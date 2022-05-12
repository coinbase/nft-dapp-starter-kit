require('dotenv').config();
const hre = require("hardhat");

const CLAIMLIST_MERKLE_ROOT = "0xfba4bbcaea3b48b20e2b8d1287aafaa5f8916be4c79de8aec2cee7f072d14004"; // MODIFY THIS

async function main() {
    const NonFungibleCoinbae = await hre.ethers.getContractFactory("NonFungibleCoinbae");
    const nft = await NonFungibleCoinbae.attach(
      process.env.CONTRACT_ADDRESS // The deployed contract address
    );
  console.log("NonFungibleCoinbae attached to:", nft.address);

  console.log("setting claimlist merkle root...");

  const res = await nft.setClaimlistMerkleRoot(CLAIMLIST_MERKLE_ROOT);

  console.log('set claimlist merkle root', res);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});