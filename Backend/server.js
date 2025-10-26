const http = require("http");
const path = require("path");
const {
  loginUser,
  fetchUsers,
  deleteUser,
  addUser,
} = require("./controllers/userController");
const {
  fetchAnalytics,
  getQuotes,
} = require("./controllers/analyticsController");
const {
  getRequests,
  updateRequestState,
  createRequest,
} = require("./controllers/reimbursements");
require("dotenv").config();
const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // allow all origins
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  ); // allow methods
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization" // allow Authorization header
  );

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }
  if (req.url === "/login" && req.method === "POST") {
    loginUser(req, res);
  } else if (req.url === "/analytics" && req.method === "GET") {
    fetchAnalytics(req, res);
  } else if (req.url === "/quotes" && req.method === "GET") {
    getQuotes(req, res);
  } else if (req.url === "/requests" && req.method === "GET") {
    getRequests(req, res);
  } else if (req.url === "/requests" && req.method === "POST") {
    createRequest(req, res);
  } else if (req.url.startsWith("/requests/") && req.method === "PUT") {
    const id = req.url.split("/")[2];
    console.log(id);
    updateRequestState(req, res, id);
  } else if (req.url === "/users" && req.method === "GET") {
    fetchUsers(req, res);
  } else if (req.url === "/users" && req.method === "POST") {
    addUser(req, res);
  } else if (req.url.startsWith("/users/") && req.method === "DELETE") {
    const id = req.url.split("/")[2];
    console.log(id);
    deleteUser(req, res, id);
  }
});

server.listen(PORT, () => {
  console.log(`Port Listening at http://localhost:${PORT}`);
});
