// src/App.tsx

import React, { useState } from "react";
import "./App.css";
import { Layout, Modal, Form, Input, Select, Button, message } from "antd";
import NavBar from "./components/NavBar";
import MarketView from "./pages/MarketView";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MyNFTs from "./pages/MyNFTs";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import MintNFT from "./components/MintNFT";
import NFTProvider from "./context/NFTProvider";

// const client = new AptosClient("https://fullnode.devnet.aptoslabs.com/v1");

// TODOs
// 1. configure marketplace address to be gotten from web
// functionality feature that allows users to make offers on NFTs listed in the marketplace, enabling sellers to accept or decline incoming offers for their assets.
// make an offer and place a bidon the nft
const marketplaceAddr =
  "0x65a3857a226af09f7f6fa4cf017f9a00718f64be692da9df4429a747faf3b78d";

function App() {
  const { account } = useWallet();
  console.log("Account", account?.address);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Function to open the Mint NFT modal
  const handleMintNFTClick = () => setIsModalVisible(true);

  return (
    <NFTProvider>
      <Router>
        <Layout>
          <NavBar onMintNFTClick={handleMintNFTClick} />{" "}
          {/* Pass handleMintNFTClick to NavBar */}
          <Routes>
            <Route
              path="/"
              element={
                <MarketView
                  marketplaceAddr={marketplaceAddr}
                  account={account?.address}
                />
              }
            />
            <Route path="/my-nfts" element={<MyNFTs />} />
          </Routes>
          <MintNFT
            marketplaceAddr={marketplaceAddr}
            isModalVisible={isModalVisible}
            setIsModalVisible={setIsModalVisible}
          />
        </Layout>
      </Router>
    </NFTProvider>
  );
}

export default App;
