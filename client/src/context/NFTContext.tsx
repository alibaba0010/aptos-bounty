import { createContext } from "react";
import { NFT } from "./NFTProvider";

export type NFTContextType = {
  marketplaceAddr: string;
  account: string | undefined;
  offerButton: boolean;
  setOfferButton: (visible: boolean) => void;
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
  offerLength: number;
  setOfferLength: (value: number) => void;
  handleDisplayOffer: () => void;
};

const NFTContext = createContext<NFTContextType | undefined>(undefined);
export default NFTContext;
