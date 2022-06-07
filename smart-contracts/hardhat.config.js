/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const { task } = require("hardhat/config");
require("dotenv").config();
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");
require("solidity-coverage");

const {
  RINKEBY_API_URL,
  MAINNET_API_URL,
  PRIVATE_KEY,
  ETHERSCAN_API_KEY,
  CONTRACT_ADDRESS,
  ROYALTY_RECEIVER_ADDR,
} = process.env;

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();
  for (const account of accounts) {
    console.log(account.address);
  }
});

task("etherscan-verify", "Verifies on etherscan", async (taskArgs, hre) => {
  console.log("Verifying contract on etherscan...");
  await hre.run("verify:verify", {
    address: CONTRACT_ADDRESS,
    constructorArguments: [ROYALTY_RECEIVER_ADDR],
  });
});

module.exports = {
  solidity: "0.8.4",
  defaultNetwork: "rinkeby",
  settings: {
    optimizer: {
      enabled: true,
      runs: 1000,
    },
  },
  networks: {
    hardhat: {},
    rinkeby: {
      url: RINKEBY_API_URL,
      accounts: [`0x${PRIVATE_KEY}`],
    },
    mainnet: {
      url: MAINNET_API_URL,
      accounts: [`0x${PRIVATE_KEY}`],
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: ETHERSCAN_API_KEY,
  },
};
