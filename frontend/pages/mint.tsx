import { NextPage } from "next";
import styles from "@styles/Mint.module.css";

const Mint: NextPage = () => {
  return (
    <div className={styles.background}>
      <div className={styles.container}>
        <main className={styles.main}>
          <h1 className={styles.title}>
            Non-fungible Coinbaes
            <br /> ⚡️ Minting Now ⚡️
          </h1>
        </main>
      </div>
    </div>
  );
};

export default Mint;
