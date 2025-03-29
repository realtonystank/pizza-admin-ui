import { Breadcrumb, Button, Flex, Form, Space } from "antd";
import { PlusOutlined, RightOutlined } from "@ant-design/icons";
import React from "react";
import { Link } from "react-router-dom";
import ProductsFilter from "./ProductsFilter";
import { useForm } from "antd/es/form/Form";

const Products = () => {
  const [form] = useForm();
  return (
    <>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Flex justify="space-between">
          <Breadcrumb
            separator={<RightOutlined />}
            items={[
              { title: <Link to="/">Dashboard</Link> },
              { title: "Products" },
            ]}
          />
        </Flex>

        <Form form={form}>
          <ProductsFilter>
            <Button type="primary" icon={<PlusOutlined />}>
              Add Product
            </Button>
          </ProductsFilter>
        </Form>
      </Space>
    </>
  );
};

export default Products;
