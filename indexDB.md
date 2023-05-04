# IndexDB

> IndexDB 是一个运行在浏览器上的**非关系型数据库**。既然是数据库了，那就不是 5M、10M 这样小打小闹级别了。理论上来说，IndexDB 理论上是没有存储上限的一般来说不会小于 250M。它不仅可以存储字符串，还可以存储二进制数据。

## 打开数据库

```js
let request = window.indexedDB.open("MyTestDatabase");
let db = null;
// 成功
request.onsuccess = (event) => {
  db = event.target.result;
  const result = event.target.result
  createStore(result);
}
// 错误
request.onerror = function (event) {console.log("error", event);
}
```

除了成功和错误的事件之外，还有一个 `onupgradeneeded` 事件， 它表示当你创建一个新的数据库或者增加已存在的数据库的版本号时会被触发。

```js
window.indexedDB.open(this.dbName, 2);
request.onupgradeneeded = function (event) {
  db = event.target.result;
  createStore(db);
  resolve(db);
};
```

## 创建对象仓库

### createObjectStore

这个 api 是为数据库创建一个对象仓库，所谓对象仓库你可以把它理解为一张数据表。createObjectStore(name, options)函数接收两个参数，第一个参数为仓库的名字，第二个参数是个对象，是可选参数，其中包括以下的属性：

+ keyPath：主键
+ autoIncrement：boolean类型，键生成器，是否自动生成，默认false

```js
const routersStore = db.createObjectStore("routers", {
  keyPath: "id",
  autoIncrement: true,
});
```

### createIndex
我们知道 indexDB 是可以通过索引来高效查找数据的，为对象仓库创建索引使用createIndex, createIndex(name,keypath,options)接受三个参数

+ name：索引的名称，可为空
+ keypath：索引对应的keyPath
+ options：可选，比如：unique：boolean类型，如果为 true，则索引将不允许单个键的重复值

```js
const routersStore = db.createObjectStore("routers", {
  keyPath: "id",
  autoIncrement: true,
});
routersStore.createIndex("name", "name", { unique: true });
routersStore.createIndex("path", "path", { unique: false });
routersStore.createIndex("moduleType", "moduleType", { unique: false });
```

## 新增数据

```js
function save(data, tableName = "global") {
  !data.id && (data.id = "global");
  const request = db
    .transaction([tableName], "readwrite")
    .objectStore(tableName)
    .add(data);
  return new Promise((resolve, reject) => {
    request.onsuccess = function (event) {
      console.log("数据写入成功");
      resolve(event);
    };
    request.onerror = function (event) {
      console.log("数据写入失败");
      reject(event);
    };
  });
};
```

## 删除数据

```js
function remove(id = "global", tableName = "global"){
  const request = db
    .transaction([tableName], "readwrite")
    .objectStore(tableName)
    .delete(id);

  return new Promise((resolve, reject) => {
    request.onsuccess = function (event) {
      console.log("数据删除成功");
      resolve(true);
    };
    request.onerror = function (event) {
      console.log("数据删除失败");
      reject(event);
    };
  });
};
```

## 修改

```JS
function update(data, tableName = "global") {
  !data.id && (data.id = "global");
  const request = db
    .transaction([tableName], "readwrite")
    .objectStore(tableName)
    .put(data);

  return new Promise((resolve, reject) => {
    request.onsuccess = function (event) {
      console.log("数据更新成功");
      resolve(event);
    };
    request.onerror = function (event) {
      console.log("数据更新失败");
      reject(event);
    };
  });
};
```

## 查询

```js
function read (id = "global", tableName = "global") {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([tableName]);
    var objectStore = transaction.objectStore(tableName);
    var request = objectStore.get(id);
    request.onerror = function (event) {
      console.log("事务失败");
      reject(event);
    };
    request.onsuccess = function (event) {
      if (request.result) {
        resolve(request.result);
      } else {
        console.log("未获得数据记录");
        resolve(null);
      }
    };
  });
};
```

## 查询索引

```js
const getDataByIndex = (
  query = { key: "path", value: null },
  tableName = "routers"
) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([tableName], "readonly");
    const store = transaction.objectStore(tableName);
    const index = store.index(query.key);
    const request = index.getAll(query.value);
    request.onsuccess = function (e) {
      const result = e.target.result;
      console.log("result", result);
      if (result) {
        resolve(result);
      } else {
        reject();
      }
    };
  });
};
```

# mysql

> 1. WebSQL也是一种在[浏览器](https://www.baidu.com/s?wd=浏览器&from=1012015a&fenlei=mv6quAkxTZn0IZRqIHckPjm4nH00T1Y4PhRYuj9BnHbYrH79ry790ZwV5Hcvrjm3rH6sPfKWUMw85HfYnjn4nH6sgvPsT6KdThsqpZwYTjCEQLGCpyw9Uz4Bmy-bIi4WUvYETgN-TLwGUv3EnH6vnWcLPHb1n1f1PjD4PHTYPs)里存储数据的技术,跟IndexedDB不同的是,IndexedDB更像是一个[NoSQL数据库](https://www.baidu.com/s?wd=NoSQL数据库&from=1012015a&fenlei=mv6quAkxTZn0IZRqIHckPjm4nH00T1Y4PhRYuj9BnHbYrH79ry790ZwV5Hcvrjm3rH6sPfKWUMw85HfYnjn4nH6sgvPsT6KdThsqpZwYTjCEQLGCpyw9Uz4Bmy-bIi4WUvYETgN-TLwGUv3EnH6vnWcLPHb1n1f1PjD4PHTYPs),而WebSQL更像是[关系型数据库](https://www.baidu.com/s?wd=关系型数据库&from=1012015a&fenlei=mv6quAkxTZn0IZRqIHckPjm4nH00T1Y4PhRYuj9BnHbYrH79ry790ZwV5Hcvrjm3rH6sPfKWUMw85HfYnjn4nH6sgvPsT6KdThsqpZwYTjCEQLGCpyw9Uz4Bmy-bIi4WUvYETgN-TLwGUv3EnH6vnWcLPHb1n1f1PjD4PHTYPs),使用SQL查询数据。

## 基本使用

```js
// @ts-nocheck
const db = window.openDatabase("test", "1.0", "myTest", 20 * 1024 * 1024);
db.transaction(function (tx) {
  tx.executeSql(sql, null, (tx, data) => {
    resolve({ tx, data });
  });
});
```

## 常见的方法

**接口promise封装**

```ts
export function executeSql(sql: string) : Promise {
  return new Promise((resolve, reject) => {
    try {
      db.transaction(function (tx) {
        tx.executeSql(sql, null, (tx, data) => {
          resolve({ tx, data });
        });
      });
    } catch (error) {
      reject(error);
    }
  });
}
```

**创建数据表**

```ts
export function createTable(tableName : string, tableColums : string[]) : Promise {
  return new Promise(async (resolve, reject) => {
    try {
      const colums = tableColums.join(",");
      const createExecuteSql = `CREATE TABLE IF NOT EXISTS ${tableName} (${colums})`;
      const { data } = await executeSql(createExecuteSql);
      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
}
```

**删除表**

```ts
export function dropTable(tableName : string) : Promise {
  return new Promise(async (resolve, reject) => {
    try {
      const dropSql = `drop table if exists ${tableName}`;
      const { data } = await executeSql(dropSql);
      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
}
```

**插入数据**

```ts
interface Colums {
    [propName: string]: any?: string;
}
export function insetData(tableName: string, colums: Colums) : Promise {
  return new Promise(async (resolve, reject) => {
    if (typeof tableName === "string" && colums instanceof Object) {
      let keys = Object.keys(colums).join(", ");
      let values = Object.values(colums).join("', '");
      const insetSql = `INSERT INTO ${tableName} (${keys}) VALUES ('${values}')`;
      const { tx, data } = await executeSql(insetSql);
      if (data.rowsAffected === 1) {
        resolve();
      } else {
        reject({ tx, data });
      }
    } else {
      reject("参数错误");
    }
  });
}
```

**查询数据**

```ts
interface QueryObject {
    [propName: string]: any?: string;
}
export function getData(query: QueryObject) : Promise {
  return new Promise(async (resolve, reject) => {
    try {
      const { tableName, _page, _limit = 10, ...columns } = query;
      let where = null;
      let sql = null;
      let queryArr = Object.keys(columns).map((item) => {
        return item + "=" + columns[item];
      });
      where = queryArr.join(" and ");
      let sql2 = null;
      if (queryArr.length) {
        sql = `SELECT * FROM ${tableName} where `;
        sql2 = `select count(*) from ${tableName} where `;
        sql += where;
        sql2 += where;
      } else {
        sql = `SELECT * FROM ${tableName}`;
        sql2 = `select count(*) from ${tableName}`;
      }
      // 如果有_page参数就分页，_limit 默认10
      let total = null;
      if (_page) {
        let start = (Number(_page) - 1) * Number(_limit);
        const { data } = await executeSql(sql2);
        total = data.rows[0]["count(*)"];
        sql += " limit " + start + "," + _limit;
      }
      const { data } = await executeSql(sql);
      resolve({
        total: total ? total : data.rows.length,
        list: data.rows,
      });
    } catch (error) {
      reject(error);
    }
  });
}
```

**删除数据**

```ts
export function deleteByRowId(tableName : string, id: number) : Promise{
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `delete from ${tableName} where rowid=${id};`;
      const { data, tx } = await executeSql(sql);
      resolve({ tx, data });
    } catch (error) {
      reject(error);
    }
  });
}
```

**更新数据**

```ts
export function updateByRowId(tableName: string, id: number, colums: QueryObject) : Promise {
  return new Promise(async (resolve, reject) => {
    try {
      const setData = Object.keys(colums).map((key) => {
        return key + "='" + colums[key] + "'";
      });
      const updateValue = setData.join(",");
      const updateSql = `update ${tableName} set ${updateValue} where rowid='${id}';`;
      const { data } = await executeSql(updateSql);
      if (data.rowsAffected === 1) {
        resolve();
      } else {
        reject({ tx, data });
      }
    } catch (error) {
      reject(error);
    }
  });
}
```

添加到window 对象

```js
window.WebSql = {
  deleteByRowId,
  getData,
  createTable,
  insetData,
  updateByRowId,
  dropTable,
  executeSql,
};
```

