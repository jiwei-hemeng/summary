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
const router = [
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
export { router };
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

