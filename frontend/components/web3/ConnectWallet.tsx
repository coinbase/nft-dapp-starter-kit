import { useAccount, useNetwork, useDisconnect } from "wagmi";
import WalletModal from "@components/web3/WalletModal";
import {
  Button,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useDisclosure,
} from "@chakra-ui/react";
import { abridgeAddress } from "@utils/abridgeAddress";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useEffect } from "react";

type ConnectWalletProps = {
  size?: string;
};

const ConnectWallet = ({ size }: ConnectWalletProps) => {
  const { data } = useAccount();
  const { activeChain, switchNetwork } = useNetwork();
  const {
    isOpen: connectIsOpen,
    onOpen: connectOnOpen,
    onClose: connectOnClose,
  } = useDisclosure();

  const { disconnect } = useDisconnect();

  useEffect(() => {
    if (activeChain?.id !== 4 && switchNetwork) switchNetwork(4);
  }, [activeChain]);

  return (
    <>
      {!data ? (
        <Button
          style={{
            fontFamily: "'Press Start 2P', cursive",
            color: "#4b4f56",
            borderRadius: "0",
          }}
          onClick={connectOnOpen}
          size={size}
        >
          Connect Wallet
        </Button>
      ) : activeChain?.id === 4 ? (
        <Menu>
          {({ isOpen }) => (
            <>
              <MenuButton
                isActive={isOpen}
                as={Button}
                rightIcon={<ChevronDownIcon />}
                style={{
                  fontFamily: "'Press Start 2P', cursive",
                  color: "#4b4f56",
                  borderRadius: "0",
                }}
              >
                Account: {abridgeAddress(data?.address)}
              </MenuButton>
              <MenuList
                color="black"
                style={{
                  fontFamily: "'Press Start 2P', cursive",
                  color: "#4b4f56",
                  borderRadius: "0",
                  width: "100%",
                }}
              >
                <MenuItem>
                  <Link
                    href="/mycoinbaes"
                    style={{
                      textDecoration: "none",
                    }}
                  >
                    View My Coinbaes
                  </Link>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    disconnect();
                  }}
                >
                  Disconnect Wallet
                </MenuItem>
              </MenuList>
            </>
          )}
        </Menu>
      ) : (
        <Button
          style={{
            fontFamily: "'Press Start 2P', cursive",
            color: "#4b4f56",
            borderRadius: "0",
          }}
          onClick={() => switchNetwork && switchNetwork(4)}
        >
          Switch to Rinkeby
        </Button>
      )}
      <WalletModal isOpen={connectIsOpen} closeModal={connectOnClose} />
    </>
  );
};

export default ConnectWallet;
