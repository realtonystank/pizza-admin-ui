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
import React, { useMemo, useState } from "react";
import { Navigate, NavLink } from "react-router-dom";
import RestaurantsFilter from "./RestaurantsFilter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTenant, getTenants } from "../../http/api";
import RestaurantForm from "./forms/RestaurantForm";
import { PER_PAGE } from "../../constants";
import { useAuthStore } from "../../../store";
import { FieldData, Tenant } from "../../types";
import { debounce } from "lodash";

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
  const [queryForm] = Form.useForm();

  const queryClient = useQueryClient();
  const { user: loggedInUser } = useAuthStore();

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
      const filteredQueryParams = Object.fromEntries(
        Object.entries(queryParams).filter((query) => {
          return !!query[1];
        })
      );
      const queryString = new URLSearchParams(
        filteredQueryParams as unknown as Record<string, string>
      ).toString();
      const response = await getTenants(queryString);
      return response.data;
    },
  });

  const { mutate: restaurantMutate } = useMutation({
    mutationKey: ["tenant"],
    mutationFn: async (data: Tenant) => {
      await createTenant(data);
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
      form.resetFields();
      setDrawerOpen(false);
    },
  });
  const deboundedQUpdate = useMemo(() => {
    return debounce((value: string | undefined) => {
      setQueryParams((prev) => ({ ...prev, q: value, currentPage: 1 }));
    }, 500);
  }, []);

  if (loggedInUser?.role !== "admin") {
    return <Navigate to="/" replace={true} />;
  }

  const onFormSubmit = async () => {
    await form.validateFields();
    restaurantMutate(form.getFieldsValue());
  };

  const onFilterChange = async (changedFields: FieldData[]) => {
    // console.log("changedFileds from restaurants page -> ", changedFields);
    const changedFilterFields = changedFields
      .map((field) => {
        return { [field.name[0]]: field.value };
      })
      .reduce((acc, item) => ({ ...acc, ...item }), {});

    if ("q" in changedFilterFields) {
      deboundedQUpdate(changedFilterFields.q);
    } else {
      setQueryParams((prev) => ({
        ...prev,
        currentPage: 1,
        ...changedFilterFields,
      }));
    }
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
          <Form form={queryForm} onFieldsChange={onFilterChange}>
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
          </Form>
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
