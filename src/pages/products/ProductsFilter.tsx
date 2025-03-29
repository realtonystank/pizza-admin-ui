import {
  Card,
  Col,
  Form,
  Input,
  Row,
  Select,
  Space,
  Switch,
  Typography,
} from "antd";
import { ReactNode } from "react";

type ProductsFilterProps = {
  children: ReactNode;
};

const ProductsFilter = ({ children }: ProductsFilterProps) => {
  return (
    <Card>
      <Row justify={"space-between"}>
        <Col span={20}>
          <Row gutter={20}>
            <Col span={8}>
              <Form.Item name={"q"}>
                <Input.Search placeholder="Search" allowClear={true} />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name={"category"}>
                <Select
                  style={{ width: "100%" }}
                  placeholder={"Select category"}
                  allowClear={true}
                >
                  <Select.Option value="admin">Pizza</Select.Option>
                  <Select.Option value="manager">Beverages</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item name={"tenant"}>
                <Select
                  style={{ width: "100%" }}
                  placeholder={"Select restaurant"}
                  allowClear={true}
                >
                  <Select.Option value="admin">Pizza hub</Select.Option>
                  <Select.Option value="manager">AFC</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item name={"isPublished"}>
                <Space>
                  <Switch defaultChecked={true} onChange={() => {}} />
                  <Typography.Text>Show only published</Typography.Text>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Col>
        <Col span={4} style={{ display: "flex", justifyContent: "end" }}>
          {children}
        </Col>
      </Row>
    </Card>
  );
};

export default ProductsFilter;
