import { NextPage } from "next";
import styles from "@styles/Viewer.module.css";
import {
  SimpleGrid,
  Image,
  Spinner,
  VStack,
  Button,
  HStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import Link from "next/link";

const NFTViewer: NextPage = () => {
  const { data: accountData } = useAccount();
  const [tokens, setTokens] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(
    function fetchData() {
      const requestHeaders: HeadersInit = {
        Accept: "application/json",
        "X-API-KEY": process.env.OPENSEA_API_KEY ?? "",
      };

      const requestOptions: RequestInit = {
        method: "GET",
        headers: requestHeaders,
      };

      const fetchData = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(
            `https://testnets-api.opensea.io/api/v1/assets?owner=${accountData?.address}&asset_contract_address=${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}&limit=100&include_orders=false`,
            requestOptions
          );
          const { assets } = await response.json();
          setTokens(assets);
        } catch (err) {
          console.log(`Error fetching assets from Opensea: ${err}`);
          return new Error(`Error fetching assets from Opensea: ${err}`);
        }
        setIsLoading(false);
      };

      fetchData();
    },
    [accountData?.address]
  );

  return (
    <div className={styles.background}>
      <div className={styles.container}>
        <main className={styles.mainCenter}>
          <h1 className={styles.title}>My Collection</h1>
          {!isLoading ? (
            <>
              {tokens?.length > 0 && (
                <SimpleGrid columns={[1, 3, 5]} spacing={10}>
                  {tokens.map(({ name, image_url, external_link }, idx) => (
                    <VStack spacing={2} key={idx}>
                      <Image
                        rounded={"lg"}
                        height={230}
                        width={230}
                        objectFit={"cover"}
                        src={image_url ?? external_link}
                        fallbackSrc="assets/error.png"
                      />
                      <p style={{ color: "white" }}>{name}</p>
                    </VStack>
                  ))}
                </SimpleGrid>
              )}
              {(!tokens || tokens.length <= 0) && (
                <>
                  <p style={{ color: "white", marginBottom: "2rem" }}>
                    You don't own any NFTs yet. Wanna mint one?
                  </p>
                  <HStack>
                    <Link href="/">
                      <Button
                        style={{
                          fontFamily: "'Press Start 2P', cursive",
                          color: "#4b4f56",
                          borderRadius: "0",
                        }}
                      >
                        Go to Mint
                      </Button>
                    </Link>
                  </HStack>
                </>
              )}
            </>
          ) : (
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="blue.500"
              size="xl"
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default NFTViewer;
