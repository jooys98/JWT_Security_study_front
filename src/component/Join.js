import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSaveUser } from "../redux/userSlice";

import axios from "axios";
import { API_SERVER_HOST } from "../api/apiConfig";

const Join = () => {
  const dispatch = useDispatch();
  const nav = useNavigate();

  const [inputValue, setInputValue] = useState({
    id: null,
    email: "",
    password: "",
    confirmPassword: "",
    nickname: "",
    phoneNumber: "",
    birthday: "",
  });

  const [isChecked, setIsChecked] = useState(false);

  const handleChange = (e) => {
    setInputValue((prevValue) => ({
      ...prevValue,
      [e.target.name]: e.target.value,
    }));
    if (e.target.name === "email") {
      setIsChecked(false);
    }
  };

  const checkEmail = async () => {
    if (!inputValue.email) {
      alert("아이디를 입력해주세요.");
      return;
    }

    try {
      const response = await axios.get(
        `${API_SERVER_HOST}/api/users/check?username=${inputValue.email}`
      );
      if (response.data === false) {
        alert("사용 가능한 아이디입니다.");
        setIsChecked(true);
        console.log("아이디 조회 성공 ");
      } else {
        alert("이미 사용 중인 아이디입니다.");
        setIsChecked(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmitAdd = async (e) => {
    e.preventDefault();
    if (!isChecked) {
      alert("아이디 중복 체크를 해주세요.");
      return;
    }
    e.preventDefault();
    if (inputValue.password !== inputValue.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다. 다시 확인해주세요.");
      return;
    }
    const { email, password, nickname, phoneNumber, birthday } = inputValue;

    try {
      const data = {
        id: null,
        username: email,
        password,
        nickname,
        phoneNumber,
        birthday,
      };
      const response = await axios.post(
        `${API_SERVER_HOST}/api/users/join`,
        data
      );
      if (response.data) {
        dispatch(setSaveUser(response.data));
        alert("가입에 성공하였습니다.");
        nav("/");
      } else {
        alert("가입에 실패하였습니다. 다시 확인해주세요.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h2>SIGNUP</h2>
      <form onSubmit={onSubmitAdd}>
        <label htmlFor="email">아이디</label>
        <div>
          <input
            type="text"
            name="email"
            value={inputValue.email}
            onChange={handleChange}
            placeholder="이메일 아이디 입력"
            required
          />
          <button type="button" onClick={checkEmail}>
            중복 체크
          </button>
        </div>

        <label htmlFor="password">비밀번호</label>
        <input
          type="password"
          name="password"
          value={inputValue.password}
          onChange={handleChange}
          placeholder="비밀번호 입력"
          required
        />

        <label htmlFor="confirmPassword">비밀번호 확인</label>
        <input
          type="password"
          name="confirmPassword"
          value={inputValue.confirmPassword}
          onChange={handleChange}
          placeholder="비밀번호 입력"
          required
        />

        <label htmlFor="nickname">이름</label>
        <input
          type="text"
          name="nickname"
          value={inputValue.nickname}
          onChange={handleChange}
          placeholder="이름 입력"
          required
        />

        <label htmlFor="phoneNumber">전화번호</label>
        <input
          type="text"
          name="phoneNumber"
          value={inputValue.phoneNumber}
          onChange={handleChange}
          placeholder="전화번호 입력"
          required
        />
        <label htmlFor="birthday">생년월일</label>
        <input
          type="date" // text에서 date로 변경
          name="birthday"
          value={inputValue.birthday}
          onChange={handleChange}
          pattern="\d{4}-\d{2}-\d{2}" // yyyy-mm-dd 패턴 강제
          required
        />

        <button type="submit">SIGNUP</button>
      </form>
    </div>
  );
};
export default Join;
