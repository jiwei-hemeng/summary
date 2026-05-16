# react-router

[react router v6 中文文档](http://www.reactrouter.cn/docs/upgrading/)

## 基本使用

### 安装

```shell
yarn add react-router-dom -S
```

### 定义路由表

```js
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

### 使用

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

## 编程式导航

```js
import { useNavigate } from "react-router-dom";
const navigate = useNavigate();
// 传递search参数
navigate("/getUser?id=666")
// 传递state参数
navigate('/Detail/Shop', { state: {name:'tom',age:"20"} })
```

## 获取query 参数

如，页面`/#/login?url=/invoices&tt=bb&aa=ii`

```js
import { useSearchParams } from "react-router-dom";
const [searchParams] = useSearchParams();
for (let key of searchParams.keys()) {
  console.log(key, searchParams.get(key));
}
```

## 根据接口返回的路由表信息动态生成路由

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
const NotFound = () => {
  return <div>一朝一夕日复日，半醉半醒浮生梦</div>
}
function App() {
  const [routerList, setRouterList] = useState([]);
  async function getRouter() {
    // 获取接口返回的路由表信息
    const resp = await fetch("http://localhost:3000/routerList");
    const result = await resp.json();
    const routerlist = result.map((item) => {
      return {
        ...item,
        path: item.path,
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
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
export default App;
```

## useRoutes() 介绍

### 原来写的路由管理如下

```html
<Routes>
  <Route path='/about' element={<About />} />
  <Route path='/home' element={<Home />} />
  <Route path='/' element={<Navigate to='/about' />} />
</Routes>
```

 ### 使用路由表 `useRoutes()` 后 

**routes.js**

```js
// routes.js
import React from "react";
import { Navigate } from 'react-router-dom'
const Home = React.lazy(()=> import('@/pages/home/index.jsx'));
const News = React.lazy(()=> import('@/pages/home/news.jsx'));
const Message = React.lazy(()=> import('@/pages/home/message.jsx'))
const About = React.lazy(()=> import('@/pages/About'));
const routes = [{
  path: '/about',
  element: <About />
}, {
  path: '/home',
  element: <Home />,
  children: [{
    path: 'news',
    element: <News />
  }, {
    path: 'message',
    element: <Message />
  }]
}, {
  path: '/',
  element: <Navigate to='/about' />
}];
export default routes;
```

**App.js**

```js
import React from 'react'
import { NavLink, useRoutes } from 'react-router-dom'
import routes from './routes'
export default function App() {
  const elements = useRoutes(routes)
  return (
    <div className="row">
    	<div className="col-xs-2 col-xs-offset-2">
    		<NavLink to="/about">About</NavLink>
				<NavLink to="/home">Home</NavLink>
			</div>
			<div className="col-xs-6">
  		  {elements}
			</div>
		</div>
  )
}
```

**Home.jsx**

```jsx
import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'
export default function Home() {
  return (
    <>
    	<h3>我是Home的内容</h3>
    	<div>
      	<ul class="nav nav-tabs">
        	<li>
          	<NavLink className='list-group-item' to="/home/news">News</NavLink>
        	</li>
        	<li>
            <NavLink className='list-group-item' to="./message">Message</NavLink>
          </li>
          <li>
            <NavLink className='list-group-item' to="other">Other</NavLink>
        	</li>
      	</ul>
        <Outlet />
    	</div>
    </>
  )
}
```

## useLocation的使用

```js
// 跳转传值
import { useNavigate } from 'react-router-dom'
const navigate = useNavigate();
function clickCityHandle(city) {
  navigate('/home', { state: { name: 'zhou' } })
}

// 接收跳转传过来的值
import { useLocation } from 'react-router-dom'
const location = useLocation()
const { state } = location
console.log(location, state);
```

