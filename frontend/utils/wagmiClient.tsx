import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { alchemyRpcUrls, createClient } from "wagmi";

const clientOptions = {
  autoConnect: true,
  connectors: [
    new CoinbaseWalletConnector({
      options: {
        appName: "NFT Minting Starter Kit",
        jsonRpcUrl: alchemyRpcUrls.rinkeby,
      },
    }),
    new MetaMaskConnector(),
    new WalletConnectConnector({
      options: {
        qrcode: true,
      },
    }),
  ],
};

export const WagmiClient = createClient(clientOptions);
