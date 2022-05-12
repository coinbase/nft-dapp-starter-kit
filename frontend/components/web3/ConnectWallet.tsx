import { useAccount, useDisconnect } from "wagmi";
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

type ConnectWalletProps = {
  size?: string;
};

const ConnectWallet = ({ size }: ConnectWalletProps) => {
  const { data } = useAccount();
  const {
    isOpen: connectIsOpen,
    onOpen: connectOnOpen,
    onClose: connectOnClose,
  } = useDisclosure();

  const { disconnect } = useDisconnect();

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
      ) : (
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
                    href="/view"
                    style={{
                      textDecoration: "none",
                    }}
                  >
                    View NFTs
                  </Link>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    disconnect();
                  }}
                >
                  Disconnect
                </MenuItem>
              </MenuList>
            </>
          )}
        </Menu>
      )}
      <WalletModal isOpen={connectIsOpen} closeModal={connectOnClose} />
    </>
  );
};

export default ConnectWallet;
