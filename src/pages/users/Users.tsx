import {
  Breadcrumb,
  Button,
  Drawer,
  Flex,
  Form,
  Popconfirm,
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
import { useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createUser, deleteUser, getUsers, updateUser } from "../../http/api";
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
  const [currentEditingUser, setCurrentEditingUser] = useState<User | null>(
    null
  );
  const { user: loggedInUser } = useAuthStore();
  const queryClient = useQueryClient();
  const {
    token: { colorBgLayout },
  } = theme.useToken();
  const [form] = Form.useForm();
  const [filterForm] = Form.useForm();

  useEffect(() => {
    if (form && currentEditingUser) {
      form.setFieldsValue({
        ...currentEditingUser,
        tenantId: currentEditingUser.tenant?.id,
      });
      setDrawerOpen(true);
    }
  }, [currentEditingUser, form]);

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
      setCurrentEditingUser(null);
    },
  });

  const { mutate: userUpdateMutate } = useMutation({
    mutationKey: ["user-patch"],
    mutationFn: async (data: CreateUser) => {
      await updateUser(data, currentEditingUser!.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      form.resetFields();
      setDrawerOpen(false);
      setCurrentEditingUser(null);
    },
  });

  const { mutate: userDeleteMutate } = useMutation({
    mutationKey: ["user-delete"],
    mutationFn: async (userId: string) => {
      await deleteUser(userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const onHandleSubmit = async () => {
    const isEditMode = !!currentEditingUser!;
    await form.validateFields();
    if (isEditMode) {
      userUpdateMutate(form.getFieldsValue());
    } else {
      userMutate(form.getFieldsValue());
    }
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

  const onHandleDelete = (userId: string) => {
    console.log(userId);
    userDeleteMutate(userId);
  };

  if (loggedInUser?.role !== "admin") {
    return <Navigate to="/" replace={true} />;
  }

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
          columns={[
            ...columns,
            {
              title: "Actions",
              align: "center",
              render: (_text: string, record: User) => {
                return (
                  <Space>
                    <Button
                      type="link"
                      onClick={() => {
                        setCurrentEditingUser(record);
                      }}
                    >
                      Edit
                    </Button>
                    <Popconfirm
                      title="Delete the task"
                      description="Are you sure to delete this record?"
                      onConfirm={() => onHandleDelete(record.id)}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button type={"link"} danger={true}>
                        Delete
                      </Button>
                    </Popconfirm>
                  </Space>
                );
              },
            },
          ]}
          dataSource={users?.data}
          rowKey={"id"}
          pagination={{
            showTotal: (total: number, range: number[]) => {
              return `Showing ${range[0]}-${range[1]} of ${total} items`;
            },
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
          title={currentEditingUser ? "Edit User" : "Create User"}
          width={720}
          destroyOnClose={true}
          onClose={() => {
            form.resetFields();
            setDrawerOpen(false);
            setCurrentEditingUser(null);
          }}
          open={drawerOpen}
          styles={{ body: { background: colorBgLayout } }}
          extra={
            <Space>
              <Button
                onClick={() => {
                  form.resetFields();
                  setDrawerOpen(false);
                  setCurrentEditingUser(null);
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
            <UserForm isEditMode={!!currentEditingUser} />
          </Form>
        </Drawer>
      </Space>
    </>
  );
};

export default Users;
