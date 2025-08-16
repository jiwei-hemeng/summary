## 可视区域渲染

### 原理

只渲染页面可视区域的列表项，非可视区域的数据 **完全不渲染(预加载前面几项和后面几项)** ，在滚动列表时动态更新列表项

### 使用步骤

+ 下载

  ```shell
  npm i react-virtualized
  ```

+ 官网案例

  ```js
  const List = [
      'Brian Vaughn'
  ]
  // 渲染每一行的内容
  function rowRenderer ({
    key,         // Unique key within array of rows
    index,       // 索引号
    isScrolling, // 当前项是否正在滚动中
    isVisible,   // 当前项在List中是可见的
    style        // 重点属性：一定要给每一个行数添加该样式
  }) {
    return (
      <div key={key} style={style}>
        {list[index]}
      </div>
    )
  }
  // 渲染list列表
  ReactDOM.render(
    <List
      // 组件的宽度
      width={300}
      // 组件的高度
      height={300}
      rowCount={list.length}  // 渲染总条数
      // 每行的高度
      rowHeight={20}
      rowRenderer={rowRenderer} //渲染每行的内容
    />,
    document.getElementById('example')
  )
  ```

### AutoSizer让List组件占满屏幕 宽高

```js
import { List, AutoSizer  } from 'react-virtualized'
<AutoSizer>
    {({height, width})=>{
        <List height={height} width={width} ></List>
    }}
</AutoSizer>
```

### 使用  *WindowScroller*  让Lsit跟随页面滚动

```js
import { List, AutoSizer, windowScroller } from 'react-virtualized'
```

```html
<WindowScroller>
  {({ height, isScrolling, scrollTop }) => (
    <AutoSizer>
      {({ width }) => (
        <List
          autoHeight // 设置高度为 WindowScroller 最终渲染的列表高度
          // 组件的宽度
          width={width} // 视口宽度
          // 组件的高度
          height={height} // 视口高度
          rowCount={this.state.count} // List列表项总条目数
          // 每行的高度
          rowHeight={120} // 每一行高度
          rowRenderer={this.renderHouseList}
          isScrolling={isScrolling}  // 是否滚动
          scrollTop={scrollTop}
        />
      )}
    </AutoSizer>
  )}
</WindowScroller>
```

### *InfiniteLoader*  无限滚动加载组件

```html
<InfiniteLoader
          isRowLoaded={this.isRowLoaded} // 当前数据加载完成
          loadMoreRows={this.loadMoreRows} // 加载更多
          rowCount={this.state.count} // 总条数
          minimumBatchSize={10} // 加载更多时每次加载的数据量
        >
          {({ onRowsRendered, registerChild }) => (
            <WindowScroller>
              {({height, isScrolling, onChildScroll, scrollTop})=>{
                return (
                  <AutoSizer>
                    {({ width })=>(
                      <List
                        // InfiniteLoader 的要求
                        onRowsRendered={onRowsRendered}
                        ref={registerChild}
    
                        // WindowScroller  的要求
                        autoHeight  // 自适应高度
                        isScrolling={isScrolling}  // 组件是否滚动
                        onScroll={ onChildScroll} // 监听让页面一起滚动
                        scrollTop={scrollTop}
    
                        // list 组件的要求
                        width={ width }
                        height={ height }
                        rowCount={this.state.count}   // 数据的总条数
                        rowHeight={120}   // 每行的高度
                        rowRenderer={this.rowRenderer} // 每条数据渲染的函数
                      />  
                    )}
                  </AutoSizer>
                )
              }}
            </WindowScroller>
          )}
        </InfiniteLoader>
```

```js
// 当前数据是否加载完成
isRowLoaded= ({ index })=> {
    // !! 表示返回布尔值
    return !!this.state.list[index];
}
// 加载更多
loadMoreRows= ({ startIndex, stopIndex }) => {
    // 要求必须返回ProMise对象
    // startIndex 是请求更多的开始索引 stopIndex 是请求更多的结束索引
    // 默认每次请求10条
    return new Promise(async (resolve, reject)=>{
        const city = await getCurrentCity()
        const { data } = await API({
            url: '/houses',
            params: {
                cityId: city.value,
                ...this.filters,
                start: startIndex,
                end: stopIndex
            }
        })
        let newList = [...this.state.list,...data.body.list]
        this.setState({
            count: data.body.count,
            list: newList
        })
        return resolve()
    })
}
```

