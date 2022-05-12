require("dotenv").config();
const hre = require("hardhat");

async function main() {
  const IS_PUBLIC_SALE_ACTIVE = process.env.IS_PUBLIC_SALE_ACTIVE;
  if (!IS_PUBLIC_SALE_ACTIVE) {
    console.log(
      "IS_PUBLIC_SALE_ACTIVE is required. Please add it to your environment."
    );
    return;
  }

  const NonFungibleCoinbae = await hre.ethers.getContractFactory(
    "NonFungibleCoinbae"
  );
  const nft = await NonFungibleCoinbae.attach(
    process.env.CONTRACT_ADDRESS // The deployed contract address
  );
  console.log("NonFungibleCoinbae attached to:", nft.address);

  console.log(`setting isPublicSaleActive to ${IS_PUBLIC_SALE_ACTIVE}...`);

  const res = await nft.setIsPublicSaleActive(IS_PUBLIC_SALE_ACTIVE);

  console.log("set isPublicSaleActive", res);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
