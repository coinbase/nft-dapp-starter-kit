const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const MyNFT = await hre.ethers.getContractFactory("MyNFT");
  console.log("script running...");

  const ROYALTY_RECEIVER_ADDR = process.env.ROYALTY_RECEIVER_ADDR;

  if (!ROYALTY_RECEIVER_ADDR) {
    console.log("ROYALTY_RECEIVER_ADDR is required. Please update your .env");
    return;
  }

  console.log("right before deploy...");

  const deployedContract = await MyNFT.deploy(ROYALTY_RECEIVER_ADDR, {
    nonce: 195,
    gasPrice: 50000000000,
  });

  console.log(
    "right after deploy...: ",
    JSON.stringify(deployedContract, null, 2)
  );
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
