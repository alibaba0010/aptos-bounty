import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { PetraWallet } from "petra-plugin-wallet-adapter";
const wallets = [new PetraWallet()];
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <StrictMode>
    {" "}
    <AptosWalletAdapterProvider plugins={wallets} autoConnect={true}>
      {" "}
      <App />{" "}
    </AptosWalletAdapterProvider>{" "}
  </StrictMode>
);
