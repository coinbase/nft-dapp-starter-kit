const fs = require("fs");
let baseURI;

/*
 * Read IPFS URI from text file
 */
const readURI = async () => {
  try {
    const data = await fs.readFileSync(
      "build/URI/postRevealImgURL.txt",
      "utf8"
    );
    baseURI = data;
  } catch (err) {
    throw err;
  }
};

/*
 * Update image URL for each token metadata file
 */
const updateURI = async () => {
  try {
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

readURI();
updateURI();
