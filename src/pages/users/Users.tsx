import { Breadcrumb, Button, Drawer, Space, Table } from "antd";
import { PlusOutlined, RightOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../../http/api";
import { User } from "../../types";
import { useAuthStore } from "../../../store";
import UsersFilter from "./UsersFilter";

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
];

const Users = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user: loggedInUser } = useAuthStore();
  if (loggedInUser?.role !== "admin") {
    <Navigate to="/" replace={true} />;
  }

  const {
    data: users,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await getUsers();
      return response.data;
    },
  });

  return (
    <>
      <Space style={{ width: "100%" }} direction="vertical" size={"middle"}>
        <Breadcrumb
          separator={<RightOutlined />}
          items={[{ title: <Link to="/">Dashboard</Link> }, { title: "User" }]}
        />
        {isLoading && <div>Loading...</div>}
        {isError && <div>{error.message}</div>}
        <UsersFilter
          onFilterChange={(filterName: string, filterValue: string) => {
            console.log(filterName);
            console.log(filterValue);
          }}
        >
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setDrawerOpen(true)}
          >
            Create User
          </Button>
        </UsersFilter>
        <Table columns={columns} dataSource={users} rowKey={"id"} />
        <Drawer
          title="Create user"
          width={720}
          destroyOnClose={true}
          onClose={() => setDrawerOpen(false)}
          open={drawerOpen}
          extra={
            <Space>
              <Button>Cancel</Button>
              <Button type="primary">Submit</Button>
            </Space>
          }
        ></Drawer>
      </Space>
    </>
  );
};

export default Users;
