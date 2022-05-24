const fs = require("fs");
const { exit } = require("process");
require("dotenv").config();

async function main() {
  console.log("uploading metadata...");
  const OUTPUT_DIR = process.env.OUTPUT_DIR;
  const PIN_BUNDLE_NAME = process.env.PIN_BUNDLE_NAME;

  const pinataSDK = require("@pinata/sdk");
  const PINATA_API_KEY = process.env.PINATA_API_KEY;
  const PINATA_SECRET_KEY = process.env.PINATA_SECRET_KEY;

  if (!PINATA_API_KEY || !PINATA_SECRET_KEY) {
    console.log("need to provide PINATA_API_KEY and PINATA_SECRET_KEY");
    return;
  }
  const pinata = pinataSDK(PINATA_API_KEY, PINATA_SECRET_KEY);

  if (!OUTPUT_DIR) {
    console.log("need to specify folder to pin");
    return;
  }

  fs.access(OUTPUT_DIR, async (error) => {
    if (error) {
      console.log("path provided is invalid", error);
      exit(1);
    }
  });

  const options = {
    pinataMetadata: {
      name: PIN_BUNDLE_NAME | "NFT Metadata",
      keyvalues: {
        pinnedBy: "coinbaseWallet/nft-minting-starter-kit",
      },
    },
    pinataOptions: {
      cidVersion: 0,
    },
  };

  await pinata
    .pinFromFS(OUTPUT_DIR, options)
    .then((result) => {
      //handle results here
      console.log("successfully pinned!", result);
    })
    .catch((err) => {
      //handle error here
      console.log(err);
    });
  console.log("done uploading metadata!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
