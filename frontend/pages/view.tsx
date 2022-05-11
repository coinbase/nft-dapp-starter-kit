import { NextPage } from "next";
import styles from "@styles/Viewer.module.css";

const NFTViewer: NextPage = () => {
  return (
    <div className={styles.background}>
      <div className={styles.container}>
        <main className={styles.main}>
          <h1 className={styles.title}>Coinbae Viewer</h1>
        </main>
      </div>
    </div>
  );
};

export default NFTViewer;
