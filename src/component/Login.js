import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../redux/userSlice";
import apiClient from "../api/axiosInstance";

export default function Login() {
  const dispatch = useDispatch();
  const nav = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const clickRoute = () => {
    nav("/join");
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // 요청 전 데이터 형식 확인
    const requestData = {
      username: username,
      password: password,
    };
    console.log("Request Data:", {
      data: requestData,
      type: typeof requestData,
      stringified: JSON.stringify(requestData),
    });

    try {
      // API 요청 설정 로깅
      console.log("API Request Config:", {
        url: apiClient.defaults.baseURL + "/login",
        headers: apiClient.defaults.headers,
        method: "POST",
      });

      const response = await apiClient.post("/login", {
        //username과 password 만 서버에 json으로 전달
        username: username,
        password: password,
      });

      // 응답 데이터 로깅
      console.log("Response:", {
        status: response.status,
        headers: response.headers,
        data: response.data,
      });

      dispatch(
        login({
          token: response.headers["authorization"],
          ...response.data,
        }) // user가 최조 로그인 시 서버에서 빋은 토큰을 저장하는것 , 최초 인증 처리
      );
      alert("환영합니다.");
      nav("/");
    } catch (error) {
      // 에러 상세 정보 로깅
      console.error("Login Error:", {
        message: error.message,
        response: {
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers,
        },
        request: {
          headers: error.config?.headers,
          data: error.config?.data,
        },
      });
    }
  };

  return (
    <div>
      <div onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleLogin}>
          <h1>LOGIN</h1>
          <div>
            <label htmlFor="email">아이디</label>
            <input
              type="text"
              name="email"
              placeholder="아이디 입력"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password">비밀번호</label>
            <input
              type="password"
              name="password"
              placeholder="비밀번호 입력"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit">LOGIN</button>
          <button onClick={clickRoute}>Join-us!</button>
        </form>
      </div>
    </div>
  );
}
