import {
  Breadcrumb,
  Button,
  Card,
  Drawer,
  Flex,
  Form,
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTenant, getTenants } from "../../http/api";
import RestaurantForm from "./forms/RestaurantForm";
import { PER_PAGE } from "../../constants";

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
  const [queryParams, setQueryParams] = useState({
    perPage: PER_PAGE,
    currentPage: 1,
  });
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const {
    token: { colorBgLayout },
  } = theme.useToken();

  const {
    data: restaurants,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ["tenants", queryParams],
    queryFn: async () => {
      const queryString = new URLSearchParams(
        queryParams as unknown as Record<string, string>
      ).toString();
      const response = await getTenants(queryString);
      console.log(response);
      return response.data;
    },
  });

  const { mutate: restaurantMutate } = useMutation({
    mutationKey: ["tenant"],
    mutationFn: createTenant,
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
      form.resetFields();
      setDrawerOpen(false);
    },
  });

  const onFormSubmit = async () => {
    await form.validateFields();
    restaurantMutate(form.getFieldsValue());
  };

  return (
    <>
      <Space size={"middle"} direction="vertical" style={{ width: "100%" }}>
        <Flex justify="space-between" style={{ minHeight: 24 }}>
          <Breadcrumb
            separator={<RightOutlined />}
            items={[
              { title: <NavLink to="/">Dashboard</NavLink> },
              { title: "Restaurants" },
            ]}
          />
          {isFetching && (
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
                  form.resetFields();
                  setDrawerOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button type="primary" onClick={onFormSubmit}>
                Submit
              </Button>
            </Space>
          }
        >
          <Form layout={"vertical"} form={form}>
            <RestaurantForm />
          </Form>
        </Drawer>

        <Table
          dataSource={restaurants?.data}
          columns={columns}
          rowKey={"id"}
          pagination={{
            total: restaurants?.total,
            pageSize: queryParams.perPage,
            current: queryParams.currentPage,
            onChange: (page) => {
              setQueryParams((prev) => {
                return { ...prev, currentPage: page };
              });
            },
          }}
        />
      </Space>
    </>
  );
};

export default Restaurants;
