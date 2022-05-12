require('dotenv').config();
const hre = require("hardhat");

const CLAIMLIST_MERKLE_ROOT = "0x343750465941b29921f50a28e0e43050e5e1c2611a3ea8d7fe1001090d5e1436"; // MODIFY THIS

async function main() {
    const NonFungibleCoinbae = await hre.ethers.getContractFactory("NonFungibleCoinbae");
    const nft = await NonFungibleCoinbae.attach(
      process.env.CONTRACT_ADDRESS // The deployed contract address
    );
  console.log("NonFungibleCoinbae attached to:", nft.address);

  console.log("setting claimlist merkle root...");

  const res = await nft.setPreSaleListMerkleRoot(CLAIMLIST_MERKLE_ROOT);

  console.log('set claimlist merkle root', res);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});