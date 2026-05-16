import mysql from "mysql";
import dayjs from "dayjs";
import fs from "fs";
import path from "path";
debugger;
const today = dayjs().format("YYYY-MM-DD");
console.log("=============工作日期==============");
console.log("今天是：" + today);
console.log("==================================");
const connection = mysql.createConnection({
  host: "10.10.10.252",
  user: "hais",
  password: "hais123",
  database: "hais",
  port: 8006,
  timezone: "08:00",
  stringifyObjects: true,
});

connection.connect();
// 修改工作日期
// let sql =
//   "update t_users set role='doctor' where id='A013';";
let sql = `update s_working_calendar set current_working_date='${today}' where id='1';`;

connection.query(sql, (error, results) => {
  if (error) throw error;
  try {
    if (results instanceof Array) {
      results = results.map((v) => Object.assign({}, v));
      console.log(results);
      // const reddress = {
      //   divisionList: results
      // }
      // fs.writeFileSync(path.join(path.join(), 'division.json'), JSON.stringify(reddress))
      // console.log("results", results);
    } else {
      console.log(results);
    }
  } catch (err) {
    console.log(err);
  }
});
connection.end();
