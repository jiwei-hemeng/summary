import { createSlice } from '@reduxjs/toolkit';
export const userInfoSlice = createSlice({
  name: 'userInfo',
  initialState: {
    token: sessionStorage.getItem("token"),
  },
  reducers: {
    setToken(state, action) {
      sessionStorage.setItem("token", action.payload)
      state.token = action.payload
    }
  },
});
export const { setToken } = userInfoSlice.actions;
export default userInfoSlice.reducer;