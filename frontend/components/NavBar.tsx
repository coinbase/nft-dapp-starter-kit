import { Button } from '@chakra-ui/react';
import Link from 'next/link'
import styles from '../styles/Navbar.module.css'
import ConnectWallet from './web3/ConnectWallet';

const NavBar = () => {
  return (
    <div className={styles.navbar}>
      <div className={styles.partition}>
        <Link href="/" passHref>
          <button className={styles.button}>Home</button>
        </Link>
        <Link href="/#about" passHref>
          <button className={styles.button}>About</button>
        </Link>
        <Link href="/#team" passHref>
          <button className={styles.button}>Team</button>
        </Link>
        <Link href="/#roadmap" passHref>
          <button className={styles.button}>Roadmap</button>
        </Link>
        <Link href="/#faq" passHref>
          <button className={styles.button}>FAQ</button>
        </Link>
       
      </div>
      <div className={styles.partition}>
          
        <a href="https://github.com/CoinbaseWallet/nft-minting-starter-kit" target="_blank" rel="noreferrer">
            <Button colorScheme="blue" variant='outline' size="lg">
                <span className={styles.code}>
                    Source code
                </span>
            </Button>
        </a>
        <ConnectWallet />
      </div>
    </div>
  )
}

export default NavBar;
