import type { NextPage } from "next";
import Head from "next/head";
import SplashBanner from "@components/landing/Splash";

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>NFT Minting Starter Kit</title>
        <meta
          name="description"
          content="Starter kit for developers who want to build an NFT minting site"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SplashBanner />
    </div>
  );
};

export default Home;
