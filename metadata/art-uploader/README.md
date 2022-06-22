# NFT Metadata

The scripts in this directory will be used to upload your images and metadata files to IPFS to retrieve a single base URI to set on your NFT smart contract (i.e. associate your NFT tokens with the uploaded metadata). If you don't have any images or metadata files prepared, check out the [`art-engine`](../art-engine) directory.

## Getting Started

0. Prepare a Pinata API key and secret key.
1. Put all your artwork into the `images` folder with the naming convention of `[tokenId].png`.
2. Put all your corresponding metadata files into the `json` folder with the naming of `[tokenId].json`.
3. Optional: Add a pre-reveal image named `preReveal.png`.

## Generate Metadata

1. Install Dependencies

   ```
   yarn install
   ```

1. Copy the `.env.sample` file as `.env` and fill in the details

1. Generate Metadata

   ```
   yarn generate
   ```

1. Retrieve the baseURI in the `generated/baseURI.txt` file and use it to set the baseURI on your contract.

## Generate Pre-Reveal Metadata

1. Add an asset to use as the pre-reveal placeholder image for your collection tokens (`preReveal.png`).

1. Generate Pre-reveal Metadata

   ```
   yarn generate-pre
   ```

1. Retrieve the baseURI in the `generated/preRevealURI.txt` file and use it to set the baseURI on your contract.

1. When the time comes to reveal your collection's artwork, set the new base URI on your contract with the post-reveal metadata.

## Additional Context on Metadata

Every ERC-721 token stores metadata typically fetched via the tokenURI method. The method returns a URI typically points to a storage of the metadata off-chain - most commonly IPFS. It's good practice to have your metadata conform with metadata standards so that indexers are able to parse your data and display the information on their platforms.

Most projects follow this schema, defined by the `Opensea Metadata Standard`:

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

## Token URI

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
