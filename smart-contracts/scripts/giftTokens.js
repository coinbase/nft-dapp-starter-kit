require("dotenv").config();
const hre = require("hardhat");

async function main() {
  const RECIPIENTS = [
    "0x56ECc7D00bd338837E4d45047EaAec4843Ea810F",
    "0x3B19E78E8F65ea1Cc268Cba896B335057d5CFeb3",
    "0x79Da54d41c61820cf07d96E4CF19Dbf30D67Cf89",
  ]; // modify as needed

  const MyNFT = await hre.ethers.getContractFactory("MyNFT");

  const nft = await MyNFT.attach(
    process.env.CONTRACT_ADDRESS // deployed contract address
  );
  console.log("MyNFT attached to:", nft.address);

  console.log("Gifting tokens...");

  const res = await nft.giftTokens(RECIPIENTS);

  console.log("Tokens gifted!", res);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
