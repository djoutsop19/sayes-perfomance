import React, { useState, useEffect } from "react";
import {
  Layout,
  Input,
  Card,
  Typography,
  Menu,
  Avatar,
  Tooltip,
  Row,
  Col,
  Switch,
  message,
} from "antd";
import {
  UserOutlined,
  TeamOutlined,
  CalendarOutlined,
  BookOutlined,
  SearchOutlined,
  PlusCircleOutlined,
  EditOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import CreateClass from "./CreateClass";
import BookingsPage from "./BookingsPage";
import UserPage from "./UserPage";
import EditClass from "./EditClass";
import logo from "../assets/sayes-performance-logo.jpg";

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;
const { Search } = Input;

class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-screen bg-red-50">
          <h1 className="text-red-600 text-2xl font-bold">
            Oups... Une erreur est survenue. Veuillez réessayer plus tard.
          </h1>
        </div>
      );
    }
    return this.props.children;
  }
}

const AdminDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [lightMode, setLightMode] = useState(false);
  const [activePage, setActivePage] = useState("dashboard");
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  const colors = {
    light: {
      background: "#f0f4f8",
      sidebarBg: "#fff",
      sidebarText: "#1f2937",
      sidebarHoverBg: "#e0e7ff",
      headerBg: "rgba(255, 255, 255, 0.85)",
      cardBg: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
      cardShadow: "rgba(168, 237, 234, 0.4)",
      textPrimary: "#111827",
      iconPrimary: "#c21d56", // Changé pour correspondre à #c21d56
      switchBg: "#c21d56",
    },
    dark: {
      background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
      sidebarBg: "#1e293b",
      sidebarText: "#cbd5e1",
      sidebarHoverBg: "#334155",
      headerBg: "rgba(30, 41, 59, 0.9)",
      cardBg: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      cardShadow: "rgba(102, 126, 234, 0.5)",
      textPrimary: "#e0e7ff",
      iconPrimary: "#c21d56", // Changé pour correspondre à #c21d56
      switchBg: "#c21d56",
    },
  };

  const theme = lightMode ? colors.light : colors.dark;

  useEffect(() => {
    // Vérifier la session admin
    const checkSession = async () => {
      try {
        const res = await fetch("/backend/fitness.php", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        const data = await res.json();
        if (data.success && data.admin) {
          setIsAdmin(true);
        } else {
          message.error(data.message || "Accès non autorisé. Administrateur requis.");
          navigate("/admin-login");
        }
      } catch (err) {
        message.error("Erreur réseau ou serveur");
        navigate("/admin-login");
      }
    };

    checkSession();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const res = await fetch("/backend/logout.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        message.success(data.message);
        navigate("/admin-login");
      } else {
        message.error("Erreur lors de la déconnexion");
      }
    } catch (err) {
      message.error("Erreur réseau ou serveur");
      navigate("/admin-login");
    }
  };

  const cards = [
    {
      title: "Total Users",
      count: 20, // À remplacer par une requête API réelle
      icon: <UserOutlined style={{ fontSize: 40, color: theme.iconPrimary }} />,
      gradient: theme.cardBg,
      shadow: theme.cardShadow,
      countColor: theme.textPrimary,
    },
    {
      title: "Active Classes",
      count: 6, // À remplacer par une requête API réelle
      icon: <TeamOutlined style={{ fontSize: 40, color: theme.iconPrimary }} />,
      gradient: theme.cardBg,
      shadow: theme.cardShadow,
      countColor: theme.textPrimary,
    },
    {
      title: "Today's Bookings",
      count: 20, // À remplacer par une requête API réelle
      icon: <CalendarOutlined style={{ fontSize: 40, color: theme.iconPrimary }} />,
      gradient: theme.cardBg,
      shadow: theme.cardShadow,
      countColor: theme.textPrimary,
    },
    {
      title: "Total Bookings",
      count: 2000, // À remplacer par une requête API réelle
      icon: <BookOutlined style={{ fontSize: 40, color: theme.iconPrimary }} />,
      gradient: theme.cardBg,
      shadow: theme.cardShadow,
      countColor: theme.textPrimary,
    },
  ];

  const menuItems = [
    {
      key: "1",
      icon: <UserOutlined style={{ color: theme.iconPrimary, fontSize: 18 }} />,
      label: (
        <span
          onClick={() => setActivePage("UserPage")}
          style={{ cursor: "pointer" }}
        >
          Users
        </span>
      ),
    },
    {
      key: "sub1",
      icon: <TeamOutlined style={{ color: theme.iconPrimary, fontSize: 18 }} />,
      label: "Classes",
      children: [
        {
          key: "2",
          icon: <PlusCircleOutlined style={{ color: "#22c55e", fontSize: 18 }} />,
          label: (
            <span
              onClick={() => setActivePage("createClass")}
              style={{ cursor: "pointer" }}
            >
              Create Class
            </span>
          ),
        },
        {
          key: "3",
          icon: <EditOutlined style={{ color: "#facc15", fontSize: 18 }} />,
          label: (
            <span
              onClick={() => setActivePage("EditClass")}
              style={{ cursor: "pointer" }}
            >
              Edit Class
            </span>
          ),
        },
      ],
    },
    {
      key: "4",
      icon: <CalendarOutlined style={{ color: theme.iconPrimary, fontSize: 18 }} />,
      label: (
        <span
          onClick={() => setActivePage("BookingsPage")}
          style={{ cursor: "pointer" }}
        >
          Bookings
        </span>
      ),
    },
    {
      key: "5",
      icon: <LogoutOutlined style={{ color: "#ef4444", fontSize: 18 }} />,
      label: (
        <span
          onClick={handleLogout}
          style={{ cursor: "pointer" }}
        >
          Log Out
        </span>
      ),
    },
  ];

  return (
    <ErrorBoundary>
      <Layout
        style={{
          minHeight: "100vh",
          background: theme.background,
          fontFamily: "'Inter', sans-serif",
          transition: "background 0.6s ease",
        }}
      >
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          width={240}
          style={{
            background: theme.sidebarBg,
            color: theme.sidebarText,
            height: "100vh",
            position: "fixed",
            left: 0,
            top: 0,
            bottom: 0,
            overflow: "auto",
            boxShadow: "2px 0 10px rgba(0,0,0,0.1)",
            transition: "all 0.3s ease",
            zIndex: 20,
          }}
        >
          <div
            className="flex items-center justify-center py-6"
            style={{ userSelect: "none" }}
          >
            {!collapsed && (
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <img
                  src={logo}
                  alt="Logo"
                  style={{ height: 40, borderRadius: 8, objectFit: "cover" }}
                />
                <Title
                  level={3}
                  style={{
                    color: theme.iconPrimary,
                    margin: 0,
                    fontWeight: "bold",
                    letterSpacing: 2,
                  }}
                >
                  ADMIN PANEL
                </Title>
              </div>
            )}
          </div>
          <Menu
            mode="inline"
            selectedKeys={[activePage]}
            style={{
              background: theme.sidebarBg,
              color: theme.sidebarText,
              borderRight: "none",
              fontSize: 16,
            }}
            inlineIndent={20}
            theme={lightMode ? "light" : "dark"}
            items={menuItems}
          />
        </Sider>

        <Layout
          style={{
            marginLeft: collapsed ? 80 : 240,
            transition: "margin-left 0.3s ease",
            background: theme.background,
            minHeight: "100vh",
            paddingBottom: 40,
          }}
        >
          <Header
            style={{
              background: theme.headerBg,
              padding: "0 24px",
              height: 72,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: `1px solid ${lightMode ? "#e0e7ff" : "#334155"}`,
              backdropFilter: "blur(10px)",
              position: "sticky",
              top: 0,
              zIndex: 30,
              transition: "background-color 0.5s ease",
              boxShadow: lightMode
                ? "0 2px 8px rgb(59 130 246 / 0.1)"
                : "0 2px 10px rgb(168 221 255 / 0.2)",
              borderRadius: "0 0 20px 20px",
            }}
          >
            <Search
              placeholder="Search admin panel..."
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              style={{
                width: 320,
                borderRadius: 12,
                boxShadow: lightMode
                  ? "0 4px 10px rgba(59,130,246,0.15)"
                  : "0 0 20px rgba(168,221,255,0.5)",
                transition: "box-shadow 0.4s ease",
              }}
              onSearch={(val) => console.log("Search:", val)}
            />

            <div className="flex items-center gap-6">
              <Title
                level={4}
                style={{
                  margin: 0,
                  fontWeight: 700,
                  color: theme.textPrimary,
                  userSelect: "none",
                }}
              >
                {activePage === "dashboard" && "Overview"}
                {activePage === "createClass" && "Create Class"}
                {activePage === "EditClass" && "Edit Class"}
                {activePage === "UserPage" && "Users"}
                {activePage === "BookingsPage" && "Bookings"}
              </Title>
              <Tooltip title="Admin Profile">
                <Avatar
                  size={44}
                  icon={<UserOutlined />}
                  style={{
                    backgroundColor: theme.iconPrimary,
                    cursor: "default",
                    boxShadow: lightMode
                      ? "0 0 10px rgba(59,130,246,0.4)"
                      : "0 0 20px rgba(168,221,255,0.7)",
                    transition: "box-shadow 0.4s ease",
                  }}
                />
              </Tooltip>

              <Switch
                checked={lightMode}
                onChange={() => setLightMode(!lightMode)}
                checkedChildren="🌞"
                unCheckedChildren="🌙"
                style={{
                  backgroundColor: theme.switchBg,
                  boxShadow: "0 0 5px 1px rgba(0,0,0,0.1)",
                }}
              />
            </div>
          </Header>

          <Content
            style={{
              margin: 24,
              padding: 24,
              background: lightMode ? "#ffffff" : "#1f2937",
              borderRadius: 20,
              minHeight: 360,
              transition: "background-color 0.5s ease",
              boxShadow: lightMode
                ? "0 15px 40px rgba(0,0,0,0.1)"
                : "0 15px 40px rgba(0,0,0,0.8)",
            }}
          >
            {isAdmin && activePage === "dashboard" && (
              <Row gutter={[24, 24]}>
                {cards.map((card, idx) => (
                  <Col xs={24} sm={12} lg={12} xl={6} key={idx}>
                    <motion.div
                      initial={{ opacity: 0, y: 30, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.7, delay: idx * 0.15 }}
                      whileHover={{ scale: 1.06, boxShadow: `0 20px 40px ${card.shadow}` }}
                      style={{
                        borderRadius: 20,
                        background: card.gradient,
                        boxShadow: `0 8px 25px ${card.shadow}`,
                        padding: "28px 0",
                        cursor: "default",
                        userSelect: "none",
                      }}
                    >
                      <div className="flex flex-col items-center justify-center px-8">
                        <Text
                          strong
                          style={{
                            fontSize: 20,
                            color: card.countColor,
                            marginBottom: 8,
                          }}
                        >
                          {card.title}
                        </Text>
                        <div
                          style={{
                            fontSize: 48,
                            fontWeight: "900",
                            color: card.countColor,
                            userSelect: "none",
                            marginBottom: 12,
                          }}
                        >
                          {card.count}
                        </div>
                        {card.icon}
                      </div>
                    </motion.div>
                  </Col>
                ))}
              </Row>
            )}
            {isAdmin && activePage === "createClass" && <CreateClass />}
            {isAdmin && activePage === "EditClass" && <EditClass />}
            {isAdmin && activePage === "BookingsPage" && <BookingsPage />}
            {isAdmin && activePage === "UserPage" && <UserPage />}
          </Content>
        </Layout>
      </Layout>
    </ErrorBoundary>
  );
};

export default AdminDashboard;