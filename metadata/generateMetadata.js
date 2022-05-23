const fs = require("fs");
require("dotenv").config();

const generateMetadata = (path) => {
  const numTokens = process.env.TOTAL_SUPPLY;
  const revealedTokens = process.env.REVEALED_TOKENS;

  // pre-reveal placeholder tokens
  for (let idx = 0; idx < numTokens - revealedTokens; idx++) {
    const metadata = {};
    metadata["name"] = `Non-Fungible Coinbaes #${idx}`;
    metadata["image"] = imageURI; // if you have one single image (typically for pre-reveal) for all tokens
    metadata["description"] =
      "non fungible coinbaes chillin in the clouds. they will be ready for landing soon.";

    fs.writeFile(
      `${path}/${idx}.json`,
      JSON.stringify(metadata, null, 2),
      { flag: "w+" },
      (err) => {
        if (err) {
          console.error(err);
        }
        // file written successfully
      }
    );
  }

  for (let idx = numTokens - revealedTokens; idx < numTokens; idx++) {
    const metadata = {};
    metadata["name"] = `Non-Fungible Coinbaes #${idx}`;
    metadata["image"] = `${imageBaseURI}/${
      Math.floor(Math.random() * 7) + 1
    }.png`; // if your images are unique for each token id
    metadata["description"] = "non fungible coinbae has landed";
    metadata["attributes"] = [
      {
        trait_type: "Bing",
        value: "Bong",
      },
      {
        trait_type: "coin",
        value: "bae <3",
      },
    ];

    fs.writeFile(
      `${path}/${idx}.json`,
      JSON.stringify(metadata, null, 2),
      { flag: "w+" },
      (err) => {
        if (err) {
          console.error(err);
        }
        // file written successfully
      }
    );
  }
};

const filepath = "metadata/generated";
generateMetadata(filepath);
