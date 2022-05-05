require('dotenv').config();
const hre = require("hardhat");

const IS_PUBLIC_SALE_ACTIVE = true; // MODIFY THIS

async function main() {
    const WoahNiceNFT = await hre.ethers.getContractFactory("WoahNiceNFT");
    const nft = await WoahNiceNFT.attach(
      process.env.CONTRACT_ADDRESS // The deployed contract address
    );
  console.log("WoahNiceNFT attached to:", nft.address);

  console.log("setting isPublicSaleActive...");

  const res = await nft.setIsPublicSaleActive(IS_PUBLIC_SALE_ACTIVE);

  console.log('set isPublicSaleActive', res);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});