require("dotenv").config();
const hre = require("hardhat");

const NUM_TOKENS = 19; // MODIFY THIS

async function main() {
  const NonFungibleCoinbae = await hre.ethers.getContractFactory(
    "NonFungibleCoinbae"
  );
  const nft = await NonFungibleCoinbae.attach(
    process.env.CONTRACT_ADDRESS // The deployed contract address
  );
  console.log("NonFungibleCoinbae attached to:", nft.address);

  console.log("reserveForGifting...");

  const res = await nft.reserveForGifting(NUM_TOKENS);

  console.log("reserveForGifting done!", res);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
