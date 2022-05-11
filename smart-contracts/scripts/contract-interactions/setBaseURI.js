require('dotenv').config();
const hre = require("hardhat");

const NEW_BASE_URI = "https://gateway.pinata.cloud/ipfs/QmUjdsenuQvopTAubZNUKdaZjYVR8Kpo6nbDYJxyqpgRF2"; // MODIFY THIS

async function main() {
  const NonFungibleCoinbae = await hre.ethers.getContractFactory("NonFungibleCoinbae");
  const nft = await NonFungibleCoinbae.attach(
    process.env.CONTRACT_ADDRESS // The deployed contract address
  );
  console.log("NonFungibleCoinbae attached to:", nft.address);

  console.log("setting base uri...", NEW_BASE_URI);

  const res = await nft.setBaseURI(NEW_BASE_URI);

  console.log('set base uri', res);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});