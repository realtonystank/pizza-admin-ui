import { Breadcrumb, Card, Space } from "antd";
import { RightOutlined } from "@ant-design/icons";
import React from "react";
import { NavLink } from "react-router-dom";
import RestaurantsFilter from "./RestaurantsFilter";

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
      </Space>
    </>
  );
};

export default Restaurants;
