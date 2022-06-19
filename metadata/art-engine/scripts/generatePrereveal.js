const { uploadPrerevealImage } = require("./pre-reveal/uploadImage");
const { updatePrerevealMetadata } = require("./pre-reveal/updateMetadata");
const { uploadPrerevealMetadata } = require("./pre-reveal/uploadMetadata");

async function main() {
  await uploadPrerevealImage();
  await updatePrerevealMetadata();
  await uploadPrerevealMetadata();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
