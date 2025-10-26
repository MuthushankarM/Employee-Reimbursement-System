const pool = require("../config/db");
async function fetchData() {
  const [rows] = await pool.query("SELECT * FROM requests");

  return rows;
}

module.exports = { fetchData };
