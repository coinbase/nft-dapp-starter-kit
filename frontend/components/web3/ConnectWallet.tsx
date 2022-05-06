import { useAccount } from "wagmi";
import WalletModal from "@components/web3/WalletModal";
import { Button, useDisclosure } from "@chakra-ui/react";

const ConnectWallet = () => {
    const { data } = useAccount();
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
         {!data ? (
          <Button colorScheme="blue" size="lg" onClick={onOpen}>
            Connect Wallet
          </Button>
        ) : (
          <div>Account: {data?.address}</div>
        )}
        <WalletModal isOpen={isOpen} closeModal={onClose} />
        </>
    )
};

export default ConnectWallet;