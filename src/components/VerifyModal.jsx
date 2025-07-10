import React, { useState, useEffect } from "react";
import { Modal, Input, Button, message } from "antd";
import "../index.css"; // Import global CSS

export default function VerifyModal({ email, visible, onSuccess, onCancel }) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
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

  async function handleVerify() {
    setLoading(true);
    try {
      const res = await fetch("/backend/verify.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (data.success) {
        console.log("Displaying success message for code verification");
        messageApi.success({
          content: data.message || "Code verified successfully",
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
        onSuccess();
      } else {
        console.log("Displaying error message for code verification");
        messageApi.error({
          content: data.message || "Invalid code",
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
      console.error("Error verifying code:", err);
      console.log("Displaying network error message for code verification");
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
    setLoading(false);
  }

  return (
    <div>
      {contextHolder}
      <Modal
        title="Account Verification"
        open={visible}
        onCancel={onCancel}
        footer={[
          <Button key="cancel" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>,
          <Button key="verify" type="primary" loading={loading} onClick={handleVerify}>
            Verify
          </Button>,
        ]}
      >
        <p>Enter the code received by email:</p>
        <Input value={code} onChange={(e) => setCode(e.target.value)} maxLength={6} />
      </Modal>
    </div>
  );
}