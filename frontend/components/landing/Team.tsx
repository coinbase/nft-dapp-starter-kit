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
                src={"/assets/square-coinbae.png"}
                width={250}
                height={250}
              />
              <p className={styles.center}>
                <strong>Coinbae 1</strong>
                <br />
                Code + Art
              </p>
            </Box>
            <Box>
              <Image
                alt="placeholder image for team members"
                src={"/assets/square-coinbae.png"}
                width={250}
                height={250}
              />
              <p className={styles.center}>
                <strong>Coinbae 2</strong>
                <br />
                Community + Code
              </p>
            </Box>
            <Box>
              <Image
                alt="placeholder image for team members"
                src={"/assets/square-coinbae.png"}
                width={250}
                height={250}
              />
              <p className={styles.center}>
                <strong>Coinbae 3</strong>
                <br />
                Art + Commmunity
              </p>
            </Box>
            <Box>
              <Image
                alt="placeholder image for team members"
                src={"/assets/square-coinbae.png"}
                width={250}
                height={250}
              />
              <p className={styles.center}>
                <strong>Coinbae 4</strong>
                <br />
                Code
              </p>
            </Box>
          </SimpleGrid>
        </main>
      </div>
    </div>
  );
};

export default Team;
