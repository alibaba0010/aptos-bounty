import React, { FC, useContext, useEffect } from "react";
import { NFT } from "../context/NFTProvider";
import { FaCheck, FaTimes } from "react-icons/fa";
import { rarityColors, rarityLabels } from "../pages/MarketView";
import { Card, Row, Col, Tag, Button, message } from "antd";
import NFTContext, { NFTContextType } from "../context/NFTContext";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { AptosClient } from "aptos";
const { Meta } = Card;
interface AuctionsCardProps {
  nft: NFT;
  nftOwner: boolean;
}
const client = new AptosClient("https://fullnode.testnet.aptoslabs.com/v1");

const AuctionsCard: FC<AuctionsCardProps> = ({ nft, nftOwner }) => {
  const { account } = useWallet();
  const {
    marketplaceAddr,
    setIsAuctionModalVisible,
    setSelectedAuctionNft,
    setIsRunning,
    isRunning,
    timeLeft,
  } = useContext(NFTContext) as NFTContextType;
  const makeABidHandler = (nft: NFT) => {
    if (!account) return;
    setIsAuctionModalVisible(true);
    setSelectedAuctionNft(nft);
  };

  const finalizeBidHandler = async (nft: NFT) => {
    setIsRunning(false);
    if (!account) return;
    try {
      const entryFunctionPayload = {
        type: "entry_function_payload",
        function: `${marketplaceAddr}::NFTMarketplace::finalize_bid`,
        type_arguments: [],
        arguments: [nft.id.toString()],
      };
      const response = await (window as any).aptos.signAndSubmitTransaction(
        entryFunctionPayload
      );
      await client.waitForTransaction(response.hash);
      message.success("Bid finalized successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Error occured when finalizing bid:", error);
      message.error("Failed to finalize bid.");
    }
  };
  const handleAcceptBidOffer = async (nft: NFT) => {
    if (!account) return;
    try {
      const entryFunctionPayload = {
        type: "entry_function_payload",
        function: `${marketplaceAddr}::NFTMarketplace::accept_auction_offer`,
        type_arguments: [],
        arguments: [nft.id.toString()],
      };
      const response = await (window as any).aptos.signAndSubmitTransaction(
        entryFunctionPayload
      );
      await client.waitForTransaction(response.hash);
      message.success("Bid accepted successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Error occured when accepting bid:", error);
      message.error("Failed to accept bid.");
    }
  };

  const handleRejectBidOffer = async (nft: NFT) => {
    try {
      const entryFunctionPayload = {
        type: "entry_function_payload",
        function: `${marketplaceAddr}::NFTMarketplace::reject_auction_offer`,
        type_arguments: [],
        arguments: [nft.id.toString()],
      };
      const response = await (window as any).aptos.signAndSubmitTransaction(
        entryFunctionPayload
      );
      await client.waitForTransaction(response.hash);
      message.success("NFT Offer Cancelled successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Error occured when rejecting bid:", error);
      message.error("Failed to reject bid.");
    }
  };
  useEffect(() => {
    if (isRunning && timeLeft === 0) {
      finalizeBidHandler(nft);
    }
    // eslint-disable-next-line
  }, [isRunning, nft, timeLeft]);
  return (
    <Col
      key={nft.id}
      xs={24}
      sm={12}
      md={8}
      lg={6}
      xl={6}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card
        hoverable
        style={{
          width: "100%",
          maxWidth: "240px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
        }}
        cover={<img alt={nft.name} src={nft.uri} />}
        actions={[
          <Col>
            {nftOwner && nft.new_offer && (
              <Row>
                <Button
                  key="accept"
                  type="text"
                  icon={<FaCheck style={{ color: "green" }} />}
                  onClick={() => handleAcceptBidOffer(nft)}
                >
                  Accept
                </Button>
                ,
                <Button
                  key="reject"
                  type="text"
                  icon={
                    <FaTimes style={{ color: "red", marginLeft: "18px" }} />
                  }
                  onClick={() => handleRejectBidOffer(nft)}
                >
                  Reject
                </Button>
              </Row>
            )}
            {nftOwner ? (
              <Button
                key="finalize_bid"
                type="link"
                onClick={() => finalizeBidHandler(nft)}
              >
                Finalize Bid
              </Button>
            ) : (
              <Button
                key="make_bid"
                type="link"
                onClick={() => makeABidHandler(nft)}
              >
                Make A Bid
              </Button>
            )}
          </Col>,
        ]}
      >
        <div style={{ flexGrow: 1 }}>
          {/* Rarity Tag */}
          <Tag
            color={rarityColors[nft.rarity]}
            style={{
              fontSize: "14px",
              fontWeight: "bold",
              marginBottom: "10px",
            }}
          >
            {rarityLabels[nft.rarity]}
          </Tag>
          <Meta
            title={nft.name}
            description={`Previous Bid: ${nft.previous_bid} APT`}
          />
          <p>Current Bid: {nft.current_bid} APT</p>
          <p>{nft.description}</p>
          <p>ID: {nft.id}</p>
          <p>Time Left: {timeLeft} seconds</p>
        </div>
      </Card>
    </Col>
  );
};

export default AuctionsCard;
