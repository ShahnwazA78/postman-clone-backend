const express = require("express");
const axios = require("axios");
const app = express();
const cors = require("cors"); // Import the cors middleware
const { prisma, getAllRestRequests } = require("./prisma/index");
require("dotenv").config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.get("/", (req, res) => {
  req.send("server is running fine");
});
app.post("/send-request", async (req, res) => {
  const { url, method, headers, body, params } = req.body;

  try {
    const response = await axios({
      method,
      url,
      headers,
      data: body, // Optional: Include request body if needed
    });

    const data = await prisma.RestRequest.create({
      data: {
        url: url,
        method: method,
        body: body,
        params: params,
        header: headers, // Provide the header data here
      },
    });
    console.log("histroy added to database");
    const allhistorData = await getAllRestRequests();
    const historyReverse = allhistorData.reverse();
    response.data.allhistoryData = historyReverse;
    if (method === "delete") {
      return res.json({
        message: "successfully deleted!",
        allhistoryData: historyReverse,
      });
    } else if (method === "put") {
      return res.json({
        message: "successfully updated!",
        allhistoryData: historyReverse,
      });
    }
    return res.json(response.data);
  } catch (error) {
    console.error("Error sending request", error);
    res.status(500).json({ error: "Error sending request", message: error });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
