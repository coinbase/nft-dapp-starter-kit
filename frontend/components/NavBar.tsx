import { Box, Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, IconButton, Menu, MenuButton, MenuItem, MenuList, Stack, useDisclosure } from '@chakra-ui/react';
import { AddIcon, HamburgerIcon, ExternalLinkIcon } from '@chakra-ui/icons'
import Link from 'next/link'
import { FaDiscord, FaTwitter } from 'react-icons/fa';
import styles from '../styles/Navbar.module.css'
import ConnectWallet from './web3/ConnectWallet';
import { useRef } from 'react';

const NavBar = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()

  return (
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
        <a href="https://github.com/CoinbaseWallet/nft-minting-starter-kit" target="_blank" rel="noreferrer">
            <Button colorScheme="teal" variant='outline' size="md">
                <span className={styles.code}>
                    Source code
                </span>
            </Button>
        </a>
        <ConnectWallet size="md" />
        <IconButton aria-label='twitter icon' size="md" colorScheme='teal' variant="ghost" icon={<FaTwitter />} />
        <IconButton aria-label='discord icon' size="md" colorScheme='teal' variant="ghost" icon={<FaDiscord />} />
      </div>
      <div className={styles.mobilePartition}>
        <IconButton aria-label='hamburger menu icon' icon={<HamburgerIcon/>} colorScheme='teal' onClick={onOpen} />
      </div>
      <Drawer
        isOpen={isOpen}
        placement='right'
        onClose={onClose}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerBody onClick={onClose}>
            <Stack marginTop="20" spacing='24px'>
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
            </Stack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </div>
  )
}

export default NavBar;
