require("dotenv").config();
const hre = require("hardhat");

async function main() {
  const COLLECTION_URI = process.env.COLLECTION_URI;
  if (!COLLECTION_URI) {
    console.log(
      "COLLECTION_URI is required. Please add it to your environment."
    );
    return;
  }

  const MyNFT = await hre.ethers.getContractFactory("MyNFT");
  const nft = await MyNFT.attach(
    process.env.CONTRACT_ADDRESS // The deployed contract address
  );
  console.log("MyNFT attached to:", nft.address);

  console.log("setting collection uri...", COLLECTION_URI);

  const res = await nft.setCollectionURI(COLLECTION_URI);

  console.log("set collection uri", res);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
