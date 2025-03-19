import { Card, Row, Col, Input, Select, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import React from "react";

type UsersFilterProps = {
  onFilterChange: (filterName: string, filterValue: string) => void;
};

const UsersFilter = ({ onFilterChange }: UsersFilterProps) => {
  return (
    <Card>
      <Row justify={"space-between"}>
        <Col span={16}>
          <Row gutter={20}>
            <Col span={12}>
              <Input.Search
                placeholder="Search"
                onChange={(e) =>
                  onFilterChange("UserSerachQuery", e.target.value)
                }
                allowClear={true}
              />
            </Col>
            <Col span={6}>
              <Select
                style={{ width: "100%" }}
                placeholder={"Select Role"}
                allowClear={true}
                onChange={(selectedItem) =>
                  onFilterChange("roleFilter", selectedItem)
                }
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
                onChange={(selectedItem) =>
                  onFilterChange("statusFilter", selectedItem)
                }
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
