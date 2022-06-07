# NFT Dapp Starter Kit 🏗️

❗ **WARNING: This repo is currently a work-in-progress. Please do not use for purposes other than learning. It is slated to officially release by the third week of June 2022** 🔴

Ready to bootstrap your own NFT minting site? Get started here. This boilerplate repo contains an NFT minting contract, a sample frontend dapp, and metadata generation scripts for you to get started.

## Get Started

- Play around with the deployed test app [here](https://nft-dapp-starter-kit.vercel.app/)
- Check out the deployed test contracts:
  - Rinkeby - `NonFungibleCoinbae`: [`0xCa4E3b3f98cCA9e801f88F13d1BfE68176a03dFA`](https://rinkeby.etherscan.io/address/0xCa4E3b3f98cCA9e801f88F13d1BfE68176a03dFA)
- Fork this repo to play around with it.

## Prerequisites for Development

1. Rinkeby API URL (Alchemy or Infura Recommended)
2. Mainnet API URL (Alchemy or Infura Recommended)
3. Wallet (both Private Key and Public Key)

## Step 1: Smart Contracts

To set up your smart contracts and interact with them via Hardhat go to [`/smart-contracts`](smart-contracts).

## Step 2: Metadata / Assets

To learn more about token metadata and generate your own metadata, go to [`/metadata`](metadata).

To learn more about creating generative artwork with layers, go to [`/assets`](assets).

## Step 3: Frontend

To set up your own minting Dapp UI go to [`/frontend`](frontend)

## Questions?

If you have any questions or notice issues, please file a ticket and we will respond as soon as possible! We welcome all contributors to open pull requests and will try to review them in a timely manner.

## Other Resources

- [Coinbase Wallet Developer Docs](https://docs.cloud.coinbase.com/wallet-sdk/docs) - official Coinbase Wallet Developer docs to learn more about Wallet Integration
- [Paradigm's Guide to Designing Effective NFT Launches](https://www.paradigm.xyz/2021/10/a-guide-to-designing-effective-nft-launches) - tips on how to launch an NFT project
- [Scaffold-eth buyer-mints](https://github.com/scaffold-eth/scaffold-eth/tree/buyer-mints-nft) - a more complex scaffold for ETH NFT projects
- [NFT Minting Scaffold with Merkle Allowlists](https://github.com/straightupjac/nft-merkle-allowlist-scaffold) - another NFT minting scaffold that inspired this project
- [Opensea NFT Developer Docs](https://docs.opensea.io/)
- [wagmi](https://github.com/tmm/wagmi) react hooks - we used this package for the frontend integrations

### License

See [`LICENSE`](/LICENSE)
