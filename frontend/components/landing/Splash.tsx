import { Button } from "@chakra-ui/react";
import styles from "@styles/Home.module.css";

const SplashBanner = () => {
    return (
        <div id="banner">
            <main className={styles.main}>
                <h1 className={styles.title}>
                Non-fungible Coinbaes
                </h1>
                <p className={styles.description}>NFT Minting Starter Kit</p>
                <Button colorScheme='teal' variant='solid'>
                    ⚡️ minting now ⚡️ ️
                </Button>
            </main>
        </div>
    )
};

export default SplashBanner;