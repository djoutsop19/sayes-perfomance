import React, { useState, useEffect } from "react";
import { Form, Input, Button, Typography, message, Switch } from "antd";
import { UserOutlined, MailOutlined, LockOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import logo from "../assets/sayes-performance-logo.jpg";
import "../index.css"; // Import global CSS

const { Title, Text } = Typography;

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const AdminRegister = () => {
  const [form] = Form.useForm();
  const [lightMode, setLightMode] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  useEffect(() => {
    // Configure Ant Design message globally
    message.config({
      duration: 5,
      maxCount: 1,
      top: 80,
      zIndex: 2000,
    });
  }, []);

  const onFinish = async (values) => {
    try {
      const res = await fetch("/backend/admin_register.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullname: values.fullname,
          email: values.email,
          password: values.password,
        }),
      });

      const data = await res.json();
      if (data.success) {
        console.log("Affichage message de succès inscription admin");
        messageApi.success({
          content: data.message || "Inscription admin réussie",
          style: {
            color: "#fff !important",
            backgroundColor: "#52c41a !important",
            borderRadius: "8px !important",
            padding: "12px !important",
            boxShadow: "0 4px 12px rgba(0,0,0,0.5) !important",
            border: "1px solid #fff !important",
            fontSize: "16px !important",
            fontWeight: "500 !important",
            lineHeight: "1.5 !important",
            textAlign: "center !important",
          },
        });
        form.resetFields();
        navigate("/admin-login");
      } else {
        console.log("Affichage message d'erreur inscription admin");
        messageApi.error({
          content: data.message || "Erreur lors de l'inscription admin",
          style: {
            color: "#fff !important",
            backgroundColor: "#c21d56 !important",
            borderRadius: "8px !important",
            padding: "12px !important",
            boxShadow: "0 4px 12px rgba(0,0,0,0.5) !important",
            border: "1px solid #fff !important",
            fontSize: "16px !important",
            fontWeight: "500 !important",
            lineHeight: "1.5 !important",
            textAlign: "center !important",
          },
        });
      }
    } catch (err) {
      console.error("Erreur réseau lors de l'inscription admin:", err);
      console.log("Affichage message d'erreur réseau inscription admin");
      messageApi.error({
        content: "Erreur réseau ou serveur",
        style: {
          color: "#fff !important",
          backgroundColor: "#c21d56 !important",
          borderRadius: "8px !important",
          padding: "12px !important",
          boxShadow: "0 4px 12px rgba(0,0,0,0.5) !important",
          border: "1px solid #fff !important",
          fontSize: "16px !important",
          fontWeight: "500 !important",
          lineHeight: "1.5 !important",
          textAlign: "center !important",
        },
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        minHeight: "100vh",
        backgroundColor: lightMode ? "#f9f9f9" : "#0e0e0e",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 16px",
      }}
    >
      {contextHolder}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.5 }}
        style={{
          width: "100%",
          maxWidth: 500,
          background: lightMode ? "#ffffff" : "#1a1a2e",
          borderRadius: 16,
          padding: "32px 40px",
          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            marginBottom: 32,
          }}
        >
          <motion.img
            src={logo}
            alt="Logo"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{ height: 70, borderRadius: 8, objectFit: "cover" }}
          />
          <div>
            <Title level={3} style={{ margin: 0, color: lightMode ? "#333" : "#fff" }}>
              Create Admin Account
            </Title>
            <Text style={{ color: lightMode ? "#555" : "#ccc" }}>
              Register as an administrator for Sayes Performance
            </Text>
          </div>
        </div>

        <Form
          layout="vertical"
          onFinish={onFinish}
          form={form}
          size="large"
          requiredMark={false}
        >
          <Form.Item
            label="Full Name"
            name="fullname"
            rules={[{ required: true, message: "Please enter your full name" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Your full name" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Your email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Your password" />
          </Form.Item>

          <Form.Item>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                style={{
                  backgroundColor: "#c21d56",
                  borderColor: "#c21d56",
                  padding: "12px 36px",
                  borderRadius: 30,
                  fontWeight: 600,
                  width: "100%",
                }}
              >
                Create Admin Account
              </Button>
            </motion.div>
          </Form.Item>

          <Form.Item>
            <Text style={{ color: lightMode ? "#555" : "#ccc" }}>
              Already have an account?{" "}
              <a href="/admin-login" style={{ color: "#c21d56" }}>
                Sign in
              </a>
            </Text>
          </Form.Item>
        </Form>

        <div style={{ textAlign: "center", marginTop: 16 }}>
          <Switch
            checkedChildren="Light"
            unCheckedChildren="Dark"
            onChange={() => setLightMode(!lightMode)}
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AdminRegister;