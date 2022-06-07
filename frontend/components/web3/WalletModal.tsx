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
  Spinner,
  Box,
} from "@chakra-ui/react";
import { Image } from "@chakra-ui/react";
import { useEffect } from "react";
import { useConnect } from "wagmi";

type WalletModalProps = {
  isOpen: boolean;
  closeModal: () => void;
};

export default function WalletModal({ isOpen, closeModal }: WalletModalProps) {
  const { connect, connectors, isConnected, isConnecting, error } =
    useConnect();

  useEffect(() => {
    (isConnected || error) && closeModal();
  }, [isConnected, error]);

  return (
    <Modal isOpen={isOpen} onClose={closeModal} isCentered>
      <ModalOverlay />
      <ModalContent maxW="500px" minH="400px">
        <ModalHeader fontSize={25}>Select Wallet</ModalHeader>
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
                }}
                maxW="500px"
                minH="100px"
              >
                <HStack w="100%" justifyContent="center">
                  <Image
                    src={`assets/${connector.id}.png`}
                    alt="Coinbase Wallet Logo"
                    width={50}
                    height={50}
                    borderRadius="3px"
                  />
                  <Text paddingLeft={4} fontSize={30}>
                    {connector.name}
                  </Text>
                </HStack>
              </Button>
            ))}
          </VStack>
          <Box w="100%" display="flex" justifyContent="center" paddingTop="2">
            {isConnecting && <Spinner color="blue.500" />}
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
