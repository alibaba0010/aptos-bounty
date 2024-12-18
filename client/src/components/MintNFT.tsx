import { Layout, Modal, Form, Input, Select, Button, message } from "antd";
import { FC, useContext } from "react";
import { AptosClient } from "aptos";
import NFTContext, { NFTContextType } from "../context/NFTContext";

interface MarketViewProps {
  mintNFT: boolean;
}

//   marketplaceAddr: string;
//   isModalVisible: boolean;
//   setIsModalVisible: (visible: boolean) => void;
// }
const client = new AptosClient("https://fullnode.testnet.aptoslabs.com/v1");

const MintNFT = () => {
  const { marketplaceAddr, isModalVisible, setIsModalVisible } = useContext(
    NFTContext
  ) as NFTContextType;
  const handleMintNFT = async (values: {
    name: string;
    description: string;
    uri: string;
    rarity: number;
  }) => {
    try {
      const nameVector = Array.from(new TextEncoder().encode(values.name));
      console.log("Name vector ", nameVector);
      const descriptionVector = Array.from(
        new TextEncoder().encode(values.description)
      );
      const uriVector = Array.from(new TextEncoder().encode(values.uri));

      const entryFunctionPayload = {
        type: "entry_function_payload",
        function: `${marketplaceAddr}::NFTMarketplace::mint_nft`,
        type_arguments: [],
        arguments: [
          marketplaceAddr,
          nameVector,
          descriptionVector,
          uriVector,
          values.rarity,
        ],
      };
      console.log(entryFunctionPayload.arguments[0]);
      const txnResponse = await (window as any).aptos.signAndSubmitTransaction({
        entryFunctionPayload,
      });
      await client.waitForTransaction(txnResponse.hash);

      message.success("NFT minted successfully!");
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error minting NFT:", error);
      message.error("Failed to mint NFT.");
    }
  };
  return (
    <Modal
      title="Mint New NFT"
      open={isModalVisible}
      onCancel={() => setIsModalVisible(false)}
      footer={null}
    >
      <Form layout="vertical" onFinish={handleMintNFT}>
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please enter a name!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "Please enter a description!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="URI"
          name="uri"
          rules={[{ required: true, message: "Please enter a URI!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Rarity"
          name="rarity"
          rules={[{ required: true, message: "Please select a rarity!" }]}
        >
          <Select>
            <Select.Option value={1}>Common</Select.Option>
            <Select.Option value={2}>Uncommon</Select.Option>
            <Select.Option value={3}>Rare</Select.Option>
            <Select.Option value={4}>Epic</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Mint NFT
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default MintNFT;
