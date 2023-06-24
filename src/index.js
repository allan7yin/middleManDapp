require("dotenv").config();
const express = require("express");
const cors = require("cors");
const request = require("request");
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
    "gas_limit": parsed_transaction.gasLimit.toNumber(),
    "max_fee_per_gas": parsed_transaction.maxFeePerGas.toNumber(),
    "max_priority_fee_per_gas": parsed_transaction.maxPriorityFeePerGas.toNumber(),
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

async function simulateTransaction(request_data) {
  let raw_transaction = request_data["params"][0]

  let parsed_transaction = decodeRawTransactionData(raw_transaction)
}

async function passRequest(request_data, res) {
  request(
    {
      url: "environment_variable_url",
      method: "POST",
      json: request_data
    },
    (error, response, body) => {
      if (error) {
        console.error("Pass Request Error:", error)
      } else {
        console.log("Pass Request Response:", response)
        console.log("Pass Request Body:", body)
      }
    }
  )
}

app.post("/", async function (req, res) {
  const request_data = req.body
  const request_details = JSON.stringify(request_data)
  console.log("Request Body", request_details)

  const request_method = request_data.method
  if (request_method == "eth_sendRawTransaction") {
    console.log("MyMiddleMan processing eth_sendRawTransaction")
    simulateTransaction(request_data)
  } else {
    console.log(`MyMiddleMan passing request to ${test_net}`)
    // pass_request(request_data, res)
  }
});   

const server = app.listen(port, () => {
  console.log(`Server is now running on port ${port}`);
});

app.server = server;
