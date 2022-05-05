const fs = require('fs');

const imageBaseURI = "https://gateway.pinata.cloud/ipfs/QmNs9kNhW9CWjFWBsczd5yegvSHgYDB87q2iek6Fy26268"

const generateMetadata = (path) => {

    const numTokens = 20;
 
 for (let idx = 0; idx < numTokens; idx++) {
    const metadata = {};
    metadata['name'] = `Woah Nice NFT #" ${idx}`
    metadata['image'] = `${imageBaseURI}/${idx}.svg`
    metadata['description'] = "Describe your NFT"
   
    fs.writeFile(`${path}/${idx}.json`, JSON.stringify(metadata, null, 2), { flag: 'w+' }, err => {
        if (err) {
          console.error(err);
        }
        // file written successfully
      });
  }
}

const filepath = "metadata/generated/";
generateMetadata(filepath);