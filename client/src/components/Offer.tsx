import React from "react";
import {
  Typography,
  Radio,
  message,
  Card,
  Row,
  Col,
  Tag,
  Button,
  Modal,
} from "antd";
interface OfferProps {
  children: React.ReactNode;
}
const Offer = () => {
  const offerHandler = async () => {};
  return (
    <Button type="link" onClick={offerHandler}>
      Make an offer
    </Button>
  );
};

export default Offer;
