import { useState } from "react";
import { Navigate, NavLink, Outlet, useLocation } from "react-router-dom";
import {
  Avatar,
  Badge,
  Dropdown,
  Flex,
  Layout,
  Menu,
  Space,
  theme,
} from "antd";

import Logo from "../components/icons/Logo";
import Icon, { BellFilled } from "@ant-design/icons";
import Home from "../components/icons/Home";
import UserIcon from "../components/icons/UserIcon";
import { foodIcon } from "../components/icons/FoodIcon";
import BasketIcon from "../components/icons/BasketIcon";
import GiftIcon from "../components/icons/GiftIcon";
import { useAuthStore } from "../../store";
import { useLogout } from "../hooks/useLogout";

const { Header, Content, Footer, Sider } = Layout;

const getMenuItems = (role: string) => {
  const baseItems = [
    {
      key: "/",
      icon: <Icon component={Home} />,
      label: <NavLink to="/">Home</NavLink>,
    },

    {
      key: "/products",
      icon: <Icon component={BasketIcon} />,
      label: <NavLink to="/products">Products</NavLink>,
    },
    {
      key: "/promos",
      icon: <Icon component={GiftIcon} />,
      label: <NavLink to="/promos">Promos</NavLink>,
    },
  ];

  if (role === "admin") {
    const menus = [...baseItems];
    menus.splice(1, 0, {
      key: "/users",
      icon: <Icon component={UserIcon} />,
      label: <NavLink to="/users">Users</NavLink>,
    });
    menus.splice(2, 0, {
      key: "/restaurants",
      icon: <Icon component={foodIcon} />,
      label: <NavLink to="/restaurants">Restaurants</NavLink>,
    });

    return menus;
  }
  return baseItems;
};

const Dashboard = () => {
  const location = useLocation();
  const { user } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const { logout } = useLogout();

  if (user === null) {
    return (
      <Navigate
        to={`/auth/login?returnTo=${location.pathname}`}
        replace={true}
      />
    );
  }

  const items = getMenuItems(user.role);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        theme="light"
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="logo">
          <Logo />
        </div>
        <Menu
          theme="light"
          defaultSelectedKeys={["/"]}
          selectedKeys={[location.pathname]}
          mode="inline"
          items={items}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            paddingLeft: "16px",
            paddingRight: "16px",
            background: colorBgContainer,
          }}
        >
          <Flex gap="middle" align="center" justify="space-between">
            <Badge
              text={
                user.role === "admin" ? "You are an admin" : user.tenant?.name
              }
              status="success"
            ></Badge>
            <Space size={16}>
              <Badge dot={true}>
                <BellFilled />
              </Badge>
              <Dropdown
                menu={{
                  items: [
                    {
                      key: "logout",
                      label: "Logout",
                      onClick: () => logout(),
                    },
                  ],
                }}
                placement="bottomRight"
              >
                <Avatar
                  style={{ backgroundColor: "#fde3cf", color: "#f56a00" }}
                >
                  U
                </Avatar>
              </Dropdown>
            </Space>
          </Flex>
        </Header>
        <Content style={{ margin: "24px" }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
            }}
          >
            <Outlet />
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>The pizza shop</Footer>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
