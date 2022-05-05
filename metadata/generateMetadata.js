const fs = require('fs');

const imageBaseURI = "https://gateway.pinata.cloud/ipfs/QmNs9kNhW9CWjFWBsczd5yegvSHgYDB87q2iek6Fy26268";
const imageURI = "https://lh3.googleusercontent.com/Gkh5aHDkBkPpu1F9zpIlgggEP676fr1omXhQpv1TGBG7L49F_7Vhf0d5aYawYMngav0VA4lEChPMyQBjM6oBCGplVjplG9yn3nWeSvlun_SCkJiIcU_9q-EE7KFAniysN0cDoRMQBtWTOATbXEt537hGecD87RXVNBnKXa9fHbVFUwwA2HVcO3fSzBQRJpDQwolHkCG_cMk_2GnuWQ61m_gKhVvOpBHfkpmaL8FPWBSpQC_3UPiSSbeC_LPn_UYguzEdzbxwAZNSNieGtOhajuGSxqDJDQDaT1l7cnD4Yb3QE5GtezVgW-GnohdfaTARN2cwtUl2Pxz2Kq1b8wnorFmOEe-e1ux7yV9oZtb-25v1nXytbuBYqHObgo7xGwPT9ZAOvUpNugMRzennxLcwwHA2s8QgzyQzvsSIMV5aw5seN5t61zgMhe5Ieopm4Jk0PucZb8fnKvElKBJe2OFCN6QFQBD_kcwtZlk9R-cOuTxiEdiOGi8_fN6BEKwxmRss3VkURvuQWpbHsEDeVWmYiV0b8_ziYnTIGmAnLLy5NFQRySoQ0FEt-r954ejC9cMFj3u4A0WGtbhhwpb-FYtk_gVo8elUKnbuR2HjLSJ8PByaQjHGLSr1sCBftnpzsINlCUN1NB346lrgP5u8Kd1ZiO8uHUWvpJy5BCOxdIb1nwvlAM2jrVHiYw_aFH0taR1PhrXD2pi51s3LIL01uOYnhLmoXYjUju04FqlNpu9CK0g2k08R_Ag4dVAxFwH57DvplwwNXcpt9XpqvEv1S2rq1hp0OHsgkjw=w951-h1509-no";

const generateMetadata = (path) => {

    const numTokens = 20;
 
 for (let idx = 0; idx < numTokens; idx++) {
    const metadata = {};
    metadata['name'] = `Woah Nice NFT #${idx}`
    metadata['image'] = imageURI;
    // metadata['image'] = `${imageBaseURI}/${idx}.svg` // if your images are unique for each token id
    metadata['description'] = "non fungible coinbaes chillin in the clouds"
    metadata['attributes'] = [
      {
        "trait_type": "Bing", 
        "value": "Bong"
      }, 
      {
        "trait_type": "coin", 
        "value": "bae <3"
      }];

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