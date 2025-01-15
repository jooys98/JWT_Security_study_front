import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import { injectStore } from "../api/axiosInstance";
export const store = configureStore({
  reducer: {
    user: userSlice,
  },
});
injectStore(store);
