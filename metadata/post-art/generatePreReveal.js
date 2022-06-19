const fs = require("fs");
const { exit } = require("process");
require("dotenv").config();

async function main() {
  await uploadPrerevealImage();
  await createPreRevealMetadata();
  await uploadMetadata();
}

/*
 * Upload pre-reveal image to IPFS via Pinata
 */
const uploadPrerevealImage = async () => {
  console.log("Uploading pre-reveal image...");

  const pinataSDK = require("@pinata/sdk");
  const PINATA_API_KEY = process.env.PINATA_API_KEY;
  const PINATA_SECRET_KEY = process.env.PINATA_SECRET_KEY;

  if (!PINATA_API_KEY || !PINATA_SECRET_KEY) {
    console.log(
      "You must provide a Pinata API key and Secret key as env variables"
    );
    return;
  }

  const PRE_REVEAL_DIR = "preReveal.png";

  fs.access(PRE_REVEAL_DIR, async (error) => {
    if (error) {
      console.log("Provided path is not a valid path", error);
      exit(1);
    }
  });

  const options = {
    pinataMetadata: {
      name: "NFT Project Pre-Reveal Image",
    },
    pinataOptions: {
      cidVersion: 0,
    },
  };

  const pinata = pinataSDK(PINATA_API_KEY, PINATA_SECRET_KEY);

  await pinata
    .pinFromFS(PRE_REVEAL_DIR, options)
    .then(async (result) => {
      console.log("Images successfully uploaded", result);

      const pinataURL = `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`;
      const filepath = "generated/preImgURI.txt";

      try {
        await fs.writeFileSync(filepath, pinataURL);
        console.log("File written successfully to", filepath);
      } catch (err) {
        console.error(err);
      }
    })
    .catch((err) => {
      console.log(err);
    });
  console.log("Finished uploading images");
};

/*
 * Generate pre-reveal metadata with pre-reveal image
 */
const createPreRevealMetadata = async () => {
  try {
    const baseURI = await fs.readFileSync("generated/preImgURI.txt", "utf8");

    const { TOTAL_SUPPLY } = process.env;

    for (let i = 0; i < TOTAL_SUPPLY; i++) {
      const metadata = {};
      metadata["name"] = `Non-Fungible Coinbaes #${i}`;
      metadata["image"] = baseURI;
      metadata["description"] =
        "non fungible coinbaes chillin in the clouds. they will be ready for landing soon.";

      const json = JSON.stringify(metadata, null, 2);

      if (!fs.existsSync("pre-reveal")) {
        fs.mkdirSync(`pre-reveal`);
      }

      await fs.writeFileSync(`pre-reveal/${i}.json`, json);

      console.log(`Created metadata for pre-reveal tokens`);
    }
  } catch (err) {
    throw err;
  }
};

/*
 * Upload pre-reveal metadata files to IPFS as a collection
 */
const uploadMetadata = async () => {
  console.log("Uploading pre-reveal JSON...");

  const pinataSDK = require("@pinata/sdk");
  const PINATA_API_KEY = process.env.PINATA_API_KEY;
  const PINATA_SECRET_KEY = process.env.PINATA_SECRET_KEY;

  if (!PINATA_API_KEY || !PINATA_SECRET_KEY) {
    console.log(
      "You must provide a Pinata API key and Secret key as env variables"
    );
    return;
  }

  const PRE_REVEALDIR = "pre-reveal";

  fs.access(PRE_REVEALDIR, async (error) => {
    if (error) {
      console.log("Provided path is not a valid path", error);
      exit(1);
    }
  });

  const options = {
    pinataMetadata: {
      name: "NFT Project Pre-Reveal Metadata",
    },
    pinataOptions: {
      cidVersion: 0,
    },
  };

  const pinata = pinataSDK(PINATA_API_KEY, PINATA_SECRET_KEY);

  await pinata
    .pinFromFS(PRE_REVEALDIR, options)
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

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
