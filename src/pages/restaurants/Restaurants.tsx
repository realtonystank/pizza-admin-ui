import {
  Breadcrumb,
  Button,
  Card,
  Drawer,
  Flex,
  Space,
  Spin,
  Table,
  theme,
  Typography,
} from "antd";
import {
  LoadingOutlined,
  PlusOutlined,
  RightOutlined,
} from "@ant-design/icons";
import React, { useState } from "react";
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
  const [drawerOpen, setDrawerOpen] = useState(false);

  const {
    token: { colorBgLayout },
  } = theme.useToken();

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
          <RestaurantsFilter>
            <Button
              onClick={() => {
                setDrawerOpen(true);
              }}
              icon={<PlusOutlined />}
              type="primary"
            >
              Create Restaurant
            </Button>
          </RestaurantsFilter>
        </Card>
        <Drawer
          title="Create Restaurant"
          width={720}
          placement="right"
          open={drawerOpen}
          onClose={() => {
            setDrawerOpen(false);
          }}
          destroyOnClose={true}
          styles={{ body: { background: colorBgLayout } }}
          extra={
            <Space>
              <Button
                onClick={() => {
                  setDrawerOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button type="primary">Submit</Button>
            </Space>
          }
        >
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </Drawer>

        <Table dataSource={restaurants} columns={columns} rowKey={"id"} />
      </Space>
    </>
  );
};

export default Restaurants;
