// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { MerkleTree} from 'merkletreejs';
import keccak256 from 'keccak256';
import fs from 'fs';

type Data = {
  msg?: string;
  proof?: string[];
  valid?: boolean;
}

const giftlist = JSON.parse(fs.readFileSync('data/allowlists/giftlist.json', 'utf-8'))
const hashedAddresses = giftlist.map((addr: string) => keccak256(addr));
const merkleTree = new MerkleTree(hashedAddresses, keccak256, { sortPairs: true });

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

    /** validate req type **/
  if (req.method !== 'GET') {
    res.status(400);
    return;
  }

  const address = req.query.address;
  if (!address) {
    res.status(400).json({ msg: 'address is required'});
    return;
  }

  if (typeof address != 'string') {
    res.status(400).json({ msg: 'address is poorly formatted'});
    return;
  }

  const hashedAddress = keccak256(address);
  const proof = merkleTree.getHexProof(hashedAddress);
  const root = merkleTree.getHexRoot();

  // just for front-end display convenience
  // proof will be validated in smart contract as well
  const valid = merkleTree.verify(proof, hashedAddress, root);

  res.status(200).json({
    proof,
    valid,
  });
}
