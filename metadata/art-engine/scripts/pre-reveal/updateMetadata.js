const fs = require("fs");

/*
 * Update image URL for each token pre-reveal metadata file
 */
const updatePrerevealMetadata = async () => {
  try {
    const baseURI = await fs.readFileSync(
      "build/URI/preRevealImgURI.txt",
      "utf8"
    );
    const files = await fs.readdirSync("build/json");

    for (let i = 1; i <= files.length; i++) {
      const fileData = await fs.readFileSync(`build/preRevealJson/${i}.json`);
      const json = JSON.parse(fileData.toString());

      json.image_url = `${baseURI}`;
      const newJson = JSON.stringify(json);

      await fs.writeFileSync(`build/preRevealJson/${i}.json`, newJson);
      console.log(`Updated metadata for token: ${i}`);
    }
  } catch (err) {
    throw err;
  }
};

/* Comment out these lines to run this script on its own */
// updatePrerevealMetadata()
//   .then(() => {
//     process.exit(0);
//   })
//   .catch((error) => {
//     console.error(error);
//     process.exit(1);
//   });

module.exports = { updatePrerevealMetadata };
