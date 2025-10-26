const formidable = require("formidable");
const { getAllReq, updateReq } = require("../models/requestsModels");
const { sendJSON } = require("../helpers/response");

async function getRequests(req, res) {
  const requests = await getAllReq();

  return sendJSON(res, 200, requests);
}

async function updateRequestState(req, res, id) {
  try {
    let body = "";

    req.on("data", (chunk) => (body += chunk));
    req.on("end", async () => {
      const { state } = JSON.parse(body); // get "Approved" or "Rejected"

      const updated = await updateReq(state, id);

      if (updated) {
        return sendJSON(res, 200, {
          success: true,
          message: `Request ${state}`,
        });
      } else {
        return sendJSON(res, 404, {
          success: false,
          message: "Request not found",
        });
      }
    });
  } catch (err) {
    console.error(err);
    return sendJSON(res, 500, { success: false, message: "Server error" });
  }
}

async function createRequest(req, res) {
  try {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      try {
        const data = JSON.parse(body); // Parse the JSON sent from frontend
        console.log("Received data:", data);

        return sendJSON(res, 200, { success: true });
      } catch (err) {
        console.error("JSON parse error:", err);
        return sendJSON(res, 200, { success: false });
      }
    });
  } catch (err) {
    console.error(err);
    return sendJSON(res, 500, { error: "Server error" });
  }
}

module.exports = { getRequests, updateRequestState, createRequest };
