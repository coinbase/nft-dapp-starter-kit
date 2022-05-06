import styles from "@styles/Home.module.css";
import { Grid, GridItem } from '@chakra-ui/react'

const Team = () => {
    return (
        <div id="about">
            <main className={styles.mainPadding}>
                <h1 className={styles.title}>
                Team
                </h1>
                <Grid templateColumns='repeat(4, 1fr)' gap={6} marginTop={4}>
                    <GridItem w='100%' h='50'>
                        Code + Art
                    </GridItem>
                    <GridItem w='100%' h='50'>
                        Community + Code
                    </GridItem>
                        Art + Community
                    <GridItem w='100%' h='50'>
                        Code
                    </GridItem>                    
                </Grid>
            </main>
        </div>
    )
};

export default Team;