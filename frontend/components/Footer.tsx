import { IconButton } from '@chakra-ui/react'
import styles from "@styles/Footer.module.css";
import { FaTelegram, FaTwitter } from 'react-icons/fa';


const Footer = () => {
    return (
        <footer className={`${styles.footer} border-neutral-500`}>
            <div className={styles.socials}>
                {`Let's be frens `} 
                <IconButton aria-label='Search database' colorScheme='gray' variant="ghost" icon={<FaTwitter />} />
                <IconButton aria-label='Search database' colorScheme='gray' variant="ghost" icon={<FaTelegram />} />
            </div>
            &copy; {new Date().getFullYear()}
        </footer>
    )
}

export default Footer;