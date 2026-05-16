// @ts-nocheck
const db = window.openDatabase("test", "1.0", "myTest", 20 * 1024 * 1024);
export function executeSql(sql) {
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
export function createTable(tableName, tableColums) {
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
export function dropTable(tableName) {
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
export function insetData(tableName, colums) {
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

export function getData(query) {
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

export function deleteByRowId(tableName, id) {
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
export function updateByRowId(tableName, id, colums) {
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
window.WebSql = {
  deleteByRowId,
  getData,
  createTable,
  insetData,
  updateByRowId,
  dropTable,
  executeSql,
};
