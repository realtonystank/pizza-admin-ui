import { Button, Col, Input, Row } from "antd";
import React from "react";

const RestaurantsFilter = () => {
  return (
    <Row justify={"space-between"}>
      <Col span={14}>
        <Input.Search placeholder="Search" />
      </Col>
      <Col>
        <Button type="primary">Create Restaurant</Button>
      </Col>
    </Row>
  );
};

export default RestaurantsFilter;
