require("dotenv").config();
const express = require("express");
const cors = require("cors");
const request = require("request");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3").verbose();
const { ethers, parseTransaction } = require('ethers');

const port = 3000;  
const test_net = "Sepolia";

const app = express();
app.use(express.json());
app.use(cors());

function decodeRawTransactionData(raw_transaction) {
  const parsed_transaction = ethers.utils.parseTransaction(raw_transaction)

  const parsed_transaction_obj = {
    "type": parsed_transaction.type,
    "chain_id": parsed_transaction.chainId,
    "hash": parsed_transaction.hash,
    "nonce": parsed_transaction.nonce,
    "gas_limit": parsed_transaction.gasLimit,
    "max_fee_per_gas": parsed_transaction.maxFeePerGas,
    "max_priority_fee_per_gas": parsed_transaction.maxPriorityFeePerGas,
    "from": parsed_transaction.from,
    "to": parsed_transaction.to,
    "data": parsed_transaction.data,
    "value": parsed_transaction.value.toString(),
    "v": parsed_transaction.v,
    "r": parsed_transaction.r,
    "s": parsed_transaction.s,
  }

  console.log("Transaction", parsed_transaction)

  return parsed_transaction_obj
}

function calculateGasPrice(max_fee_per_gas, max_priority_fee_per_gas) {
  let gas_price = max_fee_per_gas.add(max_priority_fee_per_gas)
  return gas_price._hex
}

function submitRawSignatureToSepoliaNetwork(signature) {
  console.log("Sending data to Sepolia");
  const options = {
    url: process.env.RPC_URL,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "eth_sendRawTransaction",
      params: [signature],
      id: getRandomInt(10000000),
    }),
  };
  
  request(options, (error, response, body) => {
    if (error) {
      console.error("Error submitting raw signature:", error.message);
    } else {
      console.log("Response:", body);
    }
  });
}

async function simulateTransaction(request_data) {
  const db = await open({
    filename: "./src/middleman.sqlite3",
    driver: sqlite3.Database,
  });

  let raw_transaction = request_data["params"][0]

  let transaction_data = decodeRawTransactionData(raw_transaction)
  let simulationFormData = {
    "network_id": transaction_data.chain_id,  
    "from": transaction_data.from.toString(),
    "to": transaction_data.to.toString(),
    "gas": parseInt(transaction_data.gas_limit._hex, 16),
    "gas_price": parseInt(calculateGasPrice(transaction_data.max_fee_per_gas, transaction_data.max_priority_fee_per_gas), 16).toString(),
    "value": parseInt(transaction_data.value),
    "input": transaction_data.data.toString("hex")
  }

  console.log("Input", transaction_data.data)
  console.log("Body", simulationFormData)

  const tenderlyUrl =
    "https://api.tenderly.co/api/v1/account/" +
    process.env.TENDERLY_USER +
    "/project/" +
    process.env.TENDERLY_PROJECT +
    "/simulate";

  request(
    {
      url: tenderlyUrl,
      method: "POST",
      json: simulationFormData,
      headers: {
        "X-Access-Key": "G5OGZ70tnCnau-y8NOXndb8WGs0qOBby"
      }
    },
    async function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log("Tenderely api call status: successful")
        const dangerousEvents = ["Transfer", "Approval", "ApprovalForAll"];

        var outputTransactions = [];
        console.log(body["transaction"]["transaction_info"]["call_trace"]) // tetsing purposes 
        // const events = body["transaction"]["transaction_info"]["call_trace"]["logs"];
        
      params = [
          body["transaction"]["hash"],
          simulationFormData["from"],
          simulationFormData["to"],
          simulationFormData["value"].toString(),
          parseInt(simulationFormData["gas_price"]),
          simulationFormData["gas"],
          body["transaction"]["gas_used"],
          "",
          "",
          JSON.stringify(outputTransactions),
          raw_transaction,
          0,
        ];

        await db.all(
          `
              INSERT INTO transactions (
                  hash,
                  from_adr,
                  to_adr,
                  value,
                  gas_price,
                  gas_limit,
                  gas_used,
                  errors,
                  warnings,
                  simulation,
                  raw_transaction,
                  world_id
              ) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
              `,
          params
        );
        db.close();
    } else {
      console.log("boo it didnt work!")
      console.log(error)
      console.log(response)
      console.log(body)
    }
  })
}

async function passRequest(request_data, res) {
  request(
    {
      url: process.env.RPC_URL,
      method: "POST",
      json: request_data
    },
    (error, response, body) => {
      if (error || response.statusCode != 200) {
        console.error("Pass Request Error:", error)
      } else {
        // console.log("Pass Request Response:", response)
        // console.log("Pass Request Body:", body)
        res.send(body);
      }
    }
  )
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

app.post("/", async function (req, res) {
  const request_data = req.body
  const request_details = JSON.stringify(request_data)
  console.log("Request Body", request_details)

  const request_method = request_data.method
  if (request_method == "eth_sendRawTransaction") {
    console.log("MyMiddleMan processing eth_sendRawTransaction")
    simulateTransaction(request_data)

  } else if (req.body["method"] == "eth_bypassSendRawTransaction") {
    console.log("MyMiddleMan processing eth_bypassSendRawTransaction")
    submitRawSignatureToSepoliaNetwork(req.body["params"][0])

  } else {
    console.log(`MyMiddleMan passing request to ${test_net}`)
    passRequest(request_data, res)
  }
});   

app.get("/:hash", async function (req, res) {
  console.log("im here: " + req)
  const hashValue = req.params.hash
  console.log(hashValue)

  const db = await open({
    filename: "./src/middleman.sqlite3",
    driver: sqlite3.Database,
  });

  var result = await db.get(
    "SELECT * from transactions where hash = (?)",
    hashValue
  );
  if (result != undefined) {
    res.send(result)
  }

  db.close()
})

const server = app.listen(port, () => {
  console.log(`Server is now running on ${process.env.RPC_URL}`)
  console.log(`Server is now running on ${process.env.RPC_PORT}`)
});

app.server = server;
