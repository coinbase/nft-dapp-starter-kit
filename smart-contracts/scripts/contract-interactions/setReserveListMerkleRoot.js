require("dotenv").config();
const hre = require("hardhat");
const { generateMerkleRoot } = require("../generateMerkleRoots");

async function main() {
  const RESERVELIST_MERKLE_ROOT = generateMerkleRoot(
    "../allowlists/giftlist.json",
    "giftlist"
  );
  const NonFungibleCoinbae = await hre.ethers.getContractFactory(
    "NonFungibleCoinbae"
  );
  const nft = await NonFungibleCoinbae.attach(
    process.env.CONTRACT_ADDRESS // The deployed contract address
  );
  console.log("NonFungibleCoinbae attached to:", nft.address);

  console.log("setting reserve list merkle root...");

  const res = await nft.setReserveListMerkleRoot(RESERVELIST_MERKLE_ROOT);

  console.log("set reserve list merkle root", res);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
