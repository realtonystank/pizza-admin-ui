import { Button, Col, Input, Row } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import React from "react";

const RestaurantsFilter = () => {
  return (
    <Row justify={"space-between"}>
      <Col span={14}>
        <Input.Search placeholder="Search" />
      </Col>
      <Col>
        <Button icon={<PlusOutlined />} type="primary">
          Create Restaurant
        </Button>
      </Col>
    </Row>
  );
};

export default RestaurantsFilter;
