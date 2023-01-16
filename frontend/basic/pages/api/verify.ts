import { ironOptions } from 'global/ironOptions';
import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import { SiweMessage } from 'siwe';
import { ethers } from 'ethers';
import { abi } from 'global/erc721';

const baseUrl = process.env.NODE_ENDPOINT ?? '';
const username = process.env.NODE_USERNAME;
const password = process.env.NODE_PASSWORD;

const validateNFTOwnership = async (address: string) => {
  try {
    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ?? '';
    // Create node provider using project credentials
    const provider = new ethers.providers.JsonRpcProvider({
      url: baseUrl,
      user: username,
      password: password,
    });
    const contract = await new ethers.Contract(
      contractAddress,
      abi(),
      provider
    );
    const balance = await contract.balanceOf(address);
    if (balance.toString() !== '0') {
      console.debug(`Balance is ${balance}`);
      return true;
    }

    return false;
  } catch (error) {
    console.log(error);
    return null;
  }
};
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  switch (method) {
    case 'POST':
      try {
        const { message, signature } = req.body;
        const siweMessage = new SiweMessage(message);
        const fields = await siweMessage.validate(signature);
        const ownsNFT = await validateNFTOwnership(siweMessage.address);
        console.debug(`ownsNFT? :${ownsNFT}`);
        if (!ownsNFT)
          return res.status(422).json({ message: 'Does not own NFT' });

        if (fields.nonce !== req.session.nonce)
          return res.status(422).json({ message: 'Invalid nonce.' });

        req.session.siwe = fields;
        await req.session.save();
        res.json({ ok: true });
      } catch (_error) {
        res.json({ ok: false });
      }
      break;
    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};
export default withIronSessionApiRoute(handler, ironOptions);
