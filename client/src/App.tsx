// src/App.tsx

import React, { useContext, useState } from "react";
import "./App.css";
import { Layout, Modal, Form, Input, Select, Button, message } from "antd";
import NavBar from "./components/NavBar";
import MarketView from "./pages/MarketView";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MyNFTs from "./pages/MyNFTs";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import MintNFT from "./components/MintNFT";
import NFTProvider from "./context/NFTProvider";
import NFTContext from "./context/NFTContext";

// const client = new AptosClient("https://fullnode.devnet.aptoslabs.com/v1");

// TODOs
// 1. configure marketplace address to be gotten from web
// functionality feature that allows users to make offers on NFTs listed in the marketplace, enabling sellers to accept or decline incoming offers for their assets.
// make an offer and place a bidon the nft

function App() {
  const [mintNFT, setMintNFT] = useState(false);
  const { setIsModalVisible } = useContext(NFTContext) ?? {
    account: null,
  };
  // Function to open the Mint NFT modal
  const handleMintNFTClick = () => {
    console.log("Hello world");
    setIsModalVisible!(true);
    setMintNFT(true);
  };

  return (
    <NFTProvider>
      <Router>
        <Layout>
          <NavBar onMintNFTClick={handleMintNFTClick} />
          {/* Pass handleMintNFTClick to NavBar */}
          <Routes>
            <Route path="/" element={<MarketView />} />
            <Route path="/my-nfts" element={<MyNFTs />} />
          </Routes>
          <MintNFT mintNFT={mintNFT} />
        </Layout>
      </Router>
    </NFTProvider>
  );
}

export default App;
