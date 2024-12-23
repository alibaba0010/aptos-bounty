import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Typography, message, Card, Row, Col, Tag, Button } from "antd";
import { useContext, useEffect, useState } from "react";
import NFTContext, { NFTContextType } from "../context/NFTContext";
import { AptosClient } from "aptos";
import { NFT } from "../context/NFTProvider";
import { FaCheck, FaTimes } from "react-icons/fa";
import { rarityColors, rarityLabels } from "./MarketView";

const { Title } = Typography;
const { Meta } = Card;
const client = new AptosClient("https://fullnode.testnet.aptoslabs.com/v1");

const Auctions = () => {
  const { account } = useWallet();
  const { marketplaceAddr, setIsAuctionModalVisible, setSelectedAuctionNft } =
    useContext(NFTContext) as NFTContextType;
  const [auctionsLength, setAuctionsLength] = useState(false);
  const [auctionsNFTs, setAuctionNfts] = useState<NFT[]>([]);
  const [nftOwner, setNftOwner] = useState(false);

  const makeABidHandler = (nft: NFT) => {
    if (!account) return;
    setIsAuctionModalVisible(true);
    setSelectedAuctionNft(nft);
  };

  const finalizeBidHandler = async (nft: NFT) => {
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
      await showAuctionedNFTsHandler();
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
      await showAuctionedNFTsHandler();
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
      await showAuctionedNFTsHandler();
      window.location.reload();
    } catch (error) {
      console.error("Error occured when rejecting bid:", error);
      message.error("Failed to reject bid.");
    }
  };

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
                            <FaTimes
                              style={{ color: "red", marginLeft: "18px" }}
                            />
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
                </div>
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

export default Auctions;
