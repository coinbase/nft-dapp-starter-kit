import styles from "@styles/Home.module.css";
import { Box, SimpleGrid } from "@chakra-ui/react";
import Image from "next/image";

const Team = () => {
  return (
    <div id="team">
      <div className={styles.container}>
        <main className={styles.mainPadding}>
          <h1 className={styles.title}>Team</h1>
          <SimpleGrid columns={[1, 2, 4]} spacing="40px">
            <Box
              alignContent={"center"}
              alignItems="center"
              justifyContent="center"
            >
              <Image
                alt="placeholder image for team members"
                src={"/assets/btc2.png"}
                width={250}
                height={250}
              />
              <p className={styles.center}>
                <strong>Bit Maxi</strong>
                <br />
                Community, Marketing
              </p>
            </Box>
            <Box>
              <Image
                alt="placeholder image for team members"
                src={"/assets/eth2.png"}
                width={250}
                height={250}
              />
              <p className={styles.center}>
                <strong>Eth XOXO</strong>
                <br />
                Solidty, Art
              </p>
            </Box>
            <Box>
              <Image
                alt="placeholder image for team members"
                src={"/assets/cbw2.png"}
                width={250}
                height={250}
              />
              <p className={styles.center}>
                <strong>Coinbae Wallet</strong>
                <br />
                Code, Commmunity
              </p>
            </Box>
            <Box>
              <Image
                alt="placeholder image for team members"
                src={"/assets/sol2.png"}
                width={250}
                height={250}
              />
              <p className={styles.center}>
                <strong>Rusty Sol</strong>
                <br />
                Smart contracts, Security
              </p>
            </Box>
          </SimpleGrid>
        </main>
      </div>
    </div>
  );
};

export default Team;
