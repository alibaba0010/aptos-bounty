import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Typography, message, Row } from "antd";
import { useContext, useEffect, useState } from "react";
import NFTContext, { NFTContextType } from "../context/NFTContext";
import { AptosClient } from "aptos";
import { NFT } from "../context/NFTProvider";

import AuctionsCard from "../components/AuctionsCard";

const { Title } = Typography;

const client = new AptosClient("https://fullnode.testnet.aptoslabs.com/v1");

const Auctions = () => {
  const { account } = useWallet();
  const { marketplaceAddr } = useContext(NFTContext) as NFTContextType;
  const [auctionsLength, setAuctionsLength] = useState(false);
  const [auctionsNFTs, setAuctionNfts] = useState<NFT[]>([]);
  const [nftOwner, setNftOwner] = useState(false);

  const showAuctionedNFTsHandler = async () => {
    if (!account) return;

    try {
      const getAuctionedNFTs = await client.view({
        function: `${marketplaceAddr}::NFTMarketplace::get_nfts_on_auction`,
        arguments: [marketplaceAddr, "100", "0"],
        type_arguments: [],
      });
      const auctionNFTs = getAuctionedNFTs[0] as NFT[];

      if (auctionNFTs.length) {
        setAuctionsLength(true);
      } else {
        setAuctionsLength(false);
      }
      const hexToUint8Array = (hexString: string): Uint8Array => {
        const bytes = new Uint8Array(hexString.length / 2);
        for (let i = 0; i < hexString.length; i += 2) {
          bytes[i / 2] = parseInt(hexString.substr(i, 2), 16);
        }
        return bytes;
      };
      const decodedNfts = auctionNFTs.map((nft) => ({
        ...nft,
        name: new TextDecoder().decode(hexToUint8Array(nft.name.slice(2))),
        uri: new TextDecoder().decode(hexToUint8Array(nft.uri.slice(2))),
        current_bid: nft.current_bid / 100000000,
        previous_bid: nft.previous_bid / 100000000,
        timer: nft.timer / 100000000,
      }));
      setAuctionNfts(decodedNfts);
    } catch (error) {
      console.error("Error occured when getting auctioned nfts:", error);
      message.error("Failed to get auctioned nfts.");
    }
  };
  useEffect(() => {
    showAuctionedNFTsHandler();
    if (account) {
      if (account.address === marketplaceAddr) {
        setNftOwner(true);
      } else {
        setNftOwner(false);
      }
    }
    // eslint-disable-next-line
  }, [account, marketplaceAddr]);
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
        Auctions
      </Title>

      {/* Card Grid */}
      {auctionsLength ? (
        <Row
          gutter={[24, 24]}
          style={{
            marginTop: 20,
            width: "100%",
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {auctionsNFTs.map((nft) => (
            <AuctionsCard
              key={nft.id}
              nft={nft}
              nftOwner={nftOwner}
              showAuctionedNFTsHandler={showAuctionedNFTsHandler}
            />
          ))}
        </Row>
      ) : (
        <p>No NFT available on auction</p>
      )}
    </div>
  );
};

export default Auctions;
