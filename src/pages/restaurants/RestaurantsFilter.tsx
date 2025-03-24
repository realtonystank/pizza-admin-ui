import { Col, Form, Input, Row } from "antd";
import React, { ReactNode } from "react";

type RestaurantsFilterProps = {
  children: ReactNode;
};

const RestaurantsFilter = ({ children }: RestaurantsFilterProps) => {
  return (
    <Row justify={"space-between"}>
      <Col span={14}>
        <Form.Item name={"q"}>
          <Input.Search placeholder="Search" />
        </Form.Item>
      </Col>
      <Col>{children}</Col>
    </Row>
  );
};

export default RestaurantsFilter;
