import React, { useState, useEffect } from "react";
import { Button, Input, Modal, Upload, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { UserOutlined, HeartOutlined, CalendarOutlined, TeamOutlined, PlusOutlined, EditOutlined, UploadOutlined } from "@ant-design/icons";
import logo from "../assets/sayes-performance-logo.jpg";
import { motion } from "framer-motion";
import "../index.css"; // Import global CSS

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const Fitness = () => {
  const [user, setUser] = useState(null);
  const [groupTrainingPackages, setGroupTrainingPackages] = useState([]);
  const [privateTrainingPackages, setPrivateTrainingPackages] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [formData, setFormData] = useState({ fullname: "", email: "", avatar: null });
  const [contactFormData, setContactFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

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
        console.log("Checking session...");
        const res = await fetch("/backend/fitness.php", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        const data = await res.json();
        console.log("Response from fitness.php:", data);
        if (mounted && data.success) {
          setUser(data.admin || data.user);
          setFormData({ fullname: data.user?.fullname || "", email: data.user?.email || "", avatar: null });
        }
      } catch (err) {
        console.error("Error checking session:", err);
      }
    };

    const fetchPackages = async () => {
      try {
        console.log("Fetching packages...");
        const groupRes = await fetch("/backend/packages.php?category=Group Training", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const groupData = await groupRes.json();
        console.log("Response from packages.php (Group):", groupData);
        if (mounted && groupData.success) {
          setGroupTrainingPackages(groupData.packages);
        } else if (mounted) {
          console.log("Displaying group package error message");
          messageApi.error({
            content: groupData.message || "Error fetching group packages",
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

        const privateRes = await fetch("/backend/packages.php?category=Private", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const privateData = await privateRes.json();
        console.log("Response from packages.php (Private):", privateData);
        if (mounted && privateData.success) {
          setPrivateTrainingPackages(privateData.packages);
        } else if (mounted) {
          console.log("Displaying private package error message");
          messageApi.error({
            content: privateData.message || "Error fetching private packages",
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
        console.error("Error fetching packages:", err);
        if (mounted) {
          console.log("Displaying network error message");
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
      }
    };

    checkSession();
    fetchPackages();

    return () => {
      mounted = false;
    };
  }, [messageApi]);

  const handleLogout = async () => {
    try {
      console.log("Logging out...");
      const res = await fetch("/backend/logout.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await res.json();
      console.log("Response from logout.php:", data);
      if (data.success) {
        console.log("Displaying logout success message");
        messageApi.success({
          content: data.message,
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
        setUser(null);
        navigate("/login");
      } else {
        console.log("Displaying logout error message");
        messageApi.error({
          content: data.message || "Error logging out",
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
      console.error("Error logging out:", err);
      console.log("Displaying network error message for logout");
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
      navigate("/login");
    }
  };

  const showMembershipModal = (pkg, type) => {
    if (!user) {
      console.log("Displaying login info message");
      messageApi.info({
        content: "Please log in to subscribe to a membership.",
        style: {
          color: "#fff !important",
          backgroundColor: "#1890ff !important",
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
      navigate("/login");
      return;
    }
    setSelectedPackage({ ...pkg, package_type: type });
    setIsModalVisible(true);
  };

  const handleModalOk = async () => {
    if (!user) {
      console.log("Displaying login info message in modal");
      messageApi.info({
        content: "Please log in to subscribe to a membership.",
        style: {
          color: "#fff !important",
          backgroundColor: "#1890ff !important",
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
      navigate("/login");
      return;
    }
    if (!formData.fullname || !formData.email) {
      console.log("Displaying required fields error message");
      messageApi.error({
        content: "Please fill in all required fields.",
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
      console.log("Sending membership data:", { ...formData, package: selectedPackage });
      const formDataToSend = new FormData();
      formDataToSend.append("fullname", formData.fullname);
      formDataToSend.append("email", formData.email);
      if (formData.avatar) {
        formDataToSend.append("avatar", formData.avatar);
      }
      formDataToSend.append("package_id", selectedPackage.id);
      formDataToSend.append("package_name", selectedPackage.package_name);
      formDataToSend.append("package_type", selectedPackage.package_type);
      formDataToSend.append("price_per_month", selectedPackage.price_per_month);
      formDataToSend.append("binding_time", selectedPackage.binding_time);

      const res = await fetch("/backend/membership.php", {
        method: "POST",
        body: formDataToSend,
        credentials: "include",
      });
      const data = await res.json();
      console.log("Response from membership.php:", data);
      if (data.success) {
        console.log("Displaying membership success message");
        messageApi.success({
          content: data.message || "Membership subscription successful!",
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
        setFormData({ fullname: user?.fullname || "", email: user?.email || "", avatar: null });
      } else {
        console.log("Displaying membership error message");
        messageApi.error({
          content: data.message || "Error subscribing to membership",
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
      console.error("Error subscribing:", err);
      console.log("Displaying network error message for membership");
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

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setFormData({ fullname: user?.fullname || "", email: user?.email || "", avatar: null });
  };

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleContactFormChange = (field, value) => {
    setContactFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleContactSubmit = async () => {
    if (!contactFormData.name || !contactFormData.email || !contactFormData.message) {
      console.log("Validation failed: Missing fields");
      console.log("Displaying required fields error message for contact");
      messageApi.error({
        content: "Please fill in all required fields.",
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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactFormData.email)) {
      console.log("Validation failed: Invalid email");
      console.log("Displaying invalid email error message");
      messageApi.error({
        content: "Please enter a valid email address.",
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

    setLoading(true);
    try {
      console.log("Sending contact form:", contactFormData);
      const res = await fetch("/backend/contact.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactFormData),
      });
      const text = await res.text();
      console.log("Raw response from contact.php:", text);
      try {
        const data = JSON.parse(text);
        console.log("Response from contact.php:", data);
        if (data.success) {
          console.log("Displaying contact success message:", data.message);
          messageApi.success({
            content: data.message || "Message sent successfully!",
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
          setContactFormData({ name: "", email: "", message: "" });
        } else {
          console.log("Displaying contact error message:", data.message);
          messageApi.error({
            content: data.message || "Error sending message",
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
      } catch (jsonError) {
        console.error("JSON parsing error:", jsonError, "Raw response:", text);
        console.log("Displaying JSON error message");
        messageApi.error({
          content: "Server error: Invalid JSON response",
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
      console.error("Error sending form:", err);
      console.log("Displaying network error message for contact");
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
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white font-sans">
      {contextHolder}
      {/* Header */}
      <header className="bg-black text-white sticky top-0 z-50 px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row justify-between items-center shadow-md border-b-2 border-[#c21d56]">
        <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-0">
          <img src={logo} alt="Sayes Logo" className="h-10 sm:h-12 w-10 sm:w-12 rounded-full" />
          <span className="text-base sm:text-lg font-bold">Sayes Performance</span>
        </div>
        <nav className="flex flex-wrap justify-center gap-3 sm:gap-6 text-base sm:text-sm font-medium">
          {user ? (
            <>
              <Link to="/me" className="hover:text-[#ff416c] transition">
                <UserOutlined /> Me
              </Link>
              <Link to="/LandingPage" className="hover:text-[#ff416c] transition">
                <HeartOutlined /> Home
              </Link>
              <Link to="/reservations" className="hover:text-[#ff416c] transition">
                <CalendarOutlined /> Reservations
              </Link>
              <Link to="/players" className="hover:text-[#ff416c] transition">
                <TeamOutlined /> Players
              </Link>
              {user?.is_admin && (
                <Link to="/admin-dashboard" className="hover:text-[#ff416c] transition">
                  <EditOutlined /> Admin Dashboard
                </Link>
              )}
            </>
          ) : (
            <Link to="/login" className="hover:text-[#ff416c] transition">
              Login
            </Link>
          )}
        </nav>
        {user && (
          <button
            className="text-xs sm:text-sm bg-[#ff416c] text-white px-3 sm:px-4 py-1.5 sm:py-1 rounded-full hover:bg-white hover:text-black transition mt-2 sm:mt-0"
            onClick={handleLogout}
          >
            Logout
          </button>
        )}
      </header>

      {/* Hero */}
      <section className="text-center py-10 sm:py-14 px-4 sm:px-6 bg-[#1a1a1a]">
        <motion.h1
          initial="hidden"
          whileInView="show"
          variants={fadeUp}
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-3 sm:mb-4"
        >
          Unlock Your Peak Performance
        </motion.h1>
        <motion.p
          initial="hidden"
          whileInView="show"
          variants={fadeUp}
          className="text-gray-300 text-base sm:text-lg max-w-xl sm:max-w-2xl mx-auto"
        >
          Join our elite training programs designed to transform your body and mind.
        </motion.p>
        <motion.div
          initial="hidden"
          whileInView="show"
          variants={fadeUp}
          className="mt-4 sm:mt-6"
        >
          <Button
            className="bg-[#c21d56] text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-full hover:bg-white hover:text-black transition text-xs sm:text-base"
            onClick={() => navigate("/login")}
          >
            Start Now
          </Button>
        </motion.div>
      </section>

      {/* Main Content */}
      <main className="px-4 sm:px-6 md:px-16 py-8 sm:py-12 space-y-12 sm:space-y-20">
        {/* Group Training */}
        <section>
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-10">Group Training</h2>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            {groupTrainingPackages.length > 0 ? (
              groupTrainingPackages.map((pkg, index) => (
                <motion.div
                  key={index}
                  initial="hidden"
                  whileInView="show"
                  variants={fadeUp}
                  viewport={{ once: true }}
                  className="bg-white text-black w-full max-w-[300px] sm:max-w-[260px] rounded-2xl overflow-hidden shadow-xl hover:scale-105 transition duration-300"
                >
                  <div className="bg-[#c21d56] py-2 sm:py-3 px-4 text-white font-bold text-center text-sm sm:text-base">
                    MEMBERSHIP
                  </div>
                  <div className="p-4 sm:p-5 space-y-2 text-xs sm:text-sm">
                    <h3 className="text-base sm:text-lg font-semibold">{pkg.package_name}</h3>
                    <ul className="space-y-1">
                      <li>{pkg.frequency}</li>
                      <li className="font-bold">Price: {pkg.price_per_month} SEK /month</li>
                      <li className="font-bold">Binding Time: {pkg.binding_time}</li>
                    </ul>
                    <Button
                      className="w-full mt-2 sm:mt-3 bg-[#f5f5f5] hover:bg-[#c21d56] hover:text-white transition text-xs sm:text-sm h-9 sm:h-auto"
                      onClick={() => showMembershipModal(pkg, "Group Training")}
                    >
                      Become a member
                    </Button>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-gray-400 text-center text-sm sm:text-base">No group packages available.</p>
            )}
          </div>
        </section>

        {/* Private Training */}
        <section>
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-10">Private Training</h2>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            {privateTrainingPackages.length > 0 ? (
              privateTrainingPackages.map((pkg, index) => (
                <motion.div
                  key={index}
                  initial="hidden"
                  whileInView="show"
                  variants={fadeUp}
                  viewport={{ once: true }}
                  className="bg-white text-black w-full max-w-[300px] sm:max-w-[260px] rounded-2xl overflow-hidden shadow-xl hover:scale-105 transition duration-300"
                >
                  <div className="bg-[#c21d56] py-2 sm:py-3 px-4 text-white font-bold text-center text-sm sm:text-base">
                    MEMBERSHIP
                  </div>
                  <div className="p-4 sm:p-5 space-y-2 text-xs sm:text-sm">
                    <h3 className="text-base sm:text-lg font-semibold">{pkg.package_name}</h3>
                    <ul className="space-y-1">
                      <li>{pkg.frequency}</li>
                      <li className="font-bold">Price: {pkg.price_per_month} SEK /month</li>
                      <li className="font-bold">Binding Time: {pkg.binding_time}</li>
                    </ul>
                    <Button
                      className="w-full mt-2 sm:mt-3 bg-[#f5f5f5] hover:bg-[#c21d56] hover:text-white transition text-xs sm:text-sm h-9 sm:h-auto"
                      onClick={() => showMembershipModal(pkg, "Private")}
                    >
                      Become a member
                    </Button>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-gray-400 text-center text-sm sm:text-base">No private packages available.</p>
            )}
          </div>
        </section>

        {/* Contact Form */}
        <section className="max-w-md sm:max-w-xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6">Contact Us</h2>
          <form className="space-y-3 sm:space-y-4 bg-[#1c1c1c] p-4 sm:p-6 rounded-xl shadow-md">
            <div>
              <label className="block text-xs sm:text-sm mb-1">Name</label>
              <Input
                placeholder="Your Name"
                value={contactFormData.name}
                onChange={(e) => handleContactFormChange("name", e.target.value)}
                className="bg-[#f1f1f1] text-black text-xs sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm mb-1">Email</label>
              <Input
                placeholder="Your Email"
                value={contactFormData.email}
                onChange={(e) => handleContactFormChange("email", e.target.value)}
                className="bg-[#f1f1f1] text-black text-xs sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm mb-1">Message</label>
              <Input.TextArea
                rows={4}
                placeholder="Your message..."
                value={contactFormData.message}
                onChange={(e) => handleContactFormChange("message", e.target.value)}
                className="bg-[#f1f1f1] text-black text-xs sm:text-sm"
              />
            </div>
            <Button
              type="primary"
              className="bg-[#c21d56] text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-full hover:bg-white hover:text-black transition text-xs sm:text-base"
              onClick={handleContactSubmit}
              loading={loading}
            >
              Send
            </Button>
          </form>
        </section>
      </main>

      {/* Modal */}
      <Modal
        title="Become a Member"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Confirm Membership"
        cancelText="Cancel"
        okButtonProps={{ className: "bg-[#c21d56] hover:bg-white hover:text-black transition text-xs sm:text-sm" }}
        cancelButtonProps={{ className: "text-xs sm:text-sm" }}
        width={window.innerWidth < 640 ? "100vw" : 520}
        style={{ top: window.innerWidth < 640 ? 0 : 20 }}
        styles={{
          body: {
            padding: window.innerWidth < 640 ? "12px" : "24px",
            maxHeight: window.innerWidth < 640 ? "100vh" : "80vh",
            overflowY: "auto",
          },
        }}
      >
        <div className="space-y-3 sm:space-y-4">
          <div>
            <label className="block text-xs sm:text-sm mb-1">Full Name *</label>
            <Input
              placeholder="Your Full Name"
              value={formData.fullname}
              onChange={(e) => handleFormChange("fullname", e.target.value)}
              className="text-xs sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm mb-1">Email *</label>
            <Input
              placeholder="Your Email"
              value={formData.email}
              onChange={(e) => handleFormChange("email", e.target.value)}
              className="text-xs sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm mb-1">Avatar (optional)</label>
            <Upload
              beforeUpload={(file) => {
                setFormData((prev) => ({ ...prev, avatar: file }));
                return false;
              }}
              accept="image/*"
              showUploadList={false}
            >
              <Button
                icon={<UploadOutlined />}
                className="text-xs sm:text-sm"
              >
                Upload Avatar
              </Button>
            </Upload>
            {formData.avatar && <p className="text-xs sm:text-sm mt-1">Selected: {formData.avatar.name}</p>}
          </div>
          {selectedPackage && (
            <div>
              <h3 className="font-semibold text-sm sm:text-base">Selected Package</h3>
              <p className="text-xs sm:text-sm">Name: {selectedPackage.package_name}</p>
              <p className="text-xs sm:text-sm">Type: {selectedPackage.package_type}</p>
              <p className="text-xs sm:text-sm">Price: {selectedPackage.price_per_month} SEK /month</p>
              <p className="text-xs sm:text-sm">Binding Time: {selectedPackage.binding_time}</p>
            </div>
          )}
        </div>
      </Modal>

      {/* Footer */}
      <footer className="bg-black text-center text-gray-400 py-4 sm:py-6 mt-8 sm:mt-16 border-t border-[#222]">
        <img src={logo} alt="Logo" className="h-10 sm:h-12 mx-auto mb-2 sm:mb-2 rounded-full" />
        <p className="text-xs sm:text-sm">© {new Date().getFullYear()} Sayes Performance. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Fitness;