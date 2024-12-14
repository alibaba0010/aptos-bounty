import { FC, ReactNode, useState } from "react";
import NFTContext from "./NFTContext";

interface NFTProps {
  children: ReactNode;
}
const NFTProvider: FC<NFTProps> = ({ children }) => {
  const [offerButton, setOfferButton] = useState(false);
  const [isBuyModalVisible, setIsBuyModalVisible] = useState(false);

  return (
    <NFTContext.Provider
      value={{
        offerButton,
        setOfferButton,
        isBuyModalVisible,
        setIsBuyModalVisible,
      }}
    >
      {children}
    </NFTContext.Provider>
  );
};

export default NFTProvider;
