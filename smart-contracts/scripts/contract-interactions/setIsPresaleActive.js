require('dotenv').config();
const hre = require("hardhat");

const IS_PRESALE_ACTIVE = true; // MODIFY THIS

async function main() {
    const NonFungibleCoinbae = await hre.ethers.getContractFactory("NonFungibleCoinbae");
    const nft = await NonFungibleCoinbae.attach(
      process.env.CONTRACT_ADDRESS // The deployed contract address
    );
  console.log("NonFungibleCoinbae attached to:", nft.address);

  console.log("setting isPresaleActive...");

  const res = await nft.setIsPreSaleActive(IS_PRESALE_ACTIVE);

  console.log('set isPresaleActive', res);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});