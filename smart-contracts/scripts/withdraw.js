require("dotenv").config();
const hre = require("hardhat");

async function main() {
  const MyNFT = await hre.ethers.getContractFactory("MyNFT");

  const nft = await MyNFT.attach(
    process.env.CONTRACT_ADDRESS // deployed contract address
  );
  console.log("MyNFT attached to:", nft.address);

  console.log(`Withdrawing ETH from NFT contract...`);

  const res = await nft.withdraw();

  console.log("ETH withdrawn!", res);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
