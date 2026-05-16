import { configureStore } from '@reduxjs/toolkit';
import userInfoSlice from "./features/userInfo"
export default configureStore({
  reducer: {
    userInfo: userInfoSlice
  },
});