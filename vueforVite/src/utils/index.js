// @ts-nocheck
import router from "@/router";
const baseUrl = import.meta.env.VITE_BASE_URL;
export default function ({
  method = "GET",
  url,
  data,
  headers = new Headers({
    "Content-Type": "application/json;charset=utf-8"
  }),
  responseType = "json"
}) {
  return new Promise((resolve, reject) => {
    try {
      url = baseUrl + url;
      let body = null;
      if (method !== "GET") {
        body = JSON.stringify(data);
      }
      fetch(url, {
        method,
        headers,
        body
      })
        .then((res) => {
          if (res.ok) {
            // 请求成功
            if (responseType === "json") {
              return res.json();
            } else {
              return res.blob();
            }
          } else {
            // 请求失败
            reject(res);
          }
        })
        .then((res) => {
          if (res.code === "401") {
            router.push("/about");
            reject(res.message);
          } else {
            resolve(res);
          }
        })
        .catch((error) => reject(error));
    } catch (error) {
      reject(error);
    }
  });
}
