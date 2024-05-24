const express = require("express");
const mysql = require("mysql");

const app = express();

// 创建MySQL连接池
const pool = mysql.createPool({
  connectionLimit: 10,
  host: "example.org",
  user: "username",
  password: "password",
  database: "dbname",
});

app.post("/transaction", (req, res) => {
  // 开始事务
  pool.getConnection((err, connection) => {
    if (err) {
      return res.status(500).send("Error connecting to database.");
    }

    connection.beginTransaction((error) => {
      if (error) {
        return res.status(500).send("Error starting transaction.");
      }

      // 执行SQL语句
      connection.query(
        "INSERT INTO table1 (data1) VALUES (?)",
        ["value1"],
        (error, results1) => {
          if (error) {
            return connection.rollback(() => {
              throw error;
            });
          }

          connection.query(
            "UPDATE table2 SET data2 = ? WHERE id = ?",
            ["value2", 1],
            (error, results2) => {
              if (error) {
                return connection.rollback(() => {
                  throw error;
                });
              }

              // 提交事务
              connection.commit((error) => {
                if (error) {
                  return connection.rollback(() => {
                    throw error;
                  });
                }

                connection.release();
                res.json({ success: true });
              });
            }
          );
        }
      );
    });
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
