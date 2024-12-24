import { FC, ReactNode, useEffect, useState } from "react";
import NFTContext from "./NFTContext";
import { AptosClient } from "aptos";
import { message } from "antd";
interface NFTProps {
  children: ReactNode;
}

export type NFT = {
  id: number;
  owner: string;
  name: string;
  description: string;
  uri: string;
  price: number;
  for_sale: boolean;
  rarity: number;
  offree: string;
  offer_price: number;
  made_ofer: boolean;
  current_bid: number;
  previous_bid: number;
  new_offer: boolean;
  timer: number;
};
const NFTProvider: FC<NFTProps> = ({ children }) => {
  const [isBuyModalVisible, setIsBuyModalVisible] = useState(false);
  const [isOfferModalVisible, setIsOfferModalVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedNft, setSelectedNft] = useState<NFT | null>(null);
  const [isAuctionModalVisible, setIsAuctionModalVisible] = useState(false);
  const [selectedAuctionNft, setSelectedAuctionNft] = useState<NFT | null>(
    null
  );
  const [timeLeft, setTimeLeft] = useState<number>(90);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const marketplaceAddr =
    "0x497d8a18b09879bb6fab1d79245d49f96272bc0ea4f1f595c4f2ff785b295283";
  const handleMintNFTClick = () => {
    setIsModalVisible(true);
  };
  const client = new AptosClient("https://fullnode.testnet.aptoslabs.com/v1");

  const handleFetchNfts = async (selectedRarity: number | undefined) => {
    try {
      const response = await client.getAccountResource(
        marketplaceAddr,
        "0x497d8a18b09879bb6fab1d79245d49f96272bc0ea4f1f595c4f2ff785b295283::NFTMarketplace::Marketplace"
      );
      const nftList = (response.data as { nfts: NFT[] }).nfts;

      const hexToUint8Array = (hexString: string): Uint8Array => {
        const bytes = new Uint8Array(hexString.length / 2);
        for (let i = 0; i < hexString.length; i += 2) {
          bytes[i / 2] = parseInt(hexString.substr(i, 2), 16);
        }
        return bytes;
      };
      const decodedNfts = nftList.map((nft) => ({
        ...nft,
        name: new TextDecoder().decode(hexToUint8Array(nft.name.slice(2))),
        description: new TextDecoder().decode(
          hexToUint8Array(nft.description.slice(2))
        ),
        uri: new TextDecoder().decode(hexToUint8Array(nft.uri.slice(2))),
        price: nft.price / 100000000,
      }));

      // Filter NFTs based on `for_sale` property and rarity if selected
      const filteredNfts = decodedNfts.filter(
        (nft) =>
          nft.for_sale &&
          (selectedRarity === undefined || nft.rarity === selectedRarity)
      );

      setNfts(filteredNfts);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error fetching NFTs by rarity:", error);
      message.error("Failed to fetch NFTs.");
    }
  };
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);
  return (
    <NFTContext.Provider
      value={{
        marketplaceAddr,
        currentPage,
        nfts,
        handleFetchNfts,
        setCurrentPage,
        isModalVisible,
        setIsModalVisible,
        isOfferModalVisible,
        setIsOfferModalVisible,
        isBuyModalVisible,
        selectedNft,
        setSelectedNft,
        setIsBuyModalVisible,
        handleMintNFTClick,
        isAuctionModalVisible,
        setIsAuctionModalVisible,
        selectedAuctionNft,
        setSelectedAuctionNft,
        isRunning,
        setIsRunning,
        timeLeft,
        setTimeLeft,
      }}
    >
      {children}
    </NFTContext.Provider>
  );
};

export default NFTProvider;
