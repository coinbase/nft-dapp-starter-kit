const hre = require("hardhat");

async function main() {
  const WoahNiceNFT = await hre.ethers.getContractFactory("WoahNiceNFT");
  const nft = await WoahNiceNFT.deploy("0xF4604411A380F13e2AFEa3a6983307411e7d9A1b");

  await nft.deployed();

  console.log("WoahNiceNFT deployed to:", nft.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
