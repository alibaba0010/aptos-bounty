import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { AptosClient } from "aptos";
import React, { useContext, useEffect, useState } from "react";
import NFTContext, { NFTContextType } from "../context/NFTContext";
import { NFT } from "../context/NFTProvider";
import {
  Typography,
  Radio,
  message,
  Card,
  Row,
  Col,
  Pagination,
  Tag,
  Button,
  Modal,
} from "antd";

const { Title } = Typography;
const { Meta } = Card;

const DisplayOffer = () => {
  const { marketplaceAddr } = useContext(NFTContext) as NFTContextType;
  const { account } = useWallet();
  const [offerNFTs, setOfferNfts] = useState<NFT[]>([]);

  const client = new AptosClient("https://fullnode.testnet.aptoslabs.com/v1");

  const truncateAddress = (address: string, start = 6, end = 4) => {
    return `${address.slice(0, start)}...${address.slice(-end)}`;
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
      const hexToUint8Array = (hexString: string): Uint8Array => {
        const bytes = new Uint8Array(hexString.length / 2);
        for (let i = 0; i < hexString.length; i += 2) {
          bytes[i / 2] = parseInt(hexString.substr(i, 2), 16);
        }
        return bytes;
      };
      const decodedNfts = offerNFTs.map((nft) => ({
        ...nft,
        // name: new TextDecoder().decode(hexToUint8Array(nft.name.slice(2))),
        // description: new TextDecoder().decode(
        //   hexToUint8Array(nft.description.slice(2))
        // ),
        price: nft.price / 100000000,
        offer_price: nft.price / 100000000,
      }));
      console.log("Decoded NFTs: ", decodedNfts);
      setOfferNfts(decodedNfts);
    } catch (error) {
      console.error("Error occured when getting offers:", error);
      message.error("Failed to get offers.");
    }
  };
  useEffect(() => {
    handleDisplayOffer();
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
    </div>
  );
};

export default DisplayOffer;
