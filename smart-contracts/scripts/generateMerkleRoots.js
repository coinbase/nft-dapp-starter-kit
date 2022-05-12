const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");
const fs = require("fs");

const generateMerkleRoot = (addressesPath, writeFileName) => {
  const addresses = require(addressesPath);
  const leafNodes = addresses.map((addr) => keccak256(addr));
  const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
  const rootHash = merkleTree.getHexRoot();

  fs.writeFile(
    `generated/merkle-roots/${writeFileName}.txt`,
    rootHash.toString("hex"),
    { flag: "w+" },
    (err) => {
      if (err) {
        console.error(err);
      }
      // file written successfully
    }
  );

  console.log("generateMerkleRoot", rootHash.toString("hex"));
  return rootHash;
};

module.exports = {
  generateMerkleRoot,
};
