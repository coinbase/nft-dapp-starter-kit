import { NextPage } from "next";
import styles from "@styles/Mint.module.css";
import { Button, VStack } from "@chakra-ui/react";
import { useContractWrite } from "wagmi";
import NonFungibleCoinbae from "@data/NonFungibleCoinbae.json";
import { useState } from "react";
import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import Image from "next/image";

const Mint: NextPage = () => {
  const [numPresaleMint, setNumPresaleMint] = useState(3);

  const {
    data: presaleMintData,
    isError: presaleMintIsError,
    isLoading: presaleMintIsLoading,
    write: presaleMintWrite,
  } = useContractWrite(
    {
      addressOrName: "0x154058c11Ccc29376f5C1803eBeeD816eEbD3732",
      contractInterface: NonFungibleCoinbae.abi,
    },
    "mint"
  );

  const handleMint = () => {
    return;
  };

  return (
    <div className={styles.background}>
      <div className={styles.container}>
        <main className={styles.main}>
          <h1 className={styles.title}>
            Non-fungible Coinbaes
            <br />
            ⚡️ Presale Minting Now ⚡️
          </h1>
          <VStack>
            <Image
              alt="placeholder image for team members"
              src={"/assets/cbw2.png"}
              width={250}
              height={250}
            />
            {/* select # of tokens to mint */}
            <NumberInput min={0} max={3}>
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <Button
              style={{
                fontFamily: "'Press Start 2P', cursive",
                color: "#4b4f56",
                borderRadius: "0",
              }}
            >
              Mint Presale
            </Button>
          </VStack>
        </main>
      </div>
    </div>
  );
};

export default Mint;
