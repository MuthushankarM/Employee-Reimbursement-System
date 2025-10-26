const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

function createToken(id, role, email) {
  return jwt.sign({ id, role, email }, JWT_SECRET, {
    expiresIn: "1h",
  });
}

module.exports = { createToken };
