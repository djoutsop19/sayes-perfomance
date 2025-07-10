import React, { useState, useEffect } from "react";
import { Card, Row, Col, Button, Typography, Switch, Modal, Form, Input, Select, message } from "antd";
import { EditOutlined, DeleteOutlined, UserOutlined, DollarOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../assets/sayes-performance-logo.jpg";
import "../index.css"; // Import global CSS

const { Title, Text } = Typography;
const { Option } = Select;

const EditClass = () => {
  const [lightMode, setLightMode] = useState(false);
  const [packages, setPackages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [form] = Form.useForm();
  const [isAdmin, setIsAdmin] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  const colors = {
    light: {
      background: "#f0f4f8",
      cardBg: "#ffffff",
      textPrimary: "#111827",
      textSecondary: "#6b7280",
    },
    dark: {
      background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
      cardBg: "#1f2937",
      textPrimary: "#e0e7ff",
      textSecondary: "#9ca3af",
    },
  };

  const theme = lightMode ? colors.light : colors.dark;

  useEffect(() => {
    // Configure Ant Design message globally
    message.config({
      duration: 5,
      maxCount: 1,
      top: 80,
      zIndex: 2000,
    });

    let mounted = true;

    const checkSession = async () => {
      try {
        console.log("Checking admin session...");
        const res = await fetch("/backend/fitness.php", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        const data = await res.json();
        console.log("Response from fitness.php:", data);
        if (mounted && data.success && data.admin) {
          setIsAdmin(true);
          fetchPackages();
        } else if (mounted) {
          console.log("Displaying unauthorized access error message");
          messageApi.error({
            content: data.message || "Access denied. Admin required.",
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
          navigate("/admin-login");
        }
      } catch (err) {
        console.error("Error checking session:", err);
        if (mounted) {
          console.log("Displaying network error message for session");
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
          navigate("/admin-login");
        }
      }
    };

    const fetchPackages = async () => {
      try {
        console.log("Fetching packages...");
        const res = await fetch("/backend/packages.php", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        const data = await res.json();
        console.log("Response from packages.php:", data);
        if (mounted && data.success) {
          setPackages(data.packages);
        } else if (mounted) {
          console.log("Displaying package retrieval error message");
          messageApi.error({
            content: data.message || "Error fetching packages",
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
          navigate("/admin-login");
        }
      } catch (err) {
        console.error("Error fetching packages:", err);
        if (mounted) {
          console.log("Displaying network error message for packages");
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
          navigate("/admin-login");
        }
      }
    };

    checkSession();

    return () => {
      mounted = false;
    };
  }, [navigate, messageApi]);

  const handleEdit = (pkg) => {
    if (!isAdmin) {
      console.log("Displaying unauthorized access error message for editing");
      messageApi.error({
        content: "Access denied. Admin required.",
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
    console.log("Editing package:", pkg);
    setEditingPackage(pkg);
    form.setFieldsValue({
      membership: pkg.membership_required ? "Yes" : "No",
      className: pkg.package_name,
      frequency: pkg.frequency,
      price: pkg.price_per_month,
      terms: pkg.binding_time,
      category: pkg.category,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!isAdmin) {
      console.log("Displaying unauthorized access error message for deletion");
      messageApi.error({
        content: "Access denied. Admin required.",
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
    console.log("Attempting to delete package ID:", id, typeof id);
    if (window.confirm("Are you sure you want to delete this package?")) {
      setDeletingId(id);
      try {
        console.log("Sending DELETE request for ID:", id);
        const res = await fetch("/backend/packages.php", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ id }),
        });
        const data = await res.json();
        console.log("Response from deletion:", data);
        if (data.success) {
          console.log("Displaying success message for package deletion");
          messageApi.success({
            content: data.message || "Package deleted successfully",
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
          setPackages(packages.filter((pkg) => pkg.id !== id));
          console.log("Packages after deletion:", packages.filter((pkg) => pkg.id !== id));
        } else {
          console.log("Displaying error message for package deletion");
          messageApi.error({
            content: data.message || "Error during deletion",
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
        console.error("Error deleting package:", err);
        console.log("Displaying network error message for package deletion");
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
      } finally {
        setDeletingId(null);
      }
    } else {
      console.log("Deletion canceled for ID:", id);
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      console.log("Modifying package:", values);
      const res = await fetch("/backend/packages.php", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          id: editingPackage.id,
          membership_required: values.membership === "Yes" ? 1 : 0,
          package_name: values.className,
          frequency: values.frequency,
          price_per_month: parseFloat(values.price),
          binding_time: values.terms,
          category: values.category,
        }),
      });
      const data = await res.json();
      console.log("Response from modification:", data);
      if (data.success) {
        console.log("Displaying success message for package modification");
        messageApi.success({
          content: data.message || "Package modified successfully",
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
        setPackages(
          packages.map((pkg) =>
            pkg.id === editingPackage.id
              ? {
                  ...pkg,
                  membership_required: values.membership === "Yes" ? 1 : 0,
                  package_name: values.className,
                  frequency: values.frequency,
                  price_per_month: parseFloat(values.price),
                  binding_time: values.terms,
                  category: values.category,
                }
              : pkg
          )
        );
        setIsModalOpen(false);
        form.resetFields();
      } else {
        console.log("Displaying error message for package modification");
        messageApi.error({
          content: data.message || "Error during modification",
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
      console.error("Error modifying package:", err);
      console.log("Displaying network error message for package modification");
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

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: theme.background,
        padding: "24px",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {contextHolder}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <img
            src={logo}
            alt="Logo"
            style={{ height: 50, borderRadius: 8, objectFit: "cover" }}
          />
          <Title level={2} style={{ margin: 0, color: theme.textPrimary }}>
            Edit Packages
          </Title>
        </div>
        <Switch
          checkedChildren="🌞"
          unCheckedChildren="🌙"
          onChange={() => setLightMode(!lightMode)}
          style={{
            backgroundColor: lightMode ? "#c21d56" : "#c21d56",
          }}
        />
      </motion.div>

      <Row gutter={[24, 24]} justify="center">
        {packages.map((pkg, index) => (
          <Col xs={24} sm={12} md={10} lg={8} key={pkg.id}>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: index * 0.15 }}
              whileHover={{ scale: 1.03, boxShadow: lightMode ? "0 12px 25px rgba(0,0,0,0.1)" : "0 12px 25px rgba(0,0,0,0.8)" }}
              style={{
                borderRadius: 16,
                background: theme.cardBg,
                padding: 24,
                boxShadow: lightMode ? "0 8px 20px rgba(0,0,0,0.1)" : "0 8px 20px rgba(0,0,0,0.8)",
              }}
            >
              <Title level={4} style={{ marginBottom: 16, color: theme.textPrimary }}>
                {pkg.package_name}
              </Title>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <Text style={{ color: theme.textSecondary, display: "flex", alignItems: "center", gap: 8 }}>
                  <UserOutlined /> {pkg.frequency}
                </Text>
                <Text style={{ color: theme.textSecondary, display: "flex", alignItems: "center", gap: 8 }}>
                  <DollarOutlined /> Price: {pkg.price_per_month} SEK /month
                </Text>
                <Text style={{ color: theme.textSecondary, display: "flex", alignItems: "center", gap: 8 }}>
                  <ClockCircleOutlined /> Binding Time: {pkg.binding_time}
                </Text>
                <Text style={{ color: theme.textSecondary, display: "flex", alignItems: "center", gap: 8 }}>
                  Category: {pkg.category}
                </Text>
                <Text style={{ color: theme.textSecondary, display: "flex", alignItems: "center", gap: 8 }}>
                  Membership Required: {pkg.membership_required ? "Yes" : "No"}
                </Text>
              </div>
              {isAdmin && (
                <div style={{ marginTop: 24, display: "flex", gap: 16, justifyContent: "center" }}>
                  <motion.div whileHover={{ scale: 1.1 }}>
                    <Button
                      icon={<EditOutlined />}
                      style={{
                        backgroundColor: "#c21d56",
                        borderColor: "#c21d56",
                        color: "#fff",
                        borderRadius: 8,
                      }}
                      onClick={() => handleEdit(pkg)}
                    >
                      Edit
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.1 }}>
                    <Button
                      danger
                      icon={<DeleteOutlined />}
                      style={{ borderRadius: 8 }}
                      onClick={() => handleDelete(pkg.id)}
                      loading={deletingId === pkg.id}
                    >
                      Delete
                    </Button>
                  </motion.div>
                </div>
              )}
            </motion.div>
          </Col>
        ))}
      </Row>

      <Modal
        title="Edit Package"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Save"
        cancelText="Cancel"
        okButtonProps={{ style: { backgroundColor: "#c21d56", borderColor: "#c21d56", borderRadius: 8 } }}
        cancelButtonProps={{ style: { borderRadius: 8 } }}
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        <Form
          layout="vertical"
          form={form}
          size="large"
          requiredMark={false}
        >
          <Form.Item
            label="Category"
            name="category"
            rules={[{ required: true, message: "Please select a category" }]}
          >
            <Select placeholder="Choose category" style={{ borderRadius: 8 }}>
              <Option value="Group Training">Group Training</Option>
              <Option value="Private">Private</Option>
              <Option value="Summer Camp">Summer Camp</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Frequency"
            name="frequency"
            rules={[{ required: true, message: "Please enter frequency" }]}
          >
            <Input placeholder="e.g. 1 Group Training/week" style={{ borderRadius: 8 }} />
          </Form.Item>
          <Form.Item
            label="Membership Required?"
            name="membership"
            rules={[{ required: true, message: "Please select membership status" }]}
          >
            <Select placeholder="Membership required?" style={{ borderRadius: 8 }}>
              <Option value="Yes">Yes</Option>
              <Option value="No">No</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Price per Month"
            name="price"
            rules={[{ required: true, message: "Please enter price" }]}
          >
            <Input type="number" step="0.01" placeholder="e.g. 990.00" addonAfter="SEK" style={{ borderRadius: 8 }} />
          </Form.Item>
          <Form.Item
            label="Binding Time"
            name="terms"
            rules={[{ required: true, message: "Please enter binding time" }]}
          >
            <Input placeholder="e.g. 3 months" style={{ borderRadius: 8 }} />
          </Form.Item>
          <Form.Item
            label="Package Name"
            name="className"
            rules={[{ required: true, message: "Please enter package name" }]}
          >
            <Input placeholder="e.g. Beginner Strength" style={{ borderRadius: 8 }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default EditClass;