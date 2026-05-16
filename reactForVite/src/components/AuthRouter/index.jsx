// @ts-nocheck
import React from "react";
import { useSelector } from "react-redux";
import { useMemo } from "react";
import { Navigate } from "react-router-dom";
export default function AuthRouter(props) {
  const token = useSelector((state) => state.userInfo.token);
  if (props.title) {
    document.title = props.title;
  }
  const isLogin = useMemo(() => !!token, [token]);
  if (!props.auth || (props.auth && isLogin)) {
    return <props.element />;
  }
  return <Navigate to={`/login?url=/index/${props.path}`} />;
}
