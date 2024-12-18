import React, { useContext, useState } from "react";
import { Button, Modal, Input, Typography, Badge } from "antd";
import NFTContext, { NFTContextType } from "../context/NFTContext";
import { NFT } from "../context/NFTProvider";

const { Text } = Typography;

const Offer = () => {
  const {
    isOfferModalVisible,
    setIsOfferModalVisible,
    offerButton,
    selectedNft,
    offerLength,
  } = useContext(NFTContext) as NFTContextType;

  const [offerPrice, setOfferPrice] = useState<string>("");

  const handleModalClose = () => {
    setIsOfferModalVisible(false);
    setOfferPrice("");
  };

  const handleOfferSubmit = () => {
    // Implement the logic to submit the offer
    console.log(
      `Submitting offer of ${offerPrice} APT for NFT ${selectedNft?.id}`
    );
    // Add your offer submission logic here
    handleModalClose();
  };
  console.log("Modal closed: ", offerLength);
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
