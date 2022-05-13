# NFT Minting Starter Kit Frontend

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started
1) Run `yarn install` inside the frontend directory
2) Create and fill out the `.env` file:
    ```bash
    NEXT_PUBLIC_CONTRACT_ADDRESS=0xCa4E3b3f98cCA9e801f88F13d1BfE68176a03dFA # modify with your own deployed contract address
    NEXT_PUBLIC_BLOCK_EXPLORER_URL=https://rinkeby.etherscan.io
    OPENSEA_API_KEY=[PUT YOUR OWN KEY HERE] # optional
    ```
3) Run the development server:

    ```bash
    yarn dev
    ```
4) Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the pages by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

## API Routes
[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on like so: [http://localhost:3000/api/giftlist?address={address}](http://localhost:3000/api/giftlist?address=0x0). The endpoints can be edited in the `pages/api` directory.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
