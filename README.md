# NFT Dapp Starter Kit 🏗️

Ready to bootstrap your own NFT minting site? Get started here. This boilerplate repo contains an NFT minting contract, a sample frontend dapp, and metadata generation scripts for you to get started.

## Get Started

- Play around with the deployed test app [here](https://nft-dapp-starter-kit-v2.vercel.app/)
- Check out the deployed test contracts:
  - Rinkeby - `NonFungibleCoinbae`: [`0xCa4E3b3f98cCA9e801f88F13d1BfE68176a03dFA`](https://rinkeby.etherscan.io/address/0xCa4E3b3f98cCA9e801f88F13d1BfE68176a03dFA)
- Fork this repo to play around with it.

## Prerequisites for Development

1. Wallet to create a new wallet and retrieve private and public key ([Coinbase Wallet](https://chrome.google.com/webstore/detail/coinbase-wallet-extension/hnfanknocfeofbddgcijnmhnfnkdnaad?hl=en) Recommended)
2. API URL for testnet and mainnet ([Alchemy](https://dashboard.alchemyapi.io/) Recommended)
3. Etherscan API Key for contract verification ([link to Etherscan](https://etherscan.io/))

## Step 1: Smart Contracts

To set up and deploy your NFT smart contract and interact with them via Hardhat go to [`/smart-contracts`](smart-contracts).

## Step 2: Frontend

To set up and deploy your own minting dapp UI go to [`/frontend`](frontend)

## Step 3: Metadata / Assets

To learn more about token metadata and generate your own metadata, go to [`/metadata`](metadata).

## Questions?

If you have any questions or notice issues, please file a ticket and we will respond as soon as possible! We welcome all contributors to open pull requests and will try to review them in a timely manner.

## Inspirations

This starter kit was largely inspired by the following projects:

- [Crypto Coven](https://www.cryptocoven.xyz/) - NFT collection that inspired the smart contract
- [NFT Merkle Allowlists Scaffold](https://github.com/straightupjac/nft-merkle-allowlist-scaffold) - another NFT scaffold that inspired the gas-efficient presale
- [Scaffold ETH](https://github.com/scaffold-eth/scaffold-eth) - the OG scaffold that inspired this project's direction
- [Hashlips Art Engine](https://github.com/HashLips/hashlips_art_engine) - generative art tool that inspired the asset generation

## Resources

- [Coinbase Wallet Developer Docs](https://docs.cloud.coinbase.com/wallet-sdk/docs) - official Coinbase Wallet Developer docs
- [Opensea NFT Developer Docs](https://docs.opensea.io/) - Opensea NFT documentation
- [Manifold Royalty Standard](https://manifoldxyz.substack.com/p/royaltyregistryxyz?s=r) - Royalty Standard created by the Manifold team
- [wagmi](https://github.com/tmm/wagmi) - we used this library for wallet integration on the frontend

### License

See [`LICENSE`](/LICENSE)
