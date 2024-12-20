import { FC, ReactNode, useState } from "react";
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
};
const NFTProvider: FC<NFTProps> = ({ children }) => {
  const [isBuyModalVisible, setIsBuyModalVisible] = useState(false);
  const [isOfferModalVisible, setIsOfferModalVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedNft, setSelectedNft] = useState<NFT | null>(null);
  const [offerLength, setOfferLength] = useState<number>(0);

  const marketplaceAddr =
    "0x3ce691ae174233fc2470a947cf86a9647f4e282d23c568102d0f3a5a50bea008";
  const handleMintNFTClick = () => {
    setIsModalVisible(true);
  };
  const client = new AptosClient("https://fullnode.testnet.aptoslabs.com/v1");
  // const client = new AptosClient("https://fullnode.devnet.aptoslabs.com/v1");

  const handleFetchNfts = async (selectedRarity: number | undefined) => {
    try {
      const response = await client.getAccountResource(
        marketplaceAddr,
        "0x3ce691ae174233fc2470a947cf86a9647f4e282d23c568102d0f3a5a50bea008::NFTMarketplace::Marketplace"
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
        offerLength,
        setOfferLength,
        // handleDisplayOffer,
      }}
    >
      {children}
    </NFTContext.Provider>
  );
};

export default NFTProvider;
