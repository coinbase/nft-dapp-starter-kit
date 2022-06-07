import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  IconButton,
  Spacer,
  Stack,
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
    <Image width="18px" height="18px" src="assets/opensea.png" />
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
            href="https://github.com/CoinbaseWallet/nft-dapp-starter-kit"
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
        <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent background="black">
            <DrawerCloseButton />
            <DrawerBody>
              <Stack marginTop="20" spacing="24px">
                <Link href="/" passHref>
                  <button className={styles.button} onClick={onClose}>
                    Home
                  </button>
                </Link>
                <Link href="/#about" passHref>
                  <button className={styles.button} onClick={onClose}>
                    About
                  </button>
                </Link>
                <Link href="/#team" passHref>
                  <button className={styles.button} onClick={onClose}>
                    Team
                  </button>
                </Link>
                <Link href="/#roadmap" passHref>
                  <button className={styles.button} onClick={onClose}>
                    Roadmap
                  </button>
                </Link>
                <Link href="/#faq" passHref>
                  <button className={styles.button} onClick={onClose}>
                    FAQ
                  </button>
                </Link>
                <Link href="/viewer" passHref>
                  <button className={styles.button} onClick={onClose}>
                    Explorer
                  </button>
                </Link>
                <ConnectWallet isMobile size="xs" />
                <Spacer />
                <a
                  href="https://github.com/CoinbaseWallet/nft-dapp-starter-kit"
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
                    size="xs"
                  >
                    Source code
                  </Button>
                </a>

                <IconButton
                  aria-label="twitter icon"
                  size="md"
                  colorScheme="whiteAlpha"
                  variant="ghost"
                  icon={<FaTwitter />}
                />
                <IconButton
                  aria-label="discord icon"
                  size="md"
                  colorScheme="whiteAlpha"
                  variant="ghost"
                  icon={<FaDiscord />}
                />
              </Stack>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
};

export default NavBar;
