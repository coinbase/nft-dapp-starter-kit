require('dotenv').config();
const hre = require("hardhat");

const tokenURI = "https://gateway.pinata.cloud/ipfs/QmeqbQ6qYQg7P4ZDepSKTccDNQKgYpjP5Y33aYkFxrmaQW";

const main = async  () => {
    const NFT = await hre.ethers.getContractFactory("SimpleNFT");
    const nft = await NFT.attach(
        process.env.CONTRACT_ADDRESS // The deployed contract address
      );
      console.log("contract attached to:", nft.address);
    await  nft.mintNFT(process.env.PUBLIC_KEY, tokenURI);
    console.log(`Your transaction is confirmed, its receipt is: ${receipt.transactionHash}`);
};

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

