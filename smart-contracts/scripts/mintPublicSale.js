require("dotenv").config();
const hre = require("hardhat");

const NUM_TOKENS = 5; // modify as needed

async function main() {
  const MyNFT = await hre.ethers.getContractFactory("MyNFT");

  const nft = await MyNFT.attach(
    process.env.CONTRACT_ADDRESS // deployed contract address
  );
  console.log("MyNFT attached to:", nft.address);

  console.log("Minting...");

  const res = await nft.mintPublicSale(NUM_TOKENS);

  console.log("Minted!", res);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
