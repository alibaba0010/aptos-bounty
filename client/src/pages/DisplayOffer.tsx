import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { AptosClient } from "aptos";
import React, { useContext, useEffect, useState } from "react";
import NFTContext, { NFTContextType } from "../context/NFTContext";
import { NFT } from "../context/NFTProvider";
import { Typography, message, Card, Row, Col, Tag, Button } from "antd";
import { rarityColors, rarityLabels } from "./MarketView";
import { FaCheck, FaTimes } from "react-icons/fa";
const { Title } = Typography;
const { Meta } = Card;

const DisplayOffer = () => {
  const { marketplaceAddr } = useContext(NFTContext) as NFTContextType;
  const { account } = useWallet();
  const [offerNFTs, setOfferNfts] = useState<NFT[]>([]);
  const [offerLength, setOfferLength] = useState(false);
  const client = new AptosClient("https://fullnode.testnet.aptoslabs.com/v1");

  const truncateAddress = (address: string, start = 6, end = 4) => {
    return `${address.slice(0, start)}...${address.slice(-end)}`;
  };
  const handleAcceptOffer = async (nft: NFT) => {
    try {
      const entryFunctionPayload = {
        type: "entry_function_payload",
        function: `${marketplaceAddr}::NFTMarketplace::accept_offer`,
        type_arguments: [],
        arguments: [nft.offree, nft.id.toString()],
      };
      const response = await (window as any).aptos.signAndSubmitTransaction(
        entryFunctionPayload
      );
      await client.waitForTransaction(response.hash);
      message.success("NFT Transferred successfully!");
      await handleDisplayOffer();
    } catch (error) {
      console.error("Error occured when accepting offers:", error);
      message.error("Failed to accept offer.");
    }
  };

  const handleRejectOffer = async (nft: NFT) => {
    try {
      const entryFunctionPayload = {
        type: "entry_function_payload",
        function: `${marketplaceAddr}::NFTMarketplace::reject_offer`,
        type_arguments: [],
        arguments: [nft.offree, nft.id.toString()],
      };
      const response = await (window as any).aptos.signAndSubmitTransaction(
        entryFunctionPayload
      );
      await client.waitForTransaction(response.hash);
      message.success("NFT Offer Cancelled successfully!");
      handleDisplayOffer();
    } catch (error) {
      console.error("Error occured when cancelling offers:", error);
      message.error("Failed to cancel offer.");
    }
  };

  const handleDisplayOffer = async () => {
    if (!account) return;
    try {
      const getOffers = await client.view({
        function: `${marketplaceAddr}::NFTMarketplace::show_offers`,
        arguments: [marketplaceAddr, "100", "0"],
        type_arguments: [],
      });
      const offerNFTs = getOffers[0] as NFT[];
      if (offerNFTs.length) {
        setOfferLength(true);
      } else {
        setOfferLength(false);
      }
      const hexToUint8Array = (hexString: string): Uint8Array => {
        const bytes = new Uint8Array(hexString.length / 2);
        for (let i = 0; i < hexString.length; i += 2) {
          bytes[i / 2] = parseInt(hexString.substr(i, 2), 16);
        }
        return bytes;
      };
      const decodedNfts = offerNFTs.map((nft) => ({
        ...nft,
        name: new TextDecoder().decode(hexToUint8Array(nft.name.slice(2))),
        uri: new TextDecoder().decode(hexToUint8Array(nft.uri.slice(2))),
        price: nft.price / 100000000,
        offer_price: nft.offer_price / 100000000,
      }));
      const filteredNfts = decodedNfts.filter((nft) => nft.made_ofer);
      setOfferNfts(filteredNfts);
    } catch (error) {
      console.error("Error occured when getting offers:", error);
      message.error("Failed to get offers.");
    }
  };
  useEffect(() => {
    if (account) {
      handleDisplayOffer();
    }
  }, []);
  return (
    <div
      style={{
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Title level={2} style={{ marginBottom: "20px" }}>
        Offers
      </Title>

      {/* Card Grid */}
      {offerLength ? (
        <Row
          gutter={[24, 24]}
          style={{
            marginTop: 20,
            width: "100%",
            display: "flex",
            justifyContent: "center", // Center row content
            flexWrap: "wrap",
          }}
        >
          {offerNFTs.map((nft) => (
            <Col
              key={nft.id}
              xs={24}
              sm={12}
              md={8}
              lg={6}
              xl={6}
              style={{
                display: "flex",
                justifyContent: "center", // Center the single card horizontally
                alignItems: "center", // Center content in both directions
              }}
            >
              <Card
                hoverable
                style={{
                  width: "100%", // Make the card responsive
                  maxWidth: "240px", // Limit the card width on larger screens
                  margin: "0 auto",
                }}
                cover={<img alt={nft.name} src={nft.uri} />}
                actions={[
                  <Button
                    key="accept"
                    type="text"
                    icon={<FaCheck style={{ color: "green" }} />}
                    onClick={() => handleAcceptOffer(nft)}
                  >
                    Accept
                  </Button>,
                  <Button
                    key="reject"
                    type="text"
                    icon={<FaTimes style={{ color: "red" }} />}
                    onClick={() => handleRejectOffer(nft)}
                  >
                    Reject
                  </Button>,
                ]}
              >
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
                  description={`Price: ${nft.price} APT`}
                />
                <p>Offer Price: {nft.offer_price} APT</p>
                <p>{nft.description}</p>
                <p>ID: {nft.id}</p>
                <p>Offree: {truncateAddress(nft.offree)}</p>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <p>No offers available</p>
      )}
    </div>
  );
};

export default DisplayOffer;
