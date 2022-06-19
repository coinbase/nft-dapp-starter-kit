const fs = require("fs");
const { exit } = require("process");
require("dotenv").config();

async function main() {
  await uploadImages();
  await updateImageURI();
  await uploadMetadata();
}

/*
 * Upload images to IPFS via Pinata
 */
const uploadImages = async () => {
  console.log("Uploading images...");

  const pinataSDK = require("@pinata/sdk");
  const PINATA_API_KEY = process.env.PINATA_API_KEY;
  const PINATA_SECRET_KEY = process.env.PINATA_SECRET_KEY;

  if (!PINATA_API_KEY || !PINATA_SECRET_KEY) {
    console.log(
      "You must provide a Pinata API key and Secret key as env variables"
    );
    return;
  }

  const IMAGE_DIR = "images";

  fs.access(IMAGE_DIR, async (error) => {
    if (error) {
      console.log("Provided path is not a valid path", error);
      exit(1);
    }
  });

  const options = {
    pinataMetadata: {
      name: "NFT Project Images",
    },
    pinataOptions: {
      cidVersion: 0,
    },
  };

  const pinata = pinataSDK(PINATA_API_KEY, PINATA_SECRET_KEY);

  await pinata
    .pinFromFS(IMAGE_DIR, options)
    .then(async (result) => {
      console.log("Images successfully uploaded", result);

      const pinataURL = `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`;
      const filepath = "generated/imgURI.txt";

      if (!fs.existsSync("generated/imgURI.txt")) {
        fs.mkdirSync(`generated`);
      }

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
 * Update image URL for each token metadata file
 */
const updateImageURI = async () => {
  try {
    const baseURI = await fs.readFileSync("generated/imgURI.txt", "utf8");
    const files = await fs.readdirSync("json");

    for (let i = 1; i <= files.length; i++) {
      const fileData = await fs.readFileSync(`json/${i}.json`);
      const json = JSON.parse(fileData.toString());

      json.image_url = `${baseURI}/${i}.png`;
      const newJson = JSON.stringify(json);

      await fs.writeFileSync(`json/${i}.json`, newJson);
      console.log(`Updated image URL for token: ${i}`);
    }
  } catch (err) {
    throw err;
  }
};

/*
 * Upload metadata files to IPFS as a collection
 */
const uploadMetadata = async () => {
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

  const POST_REVEAL_DIR = "json";

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
      const filepath = "generated/baseURI.txt";

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
