import { createContext } from "react";

type NFTContextType = {
  offerButton: boolean;
  setOfferButton: (visible: boolean) => void;
  isBuyModalVisible: boolean;
  setIsBuyModalVisible: (visible: boolean) => void;
};

const NFTContext = createContext<NFTContextType | undefined>(undefined);
export default NFTContext;
