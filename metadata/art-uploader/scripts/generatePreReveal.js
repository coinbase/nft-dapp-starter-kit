const { uploadPrerevealImage } = require("./pre-reveal/uploadImage");
const { generatePrerevealMetadata } = require("./pre-reveal/generateMetadata");
const { uploadPrerevealMetadata } = require("./pre-reveal/uploadMetadata");

async function main() {
  await uploadPrerevealImage();
  await generatePrerevealMetadata();
  await uploadPrerevealMetadata();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
