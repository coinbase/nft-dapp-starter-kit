/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const { task } = require('hardhat/config');
require('dotenv').config();
require('@nomiclabs/hardhat-ethers');
require('@nomiclabs/hardhat-waffle');
require('solidity-coverage');
require('hardhat-contract-sizer');

const { GOERLI_API_URL, PRIVATE_KEY, CONTRACT_ADDRESS, ROYALTY_RECEIVER_ADDR } =
  process.env;

task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();
  for (const account of accounts) {
    console.log(account.address);
  }
});

task('etherscan-verify', 'Verifies on etherscan', async (taskArgs, hre) => {
  console.log('Verifying contract on etherscan...');
  await hre.run('verify:verify', {
    address: CONTRACT_ADDRESS,
    constructorArguments: [ROYALTY_RECEIVER_ADDR],
    network: taskArgs['network'],
  });
});

/*
 * ensure that the defaultNetwork is set to the network of your choice
 * before running any scripts to interact with the deploy smart contract
 */
module.exports = {
  solidity: '0.8.4',
  defaultNetwork: 'goerli',
  settings: {
    optimizer: {
      enabled: true,
      runs: 1000,
    },
  },
  networks: {
    hardhat: {},
    goerli: {
      url: GOERLI_API_URL ?? '',
      accounts: [`0x${PRIVATE_KEY}`],
    },
  },
};
