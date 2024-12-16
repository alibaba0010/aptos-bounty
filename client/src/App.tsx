// src/App.tsx

import React, { useContext, useState } from "react";
import "./App.css";
import { Layout, Modal, Form, Input, Select, Button, message } from "antd";
import NavBar from "./components/NavBar";
import MarketView from "./pages/MarketView";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MyNFTs from "./pages/MyNFTs";
import MintNFT from "./components/MintNFT";
import NFTProvider from "./context/NFTProvider";

// const client = new AptosClient("https://fullnode.devnet.aptoslabs.com/v1");

// TODOs
// 1. configure marketplace address to be gotten from web
// functionality feature that allows users to make offers on NFTs listed in the marketplace, enabling sellers to accept or decline incoming offers for their assets.
// make an offer and place a bidon the nft

function App() {
  // Function to open the Mint NFT modal

  return (
    <NFTProvider>
      <Router>
        <Layout>
          <NavBar />
          {/* Pass handleMintNFTClick to NavBar */}
          <Routes>
            <Route path="/" element={<MarketView />} />
            <Route path="/my-nfts" element={<MyNFTs />} />
          </Routes>
          <MintNFT />
        </Layout>
      </Router>
    </NFTProvider>
  );
}

export default App;
