import { NextPage } from "next";
import styles from "@styles/Viewer.module.css";
import { SimpleGrid, Image, Spinner, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";

const NFTViewer: NextPage = () => {
  const [tokens, setTokens] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(function fetchData() {
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
          `https://testnets-api.opensea.io/api/v1/assets?asset_contract_address=${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}&limit=100&include_orders=false`,
          requestOptions
        );
        const { assets } = await response.json();
        setTokens(assets);
        console.log("tokens: ", assets);
      } catch (err) {
        console.log(`Error fetching assets from Opensea: ${err}`);
        return new Error(`Error fetching assets from Opensea: ${err}`);
      }
      setIsLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div className={styles.background}>
      <div className={styles.container}>
        <main className={styles.main}>
          <h1 className={styles.title}>Coinbae Viewer</h1>
          <p style={{ color: "white", marginBottom: "2rem" }}>
            Explore all the Coinbaes!
          </p>
          {!isLoading ? (
            <SimpleGrid columns={[1, 3, 5]} spacing={10}>
              {tokens?.length > 0 &&
                tokens.map(({ name, image_url, external_link }) => (
                  <VStack spacing={2} key={name}>
                    <Image
                      rounded={"lg"}
                      height={230}
                      width={230}
                      objectFit={"cover"}
                      src={image_url ?? external_link}
                      fallbackSrc="assets/viewer/error.png"
                    />
                    <p style={{ color: "white" }}>{name}</p>
                  </VStack>
                ))}
            </SimpleGrid>
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
