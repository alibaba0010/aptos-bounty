import React, { useContext, useState } from "react";
import { Button, Modal, Input, Typography, Badge, message } from "antd";
import NFTContext, { NFTContextType } from "../context/NFTContext";
import { NFT } from "../context/NFTProvider";
import { AptosClient } from "aptos";

const { Text } = Typography;
const client = new AptosClient("https://fullnode.testnet.aptoslabs.com/v1");
// const client = new AptosClient("https://fullnode.devnet.aptoslabs.com/v1");

const Offer = () => {
  const {
    isOfferModalVisible,
    setIsOfferModalVisible,
    offerButton,
    selectedNft,
    offerLength,
    marketplaceAddr,
    account,
  } = useContext(NFTContext) as NFTContextType;

  const [offerPrice, setOfferPrice] = useState<string>("");

  const handleModalClose = () => {
    setIsOfferModalVisible(false);
    setOfferPrice("");
  };

  const handleOfferSubmit = async () => {
    if (!selectedNft || !offerPrice) return;
    console.log("Offer Price: ", offerPrice);
    console.log("Offer Selected: ", selectedNft.price);

    // Implement the logic to submit the offer
    try {
      const priceInOctas = parseFloat(offerPrice) * 100000000;

      const entryFunctionPayload = {
        type: "entry_function_payload",
        function: `${marketplaceAddr}::NFTMarketplace::make_offer`,
        type_arguments: [],
        arguments: [
          marketplaceAddr,
          selectedNft.id.toString(),
          priceInOctas.toString(),
        ],
      };
      const response = await (window as any).aptos.signAndSubmitTransaction(
        entryFunctionPayload
      );
      await client.waitForTransaction(response.hash);
      message.success("Offer for NFT submitted successfully!");

      handleModalClose();
    } catch (error) {
      console.error("Error occured when making an offer for NFT:", error);
      message.error("Failed to make an offer for NFT.");
    }
  };

  return (
    <>
      {!offerButton && (
        <div className="flex items-center justify-between px-4 py-2 text-sm cursor-pointer hover:bg-gray-700 transition-colors duration-200">
          <span className="text-white">Offers</span>
          {offerLength >= 0 && (
            <Badge className="ml-2 bg-blue-500 text-white">{offerLength}</Badge>
          )}
        </div>
      )}
      {isOfferModalVisible && (
        <Modal
          title="Make An Offer"
          open={isOfferModalVisible}
          onCancel={handleModalClose}
          footer={[
            <Button key="cancel" onClick={handleModalClose}>
              Cancel
            </Button>,
            <Button key="submit" type="primary" onClick={handleOfferSubmit}>
              Submit Offer
            </Button>,
          ]}
        >
          <Text strong>NFT Name: {selectedNft?.name}</Text>
          <br />
          <Text strong>Current Price: {selectedNft?.price} APT</Text>
          <br />
          <Text strong>Your Offer:</Text>
          <Input
            type="number"
            placeholder="Enter your offer in APT"
            value={offerPrice}
            onChange={(e) => setOfferPrice(e.target.value)}
            style={{ marginTop: 5 }}
          />
        </Modal>
      )}
    </>
  );
};

export default Offer;
