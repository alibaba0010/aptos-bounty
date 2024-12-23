import { Button, Modal, Input, Typography, message } from "antd";
import NFTContext, { NFTContextType } from "../context/NFTContext";
import { AptosClient } from "aptos";
import { useContext, useState } from "react";

const { Text } = Typography;
const client = new AptosClient("https://fullnode.testnet.aptoslabs.com/v1");
const Auction = () => {
  const [auctionPrice, setAuctionPrice] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const {
    isAuctionModalVisible,
    setIsAuctionModalVisible,
    selectedAuctionNft,
    marketplaceAddr,
  } = useContext(NFTContext) as NFTContextType;

  const handleModalClose = () => {
    setIsAuctionModalVisible(false);
    setAuctionPrice("");
    setErrorMessage("");
  };
  const handleBidSubmit = async () => {
    if (!selectedAuctionNft || !auctionPrice) return;
    try {
      const priceInOctas = parseFloat(auctionPrice) * 100000000;

      const entryFunctionPayload = {
        type: "entry_function_payload",
        function: `${marketplaceAddr}::NFTMarketplace::auction_bid_nft`,
        type_arguments: [],
        arguments: [
          marketplaceAddr,
          selectedAuctionNft.id.toString(),
          priceInOctas.toString(),
        ],
      };
      const response = await (window as any).aptos.signAndSubmitTransaction(
        entryFunctionPayload
      );
      await client.waitForTransaction(response.hash);
      message.success("Bid submitted successfully!");

      handleModalClose();
    } catch (error) {
      console.error("Error occured when submiting bid for the NFT:", error);
      message.error("Failed to submit bid for NFT.");
    }
  };
  return (
    <Modal
      title="Make A Bid"
      open={isAuctionModalVisible}
      onCancel={handleModalClose}
      footer={[
        <Button key="cancel" onClick={handleModalClose}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          disabled={!!errorMessage}
          onClick={handleBidSubmit}
        >
          Submit Offer
        </Button>,
      ]}
    >
      <Text strong>NFT Name: {selectedAuctionNft?.name}</Text>
      <br />
      <Text strong>Your Bid:</Text>
      <Input
        type="number"
        placeholder="Enter your offer in APT"
        value={auctionPrice}
        onChange={(e) => {
          const value = parseFloat(e.target.value);
          setAuctionPrice(e.target.value);
          if (selectedAuctionNft && value <= selectedAuctionNft.current_bid) {
            setErrorMessage("Your bid must be higher than the current bid.");
          } else {
            setErrorMessage("");
          }
        }}
        style={{ marginTop: 5 }}
      />
      {errorMessage && (
        <Text type="danger" style={{ display: "block", marginTop: 5 }}>
          {errorMessage}
        </Text>
      )}
    </Modal>
  );
};

export default Auction;
