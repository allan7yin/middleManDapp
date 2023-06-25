import { Button, Typography } from "@mui/material"
import { useState, useEffect } from "react"
import TransactionField from "./TransactionField"
import {
    BrowserRouter as Router,
    Link,
    Route,
    Routes,
    useParams,
  } from "react-router-dom";
function TransactionLanding() {
    const [transactionData, setTransactionData] = useState({})
    const [hash, setHash] = useState("")
    const { id } = useParams();
    // const myhash = "0xee8b1b4f3c6c7f054ad570f976001721b5286fd054c6b9a308bdd67a490b58d7"

    const loadData = async() => {
        let res = await fetch("http://localhost:3000/" + id)
        let response = await res.json()
        return response;
    }

    useEffect(() => {
        loadData().then(data => {
            console.log("got data");
            console.log(data);
            setTransactionData(data)
        }
        )
    }, [])

    useEffect(() => {
        setHash(id);
    }, []);

    useEffect(() => {
        console.log("myhash:",hash);
    }, [hash]);

    return(
        <div style={{height: "100%", width: "100%", backgroundColor: "#E2D1F9",
                     display: "flex", justifyContent: "center"}}>
            <div style={{width: "50%", marginTop: "5%"}}>
                <Typography variant="h3" gutterBottom>
                    Transaction Details
                </Typography>
                <TransactionField field_name="Transaction Hash" field_value={transactionData.hash}/>
                <TransactionField field_name="From" field_value={transactionData.from_adr}/>
                <TransactionField field_name="To" field_value={transactionData.to_adr}/>
                <TransactionField field_name="ETH Transferred" field_value={transactionData.value}/>
                <TransactionField field_name="Max Gas Price" field_value={transactionData.gas_price}/>
                <TransactionField field_name="Gas Limit" field_value={transactionData.gas_limit}/>
                <TransactionField field_name="Gas Used" field_value={transactionData.gas_used}/>
                <div style={{display: "flex"}}>
                    <Button variant="contained" style={{marginTop: "2%", marginLeft: 'auto'}}>Submit Transaction</Button>
                </div>
            </div>
        </div>
    )
}

export default TransactionLanding