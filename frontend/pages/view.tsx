import { NextPage } from "next";
import styles from "@styles/Viewer.module.css";
import { SimpleGrid, Image, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

const NFTViewer: NextPage = () => {
  const { data: accountData } = useAccount();
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
          `https://api.opensea.io/api/v1/assets?owner=${accountData?.address}&order_direction=desc&limit=20&include_orders=false`,
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
  }, []);

  return (
    <div className={styles.background}>
      <div className={styles.container}>
        <main className={styles.main}>
          <h1 className={styles.title}>Coinbae Viewer</h1>
          {!isLoading ? (
            <SimpleGrid columns={5} spacing={10}>
              {tokens.map(({ image_url }) => (
                <Image
                  rounded={"lg"}
                  height={230}
                  width={282}
                  objectFit={"cover"}
                  src={image_url}
                />
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
