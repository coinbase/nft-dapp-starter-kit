import Link from 'next/link'
import styles from '../styles/Navbar.module.css'
import ConnectWallet from './web3/ConnectWallet';

const NavBar = () => {
  return (
    <div className={styles.navbar}>
      <div className={styles.partition}>
        <Link href="/#about" passHref>
          <button className={styles.button}>About</button>
        </Link>
        <Link href="/#docs" passHref>
          <button className={styles.button}>Team</button>
        </Link>
        <Link href="/#docs" passHref>
          <button className={styles.button}>Roadmap</button>
        </Link>
        <Link href="/#docs" passHref>
          <button className={styles.button}>FAQ</button>
        </Link>
      </div>
      <div>
        <ConnectWallet />
      </div>
    </div>
  )
}

export default NavBar;
