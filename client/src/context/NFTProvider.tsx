import { FC, ReactNode, useState } from "react";
import NFTContext from "./NFTContext";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

interface NFTProps {
  children: ReactNode;
}
const NFTProvider: FC<NFTProps> = ({ children }) => {
  const [offerButton, setOfferButton] = useState(false);
  const [isBuyModalVisible, setIsBuyModalVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const marketplaceAddr =
    "0x65a3857a226af09f7f6fa4cf017f9a00718f64be692da9df4429a747faf3b78d";
  const { account } = useWallet();

  return (
    <NFTContext.Provider
      value={{
        marketplaceAddr,
        account: account?.address,
        offerButton,
        setOfferButton,
        isModalVisible,
        setIsModalVisible,
        isBuyModalVisible,
        setIsBuyModalVisible,
      }}
    >
      {children}
    </NFTContext.Provider>
  );
};

export default NFTProvider;
