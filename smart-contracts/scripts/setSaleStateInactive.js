require("dotenv").config();
const hre = require("hardhat");

async function main() {
  const MyNFT = await hre.ethers.getContractFactory("MyNFT");

  const nft = await MyNFT.attach(
    process.env.CONTRACT_ADDRESS // deployed contract address
  );
  console.log("MyNFT attached to:", nft.address);

  console.log(`setting contract saleState to inactive...`);

  const res = await nft.setSaleInactive();

  console.log("set PresaleActive", res);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
