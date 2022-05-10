import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import Link from "next/link";
import { FaDiscord, FaTwitter } from "react-icons/fa";
import styles from "../styles/Navbar.module.css";
import ConnectWallet from "./web3/ConnectWallet";
import { useRef } from "react";

const NavBar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <div className={styles.background}>
      <div className={styles.navbar}>
        <div className={styles.rightPartition}>
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
        <div className={styles.leftPartition}>
          <a
            href="https://github.com/CoinbaseWallet/nft-minting-starter-kit"
            target="_blank"
            rel="noreferrer"
          >
            <Box
              as="button"
              height="40px"
              lineHeight="1.2"
              transition="all 0.2s cubic-bezier(.08,.52,.52,1)"
              px="8px"
              fontFamily="'Press Start 2P', cursive"
              fontSize="14px"
              fontWeight="semibold"
              color="#FFFFFF"
              _hover={{ bg: "rgba(245, 246, 247, 0.2);", color: "#FFF" }}
              _active={{
                bg: "#dddfe2",
                transform: "scale(0.98)",
                borderColor: "#bec3c9",
              }}
            >
              Source code
            </Box>
          </a>
          <ConnectWallet size="md" />
          <IconButton
            aria-label="twitter icon"
            size="md"
            colorScheme="white"
            variant="ghost"
            icon={<FaTwitter />}
          />
          <IconButton
            aria-label="discord icon"
            size="md"
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
            <DrawerBody onClick={onClose}>
              <Stack marginTop="20" spacing="24px">
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
                <Spacer />
                <a
                  href="https://github.com/CoinbaseWallet/nft-minting-starter-kit"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Box
                    as="button"
                    height="40px"
                    lineHeight="1.2"
                    transition="all 0.2s cubic-bezier(.08,.52,.52,1)"
                    px="8px"
                    fontFamily="'Press Start 2P', cursive"
                    fontSize="14px"
                    fontWeight="semibold"
                    color="#FFFFFF"
                    _hover={{ bg: "rgba(245, 246, 247, 0.2);", color: "#FFF" }}
                    _active={{
                      bg: "#dddfe2",
                      transform: "scale(0.98)",
                      borderColor: "#bec3c9",
                    }}
                  >
                    Source code
                  </Box>
                </a>
                <ConnectWallet size="md" />
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
