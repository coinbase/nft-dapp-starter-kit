import type { NextPage } from "next";
import Head from "next/head";
import SplashBanner from "@components/landing/Splash";
import About from "@components/landing/About";
import Roadmap from "@components/landing/Roadmap";
import Team from "@components/landing/Team";
import FAQ from "@components/landing/FAQ";

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
      <About />
      <Roadmap />
      <Team />
      <FAQ />
    </div>
  );
};

export default Home;
