import {
  Card,
  Col,
  Form,
  Input,
  Row,
  Select,
  Space,
  Typography,
  Upload,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import React from "react";
import { Category } from "../../../types";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../../../http/api";

const ProductForm = () => {
  const { data: categories } = useQuery({
    queryKey: ["category"],
    queryFn: async () => {
      const searchParams = {
        perPage: 10000,
        currentPage: 1,
      };
      const queryString = new URLSearchParams(
        searchParams as unknown as Record<string, string>
      ).toString();
      const response = await getCategories(queryString);
      return response.data;
    },
  });

  return (
    <Row>
      <Col span={24}>
        <Space direction={"vertical"} size={"large"} style={{ width: "100%" }}>
          <Card title={"Product info"}>
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item
                  name={"name"}
                  label={"Product name"}
                  rules={[
                    { required: true, message: "Product name is required" },
                  ]}
                >
                  <Input size="large" title="Product name" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={"Category"}
                  name={"categoryId"}
                  rules={[
                    { required: true, message: "Product category is required" },
                  ]}
                >
                  <Select
                    size={"large"}
                    style={{ width: "100%" }}
                    allowClear={true}
                    placeholder={"Select category"}
                  >
                    {categories?.data?.map((category: Category) => {
                      return (
                        <Select.Option value={category._id} key={category._id}>
                          {category.name}
                        </Select.Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  label={"Description"}
                  rules={[
                    {
                      required: true,
                      message: "Product description is requiredr",
                    },
                  ]}
                  name={"description"}
                >
                  <Input.TextArea
                    size={"large"}
                    style={{ resize: "none" }}
                    maxLength={200}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>
          <Card title={"Product image"}>
            <Form.Item
              name={"image"}
              rules={[{ required: true, message: "Product image is required" }]}
            >
              <Upload listType="picture-card">
                <div>
                  <Space direction={"vertical"}>
                    <PlusOutlined />
                    <Typography.Text>Upload</Typography.Text>
                  </Space>
                </div>
              </Upload>
            </Form.Item>
          </Card>
        </Space>
      </Col>
    </Row>
  );
};

export default ProductForm;
