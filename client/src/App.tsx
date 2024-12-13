// src/App.tsx

import React, { useState } from "react";
import "./App.css";
import { Layout, Modal, Form, Input, Select, Button, message } from "antd";
import NavBar from "./components/NavBar";
import MarketView from "./pages/MarketView";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MyNFTs from "./pages/MyNFTs";
import { AptosClient } from "aptos";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

const client = new AptosClient("https://fullnode.testnet.aptoslabs.com/v1");
// const client = new AptosClient("https://fullnode.devnet.aptoslabs.com/v1");

// const marketplaceAddr =
//   "0xb4037b16f9c0ea23f4df411e84a49278165c40dd9940ee41b41acb22caae8725";
// TODOs
// 1. configure marketplace address to be gotten from web
// functionality feature that allows users to make offers on NFTs listed in the marketplace, enabling sellers to accept or decline incoming offers for their assets.
// make an offer and place a bidon the nft
const marketplaceAddr =
  "0x65a3857a226af09f7f6fa4cf017f9a00718f64be692da9df4429a747faf3b78d";

function App() {
  const { signAndSubmitTransaction } = useWallet();
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Function to open the Mint NFT modal
  const handleMintNFTClick = () => setIsModalVisible(true);

  const handleMintNFT = async (values: {
    name: string;
    description: string;
    uri: string;
    rarity: number;
  }) => {
    try {
      const nameVector = Array.from(new TextEncoder().encode(values.name));
      console.log("Name vector ", nameVector);
      const descriptionVector = Array.from(
        new TextEncoder().encode(values.description)
      );
      const uriVector = Array.from(new TextEncoder().encode(values.uri));

      const entryFunctionPayload = {
        type: "entry_function_payload",
        function: `${marketplaceAddr}::NFTMarketplace::mint_Nft`,
        type_arguments: [],
        arguments: [
          marketplaceAddr,
          nameVector,
          descriptionVector,
          uriVector,
          values.rarity,
        ],
      };
      console.log(entryFunctionPayload.arguments[0]);
      const txnResponse = await (window as any).aptos.signAndSubmitTransaction({
        entryFunctionPayload,
      });
      console.log("Transaction response ", txnResponse);
      await client.waitForTransaction(txnResponse.hash);

      message.success("NFT minted successfully!");
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error minting NFT:", error);
      message.error("Failed to mint NFT.");
    }
  };

  return (
    <Router>
      <Layout>
        <NavBar onMintNFTClick={handleMintNFTClick} />{" "}
        {/* Pass handleMintNFTClick to NavBar */}
        <Routes>
          <Route
            path="/"
            element={<MarketView marketplaceAddr={marketplaceAddr} />}
          />
          <Route path="/my-nfts" element={<MyNFTs />} />
        </Routes>
        <Modal
          title="Mint New NFT"
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
        >
          <Form layout="vertical" onFinish={handleMintNFT}>
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: "Please enter a name!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Description"
              name="description"
              rules={[
                { required: true, message: "Please enter a description!" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="URI"
              name="uri"
              rules={[{ required: true, message: "Please enter a URI!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Rarity"
              name="rarity"
              rules={[{ required: true, message: "Please select a rarity!" }]}
            >
              <Select>
                <Select.Option value={1}>Common</Select.Option>
                <Select.Option value={2}>Uncommon</Select.Option>
                <Select.Option value={3}>Rare</Select.Option>
                <Select.Option value={4}>Epic</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Mint NFT
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </Layout>
    </Router>
  );
}

export default App;
