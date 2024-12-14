import { createContext } from "react";

export type NFTContextType = {
  marketplaceAddr: string;
  account: string | undefined;
  offerButton: boolean;
  setOfferButton: (visible: boolean) => void;
  isModalVisible: boolean;
  setIsModalVisible: (visible: boolean) => void;
  isBuyModalVisible: boolean;
  setIsBuyModalVisible: (visible: boolean) => void;
};

// const NFTContext = createContext<NFTContextType | undefined>({
//   marketplaceAddr: "",
//   account: undefined,
//   offerButton: false,
//   setOfferButton: () => {},
//   isModalVisible: false,
//   setIsModalVisible: () => {},
//   isBuyModalVisible: false,
//   setIsBuyModalVisible: () => {},
// });
const NFTContext = createContext<NFTContextType | undefined>(undefined);
export default NFTContext;
