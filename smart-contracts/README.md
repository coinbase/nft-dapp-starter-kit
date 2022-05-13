# Smart Contracts | NFT Minting Toolkit

## Deployed Test Contracts

Rinkeby `NonFungibleCoinbae`: [`0xCa4E3b3f98cCA9e801f88F13d1BfE68176a03dFA`](https://rinkeby.etherscan.io/address/0xCa4E3b3f98cCA9e801f88F13d1BfE68176a03dFA)

## Prerequisites

1. Have access to the public (public wallet address) and private key to your Ethereum account (use a test account!)
2. Have an alchemy account set-up (the free one works!)
3. Have an etherscan account.

## Dependencies

Install dependencies.

```
 install
```

Hardhat

```zsh
npm add hardhat
```

Dotenv

```zsh
npm add dotenv
```

Ethers.js

```zsh
npm add @nomiclabs/hardhat-ethers ethers@^5.0.0
```

OpenZeppelin

```zsh
npm add @openzeppelin/contracts
```

Alchemy Web3

```zsh
npm add @alch/alchemy-web3
```

Hardhat-etherscan (to verify your contract)

```
npm add @nomiclabs/hardhat-etherscan
```

## Running Locally

To run this locally, make sure you have your environment variables set.

1. Make a copy of `.sample-env` and fill it out

   ```
   cp .env.sample .env
   ```

   You should fill out at least the following fields: `RINKEBY_API_URL`, `ETHERSCAN_API_KEY`, `PRIVATE_KEY` and `PUBLIC_KEY`.

   The `CONTRACT_ADDRESS` field will be filled out after you deploy your smart contract!

2. Make any modifications the smart contract in `./contract` and deploy script in `./script/deploy.js`
3. Compile the contract
   ```
   npx hardhat compile
   ```
4. Edit the deploy script.

   Modify `scripts/deploy.js` to include the specific deploy arguments that you want your ERC721 contract to be deployed with.

5. Deploy the contract
   ```
   npx hardhat run scripts/deploy.js --network hardhat
   ```

## Steps to Test

Run `npx hardhat test --network hardhat`.

## Scripts

### Overview

Scripts for contract interactions are located in [`scripts/contract-interactions`](scripts/contract-interactions).
Scripts to generate merkle roots are located in [`scripts`](scripts).

Try running some of the following tasks:

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
npx hardhat help
```

### Deploy on Testnet

Set `ROYALTY_RECEIVER_ADDR` in your `.env` and run the following script:

```bash
npm run rinkeby:deploy
```

Then update `CONTRACT_ADDRESS` with the deployed contract address and run the following script to verify your contract:

```bash
npm run rinkeby:verify
```

### Merkle Roots

To set merkle roots for allowlists, update the addresses in `allowlists/claimlist.json` and `allowlists/giftlist.json` and run the following scripts.

```
   npm run rinkeby:setPresaleListMerkle
   npm run rinkeby:setReserveListMerkle
```

### Sale States

To modify the active sale states, modify the following environment variables:

```bash
IS_PRESALE_ACTIVE=true # modify as needed
IS_PUBLIC_SALE_ACTIVE=true # modify as needed
BASE_URI=
```

and run the following scripts

```
npm run rinkeby:setIsPublicSaleActive
npm run rinkeby:setIsPresaleActive
```

## Etherscan verification

To try out Etherscan verification, you first need to deploy a contract to an Ethereum network that's supported by Etherscan, such as Rinkeby.

In this project, copy the .env.sample file to a file named .env, and then edit it to fill in the details. Enter your Etherscan API key, your Rinkeby node URL (eg from Alchemy), and the private key of the account which will send the deployment transaction. With a valid .env file in place, first deploy your contract:

```shell
hardhat run --network rinkeby scripts/deploy.js
```

Then, copy the deployment address and paste it in to replace `DEPLOYED_CONTRACT_ADDRESS` in this command:

```shell
npx hardhat verify --network rinkeby DEPLOYED_CONTRACT_ADDRESS [deploy parameters]
```

## Gas Usage

| **Method**                   | **Gas**   | Average Cost (@ Gas Price of 50 gwei) |
| ---------------------------- | --------- | ------------------------------------- |
| Contract Deploy              | 4,747,369 | 0.23736845 ETH                        |
| Set is Public/Presale Active | 29,063    | 0.00145315 ETH                        |
| Set Base URI                 | 115,025   | 0.00575125 ETH                        |
| Set Merkle Root              | 29,085    | 0.00145425 ETH                        |
| Public Mint (1 NFT)          | 65,630    | 0.0032815 ETH                         |
| Public Mint (3 NFTs)         | 152,074   | 0.0076037 ETH                         |
