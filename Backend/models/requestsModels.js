const pool = require("../config/db");

async function getAllReq() {
  const [rows] = await pool.query(
    "SELECT r.id,r.reqName, r.category, r.amount, r.createdAt,r.state, u.username, u.role FROM requests r JOIN users u ON r.emp_id = u.id WHERE state='Pending';"
  );
  return rows;
}

async function updateReq(state, id) {
  const [rows] = await pool.query("UPDATE requests SET state=? WHERE id=?", [
    state,
    id,
  ]);
  return rows.affectedRows > 0;
}

module.exports = { getAllReq, updateReq };
