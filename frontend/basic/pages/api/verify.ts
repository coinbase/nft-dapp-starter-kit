import { checkNFTOwnership } from 'global/checkNFTOwnership';
import { ironOptions } from 'global/ironOptions';
import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import { SiweMessage } from 'siwe';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  switch (method) {
    case 'POST':
      try {
        const { message, signature } = req.body;
        const siweMessage = new SiweMessage(message);
        const fields = await siweMessage.validate(signature);
        const ownsNFT = await checkNFTOwnership(siweMessage.address);
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
