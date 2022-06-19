const fs = require("fs");

/*
 * Update image URL for each token metadata file
 */
const updateMetadata = async () => {
  try {
    const baseURI = await fs.readFileSync(
      "build/URI/postRevealImgURI.txt",
      "utf8"
    );
    const files = await fs.readdirSync("build/json");

    for (let i = 1; i <= files.length; i++) {
      const fileData = await fs.readFileSync(`build/json/${i}.json`);
      const json = JSON.parse(fileData.toString());

      json.image_url = `${baseURI}/${i}.png`;
      const newJson = JSON.stringify(json);

      await fs.writeFileSync(`build/json/${i}.json`, newJson);
      console.log(`Updated metadata for token: ${i}`);
    }
  } catch (err) {
    throw err;
  }
};

/* Comment out these lines to run this script on its own */
// updateMetadata()
//   .then(() => {
//     process.exit(0);
//   })
//   .catch((error) => {
//     console.error(error);
//     process.exit(1);
//   });

module.exports = { updateMetadata };
