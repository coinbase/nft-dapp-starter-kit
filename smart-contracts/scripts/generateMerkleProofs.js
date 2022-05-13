const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');
const fs = require('fs');

export const generateMerkleProof = (addressesPath, address) => {
    const addresses = require(addressesPath);
    const leafNodes = addresses.map((addr) => keccak256(addr));
    const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
  
    const hashedAddress = keccak256(address);
    const proof = merkleTree.getHexProof(hashedAddress);
    const root = merkleTree.getHexRoot();
  
    const valid = merkleTree.verify(proof, hashedAddress, root);
  
    fs.writeFile(`generated/merkle-proofs/claimlist/${address}-claimlist-merkle-proof.json`, JSON.stringify({
      valid: valid,
      proof: proof
    }), { flag: 'w+' }, err => {
      if (err) {
        console.error(err);
      }
      // file written successfully
    });
  
    console.log('generateMerkleProof', proof, valid)
    return valid;
  }

  generateMerkleProof('../allowlists/presaleList.json', '0x90F79bf6EB2c4f870365E785982E1f101E93b906');
  generateMerkleProof('../allowlists/presaleList.json', '0xF4604411A380F13e2AFEa3a6983307411e7d9A1b');