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

```bash
node metadata/generateMetadata.js
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
