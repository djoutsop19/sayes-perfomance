import React, { useState, useEffect } from "react";
import { Table, Avatar, Input, Tag, Select, Button, Card, message, Spin } from "antd";
import {
  LogoutOutlined,
  HomeOutlined,
  UserOutlined,
  CalendarOutlined,
  TeamOutlined,
  SearchOutlined,
  RiseOutlined,
  EnvironmentOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  EditOutlined,
  GlobalOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/sayes-performance-logo.jpg";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

const { Option } = Select;

// Données statiques pour les graphiques (à rendre dynamique si nécessaire)
const chartData = [
  { name: "Jan", players: 1, age: 25 },
  { name: "Feb", players: 2, age: 26 },
  { name: "Mar", players: 2, age: 27 },
];

const columns = [
  {
    title: <span className="flex items-center gap-1 text-xs sm:text-base"><UserOutlined /> Player</span>,
    dataIndex: "fullname",
    key: "fullname",
    width: 160,
    render: (text, record) => (
      <div className="flex items-center gap-2 sm:gap-4">
        <Avatar src={record.avatar || "https://example.com/default-avatar.jpg"} size={32} sm={48} className="shadow-md" />
        <div>
          <div className="font-semibold text-gray-900 text-xs sm:text-base hover:text-blue-600 cursor-pointer transition-all duration-200 truncate">
            {record.fullname}
          </div>
        </div>
      </div>
    ),
  },
  {
    title: <span className="flex items-center gap-1 text-xs sm:text-base"><HomeOutlined /> Club Name</span>,
    dataIndex: "team",
    key: "team",
    width: 100,
    render: (team) => <span className="text-gray-700 font-medium text-xs sm:text-base truncate">{team}</span>,
  },
  {
    title: <span className="flex items-center gap-1 text-xs sm:text-base"><RiseOutlined /> Position</span>,
    dataIndex: "player_position",
    key: "player_position",
    width: 100,
    render: (pos) => <Tag color="blue" className="text-xs sm:text-sm px-1 sm:px-2 py-0.5">{pos}</Tag>,
  },
  {
    title: <span className="flex items-center gap-1 text-xs sm:text-base"><CalendarOutlined /> Age</span>,
    dataIndex: "age",
    key: "age",
    width: 80,
    render: (age) => <span className="text-gray-700 font-semibold text-xs sm:text-base">{age}</span>,
  },
  {
    title: <span className="flex items-center gap-1 text-xs sm:text-base"><EnvironmentOutlined /> District</span>,
    dataIndex: "district",
    key: "district",
    width: 100,
    render: (district) => <span className="text-gray-700 font-semibold text-xs sm:text-base truncate">{district}</span>,
  },
  {
    title: <span className="flex items-center gap-1 text-xs sm:text-base"><GlobalOutlined /> Country</span>,
    dataIndex: "country",
    key: "country",
    width: 100,
    render: (country) => <span className="text-gray-700 font-semibold text-xs sm:text-base truncate">{country}</span>,
  },
];

const Players = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      try {
        console.log("Vérification de la session...");
        const res = await fetch("/backend/fitness.php", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        const data = await res.json();
        console.log("Réponse de fitness.php:", data);
        if (mounted && data.success && (data.user || data.admin)) {
          setUser(data.admin || data.user);
          fetchUsers();
        } else if (mounted) {
          message.error(data.message || "Veuillez vous connecter.");
          navigate("/login");
        }
      } catch (err) {
        console.error("Erreur lors de la vérification de la session:", err);
        if (mounted) {
          message.error("Erreur réseau ou serveur");
          navigate("/login");
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
              club_name: user.club_name,
              team: user.team,
              age: user.age,
              district: user.district,
              country: user.country,
              player_position: user.player_position,
              avatar: user.avatar || "https://example.com/default-avatar.jpg",
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

  const handleLogout = async () => {
    try {
      console.log("Déconnexion...");
      const res = await fetch("/backend/logout.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await res.json();
      console.log("Réponse de logout.php:", data);
      if (data.success) {
        message.success(data.message);
        setUser(null);
        navigate("/login");
      } else {
        message.error("Erreur lors de la déconnexion");
      }
    } catch (err) {
      console.error("Erreur lors de la déconnexion:", err);
      message.error("Erreur réseau ou serveur");
      navigate("/login");
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-[#f4f4f7] to-white text-black font-sans"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Header */}
      <motion.header
        className="bg-black text-white sticky top-0 z-50 px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row justify-between items-center shadow-sm border-b border-gray-800"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-0">
          <img src={logo} alt="Sayes Logo" className="h-10 sm:h-12 w-10 sm:w-12 rounded-full shadow-md" />
          <span className="text-base sm:text-xl font-bold tracking-wide text-white">Sayes Performance</span>
        </div>
        <nav className="flex flex-wrap justify-center gap-3 sm:gap-6 text-base sm:text-sm font-medium">
          {user ? (
            <>
              <Link to="/me" className="flex flex-col items-center text-gray-300 hover:text-[#c21d56] transition">
                <UserOutlined className="text-sm sm:text-base mb-1" /> Me
              </Link>
              <Link to="/fitness" className="flex flex-col items-center text-gray-300 hover:text-[#c21d56] transition">
                <HomeOutlined className="text-sm sm:text-base mb-1" /> Fitness
              </Link>
              <Link to="/reservations" className="flex flex-col items-center text-gray-300 hover:text-[#c21d56] transition">
                <CalendarOutlined className="text-sm sm:text-base mb-1" /> Reservations
              </Link>
              <Link to="/players" className="flex flex-col items-center text-gray-300 hover:text-[#c21d56] transition">
                <TeamOutlined className="text-sm sm:text-base mb-1" /> Players
              </Link>
              {user.is_admin && (
                <>
                  <Link to="/create-class" className="flex flex-col items-center text-gray-300 hover:text-[#c21d56] transition">
                    <PlusOutlined className="text-sm sm:text-base mb-1" /> Create Package
                  </Link>
                  <Link to="/admin-dashboard" className="flex flex-col items-center text-gray-300 hover:text-[#c21d56] transition">
                    <EditOutlined className="text-sm sm:text-base mb-1" /> Admin Dashboard
                  </Link>
                </>
              )}
            </>
          ) : (
            <Link to="/login" className="flex flex-col items-center text-gray-300 hover:text-[#c21d56] transition">
              Login
            </Link>
          )}
        </nav>
        {user && (
          <button
            className="text-sm sm:text-sm bg-[#c21d56] text-white px-3 sm:px-4 py-1.5 sm:py-1 rounded-full hover:bg-white hover:text-[#c21d56] border border-[#c21d56] transition mt-2 sm:mt-0"
            onClick={handleLogout}
          >
            <LogoutOutlined /> Logout
          </button>
        )}
      </motion.header>

      {/* Hero Section */}
      <motion.section
        className="px-4 sm:px-6 pt-6 sm:pt-10 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-[#c21d56]">Welcome to the Players Space</h1>
        <p className="text-gray-600 max-w-md sm:max-w-2xl mx-auto text-sm sm:text-sm md:text-base">
          Monitor, manage and review all registered players' data in real-time. Use filters, search and explore player details.
        </p>
      </motion.section>

      {/* Filters and Search */}
      <motion.div
        className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 px-4 sm:px-6 mt-4 sm:mt-6 mb-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Input
            placeholder="Search players..."
            prefix={<SearchOutlined />}
            className="w-full sm:w-64 text-sm sm:text-sm shadow rounded-md border border-gray-300 h-10 sm:h-auto"
          />
          <Select defaultValue="All" className="w-full sm:w-32 text-sm sm:text-sm h-10 sm:h-auto">
            <Option value="All">All Teams</Option>
            <Option value="Milan FC">Milan FC</Option>
            <Option value="Barcelon">Barcelon</Option>
            <Option value="Stockholm FC">Stockholm FC</Option>
          </Select>
        </div>
        <Button
          type="primary"
          icon={<InfoCircleOutlined />}
          className="bg-[#c21d56] border-none text-sm sm:text-sm w-full sm:w-auto h-10 sm:h-auto"
        >
          Player Stats
        </Button>
      </motion.div>

      {/* Main Table */}
      <main className="px-4 sm:px-10 py-4 sm:py-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {loading ? (
            <div className="text-center py-6 sm:py-10 min-h-[200px]">
              <Spin size="large" tip="Chargement des joueurs..." />
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-xl p-3 sm:p-6">
              <Table
                dataSource={users}
                columns={columns}
                pagination={{ pageSize: 8 }}
                bordered
                className="text-xs sm:text-sm"
                locale={{ emptyText: "Aucun joueur trouvé" }}
                scroll={{ x: 600 }}
              />
            </div>
          )}
        </motion.div>
      </main>

      {/* Charts */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 px-4 sm:px-6 py-6 sm:py-10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
      >
        <Card title="Players Over Time" bordered className="shadow text-sm sm:text-sm">
          <ResponsiveContainer width="100%" height={260} sm={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} sm={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} sm={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="players" stroke="#c21d56" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card title="Average Age Trend" bordered className="shadow text-sm sm:text-sm">
          <ResponsiveContainer width="100%" height={260} sm={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} sm={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} sm={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="age" stroke="#52c41a" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </motion.div>

      {/* Footer */}
      <motion.footer
        className="bg-white text-center text-gray-500 py-4 sm:py-6 mt-6 sm:mt-16 border-t border-gray-200"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.4 }}
      >
        <img src={logo} alt="Logo" className="h-10 sm:h-12 mx-auto mb-2 rounded-full shadow-sm" />
        <p className="text-sm sm:text-sm">© {new Date().getFullYear()} Sayes Performance. All rights reserved.</p>
      </motion.footer>
    </motion.div>
  );
};

export default Players;