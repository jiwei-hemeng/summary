# react redux基础

[redux中文网](https://cn.react-redux.js.org/introduction/getting-started) 、[React Redux 快速入门](https://cn.react-redux.js.org/tutorials/quick-start)

## redux是一个用于js应用的状态管理容器

1. **redux**和react没有任何直接关系--**其他框架要用 也可以的**
2. redux可以在jq|vue等项目中使用,也可以在react项目中使用
3. redux基于Flux架构模式的具体产物
4. redux可以用来做统一的数据管理

## 安装

```shell
npm i react-redux redux -S
```

## react-redux 在项目中的配置

在项目`src`目录上创建  `store/index.js`

```js
import { legacy_createStore as createStore } from 'redux'
import Reducer from './reducer.js'
let state = {
  num: 10
}
let store = createStore(Reducer, state)
export default store
```

在项目`src`目录上创建  `store/reducer.js`

```js
// 返回reducer
const reducerAction = {
  add: (state, action) => {
    const newState = { ...state };
    newState.num += action.value;
    return newState;
  },
  setToken: (state, action) => {
    const newToken = { ...state };
    newToken.token = action.value;
    return newToken;
  },
  setJoinTime: (state, action) => {
    const newToken = { ...state };
    newToken.joinTime = action.value;
    return newToken;
  },
};
const Reducer = (state, action) => {
  return reducerAction[action.type]
    ? reducerAction[action.type](state, action)
    : state;
};
export default Reducer;
```

`项目的入口文件index.js`

```js
import React from 'react'
import ReactDOM from 'react-dom'
// 导入react-redux需要的文件
import { Provider } from 'react-redux'
import store from './store/index.js'
import App from './App'
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
```

## 在项目的组件中使用

```js
import { connect } from 'react-redux'
class Total extends React.Component {	
  render() {
    const { sum } = this.props // {}
    return <div>商品总数：【{sum}】</div>
  }
}
// 获取共享的数据
const mapStateToProps = (state, ownProps) => {
  return {
    sum: state.sum
  }
}
// 操作共享的数据
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    add: () => {
      dispatch({
        type: 'add',
        value: 1
      })
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Total)
```

# Hooks

> [文档地址](https://cn.react-redux.js.org/api/hooks)

## useSelector

```js
import React from 'react'
import { useSelector } from 'react-redux'

export const CounterComponent = () => {
  const counter = useSelector((state) => state.counter)
  return <div>{counter}</div>
}
```

## useDispatch()

```jsx
import React from 'react'
import { useDispatch } from 'react-redux'
export const CounterComponent = ({ value }) => {
  const dispatch = useDispatch()
  return (
    <div>
      <span>{value}</span>
      <button onClick={() => dispatch({ type: 'increment-counter' })}>
        Increment counter
      </button>
    </div>
  )
}
```

# React Redux 8.x  的使用步骤

## 安装 Redux Toolkit 和 React Redux

```shell
npm install @reduxjs/toolkit react-redux
```

## 创建 Redux Store

创建一个命名为 `src/app/store.js` 的文件

```js
import { configureStore } from '@reduxjs/toolkit';
export default configureStore({
  reducer: {},
});
```

## 为 React 提供 Redux Store

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import store from './app/store';
import { Provider } from 'react-redux';
// 从 React 18 开始
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
```

## 创建 Redux State Slice

添加一个名为 `src/features/counter/counterSlice.js` 的新文件。在该文件中，从 Redux Toolkit 导入 `createSlice` API。

```js
import { createSlice } from '@reduxjs/toolkit';
export const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    value: 0,
  },
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
  },
});
export const { increment, decrement, incrementByAmount } = counterSlice.actions;
export default counterSlice.reducer;
```

## 添加 Slice Reducers 到 Store

```js
import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '@/features/counter/counterSlice';
export default configureStore({
  reducer: {
    counter: counterReducer,
  },
});
```

## 在 React 组件中使用 Redux State 和 Actions

```jsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { decrement, increment } from '@/features/counter/counterSlice';
export function Counter() {
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();
  return (
    <div>
      <div>
        <button
          aria-label="Increment value"
          onClick={() => dispatch(increment())}
        >
          Increment
        </button>
        <span>{count}</span>
        <button
          aria-label="Decrement value"
          onClick={() => dispatch(decrement())}
        >
          Decrement
        </button>
      </div>
    </div>
  );
}
```

