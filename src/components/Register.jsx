import React, { useState, useEffect } from "react";
import { Input, Button, Card, Divider, message, Modal } from "antd";
import {
  LockOutlined,
  UserOutlined,
  MailOutlined,
  GoogleOutlined,
  FormOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import logo from "../assets/sayes-performance-logo.jpg";
import { auth, provider, signInWithPopup } from "../firebase";
import "../index.css"; // Import global CSS

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [code1, setCode1] = useState("");
  const [code2, setCode2] = useState("");
  const [code3, setCode3] = useState("");
  const [currentEmail, setCurrentEmail] = useState("");
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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

  const handleGoogleRegister = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Send information to the backend
      const res = await fetch("/backend/google_register.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullname: user.displayName,
          email: user.email,
        }),
      });

      const data = await res.json();
      if (data.success) {
        console.log("Displaying success message for Google registration");
        messageApi.success({
          content: `Welcome ${user.displayName}`,
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
        setCurrentEmail(user.email);
        setIsPasswordModalVisible(true); // Show modal to set password
      } else {
        console.log("Displaying error message for Google registration");
        messageApi.error({
          content: data.message || "Error during Google registration",
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
      console.error("Google Register error:", error);
      console.log("Displaying network error message for Google");
      messageApi.error({
        content: "Error during Google registration",
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

  const handleRegister = async () => {
    if (!name || !email || password.length < 6) {
      console.log("Displaying warning message for required fields");
      messageApi.warning({
        content: "Fill all fields with a password of at least 6 characters",
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
      const res = await fetch("/backend/register.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullname: name, email, password }),
      });

      const data = await res.json();
      if (data.success) {
        console.log("Displaying success message for registration");
        messageApi.success({
          content: "Verification code sent",
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
        setCurrentEmail(email);
        setIsModalVisible(true);
      } else {
        console.log("Displaying error message for registration");
        messageApi.error({
          content: data.message || "Error during registration",
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
      console.error("Error during registration:", err);
      console.log("Displaying network error message for registration");
      messageApi.error({
        content: "Network or server error",
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

  const handleVerifyCode = async () => {
    const verificationCode = code1 + code2 + code3;
    if (!code1 || !code2 || !code3 || verificationCode.length !== 6) {
      console.log("Displaying error message for verification code");
      messageApi.error({
        content: "Please enter a 6-digit verification code",
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
      return;
    }

    try {
      const res = await fetch("/backend/verify_code.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: currentEmail, code: verificationCode }),
      });

      const data = await res.json();
      if (data.success) {
        console.log("Displaying success message for verification");
        messageApi.success({
          content: data.message || "Verification successful",
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
        setIsModalVisible(false);
        window.location.href = "/fitness";
      } else {
        console.log("Displaying error message for verification");
        messageApi.error({
          content: data.message || "Invalid verification code",
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
      console.error("Error during verification:", err);
      console.log("Displaying network error message for verification");
      messageApi.error({
        content: "Network or server error",
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

  const handleCodeChange = (value, setCode, nextInputId) => {
    if (value.length <= 2 && /^[0-9]*$/.test(value)) {
      setCode(value);
      if (value.length === 2 && nextInputId) {
        document.getElementById(nextInputId).focus();
      }
    }
  };

  const handleUpdatePassword = async () => {
    if (newPassword.length < 6) {
      console.log("Displaying error message for short password");
      messageApi.error({
        content: "The password must be at least 6 characters.",
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
      return;
    }
    if (newPassword !== confirmPassword) {
      console.log("Displaying error message for mismatched passwords");
      messageApi.error({
        content: "Passwords do not match.",
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
      return;
    }

    try {
      const res = await fetch("/backend/update_password.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: currentEmail, password: newPassword }),
      });

      const data = await res.json();
      if (data.success) {
        console.log("Displaying success message for password");
        messageApi.success({
          content: "Password set successfully.",
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
        setIsPasswordModalVisible(false);
        window.location.href = "/fitness";
      } else {
        console.log("Displaying error message for password");
        messageApi.error({
          content: data.message || "Error setting password",
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
      console.error("Error setting password:", err);
      console.log("Displaying network error message for password");
      messageApi.error({
        content: "Network or server error",
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
          <h2 className="text-2xl font-bold text-[#c21d56]">Create Your Account</h2>
          <p className="text-gray-500 text-sm">Join Sayes Performance</p>
        </div>

        <Button
          icon={<GoogleOutlined />}
          className="w-full mb-4 border border-gray-300 text-black hover:text-[#c21d56] hover:border-[#c21d56]"
          onClick={handleGoogleRegister}
        >
          Sign up with Google
        </Button>

        <Divider className="text-xs text-gray-400">OR</Divider>

        <Input
          size="large"
          placeholder="Full Name"
          prefix={<FormOutlined />}
          className="mb-4"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          size="large"
          placeholder="Email"
          prefix={<MailOutlined />}
          className="mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          icon={<UserOutlined />}
          className="w-full bg-[#c21d56] hover:bg-white hover:text-[#c21d56] border-[#c21d56]"
          onClick={handleRegister}
        >
          Register
        </Button>

        <p className="text-center text-sm text-gray-500 mt-4">
          Already registered?{" "}
          <a href="/login" className="text-[#c21d56] font-semibold hover:underline">
            Login here
          </a>
        </p>
      </Card>

      {/* Modal for verification code (classic registration) */}
      <Modal
        title={
          <div className="text-center">
            <h2 className="text-xl font-bold text-[#c21d56]">Email Verification</h2>
            <p className="text-gray-500 text-sm">Enter the code sent to {currentEmail}</p>
          </div>
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button
            key="cancel"
            className="border border-gray-300 text-black hover:text-[#c21d56] hover:border-[#c21d56]"
            onClick={() => setIsModalVisible(false)}
          >
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            className="bg-[#c21d56] hover:bg-white hover:text-[#c21d56] border-[#c21d56]"
            onClick={handleVerifyCode}
          >
            Verify
          </Button>,
        ]}
        className="rounded-2xl shadow-2xl"
        bodyStyle={{ padding: '24px' }}
      >
        <div className="flex justify-between mb-4">
          <Input
            size="large"
            placeholder="XX"
            prefix={<MailOutlined />}
            className="w-[30%]"
            value={code1}
            onChange={(e) => handleCodeChange(e.target.value, setCode1, "code2")}
            maxLength={2}
            id="code1"
          />
          <Input
            size="large"
            placeholder="XX"
            prefix={<MailOutlined />}
            className="w-[30%]"
            value={code2}
            onChange={(e) => handleCodeChange(e.target.value, setCode2, "code3")}
            maxLength={2}
            id="code2"
          />
          <Input
            size="large"
            placeholder="XX"
            prefix={<MailOutlined />}
            className="w-[30%]"
            value={code3}
            onChange={(e) => handleCodeChange(e.target.value, setCode3, null)}
            maxLength={2}
            id="code3"
          />
        </div>
      </Modal>

      {/* Modal to set password (Google registration) */}
      <Modal
        title={
          <div className="text-center">
            <h2 className="text-xl font-bold text-[#c21d56]">Set Your Password</h2>
            <p className="text-gray-500 text-sm">Please set a password to log in with your email.</p>
          </div>
        }
        open={isPasswordModalVisible}
        onCancel={() => {
          setIsPasswordModalVisible(false);
          window.location.href = "/fitness";
        }}
        footer={[
          <Button
            key="cancel"
            className="border border-gray-300 text-black hover:text-[#c21d56] hover:border-[#c21d56]"
            onClick={() => {
              setIsPasswordModalVisible(false);
              window.location.href = "/fitness";
            }}
          >
            Skip
          </Button>,
          <Button
            key="submit"
            type="primary"
            className="bg-[#c21d56] hover:bg-white hover:text-[#c21d56] border-[#c21d56]"
            onClick={handleUpdatePassword}
          >
            Set
          </Button>,
        ]}
        className="rounded-2xl shadow-2xl"
        bodyStyle={{ padding: '24px' }}
      >
        <Input.Password
          size="large"
          placeholder="New Password"
          prefix={<LockOutlined />}
          className="mb-4"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <Input.Password
          size="large"
          placeholder="Confirm Password"
          prefix={<LockOutlined />}
          className="mb-4"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </Modal>
    </motion.div>
  );
};

export default Register;