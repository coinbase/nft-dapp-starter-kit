import styles from "@styles/Home.module.css";

const About = () => {
  return (
    <div id="about">
      <div className={styles.container}>
        <main className={styles.mainPadding}>
          <h1 className={styles.blueTitle}>About</h1>
          <div className={styles.content}>
            <p className={styles.description}>
              {`What are coinbaes? No one knows. But that doesn't matter, because this project is all about them!`}
              <br />
              <br />
              {`Non fungible Coinbaes is the perfect way to show your friends and family how much you love crypto. With this project, you can buy, sell, and trade virtual baes that represent nothing more than pixels on a screen. But that's not all! You can also use these tokens to buy virtual goods and services. So what are you waiting for? Mint a coinbae as an NFT.`}
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default About;
