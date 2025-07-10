import React, { useState, useEffect } from "react";
import { Input, Button, Card, Divider, message } from "antd";
import {
  LockOutlined,
  UserOutlined,
  GoogleOutlined,
  LoginOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import logo from "../assets/sayes-performance-logo.jpg";
import { auth, provider, signInWithPopup } from "../firebase";
import "../index.css"; // Import global CSS

const Login = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    // Configure Ant Design message globally
    message.config({
      duration: 5,
      maxCount: 1,
      top: 80,
      zIndex: 2000,
    });
  }, []);

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Envoyer les informations au backend
      const res = await fetch("/backend/google_login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          fullname: user.displayName,
        }),
      });

      const data = await res.json();
      if (data.success) {
        console.log("Affichage message de succès connexion Google");
        messageApi.success({
          content: `Bienvenue ${user.displayName}`,
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
        window.location.href = "/fitness";
      } else {
        console.log("Affichage message d'erreur connexion Google");
        messageApi.error({
          content: data.message || "Erreur lors de la connexion avec Google",
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
    } catch (error) {
      console.error("Erreur Google Login:", error);
      console.log("Affichage message d'erreur réseau Google");
      messageApi.error({
        content: "Erreur lors de la connexion avec Google",
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

  const handleLogin = async () => {
    if (!identifier || !password) {
      console.log("Affichage message d'avertissement champs obligatoires");
      messageApi.warning({
        content: "Tous les champs sont obligatoires.",
        style: {
          color: "#fff !important",
          backgroundColor: "#faad14 !important",
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
      return;
    }

    try {
      const res = await fetch("/backend/login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json();
      if (data.success) {
        console.log("Affichage message de succès connexion");
        messageApi.success({
          content: "Connexion réussie",
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
        console.log("Utilisateur connecté:", data.user);
        window.location.href = "/fitness";
      } else {
        console.log("Affichage message d'erreur connexion");
        messageApi.error({
          content: data.message || "Erreur lors de la connexion",
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
      console.error("Erreur lors de la connexion:", err);
      console.log("Affichage message d'erreur réseau connexion");
      messageApi.error({
        content: "Erreur serveur ou réseau",
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
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f4f4f7] to-white px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {contextHolder}
      <Card className="w-full max-w-md shadow-2xl rounded-2xl border p-6">
        <div className="text-center mb-6">
          <img src={logo} alt="Sayes Logo" className="h-16 w-16 mx-auto mb-2 rounded-full shadow-md" />
          <h2 className="text-2xl font-bold text-[#c21d56]">Welcome Back</h2>
          <p className="text-gray-500 text-sm">Access your Sayes Performance account</p>
        </div>

        <Button
          icon={<GoogleOutlined />}
          className="w-full mb-4 border border-gray-300 text-black hover:text-[#c21d56] hover:border-[#c21d56]"
          onClick={handleGoogleLogin}
        >
          Continue with Google
        </Button>

        <Divider className="text-xs text-gray-400">OR</Divider>

        <Input
          size="large"
          placeholder="Email ou Nom complet"
          prefix={<UserOutlined />}
          className="mb-4"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
        />
        <Input.Password
          size="large"
          placeholder="Password"
          prefix={<LockOutlined />}
          className="mb-6"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          type="primary"
          icon={<LoginOutlined />}
          className="w-full bg-[#c21d56] hover:bg-white hover:text-[#c21d56] border-[#c21d56]"
          onClick={handleLogin}
        >
          Login
        </Button>

        <p className="text-center text-sm text-gray-500 mt-4">
          Don’t have an account?{" "}
          <a href="/register" className="text-[#c21d56] font-semibold hover:underline">
            Register here
          </a>
        </p>
      </Card>
    </motion.div>
  );
};

export default Login;