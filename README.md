## MyMiddleMan
Submission for [ETHGlobal Waterloo 2023 Hackathon](https://ethglobal.com/showcase/mymiddleman-e0ps2). This poject is a web3 middleware application aimed to provide security to user transaction occurred on the blockchain. Using Tenderly to simulate and test a virtual transaction our product aims to guarantee 100% safe User transaction.

### Description
We act as a middleman, every communication that occurs between a user and the blockchain through a wallet ([MetaMask](https://metamask.io)) occurs through our platform. We insure each transaction is scam free by using a stable and versatile platform called Tenderly. Tenderly provides a simulation that runs the transaction on a virtual fork of the blockchain allowing the users to remove the barrier between a transaction and its execution.

### How it's Made
Firstly some of our tech stacks include `node.js`, `react`, and `web3` frameworks. We made a custom rpc server in `node.js` that is able to directly connect to `MetaMask` which for the sake of the hackathon connects to the `Sepolia` test net for development and testing purposes. Using the latest frameworks we received the data from `MetaMask` requests and send it directly to tenderly in the right format which simulates it in a forked blockchain. Next `tenderly` returns the results which we store in a database(`SQLite`) and it is inflected in a user interface on our website allowing the user to clearly analyze the impact of their transaction. Lastly, the User can click on the submit transaction button if they feel safe to commit the transaction given the result of the simulation.

### Prerequisities
* Have `Metamask` Account
* Make `Infura` account (will provide `0.5 ETH` for mock usage on forked blockchain)

### How to Run
1. First clone the project
```
git clone https://github.com/allan7yin/middleManDapp.git
```
2. Navigate to backend folder and install dependneices
```
npm install
```
3. Configure environment variables in `.env`. To do so, will need to create account with [Tenderely](https://tenderly.co). Within [Tenderely](https://tenderly.co), create a project, create virtual fork of blockchain on testing network `Sepolia`. For that project, obtain `api key`, and place into `.env`.
4. Once configured, run application (default is port `3000`)
```
npm start
```
5. Navigate to frontend folder and install dependencies
```
npm install
```
6. Run the fronend (default is port 3001)
```
npm run start
```

Open `MetaMask` in your browser extension, and add the network as the backend server. By default the parameters are:
* `Network Name:` (your choice)
* `New RPC URL: http://localhost:3000`
* `Chain ID: 11155111` (since `Sepolia` test network is used)
* `Currency Symbol: ETH`


