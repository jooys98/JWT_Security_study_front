import { createSlice } from "@reduxjs/toolkit";

const initState = {
  id: null,
  username: "",
  nickname: "",
  phoneNumber: "",
  birthday: "",
  role: "",
  jwtToken: "", // JWT 토큰 저장
  joinDate: null,
  addUserInfo: [],
};

const userSlice = createSlice({
  name: "userSlice",

  initialState: initState,
  reducers: {
    login: (state, action) => {
      const { token, ...userData } = action.payload;
      state.jwtToken = token;

      // 받은 유저 데이터로 state 업데이트
      state.id = userData.id;
      state.username = userData.username;
      state.nickname = userData.nickname;
      state.phoneNumber = userData.phoneNumber;
      state.birthday = userData.birthday;
      state.role = userData.role;
      state.joinDate = userData.joinDate;

      console.log("저장된 토큰:", token);
      console.log("저장된 유저 정보:", userData);
    },
    logout: (state) => {
      return initState;
    },
    setSaveUser: (state, action) => {
      state.addUserInfo = action.payload;
    },
  },
});

export const { login, logout, setSaveUser } = userSlice.actions;
export default userSlice.reducer;
