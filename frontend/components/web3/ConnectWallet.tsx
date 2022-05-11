import { useAccount } from "wagmi";
import WalletModal from "@components/web3/WalletModal";
import { Button, useDisclosure } from "@chakra-ui/react";
import { abridgeAddress } from "@utils/abridgeAddress";
import ConnectedModal from "./ConnectedModal";

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
  const {
    isOpen: disconnectIsOpen,
    onOpen: disconnectOnOpen,
    onClose: disconnectOnClose,
  } = useDisclosure();

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
        <Button
          style={{
            fontFamily: "'Press Start 2P', cursive",
            color: "#4b4f56",
            borderRadius: "0",
          }}
          onClick={disconnectOnOpen}
          size={size}
        >
          Account: {abridgeAddress(data?.address)}
        </Button>
      )}
      <WalletModal isOpen={connectIsOpen} closeModal={connectOnClose} />
      <ConnectedModal
        address={data?.address}
        isOpen={disconnectIsOpen}
        closeModal={disconnectOnClose}
      />
    </>
  );
};

export default ConnectWallet;
