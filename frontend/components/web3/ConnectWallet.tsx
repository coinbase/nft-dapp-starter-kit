import { useAccount } from "wagmi";
import WalletModal from "@components/web3/WalletModal";
import { Box, Button, useDisclosure } from "@chakra-ui/react";

type ConnectWalletProps = {
    size?: string;
}
const ConnectWallet = ({size} : ConnectWalletProps) => {
    const { data } = useAccount();
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
         {!data ? (
          <Box
            as='button'
            height='40px'
            lineHeight='1.2'
            transition='all 0.2s cubic-bezier(.08,.52,.52,1)'
            px='8px'
            borderRadius='0px'
            fontFamily="'Press Start 2P', cursive"
            fontSize='14px'
            fontWeight='semibold'
            bg='#f5f6f7'
            borderColor='#ccd0d5'
            color='#4b4f56'
            _hover={{ bg: '#DCDCDC' }}
            _active={{
                bg: '#dddfe2',
                transform: 'scale(0.98)',
                borderColor: '#bec3c9',
            }}
            onClick={onOpen}
            >
              Connect Wallet
          </Box>
        ) : (
          <div>Account: {data?.address}</div>
        )}
        <WalletModal isOpen={isOpen} closeModal={onClose} />
        </>
    )
};

export default ConnectWallet;