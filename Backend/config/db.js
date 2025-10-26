const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "12521",
  database: "reimburse1",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function testconnection() {
  try {
    const connection = await pool.getConnection();
    console.log("-- 🛢️  DB connected 🛢️  --");
    connection.release();
  } catch (err) {
    console.log("DB not connected -> ", err);
  }
}

testconnection();

module.exports = pool;
