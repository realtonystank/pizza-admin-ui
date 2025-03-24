import { Card, Row, Col, Input, Select, Form } from "antd";
import React, { ReactNode } from "react";

type UsersFilterProps = {
  children: ReactNode;
};

const UsersFilter = ({ children }: UsersFilterProps) => {
  return (
    <Card>
      <Row justify={"space-between"}>
        <Col span={16}>
          <Row gutter={20}>
            <Col span={12}>
              <Form.Item name={"q"}>
                <Input.Search placeholder="Search" allowClear={true} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name={"role"}>
                <Select
                  style={{ width: "100%" }}
                  placeholder={"Select Role"}
                  allowClear={true}
                >
                  <Select.Option value="admin">Admin</Select.Option>
                  <Select.Option value="manager">Manager</Select.Option>
                  <Select.Option value="customer">Customer</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            {/* <Col span={6} style={{ display: "flex", alignItems: "center" }}>
              <Select
                placeholder={"Status"}
                allowClear={true}
                style={{ width: "100%" }}
              >
                <Select.Option value="ban">Ban</Select.Option>
                <Select.Option value="active">Active</Select.Option>
              </Select>
            </Col> */}
          </Row>
        </Col>
        <Col>{children}</Col>
      </Row>
    </Card>
  );
};

export default UsersFilter;
