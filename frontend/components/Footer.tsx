import styles from "@styles/Home.module.css";

const Footer = () => {
    return (
        <footer className={`${styles.footer} border-neutral-500`}>
            &copy; {new Date().getFullYear()}
        </footer>
    )
}

export default Footer;