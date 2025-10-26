const { sendJSON } = require("../helpers/response.js");
const { fetchData } = require("../models/analytsicsModels");
require("dotenv").config();

const API_KEY = process.env.API_KEY;

async function fetchAnalytics(req, res) {
  const data = await fetchData();

  return sendJSON(res, 200, data);
}

async function getQuotes(req, res) {
  try {
    const response = await fetch("https://api.api-ninjas.com/v1/quotes", {
      method: "GET",
      headers: {
        "X-Api-Key": API_KEY,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error ! status: ${response.statis}`);
    }
    let data = await response.json();
    data = data[0];
    return sendJSON(res, 200, { success: true, data });
  } catch (err) {
    return sendJSON(res, 500, {
      success: false,
      error: "Failed to fetch quoutes",
    });
  }
}

module.exports = { fetchAnalytics, getQuotes };
