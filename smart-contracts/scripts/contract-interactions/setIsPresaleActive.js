require("dotenv").config();
const hre = require("hardhat");

async function main() {
  const NonFungibleCoinbae = await hre.ethers.getContractFactory(
    "NonFungibleCoinbae"
  );

  const IS_PRESALE_ACTIVE = process.env.IS_PRESALE_ACTIVE;
  if (!IS_PRESALE_ACTIVE) {
    console.log(
      "IS_PRESALE_ACTIVE is required. Please add it to your environment."
    );
    return;
  }

  const nft = await NonFungibleCoinbae.attach(
    process.env.CONTRACT_ADDRESS // The deployed contract address
  );
  console.log("NonFungibleCoinbae attached to:", nft.address);

  console.log("setting isPresaleActive...");

  const res = await nft.setIsPreSaleActive(IS_PRESALE_ACTIVE);

  console.log("set isPresaleActive", res);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

module.exports = {
  main,
};
