const pool = require("../config/db");

async function checkUser(email) {
  const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);
  return rows[0];
}

async function getUsers() {
  const [rows] = await pool.query("SELECT * FROM users");

  return rows;
}

async function deleteEmployee(id) {
  const [rows] = await pool.query("DELETE from users WHERE id=?", [id]);
  return rows.affectedRows > 0;
}

async function createEmployee(user) {
  console.log();
  const [rows] = await pool.query(
    "INSERT INTO users(username, role, email, password) values (?,?,?,?)",
    [user.name, user.role, user.email, user.password]
  );

  return rows.affectedRows > 0;
}
module.exports = { checkUser, getUsers, deleteEmployee, createEmployee };
