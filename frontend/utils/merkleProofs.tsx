import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";

export const generateMerkleProof = (addresses: string[], address: string) => {
  const leafNodes = addresses.map((addr: string) => keccak256(addr));
  const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });

  const hashedAddress = keccak256(address);
  const proof = merkleTree.getHexProof(hashedAddress);
  const root = merkleTree.getHexRoot();

  const valid = merkleTree.verify(proof, hashedAddress, root);

  return {
    valid: valid,
    proof: proof,
  };
};
