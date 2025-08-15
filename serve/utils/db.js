// @ts-nocheck
import mysql from "mysql";
export default function db(sql, params = undefined) {
  return new Promise((resolve, reject) => {
    const connection = mysql.createConnection({
      host: "10.10.10.252",
      user: "hais",
      password: "hais123",
      database: "hais",
      port: 8006,
      timezone: "08:00",
    });
    connection.connect();
    connection.query(sql, params, (error, results) => {
      if (error) {
        console.log("异常信息:", error.sqlMessage);
        console.log("执行的sql:", error.sql);
        reject(error.sqlMessage);
      }
      try {
        if (results instanceof Array) {
          results = results.map((v) => Object.assign({}, v));
          resolve(JSON.parse(JSON.stringify(results)));
        } else {
          resolve(results);
        }
      } catch (err) {
        console.log("err.name", err.name);
        reject(err);
      }
    });
    connection.end();
  });
}
