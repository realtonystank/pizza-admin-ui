import { Breadcrumb, Card, Space, Table } from "antd";
import { RightOutlined } from "@ant-design/icons";
import React from "react";
import { NavLink } from "react-router-dom";
import RestaurantsFilter from "./RestaurantsFilter";

const dataSource = [
  {
    id: "1",
    name: "Mike",
    address: "10 Downing Street",
  },
  {
    id: "2",
    name: "John",
    address: "10 Downing Street",
  },
];

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
  return (
    <>
      <Space size={"middle"} direction="vertical" style={{ width: "100%" }}>
        <Breadcrumb
          separator={<RightOutlined />}
          items={[
            { title: <NavLink to="/">Dashboard</NavLink> },
            { title: "Restaurants" },
          ]}
        />
        <Card>
          <RestaurantsFilter />
        </Card>

        <Table dataSource={dataSource} columns={columns} rowKey={"id"} />
      </Space>
    </>
  );
};

export default Restaurants;
