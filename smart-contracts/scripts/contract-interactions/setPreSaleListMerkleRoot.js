require("dotenv").config();
const hre = require("hardhat");
const { generateMerkleRoot } = require("../generateMerkleRoots");
const fs = require("fs");

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

  console.log("setting presale list merkle root...");

  const res = await nft.setPreSaleListMerkleRoot(CLAIMLIST_MERKLE_ROOT);

  console.log("set presale list merkle root", res);
  // copy contents of giftlist to front-end directory

  fs.copyFile(
    "allowlists/presaleList.json",
    "../frontend/data/allowlists/presaleList.json",
    (err) => {
      if (err) {
        console.log("Error Found:", err);
      } else {
        console.log(
          "\nPresale List:",
          fs.readFileSync(
            "../frontend/data/allowlists/presaleList.json",
            "utf8"
          )
        );
      }
    }
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
