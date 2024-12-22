// src/App.tsx

import React, { useContext, useEffect, useState } from "react";
import "./App.css";
import { Layout } from "antd";
import NavBar from "./components/NavBar";
import MarketView from "./pages/MarketView";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MyNFTs from "./pages/MyNFTs";
import MintNFT from "./components/MintNFT";
import NFTContext, { NFTContextType } from "./context/NFTContext";
import Offer from "./components/Offer";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import DisplayOffer from "./pages/DisplayOffer";
import Auctions from "./pages/Auctions";

// TODOs

function App() {
  const [offer, setOffer] = useState(false);
  const { account } = useWallet();
  // Function to open the Mint NFT modal
  const { marketplaceAddr } = useContext(NFTContext) as NFTContextType;
  useEffect(() => {
    if (account) {
      if (account.address !== marketplaceAddr) {
        setOffer(false);
      } else {
        setOffer(true);
      }
    } else {
      return;
    }
  }, [account, marketplaceAddr]);
  return (
    <Router>
      <Layout>
        <NavBar offer={offer} />
        {/* Pass handleMintNFTClick to NavBar */}
        <Routes>
          <Route path="/" element={<MarketView offer={offer} />} />
          <Route path="/my-nfts" element={<MyNFTs />} />
          {offer && <Route path="/offers" element={<DisplayOffer />} />}
          <Route path="/auctions" element={<Auctions />} />
        </Routes>
        <MintNFT />
        <Offer offer={offer} />
      </Layout>
    </Router>
  );
}

export default App;
