// @ts-nocheck
let db = null;
function createStore(db) {
  if (!db.objectStoreNames.contains("tableName")) {
    const routersStore = db.createObjectStore("tableName", {
      keyPath: "id", // 设置主键
      autoIncrement: true // 设置主键自增加
    });
    routersStore.createIndex("name", "name", { unique: false });
    routersStore.createIndex("path", "path", { unique: false });
    routersStore.createIndex("moduleType", "moduleType", { unique: false });
  }
}
function getIndexDB(dbName = "myDB") {
  return new Promise((resolve, reject) => {
    // 使用 IndexedDB 的第一步是打开数据库
    const request = window.indexedDB.open(dbName);
    request.onerror = function (event) {
      reject(event);
    };
    request.onsuccess = function (event) {
      // 成功处理
      db = event.target.result;
      createStore(db);
      resolve();
    };

    // 通过 监听[数据库升级事件]拿到 数据库实例
    request.onupgradeneeded = function (event) {
      db = event.target.result;
      createStore(db);
      resolve();
    };
  });
}

// 增
function save(data, tableName = "tableName") {
  return new Promise((resolve, reject) => {
    const request = db.transaction([tableName], "readwrite").objectStore(tableName).add(data);
    request.onsuccess = function (event) {
      console.log("数据写入成功");
      resolve(event);
    };
    request.onerror = function (event) {
      console.log("数据写入失败");
      reject(event);
    };
  });
}

// 删
function remove(id, tableName = "tableName") {
  return new Promise((resolve, reject) => {
    if (id) {
      const request = db.transaction([tableName], "readwrite").objectStore(tableName).delete(id);
      request.onsuccess = function () {
        console.log("数据删除成功");
        resolve(true);
      };
      request.onerror = function (event) {
        console.log("数据删除失败");
        reject(event);
      };
    } else {
      reject("主键不能为空");
    }
  });
}

// 改
function update(data, tableName = "tableName") {
  return new Promise((resolve, reject) => {
    if (data.id) {
      const request = db.transaction([tableName], "readwrite").objectStore(tableName).put(data);
      request.onsuccess = function (event) {
        resolve(event);
      };
      request.onerror = function (event) {
        reject(event);
      };
    } else {
      reject("主键id不能为空");
    }
  });
}

// 新增或改
async function saveOrUpdate(data, tableName = "tableName") {
  !data.id && (data.id = "global");
  const res = await read(data.id);
  if (res) {
    console.log("存在数据，即将更新");
    return update(data, tableName);
  } else {
    console.log("不存在数据，即将新增");
    return save(data, tableName);
  }
}

// 查
function read(id = "global", tableName = "tableName") {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([tableName]);
    var objectStore = transaction.objectStore(tableName);
    var request = objectStore.get(id);
    request.onerror = function (event) {
      console.log("事务失败");
      reject(event);
    };
    request.onsuccess = function () {
      if (request.result) {
        resolve(request.result);
      } else {
        resolve(null);
      }
    };
  });
}
// 通过索引查询
function getDataByIndex(indexName, indexValue, storeName = "tableName") {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], "readonly");
    const store = transaction.objectStore(storeName);
    const index = store.index(indexName);
    const request = index.getAll(indexValue);
    request.onsuccess = function (e) {
      const result = e.target.result;
      if (result) {
        resolve(result);
      } else {
        reject();
      }
    };
  });
}
// 通过索引删除
function removeDataByIndex(indexName, indexValue, storeName = "tableName") {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], "readwrite");
    const store = transaction.objectStore(storeName);
    const index = store.index(indexName);
    const request = index.getAll(indexValue);
    request.onsuccess = function (e) {
      const result = e.target.result;
      let all = [];
      result.map((item) => {
        if ((item[indexName] = indexValue)) {
          all.push(remove(item.id, storeName));
        }
      });
      Promise.all(all)
        .then(() => {
          resolve();
        })
        .catch(() => {
          reject();
        });
    };
  });
}

// 查询所有(创建一个游标，类似JAVA里面的容器遍历的iterator()就是一个性能，估计发明IndexDB的作者可能的认真学过JAVA，这里纯属虚构，忽略，忽略...... )
function readAll(tableName = "tableName") {
  return new Promise((resolve) => {
    const objectStore = db.transaction(tableName).objectStore(tableName);
    const result = [];
    objectStore.openCursor().onsuccess = function (event) {
      const cursor = event.target.result;
      if (cursor) {
        const otherIf = {
          db: cursor.source.transaction.db.name,
          table: cursor.source.name
        };
        result.push({ value: cursor.value, otherIf });
        cursor.continue();
      } else {
        resolve(result);
      }
    };
  });
}
// 游标分页
function cursorGetDataByIndexAndPage(
  indexName,
  indexValue,
  page,
  pageSize,
  storeName = "tableName"
) {
  return new Promise((resolve, reject) => {
    let list = [];
    let counter = 0; // 计数器
    let advanced = true; // 是否跳过多少条查询
    // 仓库对象
    const store = db.transaction(storeName, "readwrite").objectStore(storeName);
    const request = store
      .index(indexName) // 索引对象
      .openCursor(IDBKeyRange.only(indexValue)); // 指针对象
    request.onsuccess = function (e) {
      let cursor = e.target.result;
      if (!cursor) {
        return resolve(list);
      }
      if (page > 1 && advanced) {
        advanced = false;
        cursor.advance((page - 1) * pageSize); // 跳过多少条
        return;
      }
      if (cursor) {
        // 必须要检查
        list.push(cursor.value);
        counter++;
        if (counter < pageSize) {
          cursor.continue(); // 遍历了存储对象中的所有内容
        } else {
          cursor = null;
          resolve(list);
          console.log("分页查询结果", list);
        }
      } else {
        resolve(list);
        console.log("分页查询结果", list);
      }
    };
    request.onerror = function (e) {
      reject(e);
    };
  });
}

const indexdbHelper = {
  db, //数据库对象
  cursorGetDataByIndexAndPage,
  getDataByIndex, // 通过索引查找
  removeDataByIndex, // 通过索引删除
  getIndexDB,
  save, // 插入记录（参数不传，默认为myDb库下global表中的 id为global的记录）
  update, // 更新记录（参数不传，默认为myDb库下global表中的 id为global的记录）
  saveOrUpdate, // 新增或更新
  read, // 查询（参数不传，默认为myDb库下global表中的 id为global的记录）
  readAll, // 查询指定表下的所有
  remove // 删除记录（参数不传，默认为myDb库下global表中的 id为global的记录）
};
window.indexdbHelper = indexdbHelper;
export default indexdbHelper;
