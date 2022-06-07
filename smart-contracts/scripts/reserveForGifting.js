require("dotenv").config();
const hre = require("hardhat");

async function main() {
  const NUM_TOKENS = process.env.NUM_TOKENS;
  if (!NUM_TOKENS) {
    console.log("BASE_URI is required. Please add it to your environment.");
    return;
  }

  const MyNFT = await hre.ethers.getContractFactory("MyNFT");
  const nft = await MyNFT.attach(
    process.env.CONTRACT_ADDRESS // The deployed contract address
  );
  console.log("MyNFT attached to:", nft.address);

  console.log("reserveForGifting...");

  const res = await nft.reserveForGifting(NUM_TOKENS);

  console.log("reserveForGifting done!", res);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
