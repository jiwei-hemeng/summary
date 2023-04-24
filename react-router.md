## react-router

### 基本使用

**安装**

```shell
yarn add react-router-dom -S
```

**定义路由表**

```js
// @ts-nocheck
import { lazy } from "react";
export const router = [
  {
    path: "/",
    auth: false,
    element: lazy(() => import("@/pages/expenses.jsx")),
  },
  {
    path: "/invoices",
    auth: true,
    element: lazy(() => import("@/pages/invoices.jsx")),
  },
  {
    path: "/login",
    auth: false,
    element: lazy(() => import("@/pages/login.jsx")),
  },
];
```

**使用**

```js
// @ts-nocheck
import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);
```

**APP.js 使用路由表**

```js
// @ts-nocheck
import React from "react";
import { useMemo } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { router } from "@/router";
function App({ token }) {
  const isLogin = useMemo(() => !!token, [token]);
  return (
    <div className="App">
      <Routes>
        {router.map((item) => {
          return (
            <Route
              key={item.path}
              path={item.path}
              element={
                !item.auth || (item.auth && isLogin) ? (
                  <item.element />
                ) : (
                  <Navigate to={`/login?url=${item.path}`} />
                )
              }
            />
          );
        })}
      </Routes>
    </div>
  );
}
export default App;
```

### 编程式导航

```js
import { useNavigate } from "react-router-dom";
const navigate = useNavigate();
navigate("/getUser?id=666")
```

### 获取query 参数

如，页面`/#/login?url=/invoices&tt=bb&aa=ii`

```js
import { useSearchParams } from "react-router-dom";
const [searchParams] = useSearchParams();
for (let key of searchParams.keys()) {
  console.log(key, searchParams.get(key));
}
```

### 根据接口返回的路由表信息动态生成路由

`router/index.js` 中

```js
import { lazy } from "react";
export const router = {
  // 此处的key用于匹配后端接口的name 
  invoices: lazy(() => import("@/pages/invoices.jsx")),
};
```

`App.jsx` 中配置

```jsx
// @ts-nocheck
import React, { Suspense, lazy } from "react";
import { useMemo, useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { router } from "@/router";
import Index from "@/pages/index";
import Home from "@/pages/expenses";
import Login from "@/pages/login";
function App() {
  const [routerList, setRouterList] = useState([]);
  async function getRouter() {
    // 获取接口返回的路由表信息
    const resp = await fetch("http://localhost:3000/routerList");
    const result = await resp.json();
    const routerlist = result.map((item) => {
      return {
        ...item,
        path: item.path.replace("/index/", ""),
        element: router[item.name],
      };
    });
    setRouterList(routerlist);
  }
  useEffect(() => {
    getRouter();
  }, []);
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Navigate to="/index/home" />}></Route>
        <Route path="/index" element={<Index />}>
          <Route path="home" index element={<Home />}></Route>
          {routerList.map((item) => {
            return (
              <Route
                key={item.path}
                path={item.path}
                element={<item.element />}
              />
            );
          })}
        </Route>
        <Route path="/login" element={<Login />}></Route>
      </Routes>
    </div>
  );
}
export default App;
```
