import { Button } from "@chakra-ui/react";
import styles from "@styles/Home.module.css";
import Image from "next/image";
import Link from "next/link";

const SplashBanner = () => {
  return (
    <div id="splash">
      <div className={styles.background}>
        <main className={styles.main}>
          <h1 className={styles.splashTitle}>Non-fungible Coinbaes</h1>
          <Link href="/mint">
            <Button
              style={{
                fontFamily: "'Press Start 2P', cursive",
                color: "#4b4f56",
                borderRadius: "0",
              }}
            >
              ⚡️ minting now ⚡️
            </Button>
          </Link>
          <div className={styles.coinbaes}>
            <Image src="/assets/btc.png" height={300} width={300} />
            <Image src="/assets/eth.png" height={300} width={300} />
            <Image src="/assets/cbw.png" height={300} width={300} />
            <Image src="/assets/sol.png" height={300} width={300} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default SplashBanner;
