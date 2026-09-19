const jwt = require("jsonwebtoken");

function authHeader(payload = { id: "user-1", role: "CLIENT" }) {
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
  return { Authorization: `Bearer ${token}` };
}

module.exports = { authHeader };
