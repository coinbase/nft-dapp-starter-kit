require('dotenv').config();
const hre = require("hardhat");

const IS_PRESALE_ACTIVE = true; // MODIFY THIS

async function main() {
    const WoahNiceNFT = await hre.ethers.getContractFactory("WoahNiceNFT");
    const nft = await WoahNiceNFT.attach(
      process.env.CONTRACT_ADDRESS // The deployed contract address
    );
  console.log("WoahNiceNFT attached to:", nft.address);

  console.log("setting isPresaleActive...");

  const res = await nft.setIsPresaleActive(IS_PRESALE_ACTIVE);

  console.log('set isPresaleActive', res);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});