import { Card, Row, Col, Input, Select, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import React from "react";

const UsersFilter = () => {
  return (
    <Card>
      <Row justify={"space-between"}>
        <Col span={16}>
          <Row gutter={20}>
            <Col span={12}>
              <Input.Search />
            </Col>
            <Col span={6}>
              <Select
                style={{ width: "100%" }}
                placeholder={"Select Role"}
                allowClear={true}
              >
                <Select.Option value="admin">Admin</Select.Option>
                <Select.Option value="manager">Manager</Select.Option>
                <Select.Option value="customer">Customer</Select.Option>
              </Select>
            </Col>
            <Col span={6} style={{ display: "flex", alignItems: "center" }}>
              <Select
                placeholder={"Status"}
                allowClear={true}
                style={{ width: "100%" }}
              >
                <Select.Option value="ban">Ban</Select.Option>
                <Select.Option value="active">Active</Select.Option>
              </Select>
            </Col>
          </Row>
        </Col>
        <Col>
          <Button type="primary" icon={<PlusOutlined />}>
            Add User
          </Button>
        </Col>
      </Row>
    </Card>
  );
};

export default UsersFilter;
