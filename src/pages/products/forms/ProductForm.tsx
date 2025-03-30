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
  Upload,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Category, Tenant } from "../../../types";
import { useQuery } from "@tanstack/react-query";
import { getCategories, getTenants } from "../../../http/api";
import Pricing from "./Pricing";
import Attributes from "./Attributes";

const ProductForm = () => {
  const selectedCategory = Form.useWatch("category");
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

  const { data: restaurants } = useQuery({
    queryKey: ["tenants"],
    queryFn: async () => {
      const queryParams = {
        perPage: 10000,
        currentPage: 1,
      };
      const queryString = new URLSearchParams(
        queryParams as unknown as Record<string, string>
      ).toString();
      const restaurants = await getTenants(queryString);
      return restaurants.data;
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
                  name={"category"}
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
                        <Select.Option
                          value={JSON.stringify(category)}
                          key={category._id}
                        >
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
          <Card title={"Tenant info"}>
            <Form.Item
              label={"Restaurant"}
              name={"tenantId"}
              rules={[{ required: true, message: "Tenant is required" }]}
            >
              <Select
                size={"large"}
                style={{ width: "100%" }}
                allowClear={true}
                placeholder={"Select tenant"}
              >
                {restaurants?.data?.map((restaurant: Tenant) => {
                  return (
                    <Select.Option value={restaurant.id} key={restaurant.id}>
                      {restaurant.name}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Card>
          {selectedCategory && (
            <Pricing selectedCategoryString={selectedCategory} />
          )}
          {selectedCategory && (
            <Attributes selectedCategoryString={selectedCategory} />
          )}
          <Card title={"Other properties"}>
            <Row>
              <Col span={12}>
                <Space size={"small"}>
                  <Form.Item
                    label={""}
                    name={"isPublished"}
                    rules={[{ required: true, message: "Tenant is required" }]}
                  >
                    <Switch
                      defaultChecked={false}
                      checkedChildren="Yes"
                      unCheckedChildren="No"
                    />
                  </Form.Item>
                  <Typography.Text
                    style={{ marginBottom: 20, display: "block" }}
                  >
                    {" "}
                    Publish
                  </Typography.Text>
                </Space>
              </Col>
            </Row>
          </Card>
        </Space>
      </Col>
    </Row>
  );
};

export default ProductForm;
