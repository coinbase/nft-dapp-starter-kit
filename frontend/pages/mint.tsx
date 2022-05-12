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
  Spinner,
} from "@chakra-ui/react";
import Image from "next/image";
import web3 from "web3";

const PRICE = 0.06;
const Mint: NextPage = () => {
  const [payable, setPayable] = useState(BigInt(60000000000000000).toString());
  const [numPublicMint, setNumPublicMint] = useState(3);
  const handleChange = (value: number | string) =>
    setNumPublicMint(Number(value));

  const {
    data: publicSaleData,
    isError: publicSaleIsError,
    isLoading: publicSaleIsLoading,
    write: publicSaleWrite,
  } = useContractWrite(
    {
      addressOrName: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS
        ? process.env.NEXT_PUBLIC_CONTRACT_ADDRESS
        : "0x154058c11Ccc29376f5C1803eBeeD816eEbD3732",
      contractInterface: NonFungibleCoinbae.abi,
    },
    "mint",
    {
      overrides: {
        value: payable,
      },
      args: [numPublicMint],
      onError(error) {
        console.log("Error", error);
      },
      onSuccess(data) {
        console.log("Success", data);
      },
    }
  );

  const handlePublicMint = () => {
    const payableInEth = PRICE * numPublicMint;
    const payableinWei = web3.utils.toWei(payableInEth.toString(10), "ether");
    setPayable(payableinWei);
    publicSaleWrite();
  };

  return (
    <div className={styles.background}>
      <div className={styles.container}>
        <main className={styles.main}>
          <h1 className={styles.title}>
            Non-fungible Coinbaes
            <br />
            ⚡️ Minting Now ⚡️
          </h1>
          <VStack>
            <Image
              alt="placeholder image for team members"
              src={"/assets/cbw2.png"}
              width={250}
              height={250}
            />
            {/* select # of tokens to mint */}
            <NumberInput
              step={1}
              defaultValue={3}
              min={0}
              max={5}
              onChange={handleChange}
              inputMode="numeric"
              variant="filled"
            >
              <NumberInputField
                _focus={{ bg: "white.300" }}
                _active={{ bg: "white.300" }}
              />
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
              onClick={handlePublicMint}
            >
              Mint public sale
              {publicSaleIsLoading && <Spinner marginLeft={2} />}
            </Button>
          </VStack>
        </main>
      </div>
    </div>
  );
};

export default Mint;
