require('@nomicfoundation/hardhat-ethers');
require('dotenv').config();

module.exports = {
    solidity: "0.8.20",
    networks: {
        mumbai: {
            url: process.env.MUMBAI_RPC_URL,
            accounts: [process.env.PRIVATE_KEY],
        }
    }
};