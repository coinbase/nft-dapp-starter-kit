// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import { generateMerkleProof } from '@utils/merkleProofs';

type Data = {
  msg?: string;
  proof?: string[];
  valid?: boolean;
}

const addresses = JSON.parse(fs.readFileSync('data/allowlists/presaleList.json', 'utf-8'))

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

  const { proof, valid } = generateMerkleProof(addresses, address)

  res.status(200).json({
    proof,
    valid,
  });
}
