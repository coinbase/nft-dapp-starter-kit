const hre = require("hardhat");

async function main() {
  const NonFungibleCoinbae = await hre.ethers.getContractFactory(
    "NonFungibleCoinbae"
  );

  const ROYALTY_RECEIVER_ADDR = process.env.ROYALTY_RECEIVER_ADDR;

  if (!ROYALTY_RECEIVER_ADDR) {
    console.log("ROYALTY_RECEIVER_ADDR is required. Please update your .env");
    return;
  }

  const nft = await NonFungibleCoinbae.deploy(ROYALTY_RECEIVER_ADDR);

  await nft.deployed();

  console.log("NonFungibleCoinbae deployed to:", nft.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
