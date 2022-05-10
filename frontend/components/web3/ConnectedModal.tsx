import {
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
} from "@chakra-ui/react";
import { useDisconnect } from "wagmi";
import { abridgeAddress } from "@utils/abridgeAddress";
import Link from "next/link";

type WalletModalProps = {
  address?: string;
  isOpen: boolean;
  closeModal: () => void;
};

export default function ConnectedModal({
  address,
  isOpen,
  closeModal,
}: WalletModalProps) {
  const { disconnect } = useDisconnect();

  return (
    <Modal isOpen={isOpen} onClose={closeModal} isCentered>
      <ModalOverlay />
      <ModalContent w="300px">
        <ModalHeader
          style={{
            fontFamily: "'Press Start 2P', cursive",
            textAlign: "center",
          }}
        >
          Connected
        </ModalHeader>
        <ModalCloseButton
          _focus={{
            boxShadow: "none",
          }}
        />
        <ModalBody paddingBottom="1.5rem">
          <VStack>
            <p>Account: {abridgeAddress(address)}</p>
            <Link href="/view">
              <Button
                variant="outline"
                w="100%"
                onClick={() => {
                  closeModal();
                }}
              >
                <Text>View NFTs</Text>
              </Button>
            </Link>
            <Button
              variant="outline"
              w="100%"
              onClick={() => {
                disconnect();
                closeModal();
              }}
            >
              <Text>Disconnect</Text>
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
