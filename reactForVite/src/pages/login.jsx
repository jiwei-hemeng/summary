// @ts-nocheck
import React from "react";
import { useNavigate } from "react-router-dom";
import useQuery from "@/hook/useQuery";
import { useSelector, useDispatch } from "react-redux";
import { setToken } from "@/store/features/userInfo";
export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [query] = useQuery();
  const { url } = query;
  return (
    <main>
      <h2>Login</h2>
      <button
        onClick={() => {
          const token = Date.now();
          dispatch(setToken(token));
          if (url) {
            navigate(url, {
              query: {
                id: 333,
              },
            });
          } else {
            navigate("/");
          }
        }}
      >
        授权登录
      </button>
    </main>
  );
}
