require('dotenv').config();
const hre = require("hardhat");

const RESERVELIST_MERKLE_ROOT = "0xfba4bbcaea3b48b20e2b8d1287aafaa5f8916be4c79de8aec2cee7f072d14004"; // MODIFY THIS

async function main() {
    const WoahNiceNFT = await hre.ethers.getContractFactory("WoahNiceNFT");
    const nft = await WoahNiceNFT.attach(
      process.env.CONTRACT_ADDRESS // The deployed contract address
    );
  console.log("WoahNiceNFT attached to:", nft.address);

  console.log("setting reserve list merkle root...");

  const res = await nft.setReserveListMerkleRoot(RESERVELIST_MERKLE_ROOT);

  console.log('set reserve list merkle root', res);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});