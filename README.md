# NFT Dapp Starter Kit 🏗️

Ready to bootstrap your own NFT minting site? You're in the right place. This boilerplate repo contains an NFT minting contract, a sample frontend dapp, and metadata generation scripts for you to get started.

Play around with the deployed test app [here](https://nonfungiblecoinbaes.vercel.app/). Check out the deployed test contract on Goerli: `NonFungibleCoinbae`: [`0xBa9FFf60ead181805369F92e032D898227937b2B`](https://goerli.etherscan.io/address/0xBa9FFf60ead181805369F92e032D898227937b2B).

## Getting Started

Have the following items handy, then fork this repository and move onto Step 1:

1. Private and public key of your development wallet ([Coinbase Wallet](https://chrome.google.com/webstore/detail/coinbase-wallet-extension/hnfanknocfeofbddgcijnmhnfnkdnaad?hl=en) Recommended)
2. API URL for testnet and mainnet ([Coinbase](https://www.coinbase.com/cloud/products/node) recommended for mainnet, [Alchemy](https://dashboard.alchemyapi.io/) or [Infura](https://infura.io/) for testnet)
3. Etherscan API Key for contract verification ([Etherscan](https://etherscan.io/))

## Step 1: Smart Contracts

Set up and deploy your NFT smart contract and interact with them via Hardhat by going to [`/smart-contracts`](smart-contracts).

## Step 2: Frontend

Set up and deploy your own minting dapp UI by going to [`/frontend`](frontend)

## Step 3: Metadata / Assets

Learn more about token metadata and generate your own metadata by going to [`/metadata`](metadata).

## Questions?

If you have any questions or notice issues, please file a ticket and we will respond as soon as possible! We welcome all contributors to open pull requests and will try to review them in a timely manner.

## Projects Built with NFT Dapp Starter Kit

Open a PR to add your project to the list:)

- [Burn My Wallet](https://burnmywallet.com/#) (Winner of ETH New York 2022)

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
- [wagmi](https://github.com/tmm/wagmi) - library used for wallet integration on the frontend website

### License

See [`LICENSE`](/LICENSE)
