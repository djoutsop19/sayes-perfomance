import React, { useState, useEffect } from "react";
import { Input, Select, Button, Upload, Switch, Tooltip, message } from "antd";
import {
  UploadOutlined,
  InfoCircleOutlined,
  LogoutOutlined,
  HomeOutlined,
  UserOutlined,
  CalendarOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import logo from "../assets/sayes-performance-logo.jpg";
import "../index.css"; // Import global CSS

const { Option } = Select;

const Me = () => {
  const [avatar, setAvatar] = useState(null);
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [age, setAge] = useState("");
  const [team, setTeam] = useState("");
  const [country, setCountry] = useState("");
  const [playerPosition, setPlayerPosition] = useState("CM");
  const [district, setDistrict] = useState("Sundbyberg");
  const [publicProfile, setPublicProfile] = useState(true);
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

    // Fetch profile information
    const fetchProfile = async () => {
      try {
        const res = await fetch("/backend/get_profile.php", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        const data = await res.json();
        if (data.success) {
          setUsername(data.user.fullname);
          setPhone(data.user.phone || "");
          setAge(data.user.age || "");
          setTeam(data.user.team || "");
          setCountry(data.user.country || "");
          setPlayerPosition(data.user.player_position || "CM");
          setDistrict(data.user.district || "Sundbyberg");
          setAvatar(data.user.avatar || null);
        } else {
          console.log("Displaying profile retrieval error message");
          messageApi.error({
            content: data.message || "Error fetching profile",
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
      } catch (err) {
        console.error("Network error fetching profile:", err);
        console.log("Displaying network error message for profile");
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
    fetchProfile();
  }, [navigate, messageApi]);

  const handleUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setAvatar(e.target.result);
    };
    reader.readAsDataURL(file);
    return false;
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch("/backend/update_profile.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          phone,
          username,
          age: age ? parseInt(age) : null,
          team,
          country,
          player_position: playerPosition,
          district,
          avatar,
        }),
      });
      const data = await res.json();
      if (data.success) {
        console.log("Displaying profile update success message");
        messageApi.success({
          content: data.message || "Profile updated successfully",
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
      } else {
        console.log("Displaying profile update error message");
        messageApi.error({
          content: data.message || "Error updating profile",
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
      console.error("Network error updating profile:", err);
      console.log("Displaying network error message for update");
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

  const handleLogout = async () => {
    try {
      const res = await fetch("/backend/logout.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        console.log("Displaying logout success message");
        messageApi.success({
          content: data.message || "Logout successful",
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
        navigate("/login");
      } else {
        console.log("Displaying logout error message");
        messageApi.error({
          content: "Error logging out",
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
      console.error("Network error during logout:", err);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-100 to-white text-[#1c1c1e] font-['SF_Pro_Display','Segoe_UI','Helvetica','Arial','sans-serif']">
      {contextHolder}
      {/* Header */}
      <header className="bg-[#0a0a0a] text-white flex flex-col sm:flex-row items-center justify-between px-6 py-4 shadow-lg">
        <img
          src={avatar || logo}
          alt="Sayes Performance Avatar"
          className="h-16 w-16 rounded-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <nav className="flex gap-6 sm:gap-16 text-sm sm:text-base font-medium">
          <a href="#" className="flex flex-col items-center hover:text-pink-400 transition-all">
            <UserOutlined className="text-[20px] mb-1" />
            Me
          </a>
          <a href="/Fitness" className="flex flex-col items-center hover:text-pink-400 transition-all">
            <HomeOutlined className="text-[20px] mb-1" />
            Fitness
          </a>
          <a href="#" className="flex flex-col items-center hover:text-pink-400 transition-all">
            <CalendarOutlined className="text-[20px] mb-1" />
            Reservations
          </a>
          <a href="/Players" className="flex flex-col items-center hover:text-pink-400 transition-all">
            <TeamOutlined className="text-[20px] mb-1" />
            Players
          </a>
          <a href="/LandingPage" className="flex flex-col items-center hover:text-pink-400 transition-all">
            <HomeOutlined className="text-[20px] mb-1" />
            Home
          </a>
        </nav>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm hover:text-red-400 transition-colors"
        >
          <LogoutOutlined /> Logout
        </button>
      </header>

      {/* Main Section */}
      <motion.main
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="flex flex-col items-center px-6 py-12"
      >
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-4 text-center sm:text-left">
          <img src={logo} alt="Logo" className="h-16" />
          <h1 className="text-3xl sm:text-5xl font-bold leading-tight tracking-tight">
            Welcome, <span className="text-pink-600">{username || "First Name"}</span>
          </h1>
        </div>

        <p className="text-sm sm:text-base font-semibold text-gray-500 tracking-widest uppercase">
          YOUR SAYES PERFORMANCE NUMBER: <span className="font-bold">SYP3245DAD</span>
        </p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-10 bg-white/90 backdrop-blur-md border border-gray-200 rounded-3xl shadow-2xl px-8 py-10 w-full max-w-xl"
        >
          <h2 className="text-xl sm:text-2xl font-semibold text-center sm:text-left mb-8 text-pink-600">
            Player Profile
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Phone number</label>
              <Input
                className="rounded-xl py-2 px-3 text-base shadow-sm focus:ring-2 ring-pink-300"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Username</label>
              <Input
                className="rounded-xl py-2 px-3 text-base shadow-sm focus:ring-2 ring-pink-300"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Img player</label>
              <Upload beforeUpload={handleUpload} className="w-full">
                <Button
                  icon={<UploadOutlined />}
                  className="w-full py-2 text-base hover:scale-105 transition rounded-xl"
                >
                  Choose File
                </Button>
              </Upload>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Age</label>
              <Input
                type="number"
                min={1}
                max={99}
                className="rounded-xl py-2 px-3 text-base shadow-sm focus:ring-2 ring-pink-300"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Team</label>
              <Input
                className="rounded-xl py-2 px-3 text-base shadow-sm focus:ring-2 ring-pink-300"
                value={team}
                onChange={(e) => setTeam(e.target.value)}
                placeholder="Enter Team"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Country</label>
              <Input
                className="rounded-xl py-2 px-3 text-base shadow-sm focus:ring-2 ring-pink-300"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Player Position</label>
              <Select
                value={playerPosition}
                onChange={setPlayerPosition}
                className="w-full rounded-xl"
              >
                {["LW", "RW", "ST", "G", "RB", "CB", "LB", "CDM", "CM", "CAM"].map(
                  (pos) => (
                    <Option key={pos} value={pos}>
                      {pos}
                    </Option>
                  )
                )}
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">District</label>
              <Select
                value={district}
                onChange={setDistrict}
                className="w-full rounded-xl"
              >
                {[
                  "Malmö",
                  "Helsingborg",
                  "Lund",
                  "Kristianstad",
                  "Landskrona",
                  "Trelleborg",
                  "Ystad",
                  "Ängelholm",
                  "Hässleholm",
                  "Eslöv",
                ].map((d) => (
                  <Option key={d} value={d}>
                    {d}
                  </Option>
                ))}
              </Select>
            </div>
          </div>

          <div className="mt-5 flex justify-between items-center">
            <div className="text-gray-400 text-xs">
              <Tooltip title="This is your district for classification">
                <InfoCircleOutlined />
              </Tooltip>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={publicProfile}
                onChange={setPublicProfile}
                className="bg-pink-500"
              />
              <span className="text-sm">Public Profile</span>
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            block
            className="mt-6 bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 text-lg rounded-xl transition-transform hover:scale-[1.02]"
          >
            Update Player
          </Button>
        </motion.div>
      </motion.main>

      {/* Footer */}
      <footer className="bg-[#0a0a0a] text-white text-center py-5 text-xs sm:text-sm tracking-wider">
        © 2025 SAYES PERFORMANCE. All Rights Reserved.
      </footer>
    </div>
  );
};

export default Me;