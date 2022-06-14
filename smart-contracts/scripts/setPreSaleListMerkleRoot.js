require("dotenv").config();
const hre = require("hardhat");
const { generateMerkleRoot } = require("./generateMerkleRoots");
const fs = require("fs");

async function main() {
  const PRESALE_MERKLE_ROOT = await generateMerkleRoot(
    "../allowlists/presaleList.json",
    "presaleList"
  );

  const MyNFT = await hre.ethers.getContractFactory("MyNFT");
  const nft = await MyNFT.attach(
    process.env.CONTRACT_ADDRESS // deployed contract address
  );
  console.log("MyNFT attached to:", nft.address);

  console.log("Setting presale list merkle root...");

  const res = await nft.setPreSaleListMerkleRoot(PRESALE_MERKLE_ROOT);

  console.log("Presale list merkle root set as:", res);

  fs.copyFile(
    "allowlists/presaleList.json",
    "../frontend/basic/data/allowlists/presaleList.json",
    (err) => {
      if (err) {
        console.log("Error Found:", err);
      } else {
        console.log(
          "\nPresale List set for Basic frontend:",
          fs.readFileSync(
            "../frontend/basic/data/allowlists/presaleList.json",
            "utf8"
          )
        );
      }
    }
  );

  fs.copyFile(
    "allowlists/presaleList.json",
    "../frontend/coinbaes/data/allowlists/presaleList.json",
    (err) => {
      if (err) {
        console.log("Error Found:", err);
      } else {
        console.log("\nPre Sale List set for Coinbaes frontend");
      }
    }
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
