import axios from "axios";
import { getLocalStorageToken, removeLocalStorageToken } from ".";
import router from "@/router";

//1.根域名配置
const request = axios.create({
  baseURL: "http://geek.itheima.net/v1_0",
  timeout: 5000,
});
//2.超时时间
//3.请求 / 响应 拦截器
request.interceptors.request.use(
  (config) => {
    //注入token
    const token = getLocalStorageToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
request.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.log(error);
    if (error.response.status === 401) {
      removeLocalStorageToken();
      router.navigate("/login");
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export default request;
