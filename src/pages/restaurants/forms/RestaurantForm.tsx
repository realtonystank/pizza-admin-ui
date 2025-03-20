import { Card, Col, Form, Input, Row } from "antd";
import React from "react";

const RestaurantForm = () => {
  return (
    <Row>
      <Col span={24}>
        <Card title={"Basic info"}>
          <Form.Item
            label={"Name"}
            name={"name"}
            rules={[{ required: true, message: "Restaurant name is required" }]}
          >
            <Input size={"large"} />
          </Form.Item>
          <Form.Item
            label={"Address"}
            name={"address"}
            rules={[
              { required: true, message: "Restaurant address is required" },
            ]}
          >
            <Input size={"large"} />
          </Form.Item>
        </Card>
      </Col>
    </Row>
  );
};

export default RestaurantForm;
