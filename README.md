# NFT Minting Toolkit

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

Scripts for contract interactions are located in [`scripts/contract-interactions`](scripts/contract-interactions).

Scripts to generate merkle roots are located in [`scripts`](scripts).

- update the addresses in `allowlist/claimlist.json` and `allowlist/giftClaimlist.json` and run the scripts to generate the merkle roots and proofs.

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, a sample script that deploys that contract, and an example of a task implementation, which simply lists the available accounts.

Try running some of the following tasks:

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
node scripts/sample-script.js
npx hardhat help
```
