const basePath = process.cwd();
const { generateImages, setup } = require(`${basePath}/src/main.js`);

function main() {
  setup();
  generateImages();
}

main();
