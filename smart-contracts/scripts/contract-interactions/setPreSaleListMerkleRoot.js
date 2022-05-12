require("dotenv").config();
const hre = require("hardhat");
const { generateMerkleRoot } = require("../generateMerkleRoots");

async function main() {
  const CLAIMLIST_MERKLE_ROOT = await generateMerkleRoot(
    "../allowlists/presaleList.json",
    "presaleList"
  );

  const NonFungibleCoinbae = await hre.ethers.getContractFactory(
    "NonFungibleCoinbae"
  );
  const nft = await NonFungibleCoinbae.attach(
    process.env.CONTRACT_ADDRESS // The deployed contract address
  );
  console.log("NonFungibleCoinbae attached to:", nft.address);

  console.log("setting claimlist merkle root...");

  const res = await nft.setPreSaleListMerkleRoot(CLAIMLIST_MERKLE_ROOT);

  console.log("set claimlist merkle root", res);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
