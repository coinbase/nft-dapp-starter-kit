const fs = require("fs");
const { exit } = require("process");
require("dotenv").config();

/*
 * Upload metadata files to IPFS via Pinata
 */
const uploadPrerevealMetadata = async () => {
  console.log("Uploading post-reveal JSON...");

  const pinataSDK = require("@pinata/sdk");
  const PINATA_API_KEY = process.env.PINATA_API_KEY;
  const PINATA_SECRET_KEY = process.env.PINATA_SECRET_KEY;

  if (!PINATA_API_KEY || !PINATA_SECRET_KEY) {
    console.log(
      "You must provide a Pinata API key and Secret key as env variables"
    );
    return;
  }

  const POST_REVEAL_DIR = "pre-reveal";

  fs.access(POST_REVEAL_DIR, async (error) => {
    if (error) {
      console.log("Provided path is not a valid path", error);
      exit(1);
    }
  });

  const options = {
    pinataMetadata: {
      name: "NFT Project Post-Reveal Metadata",
    },
    pinataOptions: {
      cidVersion: 0,
    },
  };

  const pinata = pinataSDK(PINATA_API_KEY, PINATA_SECRET_KEY);

  await pinata
    .pinFromFS(POST_REVEAL_DIR, options)
    .then(async (result) => {
      console.log("Metadata successfully uploaded", result);

      const pinataURL = `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`;
      const filepath = "generated/preRevealURI.txt";

      try {
        await fs.writeFileSync(filepath, pinataURL);
        console.log("File written successfully to ", filepath);
      } catch (err) {
        console.error(err);
      }
    })
    .catch((err) => {
      console.log(err);
    });
  console.log("Finished uploading collection metadata");
};

/* Comment out these lines to run this script on its own */
// uploadPrerevealMetadata()
//   .then(() => {
//     process.exit(0);
//   })
//   .catch((error) => {
//     console.error(error);
//     process.exit(1);
//   });

module.exports = { uploadPrerevealMetadata };
