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

