import styles from "@styles/Home.module.css";

const About = () => {
    return (
        <div id="about">
            <main className={styles.mainPadding}>
                <h1 className={styles.title}>
                About
                </h1>
                <div className={styles.content}>
                    <p className={styles.description}>
                    {`This is the dumbest NFT project EVER. It's all about non-fungible coinbaes. What are coinbaes? No one knows. But that doesn't matter, because this project is all about them!`}
                    <br /><br />
                    {`This project is so dumb, it makes us want to cry. But we'll keep smiling and hodling onto our coinbaes, because that's what this project is all about!`}
                    <br /><br />
                    {`Non fungible Coinbaes is the perfect way to show your friends and family how much you love spending money on digital assets that have no real value. With this project, you can buy, sell, and trade virtual baes that represent nothing more than pixels on a screen. But that's not all! You can also use these tokens to buy virtual goods and services, or even gamble with them in online casinos. So what are you waiting for? Mint a coinbae as an NFT. we can’t really promise any utility tho.`}
                    </p>
                </div>
            </main>
        </div>
    )
};

export default About;