require("dotenv").config();
const hre = require("hardhat");

const NUM_TOKENS = 5; // MODIFY THIS

async function main() {
  const MyNFT = await hre.ethers.getContractFactory("MyNFT");
  const nft = await MyNFT.attach(
    process.env.CONTRACT_ADDRESS // The deployed contract address
  );
  console.log("MyNFT attached to:", nft.address);

  console.log("minting...");

  const res = await nft.mint(NUM_TOKENS);

  console.log("minted!", res);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
