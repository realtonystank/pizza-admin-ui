import { Breadcrumb, Card, Flex, Space, Spin, Table, Typography } from "antd";
import { LoadingOutlined, RightOutlined } from "@ant-design/icons";
import React from "react";
import { NavLink } from "react-router-dom";
import RestaurantsFilter from "./RestaurantsFilter";
import { useQuery } from "@tanstack/react-query";
import { getTenants } from "../../http/api";

const columns = [
  {
    title: "Id",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
  },
];

const Restaurants = () => {
  const {
    data: restaurants,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["tenants"],
    queryFn: async () => {
      const response = await getTenants();
      console.log(response);
      return response.data;
    },
  });

  return (
    <>
      <Space size={"middle"} direction="vertical" style={{ width: "100%" }}>
        <Flex justify="space-between">
          <Breadcrumb
            separator={<RightOutlined />}
            items={[
              { title: <NavLink to="/">Dashboard</NavLink> },
              { title: "Restaurants" },
            ]}
          />
          {isLoading && (
            <Spin
              indicator={
                <LoadingOutlined style={{ fontSize: 24 }} spin={true} />
              }
            />
          )}
          {isError && (
            <Typography.Text type="danger">{error.message}</Typography.Text>
          )}
        </Flex>
        <Card>
          <RestaurantsFilter />
        </Card>

        <Table dataSource={restaurants} columns={columns} rowKey={"id"} />
      </Space>
    </>
  );
};

export default Restaurants;
