/**
 * 双 token + 并发请求锁机制
 */
import axios from "axios";

const service = axios.create({
  baseURL: "https://api.example.com",
  timeout: 10000,
});

//是否正在刷新token
let isRefreshing = false;
// 定义一个队列，用于存储失败的请求
let failedQueue = [];

// 处理队列中的请求
const processQueue = (error, token = null) => {
  failedQueue.forEach(async (prom) => {
    if (error) {
      prom.reject(error); // 拒绝请求
    } else {
      error.originalRequest.headers["Authorization"] = `Bearer ${token}`;
      // 使用新的 token 重新发起请求
      prom.resolve(await service(error.originalRequest));
    }
  });
  if (!error) {
    failedQueue = []; // 只有在成功刷新 token 时才清空队列
  }
};
//刷新token函数
async function refreshToken() {
  try {
    const response = await service.get("/refresh", {
      params: {
        token: localStorage.getItem("refresh_token"),
      },
      timeout: 30000, // 单独设置超时时间
    });
    return response.data.accessToken; // 返回新的 access_token
  } catch (error) {
    // 清除本地存储的 token
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    throw error; // 抛出错误
  }
}

// 添加请求拦截器
service.interceptors.request.use(
  (config) => {
    if (config.url !== "/login") {
      const accessToken = localStorage.getItem("access_token");
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    //判断是否是获取新token
    if (config.url === "/refresh_token") {
      const refreshToken = localStorage.getItem("refresh_token");
      config.headers["Authorization"] = `Bearer ${refreshToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 添加响应拦截器
service.interceptors.response.use(
  (response) => response, // 成功的响应直接返回
  async (error) => {
    const originalRequest = error.config;
    //originalRequest._retry 是一个自定义属性，用于标记请求是否已经重试过。
    //1、判断是不是token过期
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // 显式标记请求为重试
      //2、并且不是重新获取token的401，则进行token刷新
      if (!isRefreshing) {
        isRefreshing = true;
        // 重新请求access_token
        try {
          const accessToken = await refreshToken();
          // 更新localstorage中的access_token
          localStorage.setItem("access_token", accessToken);
          //配置请求头
          originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
          // 处理队列中的其他请求
          processQueue(null, accessToken);
          // 重新发起失败的请求
          return service(originalRequest);
        } catch (err) {
          // 处理队列中的请求
          processQueue(err, null);
          console.log("刷新token失败，跳转登录界面", err);
          // 重定向到登录页
          router.push("/login");
        } finally {
          isRefreshing = false; //isRefreshing设置为false
        }
      } else {
        //如果正在刷新token,则将请求加入队列
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, originalRequest });
        });
      }
    }
    // 如果不是401错误，则直接抛出错误
    return Promise.reject(error);
  }
);

export default service;
