import { createSlice } from "@reduxjs/toolkit";
import { loginAPI, getUserInfoAPI } from "@/apis/user";
import {
  setLocalStorageToken,
  getLocalStorageToken,
  removeLocalStorageToken,
} from "@/utils/token";
const userStore = createSlice({
  name: "user",
  initialState: {
    token: getLocalStorageToken() || "",
    userInfo: {},
  },
  reducers: {
    setToken(state, action) {
      state.token = action.payload;
      //本地仓库存一份
      setLocalStorageToken(action.payload);
    },
    setUserInfo(state, action) {
      state.userInfo = action.payload;
    },
    cleanUserInfo(state) {
      state.token = "";
      state.userInfo = {};
      removeLocalStorageToken();
    },
  },
});
//异步执行
const fetchLogin = (loginForm) => {
  return async (dispatch) => {
    const res = await loginAPI(loginForm);
    dispatch(setToken(res.data.token));
  };
};
const fetchUserInfo = () => {
  return async (dispatch) => {
    const res = await getUserInfoAPI();
    dispatch(setUserInfo(res.data));
  };
};
const { setToken, setUserInfo, cleanUserInfo } = userStore.actions;
const userReducer = userStore.reducer;
export { setToken, fetchLogin, fetchUserInfo, cleanUserInfo };
export default userReducer;
