import React, { useState } from "react";
import { Button, Card, Switch, Modal } from "antd";
import { motion } from "framer-motion";
import {
  TeamOutlined,
  ThunderboltOutlined,
  TrophyOutlined,
  UserOutlined,
  BulbOutlined,
  RocketOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import logo from "../assets/sayes-performance-logo.jpg";
import gif from "../assets/KkGa.gif";
import PackagesPage from "./PackagesPage";

const packages = [
  {
    title: "Demo Package",
    price: "$99",
    icon: <ThunderboltOutlined className="text-[#ffdd57]" />,
    description: "Access to group training and performance dashboard.",
    actions: ["View Details", "Get More Info"],
  },
  {
    title: "New Package",
    price: "$100",
    icon: <RocketOutlined className="text-[#4ef5ff]" />,
    description: "Includes performance analytics and personalized sessions.",
    actions: ["View Details", "Get More Info"],
  },
];

const services = [
  {
    title: "Private Training",
    icon: <UserOutlined />,
    desc: "Personalized training plans for athletes",
  },
  {
    title: "Skill Development",
    icon: <ThunderboltOutlined />,
    desc: "Expert coaches for skill development",
  },
  {
    title: "Group Training",
    icon: <TeamOutlined />,
    desc: "Group workouts for team building",
  },
  {
    title: "Training Camps",
    icon: <TrophyOutlined />,
    desc: "Intensive training camps for performance",
  },
];

const LandingPage = () => {
  const [lightMode, setLightMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleRedirectToLogin = () => {
    navigate("/Fitness");
  };

  const handleViewDetails = () => {
    console.log("Opening modal with all packages");
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    console.log("Closing modal");
    setIsModalOpen(false);
  };

  return (
    <div
      className={`min-h-screen font-sans transition-colors duration-700 ${
        lightMode
          ? "bg-white text-gray-900"
          : "bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white"
      }`}
    >
      {/* Navbar */}
      <header
        className={`flex flex-col sm:flex-row justify-between items-center px-4 sm:px-6 py-3 sm:py-4 sticky top-0 z-50 backdrop-blur-md bg-opacity-80 ${
          lightMode
            ? "bg-white border-b border-gray-300 text-gray-900 shadow-sm"
            : "bg-black bg-opacity-50 border-b border-white/20 text-white shadow-lg"
        }`}
      >
        <img src={logo} alt="Sayes Logo" className="h-10 sm:h-12 rounded-full shadow-md mb-2 sm:mb-0" />
        <nav className="flex flex-wrap justify-center gap-4 sm:gap-8 text-base sm:text-sm font-semibold tracking-wide">
          {["Contact us", "What we offer", "LOGIN"].map((link, i) => (
            <a
              key={i}
              href={link === "LOGIN" ? "/login" : "#"}
              className={`relative group ${
                lightMode ? "text-gray-900" : "text-white"
              } transition-colors duration-300`}
              onClick={link === "LOGIN" ? handleRedirectToLogin : undefined}
            >
              {link}
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-pink-500 group-hover:w-full transition-all duration-300"></span>
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-0">
          <BulbOutlined className={`${lightMode ? "text-yellow-600" : "text-yellow-400"} text-xl sm:text-lg`} />
          <Switch
            checkedChildren="Light"
            unCheckedChildren="Dark"
            onChange={() => setLightMode(!lightMode)}
            size="small"
          />
        </div>
      </header>

      {/* Hero */}
      <section className="text-center py-12 sm:py-24 px-4 sm:px-6 max-w-5xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={`text-3xl sm:text-4xl md:text-6xl font-extrabold mb-4 sm:mb-6 tracking-tight ${
            lightMode ? "text-gray-900" : "text-cyan-400"
          }`}
        >
          TRAIN SMARTER, WIN BIGGER: YOUR ATHLETIC EDGE
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className={`text-base sm:text-lg md:text-xl max-w-3xl mx-auto mb-6 sm:mb-10 ${
            lightMode ? "text-gray-700" : "text-gray-300"
          }`}
        >
          Transform your athletic journey. Access premium training programs, track
          progress, connect with top coaches for unparalleled fitness success.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8"
        >
          <Button
            className="bg-cyan-400 text-black font-semibold px-6 sm:px-8 py-2 sm:py-3 rounded-full shadow-lg hover:bg-white hover:text-cyan-600 transition"
            size="large"
            type="primary"
            onClick={() => navigate("/PackagesPage")}
          >
            See Packages
          </Button>
          <Button
            className="bg-pink-600 text-white font-semibold px-6 sm:px-8 py-2 sm:py-3 rounded-full shadow-lg hover:bg-white hover:text-pink-600 transition"
            size="large"
            type="primary"
            onClick={handleRedirectToLogin}
          >
            Get More Info
          </Button>
        </motion.div>
      </section>

      {/* Latest Packages */}
      <section className="px-4 sm:px-6 py-10 sm:py-14 max-w-6xl mx-auto">
        <h2
          className={`text-center text-2xl sm:text-3xl font-bold tracking-widest mb-6 sm:mb-10 border-b pb-3 sm:pb-4 ${
            lightMode ? "text-gray-900 border-gray-300" : "text-white border-white/30"
          }`}
        >
          LATEST PACKAGES
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10">
          {packages.map((pack, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2, duration: 0.6 }}
            >
              <Card
                title={
                  <span
                    className={`text-xl sm:text-2xl font-bold ${
                      lightMode ? "text-gray-900" : "text-white"
                    }`}
                  >
                    {pack.title}
                  </span>
                }
                bordered={false}
                className={`rounded-2xl shadow-2xl hover:shadow-[0_15px_30px_-10px_rgba(255,65,108,0.5)] transition-shadow duration-400 ${
                  lightMode ? "bg-gray-100" : "bg-[#1a1a2e]"
                }`}
                extra={
                  <span className="text-xl sm:text-2xl font-extrabold text-cyan-400">
                    {pack.price}
                  </span>
                }
              >
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 mt-4 sm:mt-6">
                  {pack.actions.map((action, i) => (
                    <Button
                      key={i}
                      className={`px-4 sm:px-5 py-1.5 sm:py-2 rounded-full font-semibold shadow-md transition hover:shadow-lg text-xs sm:text-sm h-9 sm:h-auto ${
                        lightMode
                          ? "bg-gray-200 text-gray-900 hover:bg-cyan-400 hover:text-white"
                          : "bg-white/10 text-white hover:bg-cyan-400 hover:text-black"
                      }`}
                      onClick={
                        action === "View Details"
                          ? handleViewDetails
                          : action === "Get More Info"
                          ? handleRedirectToLogin
                          : undefined
                      }
                    >
                      {action}
                    </Button>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Modal for PackagesPage */}
      <Modal
        key={isModalOpen ? "modal-open" : "modal-closed"}
        open={isModalOpen}
        onOk={handleModalClose}
        onCancel={handleModalClose}
        footer={null}
        centered
        closable={true}
        maskClosable={true}
        destroyOnClose={true}
        width={window.innerWidth < 640 ? "100vw" : 900}
        style={{ top: window.innerWidth < 640 ? 20 : 20 }}
        bodyStyle={{
          padding: window.innerWidth < 640 ? "16px" : "24px",
          background: lightMode ? "#fff" : "#1a1a2e",
          color: lightMode ? "#1f2937" : "#fff",
          fontSize: window.innerWidth < 640 ? "16px" : "16px",
          margin: window.innerWidth < 640 ? "12px" : "12px",
          maxHeight: window.innerWidth < 640 ? "calc(100vh - 40px)" : "80vh",
          overflowY: "auto",
          overflowX: "hidden",
          boxSizing: "border-box",
          lineHeight: 1.7,
        }}
        className={`${lightMode ? "bg-white" : "bg-[#1a1a2e] text-white"} rounded-2xl shadow-xl [&_.ant-modal-close]:z-50 [&_.ant-modal-close]:p-4`}
        transitionName="ant-move-up"
        maskTransitionName="ant-fade"
        maskStyle={{ backgroundColor: lightMode ? "rgba(0, 0, 0, 0.5)" : "rgba(0, 0, 0, 0.7)" }}
      >
        <div className="max-w-full overflow-x-hidden flex flex-col gap-8 p-2 [&_button]:min-h-[48px] [&_button]:min-w-[120px]">
          <PackagesPage isModal={true} lightMode={lightMode} />
        </div>
      </Modal>

      {/* Training Services */}
      <section
        className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-10 px-4 sm:px-6 py-10 sm:py-16 max-w-6xl mx-auto text-center ${
          lightMode ? "bg-gray-50 text-gray-900" : "bg-[#12122e] text-white"
        } rounded-3xl shadow-lg`}
      >
        {services.map((service, idx) => (
          <motion.div
            key={idx}
            className={`p-6 sm:p-8 rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer ${
              lightMode ? "bg-white" : "bg-[#222249]"
            }`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.15 }}
          >
            <div className="text-3xl sm:text-4xl text-cyan-400 mb-3 sm:mb-4">{service.icon}</div>
            <h3 className="text-lg sm:text-xl font-bold mb-2">{service.title}</h3>
            <p className="text-sm sm:text-base text-gray-500">{service.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* Why Sayes Performance */}
      <section
        className={`px-4 sm:px-6 py-12 sm:py-20 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-16 items-center ${
          lightMode ? "bg-gray-100 text-gray-900" : "bg-[#0f0c29] text-white"
        } rounded-3xl shadow-xl`}
      >
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="rounded-xl overflow-hidden shadow-2xl max-w-full"
        >
          <img
            src={gif}
            alt="Athlete running"
            className="w-full h-auto object-cover rounded-xl max-h-64 sm:max-h-none"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-4 sm:mb-6 text-pink-500">Why Sayes Performance?</h2>
          <p className="mb-6 sm:mb-8 text-base sm:text-lg leading-relaxed max-w-xl">
            Sayes Performance offers elite coaching, advanced facilities, and tailored
            training to optimize performance, prevent injuries, and boost your athletic
            career.
          </p>
          <ul className="space-y-3 sm:space-y-4 max-w-xl">
            {[
              "Strength conditioning for peak performance",
              "Off-season training boot camps",
              "On-site endurance coaching for athletes",
            ].map((point, i) => (
              <li key={i} className="flex items-start gap-3 sm:gap-4 text-base sm:text-lg">
                <span className="text-cyan-400 font-bold">•</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 sm:mt-12">
            <Button
              className="bg-pink-500 text-white font-bold px-8 sm:px-10 py-2 sm:py-3 rounded-full shadow-lg hover:bg-white hover:text-pink-600 transition"
              size="large"
              onClick={handleRedirectToLogin}
            >
              Join Now & Get Started
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer
        className={`text-center py-6 sm:py-8 mt-10 sm:mt-20 ${
          lightMode
            ? "bg-white text-gray-600 border-t border-gray-300"
            : "bg-black text-gray-400 border-t border-gray-700"
        }`}
      >
        <img
          src={logo}
          alt="Logo"
          className="h-10 sm:h-12 mx-auto mb-3 sm:mb-4 rounded-full shadow-md"
        />
        <p className="text-xs sm:text-sm select-none">
          © {new Date().getFullYear()} Sayes Performance. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;