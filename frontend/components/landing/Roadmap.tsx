import styles from "@styles/Roadmap.module.css";

const Roadmap = () => {
  return (
    <div id="roadmap">
      <div className={styles.background}>
        <div className={styles.container}>
          <main className={styles.main}>
            <h1 className={styles.title}>Roadmap</h1>
            <div className={styles.timeline}>
              <div className={styles.containerRight}>
                <div className={styles.content}>
                  <p>Yay mint some Coinbaes</p>
                </div>
              </div>
              <div className={styles.containerLeft}>
                <div className={styles.content}>
                  <p>Coinbaes sell out!</p>
                </div>
              </div>
              <div className={styles.containerRight}>
                <div className={styles.content}>
                  <p>Membership only access to free websites</p>
                </div>
              </div>
              <div className={styles.containerLeft}>
                <div className={styles.content}>
                  <p>Exclusive access to public spaces</p>
                </div>
              </div>
              <div className={styles.containerRight}>
                <div className={styles.content}>
                  <p>Express pass to wait in the longest lines</p>
                </div>
              </div>
              <div className={styles.containerLeft}>
                <div className={styles.content}>
                  <p>
                    Wristband that guarantees you to be kicked out of every
                    crypto event
                  </p>
                </div>
              </div>
              <div className={styles.containerRight}>
                <div className={styles.content}>
                  <p>Community Fund to fund more Coinbae projects</p>
                </div>
              </div>
              <div className={styles.containerLeft}>
                <div className={styles.content}>
                  <p>Non fungible Mutants Launch on L3 protocols</p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Roadmap;
