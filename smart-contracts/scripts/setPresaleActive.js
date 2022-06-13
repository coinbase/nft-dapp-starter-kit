require("dotenv").config();
const hre = require("hardhat");

async function main() {
  const MyNFT = await hre.ethers.getContractFactory("MyNFT");

  const nft = await MyNFT.attach(
    process.env.CONTRACT_ADDRESS // The deployed contract address
  );
  console.log("MyNFT attached to:", nft.address);

  console.log(`setting contract saleState to presale...`);

  const res = await nft.setPreSaleActive();

  console.log("set PresaleActive", res);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
