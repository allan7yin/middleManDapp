require("dotenv").config();
const express = require("express");
const cors = require("cors");
const request = require("request");
const toBuffer = require("ethereumjs-util").toBuffer;
const { FeeMarketEIP1559Transaction } = require("@ethereumjs/tx");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3").verbose();
const { default: axios } = require("axios");
const WebSocket = require("ws");
const path = require("path");
const { Server } = require("ws");
const expressWs = require("express-ws");

const port = 3000;
const test_net = "Sepolia";

const app = express();
app.use(express.json());
app.use(cors());

async function pass_request(req, res) {

}

app.post("/", async function (req, res) {
  const request_data = req.body
  const request_details = JSON.stringify(request_data)
  console.log("Request Body", request_details)

  const request_method = request_data.method
  if (request_method == "eth_sendRawTransaction") {
    console.log("MyMiddleMan processing eth_sendRawTransaction")
  } else {
    console.log(`MyMiddleMan passing request to ${test_net}`)
  }
});   

const server = app.listen(port, () => {
  console.log(`Server is now running on port ${port}`);
});

app.server = server;
