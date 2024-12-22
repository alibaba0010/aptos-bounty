import { createContext } from "react";
import { NFT } from "./NFTProvider";

export type NFTContextType = {
  marketplaceAddr: string;
  // account: string | undefined;
  isModalVisible: boolean;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  setIsModalVisible: (visible: boolean) => void;
  isBuyModalVisible: boolean;
  nfts: NFT[];
  selectedNft: NFT | null;
  setSelectedNft: (nft: NFT | null) => void;
  handleFetchNfts: (rarity?: number) => void;
  isOfferModalVisible: boolean;
  setIsOfferModalVisible: (visible: boolean) => void;
  setIsBuyModalVisible: (visible: boolean) => void;
  handleMintNFTClick: () => void;
  isAuctionModalVisible: boolean;
  setIsAuctionModalVisible: (visible: boolean) => void;
  selectedAuctionNft: NFT | null;
  setSelectedAuctionNft: (nft: NFT | null) => void;
};

const NFTContext = createContext<NFTContextType | undefined>(undefined);
export default NFTContext;
