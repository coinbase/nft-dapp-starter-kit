import { Box } from "@chakra-ui/react";
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
            <Box
              as="button"
              height="35px"
              lineHeight="1.2"
              transition="all 0.2s cubic-bezier(.08,.52,.52,1)"
              border="1px"
              px="8px"
              borderRadius="0px"
              fontFamily="'Press Start 2P', cursive"
              fontSize="14px"
              fontWeight="semibold"
              bg="#f5f6f7"
              borderColor="#ccd0d5"
              color="#4b4f56"
              _hover={{ bg: "#ebedf0" }}
              _active={{
                bg: "#dddfe2",
                transform: "scale(0.98)",
                borderColor: "#bec3c9",
              }}
            >
              ⚡️ minting now ⚡️
            </Box>
          </Link>
          <div className={styles.coinbaes}>
            <Image src="/assets/btc2.png" height={300} width={300} />
            <Image src="/assets/eth2.png" height={300} width={300} />
            <Image src="/assets/cbw2.png" height={300} width={300} />
            <Image src="/assets/sol2.png" height={300} width={300} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default SplashBanner;
