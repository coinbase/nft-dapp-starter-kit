import {
  VStack,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
} from "@chakra-ui/react";
import { Image } from "@chakra-ui/react";
import { useConnect } from "wagmi";

type WalletModalProps = {
  isOpen: boolean;
  closeModal: () => void;
};

export default function WalletModal({ isOpen, closeModal }: WalletModalProps) {
  const {
    activeConnector,
    connect,
    connectors,
    error,
    isConnecting,
    pendingConnector,
  } = useConnect();

  return (
    <Modal isOpen={isOpen} onClose={closeModal} isCentered>
      <ModalOverlay />
      <ModalContent w="300px">
        <ModalHeader>Select Wallet</ModalHeader>
        <ModalCloseButton
          _focus={{
            boxShadow: "none",
          }}
        />
        <ModalBody paddingBottom="1.5rem">
          <VStack>
            {connectors.map((connector) => (
              <Button
                variant="outline"
                w="100%"
                key={connector.id}
                onClick={() => {
                  connect(connector);
                  closeModal();
                }}
              >
                <HStack w="100%" justifyContent="center">
                  <Image
                    src={`${connector.id}.png`}
                    alt="Coinbase Wallet Logo"
                    width={25}
                    height={25}
                    borderRadius="3px"
                  />
                  <Text>{connector.name}</Text>
                  {isConnecting && pendingConnector?.id === connector.id && (
                    <Text>Connecting...</Text>
                  )}
                </HStack>
              </Button>
            ))}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
