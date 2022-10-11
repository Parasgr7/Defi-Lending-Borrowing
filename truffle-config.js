require('babel-register');
require('babel-polyfill');
const path = require("path");
const HDWalletProvider = require('./node_modules/@truffle/hdwallet-provider');
require('./node_modules/dotenv').config();

const MNEMONIC = process.env.MNEMONIC;
const INFURA_API_KEY = process.env.INFURA_API_KEY;

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*", // Match any network id
      gasPrice: 25000000000
    },
    sepolia: {
      provider: function(){
        return new HDWalletProvider(
          MNEMONIC,
          `https://sepolia.infura.io/v3/${INFURA_API_KEY}`
        )
      },
      gas_price: 25000000000,
      network_id: 11155111
    }
  },
  contracts_directory: './contracts/',
  contracts_build_directory: './abis/',
  compilers: {
    solc: {
      version: "^0.8.6",
      settings: {
        evmVersion: 'byzantium',
        optimizer: {
          enabled: true,
          runs: 1
        }
      },
      mocha: {
        reporter: 'eth-gas-reporter',
      }
    }
  },
  plugins: ["truffle-contract-size"]
}
