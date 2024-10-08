const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const SANDBOX_URL = "https://sandbox.tryfinch.com/api/";

// Create Sandbox and grab the access token
app.post("/api/create-sandbox", async (req, res) => {
  const { provider_id } = req.body;

  try {
    const response = await axios.post(
      `${SANDBOX_URL}sandbox/create`,
      {
        provider_id,
        products: ["company", "directory", "individual", "employment"],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create sandbox", error: error.message });
  }
});

// Get company information
app.get("/api/company", async (req, res) => {
  const { access_token } = req.query;

  try {
    const response = await axios.get(`${SANDBOX_URL}employer/company`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch company information",
      error: error.message,
    });
  }
});

// Get employee directory
app.get("/api/directory", async (req, res) => {
  const { access_token } = req.query;

  try {
    const response = await axios.get(`${SANDBOX_URL}employer/directory`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch employee directory",
      error: error.message,
    });
  }
});
// get details of the employee
app.post("/api/employee-details", async (req, res) => {
  const { individual_id, access_token } = req.body;

  try {
    const response = await axios.post(
      `${SANDBOX_URL}employer/employment`,
      {
        requests: [{ individual_id }],
      },
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    res.json(response.data.responses[0].body);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch employee details",
      error: error.message,
    });
  }
});

// Try accessing /payment on the sandbox and return 403 Forbidden
app.get("/api/payment", async (req, res) => {
  const { access_token, start_date, end_date } = req.query;

  try {
    await axios.get(`${SANDBOX_URL}employer/payment`, {
      params: { start_date, end_date },
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    res
      .status(403)
      .json({ message: "Access to the /payment endpoint is forbidden." });
  } catch (error) {
    res
      .status(403)
      .json({ message: "Access to the /payment endpoint is forbidden." });
  }
});

// Try accessing /pay-statement on the sandbox and return 403 Forbidden
app.get("/api/pay-statement", async (req, res) => {
  const { access_token } = req.query;

  try {
    await axios.get(`${SANDBOX_URL}employer/pay-statement`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    res
      .status(403)
      .json({ message: "Access to the /pay-statement endpoint is forbidden." });
  } catch (error) {
    res
      .status(403)
      .json({ message: "Access to the /pay-statement endpoint is forbidden." });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
