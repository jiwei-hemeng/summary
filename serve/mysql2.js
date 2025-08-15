import mysql from "mysql2/promise";
// 创建连接池
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "123123",
  database: "test_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
async function transferFunds(fromId = "1", toId = "2", amount = -20) {
  let connection;
  try {
    // 从连接池获取连接
    connection = await pool.getConnection();
    await connection.beginTransaction();
    // 检查余额是否足够
    const [rows] = await connection.query(
      "SELECT balance FROM accounts WHERE id = ? FOR UPDATE",
      [fromId]
    );
    if (rows[0].balance < amount) {
      throw new Error("Insufficient funds");
    }
    // 执行转账
    await connection.query(
      "UPDATE accounts SET balance = balance - ? WHERE id = ?",
      [amount, fromId]
    );
    await connection.query(
      "UPDATE accounts SET balance = balance + ? WHERE id = ?",
      [amount, toId]
    );
    await connection.commit();
    console.log("Transfer successful");
  } catch (error) {
    if (connection) await connection.rollback();
  } finally {
    if (connection) {
      connection.release();
      connection.destroy();
    }
  }
}
transferFunds();
