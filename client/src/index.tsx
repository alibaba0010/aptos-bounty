import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { PetraWallet } from "petra-plugin-wallet-adapter";
import NFTProvider from "./context/NFTProvider";
const wallets = [new PetraWallet()];
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <StrictMode>
    <NFTProvider>
      {" "}
      <AptosWalletAdapterProvider plugins={wallets} autoConnect={true}>
        {" "}
        <App />{" "}
      </AptosWalletAdapterProvider>{" "}
    </NFTProvider>
  </StrictMode>
);
