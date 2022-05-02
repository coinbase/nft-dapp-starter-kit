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
