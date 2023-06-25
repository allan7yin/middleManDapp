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

async function simulateTransaction(request_data) {
  let raw_transaction = request_data["params"][0]

  let transaction_data = decodeRawTransactionData(raw_transaction)
  let simulationFormData = {
    network_id: transaction_data.chain_id,  
    from: transaction_data.from.toString(),
    to: transaction_data.to.toString(),
    gas: transaction_data.gas_limit._hex,
    gas_price: calculateGasPrice(transaction_data.max_fee_per_gas, transaction_data.max_priority_fee_per_gas),
    value: parseInt(transaction_data.value),
    input: transaction_data.data.toString()
  }

  console.log("Body", simulationFormData)

  let tenderly_url = "https://api.tenderly.co/api/v1/account/allan7yin/project/middleman/simulate"
  request(
    {
      url: tenderly_url,
      method: "POST",
      json: simulationFormData,
      headers: {
        "X-Access-Key": "G5OGZ70tnCnau-y8NOXndb8WGs0qOBby"
      }
    },
    (error, response, body) => {
      if (error) {
        console.error("Tenderely Request Error:", error)
      } else {
        // console.log("Tenderely Request Response:", response)
        console.log("Tenderely Request Body:", body)
      }
    }
  )
}

async function passRequest(request_data, res) {
  request(
    {
      url: "https://rpc.tenderly.co/fork/92de727b-928b-4a44-92ca-5f5c7e045df0",
      method: "POST",
      json: request_data
    },
    (error, response, body) => {
      if (error) {
        console.error("Pass Request Error:", error)
      } else {
        // console.log("Pass Request Response:", response)
        console.log("Pass Request Body:", body)
        res.send(body);
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
    passRequest(request_data, res)
  }
});   

const server = app.listen(port, () => {
  console.log(`Server is now running on port ${port}`);
});

app.server = server;
