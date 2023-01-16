import { Profile } from '@components/landing/Profile';
import type { NextPage } from 'next';
import Head from 'next/head';

const Exclusive: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Exclusive Community Access</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Profile />
    </div>
  );
};

export default Exclusive;
