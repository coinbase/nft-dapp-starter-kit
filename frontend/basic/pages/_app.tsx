import "../styles/globals.css";
import type { AppProps } from "next/app";
import { extendTheme } from "@chakra-ui/react";
import { ChakraProvider } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";
import { Provider as WagmiProvider } from "wagmi";
import { WagmiClient } from "@utils/wagmiClient";
import NavBar from "@components/NavBar";
import Footer from "@components/Footer";
import { useEffect, useState } from "react";

function MyApp({ Component, pageProps }: AppProps) {
  const [mounted, setMounted] = useState(false);

  // prevent hydration UI bug: https://blog.saeloun.com/2021/12/16/hydration.html
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  // customize your chakra theme here
  const theme = extendTheme({
    styles: {
      global: (props: any) => ({
        body: {
          fontFamily: "Inter",
          color: mode("gray.800", "whiteAlpha.900")(props),
          bg: mode("white", "gray.800")(props),
          lineHeight: "base",
        },
      }),
    },
    colors: {
      brand: {
        100: "#f7fafc",
        900: "#1a202c",
      },
    },
  });

  return (
    <ChakraProvider theme={theme}>
      <WagmiProvider client={WagmiClient}>
        <NavBar />
        <Component {...pageProps} />
        <Footer />
      </WagmiProvider>
    </ChakraProvider>
  );
}

export default MyApp;
