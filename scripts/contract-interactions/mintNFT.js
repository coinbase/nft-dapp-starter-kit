require('dotenv').config();
const hre = require("hardhat");

const NUM_TOKENS = 5; // MODIFY THIS

async function main() {
    const WoahNiceNFT = await hre.ethers.getContractFactory("WoahNiceNFT");
    const nft = await WoahNiceNFT.attach(
      process.env.CONTRACT_ADDRESS // The deployed contract address
    );
  console.log("WoahNiceNFT attached to:", nft.address);

  console.log("minting...");

  const res = await nft.mint(NUM_TOKENS);

  console.log('minted!', res);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});