import React, { useState, useEffect } from "react";
import { Table, Typography, Image, message, Spin } from "antd";
import {
  UserOutlined,
  HomeOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import logo from "../assets/sayes-performance-logo.jpg";

const { Title } = Typography;

const columns = [
  {
    title: (
      <>
        <UserOutlined /> Full Name
      </>
    ),
    dataIndex: "fullname",
    key: "fullname",
  },
  {
    title: (
      <>
        <HomeOutlined /> Team
      </>
    ),
    dataIndex: "team",
    key: "team",
  },
  {
    title: (
      <>
        <CalendarOutlined /> Age
      </>
    ),
    dataIndex: "age",
    key: "age",
  },
  {
    title: (
      <>
        <EnvironmentOutlined /> District
      </>
    ),
    dataIndex: "district",
    key: "district",
  },
  {
    title: (
      <>
        <MailOutlined /> Email
      </>
    ),
    dataIndex: "email",
    key: "email",
  },
  {
    title: (
      <>
        <PhoneOutlined /> Phone
      </>
    ),
    dataIndex: "phone",
    key: "phone",
  },
];

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      try {
        console.log("Vérification de la session admin...");
        const res = await fetch("/backend/fitness.php", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        const data = await res.json();
        console.log("Réponse de fitness.php:", data);
        if (mounted && data.success && data.admin) {
          setIsAdmin(true);
          fetchUsers();
        } else if (mounted) {
          message.error(data.message || "Accès non autorisé. Administrateur requis.");
          navigate("/admin-login");
        }
      } catch (err) {
        console.error("Erreur lors de la vérification de la session:", err);
        if (mounted) {
          message.error("Erreur réseau ou serveur");
          navigate("/admin-login");
        }
      }
    };

    const fetchUsers = async () => {
      try {
        console.log("Récupération des utilisateurs...");
        const res = await fetch("/backend/users.php", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        const data = await res.json();
        console.log("Réponse de users.php:", data);
        if (mounted && data.success) {
          setUsers(
            data.users.map((user) => ({
              key: user.id,
              fullname: user.fullname,
              team: user.team,
              age: user.age,
              district: user.district,
              email: user.email,
              phone: user.phone,
            }))
          );
        } else if (mounted) {
          message.error(data.message || "Erreur lors de la récupération des utilisateurs");
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des utilisateurs:", err);
        if (mounted) {
          message.error("Erreur réseau ou serveur");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    checkSession();

    return () => {
      mounted = false;
    };
  }, [navigate]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0d1117",
        padding: "40px 20px",
        color: "#fff",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 30, flexWrap: "wrap" }}
      >
        <Image src={logo} preview={false} height={50} />
        <Title level={2} style={{ color: "#fff", margin: 0 }}>
          User Information
        </Title>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {loading ? (
          <div style={{ textAlign: "center", padding: "50px" }}>
            <Spin size="large" tip="Chargement des utilisateurs..." />
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={users}
            pagination={{ pageSize: 10 }}
            bordered
            style={{ background: "#fff", borderRadius: 8, overflow: "hidden" }}
            locale={{ emptyText: "Aucun utilisateur trouvé" }}
          />
        )}
      </motion.div>
    </div>
  );
};

export default UserPage;