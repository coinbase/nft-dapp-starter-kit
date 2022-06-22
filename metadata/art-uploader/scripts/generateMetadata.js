const { uploadImages } = require("./post-reveal/uploadImages");
const { updateMetadata } = require("./post-reveal/updateMetadata");
const { uploadMetadata } = require("./post-reveal/uploadMetadata");

async function main() {
  await uploadImages();
  await updateMetadata();
  await uploadMetadata();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
