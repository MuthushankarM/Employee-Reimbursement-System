require("dotenv").config();

const {
  checkUser,
  getUsers,
  deleteEmployee,
  createEmployee,
} = require("../models/userModels.js");
const { createToken } = require("../utils/jwt.js");
const { sendJSON } = require("../helpers/response.js");

// LOADING CREDENTIALS FROM env
const JWT_SECRET = process.env.JWT_SECRET;
const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;

async function loginUser(req, res) {
  try {
    const userData = await new Promise((resolve, reject) => {
      const chunks = [];

      req.on("data", (chunk) => {
        chunks.push(chunk);
      });

      req.on("end", () => {
        try {
          resolve(JSON.parse(Buffer.concat(chunks).toString()));
        } catch (err) {
          reject(err);
        }
      });
    });
    let token;
    let role;
    if (userData.email === adminEmail && userData.password === adminPassword) {
      role = "admin";
      token = createToken(0, role, adminEmail);
      console.log("Admin Logged in");
    } else {
      const getLoginInfo = await checkUser(userData.email);

      if (!getLoginInfo || getLoginInfo.password !== userData.password) {
        return sendJSON(res, 401, {
          success: false,
          message: "Invalid Credentials",
        });
      }

      role = getLoginInfo.role === "manager" ? "manager" : "employee";
      token = createToken(getLoginInfo.id, role, getLoginInfo.email);
      console.log(`${role} Logged in`);
    }
    return sendJSON(res, 200, {
      success: true,
      message: "Login Successful",
      role: role,
      token: token,
    });
  } catch (err) {
    console.error(err);
    return sendJSON(res, 500, { success: false, message: "Server Error" });
  }
}
async function fetchUsers(req, res) {
  const data = await getUsers();
  return sendJSON(res, 200, data);
}

async function deleteUser(req, res, id) {
  try {
    const response = await deleteEmployee(id);

    if (response) {
      return sendJSON(res, 200, { success: true, message: "user deleted" });
    } else {
      return sendJSON(res, 404, {
        success: false,
        message: "Request not found",
      });
    }
  } catch (err) {
    return sendJSON(res, 500, { success: false, message: "Server Error" });
  }
}

async function addUser(req, res) {
  try {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", async () => {
      const user = JSON.parse(body);
      console.log(user);
      const response = await createEmployee(user);

      if (response) {
        return sendJSON(res, 200, { message: "User added Successfully !" });
      } else {
        return sendJSON(res, 404, {
          message: "Error while adding users, try again...",
        });
      }
    });
  } catch (err) {
    console.err(err);
    return sendJSON(res, 500, { message: "Internal Server Error" });
  }
}
module.exports = { loginUser, fetchUsers, deleteUser, addUser };
