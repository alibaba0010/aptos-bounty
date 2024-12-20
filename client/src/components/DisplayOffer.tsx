import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { AptosClient } from "aptos";
import React, { useContext, useEffect } from "react";
import NFTContext, { NFTContextType } from "../context/NFTContext";
import { message } from "antd";

const DisplayOffer = () => {
  const { marketplaceAddr } = useContext(NFTContext) as NFTContextType;
  const { account } = useWallet();
  const client = new AptosClient("https://fullnode.testnet.aptoslabs.com/v1");

  const handleDisplayOffer = async () => {
    console.log("Innnnnn n'est pas");
    if (!account) return;
    try {
      const getOffers = await client.view({
        function: `${marketplaceAddr}::NFTMarketplace::show_offers`,
        arguments: [marketplaceAddr, "100", "0"],
        type_arguments: [],
      });
      console.log("Get offers: ", getOffers);
    } catch (error) {
      console.error("Error occured when getting offers:", error);
      message.error("Failed to get offers.");
    }
  };
  useEffect(() => {
    handleDisplayOffer();
  }, []);
  return <div>DisplayOffer</div>;
};

export default DisplayOffer;
