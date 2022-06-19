const fs = require("fs");

/*
 * Update image URL for each token pre-reveal metadata file
 */
const generatePrerevealMetadata = async () => {
  try {
    const baseURI = await fs.readFileSync("generated/preImgURI.txt", "utf8");

    const { TOTAL_SUPPLY } = process.env;

    for (let i = 0; i < TOTAL_SUPPLY; i++) {
      const metadata = {};
      metadata["name"] = `My NFT #${i}`;
      metadata["image"] = baseURI;
      metadata["description"] =
        "My NFT is an exclusive NFT collection. Stay tuned for the reveal.";

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

/* Comment out these lines to run this script on its own */
// generatePrerevealMetadata()
//   .then(() => {
//     process.exit(0);
//   })
//   .catch((error) => {
//     console.error(error);
//     process.exit(1);
//   });

module.exports = { generatePrerevealMetadata };
