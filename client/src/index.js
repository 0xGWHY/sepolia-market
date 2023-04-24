import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createClient, goerli, WagmiConfig } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";

import { publicProvider } from "wagmi/providers/public";
import { infuraProvider } from "wagmi/providers/infura";

// import { publicProvider } from "@wagmi/core/providers/public";

const { chains, provider } = configureChains(
  [sepolia],
  [
    infuraProvider("sepolia", {
      projectId: process.env.REACT_APP_INFURA_PROVIDER_ID,
      projectSecret: process.env.REACT_APP_INFURA_KEY,
    }),
    publicProvider({ priority: 1 }),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "Sepolia Market",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <App />
      </RainbowKitProvider>
    </WagmiConfig>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
