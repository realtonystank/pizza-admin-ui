import { Col, Input, Row } from "antd";
import React, { ReactNode } from "react";

type RestaurantsFilterProps = {
  children: ReactNode;
};

const RestaurantsFilter = ({ children }: RestaurantsFilterProps) => {
  return (
    <Row justify={"space-between"}>
      <Col span={14}>
        <Input.Search placeholder="Search" />
      </Col>
      <Col>{children}</Col>
    </Row>
  );
};

export default RestaurantsFilter;
