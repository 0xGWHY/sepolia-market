require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");
require("solidity-coverage");

module.exports = {
  solidity: {
    version: "0.8.18",
    settings: {
      optimizer: {
        enabled: true,
        runs: 20000,
      },
    },
  },
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_KEY}`,
      accounts: [process.env.DYLAN_KEY],
    },
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
    gasPrice: 15,
    coinmarketcap: process.env.COIN_MARKET_CAP_API,
  },
  etherscan: {
    // network list: https://github.com/NomicFoundation/hardhat/blob/master/packages/hardhat-etherscan/src/ChainConfig.ts
    apiKey: {
      sepolia: process.env.ETHERSCAN_API_KEY,
    },
  },
};
