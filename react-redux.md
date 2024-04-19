# react redux基础

[redux中文网](https://cn.react-redux.js.org/introduction/getting-started) 

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
