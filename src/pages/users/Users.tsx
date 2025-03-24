import {
  Breadcrumb,
  Button,
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
import { useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createUser, getUsers } from "../../http/api";
import { CreateUser, FieldData, User } from "../../types";
import { useAuthStore } from "../../../store";
import UsersFilter from "./UsersFilter";
import UserForm from "./forms/UserForm";
import { PER_PAGE } from "../../constants";
import { debounce } from "lodash";

const columns = [
  {
    title: "Id",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Name",
    dataIndex: "firstName",
    key: "firstName",
    render: (_text: string, record: User) => {
      return (
        <div>
          {record.firstName} {record.lastName}
        </div>
      );
    },
  },

  { title: "Email", dataIndex: "email", key: "email" },
  { title: "Role", dataIndex: "role", key: "role" },
  {
    title: "Restaurant",
    dataIndex: "tenant",
    key: "tenant",
    render: (_text: string, record: User) => {
      return <div>{record.tenant?.name}</div>;
    },
  },
];

const Users = () => {
  const [queryParams, setQueryParams] = useState({
    perPage: PER_PAGE,
    currentPage: 1,
  });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user: loggedInUser } = useAuthStore();
  const queryClient = useQueryClient();
  const {
    token: { colorBgLayout },
  } = theme.useToken();
  const [form] = Form.useForm();
  const [filterForm] = Form.useForm();
  if (loggedInUser?.role !== "admin") {
    <Navigate to="/" replace={true} />;
  }

  const {
    data: users,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ["users", queryParams],
    queryFn: async () => {
      const filteredParams = Object.fromEntries(
        Object.entries(queryParams).filter((item) => !!item[1])
      );

      const queryString = new URLSearchParams(
        filteredParams as unknown as Record<string, string>
      ).toString();

      const response = await getUsers(queryString);
      return response.data;
    },
    placeholderData: (previousData) => previousData,
  });

  const { mutate: userMutate } = useMutation({
    mutationKey: ["user"],
    mutationFn: async (data: CreateUser) => {
      await createUser(data);
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      form.resetFields();
      setDrawerOpen(false);
    },
  });

  const onHandleSubmit = async () => {
    await form.validateFields();
    userMutate(form.getFieldsValue());
  };
  const deboundedQUpdate = useMemo(() => {
    return debounce((value: string | undefined) => {
      setQueryParams((prev) => ({ ...prev, q: value, currentPage: 1 }));
    }, 500);
  }, []);

  const onFilterChange = async (changedFields: FieldData[]) => {
    const changedFilterFields = changedFields
      .map((item) => {
        return {
          [item.name[0]]: item.value,
        };
      })
      .reduce((acc, item) => ({ ...acc, ...item }), {});

    if ("q" in changedFilterFields) {
      deboundedQUpdate(changedFilterFields.q);
    } else {
      setQueryParams((prev) => ({
        ...prev,
        ...changedFilterFields,
        currentPage: 1,
      }));
    }
  };

  return (
    <>
      <Space style={{ width: "100%" }} direction="vertical" size={"middle"}>
        <Flex justify="space-between" style={{ minHeight: 24 }}>
          <Breadcrumb
            separator={<RightOutlined />}
            items={[
              { title: <Link to="/">Dashboard</Link> },
              { title: "User" },
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
            <Typography.Text type={"danger"}>{error.message}</Typography.Text>
          )}
        </Flex>
        <Form form={filterForm} onFieldsChange={onFilterChange}>
          <UsersFilter>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setDrawerOpen(true)}
            >
              Create User
            </Button>
          </UsersFilter>
        </Form>
        <Table
          columns={columns}
          dataSource={users?.data}
          rowKey={"id"}
          pagination={{
            total: users?.total,
            pageSize: queryParams.perPage,
            current: queryParams.currentPage,
            onChange: (page) => {
              setQueryParams((prev) => {
                return {
                  ...prev,
                  currentPage: page,
                };
              });
            },
          }}
        />
        <Drawer
          title="Create user"
          width={720}
          destroyOnClose={true}
          onClose={() => {
            form.resetFields();
            setDrawerOpen(false);
          }}
          open={drawerOpen}
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
              <Button type="primary" onClick={onHandleSubmit}>
                Submit
              </Button>
            </Space>
          }
        >
          <Form layout="vertical" form={form}>
            <UserForm />
          </Form>
        </Drawer>
      </Space>
    </>
  );
};

export default Users;
