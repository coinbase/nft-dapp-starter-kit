require('dotenv').config();
const hre = require("hardhat");

const NEW_BASE_URI = ""; // MODIFY THIS

async function main() {
  const WoahNiceNFT = await hre.ethers.getContractFactory("WoahNiceNFT");
  const nft = await WoahNiceNFT.attach(
    process.env.CONTRACT_ADDRESS // The deployed contract address
  );
  console.log("WoahNiceNFT attached to:", nft.address);

  console.log("setting base uri...", NEW_BASE_URI);

  const res = await nft.setBaseURI(NEW_BASE_URI);

  console.log('set base uri', res);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});