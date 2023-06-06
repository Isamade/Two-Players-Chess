const HDWalletProvider = require("@truffle/hdwallet-provider");
const accountIndex = 0;
const infura = process.env.INFURA_URI;
const mnemonic = process.env.MNEMONIC;

module.exports = {
  contracts_directory: './contracts/',
  contracts_build_directory: './abis',

  networks: {
    develop: {
      //host: "http://172.17.0.1",
      //port: 8545,
      port: 9545,
      network_id: 20,
      defaultEtherBalance: 100,
      blockTime: 3
    },
    ganache: {
      host: "http://172:0.0.1",
      port: 7545,
      network_id: 5777
    },
    goerli_infura: {
      provider: function() {
        return new HDWalletProvider(mnemonic, infura, accountIndex)
      },
      network_id: 5,
      networkCheckTimeout: 10000,
      timeoutBlocks: 200
    }
  },

  mocha: {
    // timeout: 100000
  },

  compilers: {
    solc: {
      version: "0.8.11",
      // docker: true,
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        },
      //  evmVersion: "byzantium"
      }
    }
  }
};
