import {
  Button,
  IconButton,
  useDisclosure,
  Image,
  Box,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import Link from "next/link";
import { FaDiscord, FaTwitter } from "react-icons/fa";
import styles from "../styles/Navbar.module.css";
import ConnectWallet from "./web3/ConnectWallet";

const FaOpensea = () => (
  <Box
    width="48px"
    height="48px"
    display="flex"
    justifyContent="center"
    alignItems="center"
  >
    <Image width="18px" height="18px" src="assets/navbar/opensea.png" />
  </Box>
);

const NavBar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <div className={styles.background}>
      <div className={styles.navbar}>
        <div className={styles.leftPartition}>
          <Link href="/" passHref>
            <button className={styles.button}>Home</button>
          </Link>
          <Link href="/#about" passHref>
            <button className={styles.button}>About</button>
          </Link>
          <Link href="/#roadmap" passHref>
            <button className={styles.button}>Roadmap</button>
          </Link>
          <Link href="/#team" passHref>
            <button className={styles.button}>Team</button>
          </Link>
          <Link href="/#faq" passHref>
            <button className={styles.button}>FAQ</button>
          </Link>
          <Link href="/viewer" passHref>
            <button className={styles.button}>Explore Collection</button>
          </Link>
        </div>
        <div className={styles.rightPartition}>
          <a
            href="https://github.com/CoinbaseWallet/nft-minting-starter-kit"
            target="_blank"
            rel="noreferrer"
          >
            <Button
              style={{
                fontFamily: "'Press Start 2P', cursive",
                color: "#FFFFFF",
                borderRadius: "0",
              }}
              colorScheme="whiteAlpha"
              variant="ghost"
              size="md"
            >
              Source code
            </Button>
          </a>
          <ConnectWallet size="md" />
          <FaOpensea />
          <IconButton
            aria-label="twitter icon"
            size="lg"
            colorScheme="white"
            variant="ghost"
            icon={<FaTwitter />}
          />
          <IconButton
            aria-label="discord icon"
            size="lg"
            colorScheme="white"
            variant="ghost"
            icon={<FaDiscord />}
          />
        </div>
        <div className={styles.mobilePartition}>
          <IconButton
            aria-label="hamburger menu icon"
            icon={<HamburgerIcon />}
            colorScheme="white"
            onClick={onOpen}
          />
        </div>
      </div>
    </div>
  );
};

export default NavBar;
