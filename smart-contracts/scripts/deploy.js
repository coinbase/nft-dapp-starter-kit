const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const MyNFT = await hre.ethers.getContractFactory("MyNFT");

  const ROYALTY_RECEIVER_ADDR = process.env.ROYALTY_RECEIVER_ADDR;

  if (!ROYALTY_RECEIVER_ADDR) {
    console.log("ROYALTY_RECEIVER_ADDR is required. Please update your .env");
    return;
  }

  const deployedContract = await MyNFT.deploy(ROYALTY_RECEIVER_ADDR);

  await deployedContract.deployed();

  console.log("MyNFT deployed to:", deployedContract.address);

  fs.copyFile(
    "artifacts/contracts/nft.sol/MyNFT.json",
    "../frontend/basic/data/MyNFT.json",
    (err) => {
      if (err) {
        console.log("Error Found:", err);
      } else {
        console.log(
          "\nCopied ABI file:",
          fs.readFileSync("../frontend/basic/data/MyNFT.json", "utf8")
        );
      }
    }
  );

  return deployedContract;
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
