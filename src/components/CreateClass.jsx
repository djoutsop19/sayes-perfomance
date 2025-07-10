import React, { useEffect } from "react";
import { Form, Input, Select, Button, Typography, Row, Col, message, Divider } from "antd";
import { PlusOutlined, DollarOutlined, ScheduleOutlined, UserSwitchOutlined, TagOutlined, FileTextOutlined, AppstoreOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import logo from "../assets/sayes-performance-logo.jpg";
import "../index.css"; // Import global CSS

const { Title, Text } = Typography;
const { Option } = Select;

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const CreateClass = () => {
  const [form] = Form.useForm();
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

  const onFinish = async (values) => {
    try {
      const res = await fetch("/backend/packages.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          membership_required: values.membership === "Yes" ? 1 : 0,
          package_name: values.className,
          frequency: values.frequency,
          price_per_month: parseFloat(values.price),
          binding_time: values.terms,
          category: values.category,
        }),
      });

      const data = await res.json();
      if (data.success) {
        console.log("Affichage message de succès création package");
        messageApi.success({
          content: data.message || "Package créé avec succès",
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
      } else {
        console.log("Affichage message d'erreur création package");
        messageApi.error({
          content: data.message || "Erreur lors de la création du package",
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
      console.error("Erreur réseau lors de la création du package:", err);
      console.log("Affichage message d'erreur réseau création package");
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
        backgroundColor: "#f9f9f9",
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
          maxWidth: 960,
          background: "#ffffff",
          borderRadius: 16,
          padding: "32px 40px",
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
            <Title level={3} style={{ margin: 0, color: "#333" }}>
              Create a Package
            </Title>
            <Text type="secondary">
              Fill in the details to add a new package
            </Text>
          </div>
        </div>

        <Divider />

        <Form
          layout="vertical"
          onFinish={onFinish}
          form={form}
          size="large"
          requiredMark={false}
        >
          <Row gutter={[24, 24]}>
            <Col xs={24} sm={12}>
              <Form.Item
                label={<><AppstoreOutlined /> Category</>}
                name="category"
                rules={[{ required: true, message: "Please select a category" }]}
              >
                <Select placeholder="Choose category">
                  <Option value="Group Training">Group Training</Option>
                  <Option value="Private">Private</Option>
                  <Option value="Summer Camp">Summer Camp</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                label={<><ScheduleOutlined /> Frequency</>}
                name="frequency"
                rules={[{ required: true, message: "Please enter frequency" }]}
              >
                <Input placeholder="e.g. 1 Group Training/week" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                label={<><UserSwitchOutlined /> Membership Required?</>}
                name="membership"
                rules={[{ required: true, message: "Please select membership status" }]}
              >
                <Select placeholder="Membership required?">
                  <Option value="Yes">Yes</Option>
                  <Option value="No">No</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                label={<><DollarOutlined /> Price per Month</>}
                name="price"
                rules={[{ required: true, message: "Please enter price" }]}
              >
                <Input type="number" step="0.01" placeholder="e.g. 990.00" addonAfter="$" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                label={<><FileTextOutlined /> Binding Time</>}
                name="terms"
                rules={[{ required: true, message: "Please enter binding time" }]}
              >
                <Input placeholder="e.g. 3 months" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                label={<><TagOutlined /> Package Name</>}
                name="className"
                rules={[{ required: true, message: "Please enter package name" }]}
              >
                <Input placeholder="e.g. Beginner Strength" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item style={{ textAlign: "center", marginTop: 24 }}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                type="primary"
                htmlType="submit"
                icon={<PlusOutlined />}
                size="large"
                style={{
                  backgroundColor: "#c21d56",
                  borderColor: "#c21d56",
                  padding: "12px 36px",
                  borderRadius: 30,
                  fontWeight: 600,
                  fontSize: 16,
                }}
              >
                Create Package
              </Button>
            </motion.div>
          </Form.Item>
        </Form>
      </motion.div>
    </motion.div>
  );
};

export default CreateClass;