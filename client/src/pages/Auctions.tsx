import { Typography, message, Card, Row, Col, Tag, Button } from "antd";

const { Title } = Typography;
const { Meta } = Card;
const Auctions = () => {
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
    </div>
  );
};

export default Auctions;
