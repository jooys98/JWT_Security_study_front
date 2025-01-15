import axios from "axios";
import { API_SERVER_HOST } from "./apiConfig";
import { login } from "../redux/userSlice";

let store;
export const injectStore = (_store) => {
  store = _store;
};
// Axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: API_SERVER_HOST, // 백엔드 API의 기본 URL
  headers: {
    "Content-Type": "application/json", // 기본 Content-Type
  },
  withCredentials: true, // 쿠키를 포함한 요청(리프레쉬 토큰을 쿠키로 주고받기 위해 )
});

// 요청 인터셉터 ( 요청을 보내기 전에 실행 시킴 )
apiClient.interceptors.request.use(
  (config) => {
    // URLSearchParams인 경우 Content-Type 설정
    if (config.data instanceof URLSearchParams) {
      config.headers["Content-Type"] = "application/x-www-form-urlencoded";
    }

    //사용자가 인증이 필요한 경로 api에 잡근 할때
    // 자동으로 토큰을 추가하여 request 를 보냄(서버에 보내는 api 요청에 인증정보를 포함시킴)
    const jwtToken = store.getState().user.jwtToken;
    if (jwtToken) {
      config.headers["Authorization"] = `Bearer ${jwtToken}`;
      // store에 있는 JWT 토큰을 Authorization 헤더에 추가
    } // Bearer : 엑세스 토큰 앞에 붙는 기본값

    return config;
  },
  (error) => {
    // 요청 에러 처리
    return Promise.reject(error);
  }
);

// 응답 인터셉터
apiClient.interceptors.response.use(
  (response) => response, // 응답이 성공적인 경우 그대로 반환
  async (error) => {
    const originalRequest = error.config; // 원본 요청
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true; // 재시도 플래그 설정
      try {
        // 리프레시 토큰을 사용하여 새로운 액세스 토큰 요청
        const refreshResponse = await axios.post(
          `${API_SERVER_HOST}/reissue`,
          null,
          { withCredentials: true }
        );

        const newToken = refreshResponse.headers["authorization"];
        store.dispatch(
          login({
            token: newToken,
            ...refreshResponse.data, // 새로운 유저 정보가 있다면 함께 업데이트
          })
        );
        console.log("만료된 토큰을 재발급 받았습니다.");

        // 원래 요청을 새로운 토큰으로 다시 시도
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error("리프레시 토큰으로 재발급 실패:", refreshError.message);
        return Promise.reject(refreshError); // 재발급 실패 시 에러 반환
      }
    }
    return Promise.reject(error); // 다른 에러 처리
  }
);

export default apiClient; // Axios 인스턴스 내보내기
