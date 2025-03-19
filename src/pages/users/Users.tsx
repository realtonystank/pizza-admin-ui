import { Breadcrumb } from "antd";
import { RightOutlined } from "@ant-design/icons";
import React from "react";
import { Link } from "react-router-dom";

const Users = () => {
  return (
    <>
      <Breadcrumb
        separator={<RightOutlined />}
        items={[{ title: <Link to="/">Dashboard</Link> }, { title: "User" }]}
      />
    </>
  );
};

export default Users;
