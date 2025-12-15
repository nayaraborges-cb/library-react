import { Layout, Menu } from "antd";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { UserOutlined, BookOutlined } from "@ant-design/icons";

const { Sider, Content } = Layout;

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider>
        <Menu
          theme="dark"
          selectedKeys={[location.pathname]}
          items={[
            { key: "/users", icon: <UserOutlined />, label: "Usuários", onClick: () => navigate("/users") },
            { key: "/books", icon: <BookOutlined />, label: "Livros", onClick: () => navigate("/books") },
          ]}
        />
      </Sider>
      <Content style={{ padding: 24 }}>
        <Outlet />
      </Content>
    </Layout>
  );
}

/* 
import React from "react";
import { Layout, Menu, Button, Dropdown, Avatar, Space } from "antd";
import {
  UserOutlined,
  BookOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";

const { Header, Sider, Content } = Layout;

export default function Dashboard({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = React.useState(false);

  const handleLogout = () => {
    logout();
    setLocation("/login");
  };

  const siderMenuItems = [
    {
      key: "/users",
      icon: <UserOutlined />,
      label: "Usuários",
      onClick: () => setLocation("/users"),
    },
    {
      key: "/books",
      icon: <BookOutlined />,
      label: "Livros",
      onClick: () => setLocation("/books"),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible collapsed={collapsed} trigger={null}>
        <Menu
          mode="inline"
          selectedKeys={[location]}
          items={siderMenuItems}
        />
      </Sider>

      <Layout>
        <Header style={{ background: "#fff", display: "flex", justifyContent: "space-between" }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
          />

          <Space>
            <Avatar icon={<UserOutlined />} />
            <span>{user?.username}</span>
            <Dropdown
              menu={{
                items: [
                  {
                    key: "logout",
                    icon: <LogoutOutlined />,
                    label: "Sair",
                    onClick: handleLogout,
                  },
                ],
              }}
            >
              <Button type="text">Menu</Button>
            </Dropdown>
          </Space>
        </Header>

        <Content style={{ margin: 24, padding: 24, background: "#fff" }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
} */