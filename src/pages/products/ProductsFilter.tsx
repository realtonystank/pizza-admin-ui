import { useQuery } from "@tanstack/react-query";
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
import { getCategories, getTenants } from "../../http/api";
import { Category, Tenant } from "../../types";
import { useAuthStore } from "../../../store";

type ProductsFilterProps = {
  children: ReactNode;
};

const ProductsFilter = ({ children }: ProductsFilterProps) => {
  const { user } = useAuthStore();
  const { data: restaurants } = useQuery({
    queryKey: ["restaurants"],
    queryFn: async () => {
      const queryString = new URLSearchParams({
        perPage: 100000,
        currentPage: 1,
      } as unknown as Record<string, string>).toString();
      const response = await getTenants(queryString);
      return response.data;
    },
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const queryString = new URLSearchParams({
        perPage: 10000,
        currentPage: 1,
      } as unknown as Record<string, string>).toString();
      const response = await getCategories(queryString);
      return response.data;
    },
  });

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
              <Form.Item name={"categoryId"}>
                <Select
                  style={{ width: "100%" }}
                  placeholder={"Select category"}
                  allowClear={true}
                >
                  {categories?.data.map((category: Category) => {
                    return (
                      <Select.Option value={category._id} key={category._id}>
                        {category.name}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            {user!.role === "admin" && (
              <Col span={5}>
                <Form.Item name={"tenantId"}>
                  <Select
                    style={{ width: "100%" }}
                    placeholder={"Select restaurant"}
                    allowClear={true}
                  >
                    {restaurants?.data?.map((restaurant: Tenant) => {
                      return (
                        <Select.Option
                          value={restaurant.id}
                          key={restaurant.id}
                        >
                          {restaurant.name}
                        </Select.Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>
            )}

            <Col span={7}>
              <Space>
                <Form.Item name={"isPublished"}>
                  <Switch defaultChecked={false} />
                </Form.Item>
                <Typography.Text>Show only published</Typography.Text>
              </Space>
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
