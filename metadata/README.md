# NFT Metadata

Every ERC-721 token can store some metadata typically through metadataURI (but can be called other things like contractURI etc). This typically points to a link that stores the metadata off-chain - most commonly IPFS. In addition to this, marketplaces and other NFT providers often have their own API that exposes more information about the NFT that is not stored ‘on-chain’.

It's generally good practice to have your metadata conform with metadata standards so that indexers are able to parse your data and display the information on their platforms.
There isn't a universal standard for NFT metadata but most projects follow this schema:

```
{
    "name": "Woah Nice NFT",
    "image": "https://gateway.pinata.cloud/ipfs/Qmd9fFVJEELBLyZE84945qz8U32LZHgJ3yvzPbU4L2vxvD",
    "description": "All about this project",
    "attributes": [
      {
        "trait_type": "Creator",
        "value": "Me!"
      }
    ]
  }
```

Some other major marketplaces like Zora and Rarible have slightly different metadata standard schemas.

## Metadata Generating

A sample script to generate metadata for projects using the `tokenURI()` override with a return value of `string(abi.encodePacked(baseURI, "/", tokenId.toString(), ".json"));`, there is a sample script that can be modified to generate metadata in bulk.

First populate the following `.env` variables:

```bash
PRE_REVEAL_URI= # for placeholder pre-reveal data
BASE_URI=https://gateway.pinata.cloud/ipfs/QmYnznvRMX7NYeGg87D51ruzmuuq2schCMde5ch3Pz3j3S
REVEALED_TOKENS=10 # tokens that have been or are ready to be revealed
TOTAL_SUPPLY=900
```

and then run:

```bash
npm run generate-basic
```

## Contract Level (Collection) Metadata

Some marketplaces and wallets display contract-level/collection metadata. For Opensea, this information is read off a [`contractURI`](https://docs.opensea.io/docs/contract-level-metadata) read function.

You can optionally add collection metadata to your contract by adding the external view function into your contract.

```
function contractURI() public view returns (string memory) {
    return collectionURI;
}
```

`collectionURI` can be set in the contract constructor or a setter can be added as well to modify the contractURI information after deploy.

```
  function setCollectionURI(string memory _collectionURI) external onlyOwner {
        collectionURI = _collectionURI_;
    }
```

## Non-Fungible Coinbae's Token URI

For this scaffold, notice that the `tokenURI()` is defined as follows:

```cpp
function tokenURI(uint256 tokenId)
      public
      view
      virtual
      override
      returns (string memory)
  {
      require(_exists(tokenId), "Nonexistent token");

      return
          string(abi.encodePacked(baseURI, "/", tokenId.toString(), ".json"));
  }
```

`tokenURI()` is a method required in the ERC721 interface and is what indexers (how major NFT marketplace and wallets recognize your NFT) call to extract your NFT media and metadata. There are many different ways to implement `tokenURI` including unique tokenURIs per token, on-chain metadata (expensive gas costs) and IPFS collections with a standardized naming schema. This project has implemented the last option "IPFS collections with a standardized naming scheme".

This means that when you generate the collection of metadata, the contract will expect that all the metadata `.json` files will be contained under one `IPFS` hash. This way, the NFT creator is only required to change the `baseURI` to modify the media and metadata for the entire collection. The indexers will expect the metadata for each individual token to be retrived by concatenating the `IPFS` hash with the tokenId like `ipfs://[hash]/[tokenId].json`.

## Pre-Reveal and Post-Reveal

For this project, we decided to go with the model of storing metadata off-chain via IPFS and using a model of batch reveals to prevent rarity sniping<sub>1</sub>. How this works is:

1. the project creators initially set a base URI to a placeholder image and placeholder metadata
2. the project opens up for minting and minters will receive the NFTs in a pre-reveal state
3. The NFT creators will decide on a 'reveal date' and track how many tokens have been minted. This will be used to generate a new set of metadata such that only the tokens that have already been minted will be populated with the NFT collection. The rest of the unminted tokens will still point to pre-reveal data
   - ideally only the tokens that have already been minted will be revealed and the rest of tokens that have not been minted yet will still point to the pre-reveal metadata
4. The creators will do a 'reveal' where they will run `setBaseURI` to replace the base URI with the actual NFT images for the collection.
5. If the project is not fully minted out (token count has not reached total supply yet), steps 2-4 will repeat until the collection is minted out.

With this method, minters will not be able to predict which token IDs contain which traits.

## Uploading Metadata to IPFS

After you generate your metadata, you can use a pinning service such as [Pinata](https://github.com/PinataCloud/Pinata-SDK#metadata-anchor) to upload and pin your data to IPFS.

Populate the following fields in your `.env`:

```
PINATA_API_KEY=
PINATA_SECRET_KEY=
PIN_FOLDER=generated  # folder to upload
PIN_BUNDLE_NAME=nft-minting-kit-test # name of pinned folder (optional)
```

and run `npm run upload` to pin the contents of the specified folder.

The IPFS hash will be printed in the console and a your pinned metadata will be available to view in the [Pinata Pin Manager](https://app.pinata.cloud/pinmanager) shortly. Update the baseURI in your contract.

---

1. Rarity sniping is the practice of NFT collectors finding exploits in the way token data is populated such that they can predict the traits of NFTs before they are minted so they can time purchases to acquire certain token IDs. The goal of this is generally to acquire rare NFTs that they are able to resell for a profit on secondary markets.
