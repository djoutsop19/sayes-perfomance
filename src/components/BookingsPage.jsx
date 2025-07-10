import React, { useState, useEffect } from "react";
import { Table, Typography, Image, Button, Tooltip, Modal, Input, message } from "antd";
import {
  EyeOutlined,
  UserOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  ReadOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import logo from "../assets/sayes-performance-logo.jpg";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [editFormData, setEditFormData] = useState({ fullname: "", email: "", package_name: "" });
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const fetchBookings = async () => {
      try {
        console.log("Récupération des bookings...");
        const res = await fetch("/backend/bookings.php", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        const data = await res.json();
        console.log("Réponse de bookings.php:", data);
        if (mounted && data.success) {
          setBookings(
            data.bookings.map((booking) => ({
              key: booking.id,
              name: booking.fullname,
              className: booking.package_name,
              phone: booking.phone,
              district: booking.district,
              email: booking.email,
              avatar: booking.avatar,
              package_type: booking.package_type,
              price_per_month: booking.price_per_month,
              binding_time: booking.binding_time,
            }))
          );
        } else if (mounted) {
          message.error(data.message || "Erreur lors de la récupération des bookings");
          navigate("/login");
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des bookings:", err);
        if (mounted) {
          message.error("Erreur réseau ou serveur");
          navigate("/login");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchBookings();

    return () => {
      mounted = false;
    };
  }, [navigate]);

  const showViewModal = (booking) => {
    setSelectedBooking(booking);
    setIsViewModalVisible(true);
  };

  const showEditModal = (booking) => {
    setSelectedBooking(booking);
    setEditFormData({
      fullname: booking.name,
      email: booking.email,
      package_name: booking.className,
    });
    setIsEditModalVisible(true);
  };

  const showDeleteModal = (booking) => {
    setSelectedBooking(booking);
    setIsDeleteModalVisible(true);
  };

  const handleEditOk = async () => {
    try {
      console.log("Mise à jour du booking:", { id: selectedBooking.key, ...editFormData });
      const res = await fetch("/backend/bookings.php", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id: selectedBooking.key, ...editFormData }),
      });
      const data = await res.json();
      console.log("Réponse de bookings.php (PUT):", data);
      if (data.success) {
        message.success("Booking mis à jour avec succès");
        setBookings((prev) =>
          prev.map((b) =>
            b.key === selectedBooking.key
              ? { ...b, name: editFormData.fullname, email: editFormData.email, className: editFormData.package_name }
              : b
          )
        );
        setIsEditModalVisible(false);
      } else {
        message.error(data.message || "Erreur lors de la mise à jour du booking");
      }
    } catch (err) {
      console.error("Erreur lors de la mise à jour:", err);
      message.error("Erreur réseau ou serveur");
    }
  };

  const handleDeleteOk = async () => {
    try {
      console.log("Suppression du booking:", selectedBooking.key);
      const res = await fetch("/backend/bookings.php", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id: selectedBooking.key }),
      });
      const data = await res.json();
      console.log("Réponse de bookings.php (DELETE):", data);
      if (data.success) {
        message.success("Booking supprimé avec succès");
        setBookings((prev) => prev.filter((b) => b.key !== selectedBooking.key));
        setIsDeleteModalVisible(false);
      } else {
        message.error(data.message || "Erreur lors de la suppression du booking");
      }
    } catch (err) {
      console.error("Erreur lors de la suppression:", err);
      message.error("Erreur réseau ou serveur");
    }
  };

  const columns = [
    {
      title: (
        <span className="flex items-center gap-2">
          <UserOutlined /> Name
        </span>
      ),
      dataIndex: "name",
      key: "name",
    },
    {
      title: (
        <span className="flex items-center gap-2">
          <EnvironmentOutlined /> District
        </span>
      ),
      dataIndex: "district",
      key: "district",
    },
    {
      title: (
        <span className="flex items-center gap-2">
          <ReadOutlined /> Class Name
        </span>
      ),
      dataIndex: "className",
      key: "className",
    },
    {
      title: (
        <span className="flex items-center gap-2">
          <PhoneOutlined /> Phone Number
        </span>
      ),
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: (
        <span className="flex items-center gap-2">
          <MailOutlined /> Email
        </span>
      ),
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex gap-2">
          <motion.div
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Tooltip title="View Details">
              <Button
                shape="circle"
                icon={<EyeOutlined style={{ fontSize: 20 }} />}
                style={{
                  backgroundColor: "#1890ff",
                  color: "#fff",
                  border: "none",
                }}
                onClick={() => showViewModal(record)}
              />
            </Tooltip>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Tooltip title="Edit">
              <Button
                shape="circle"
                icon={<EditOutlined style={{ fontSize: 20 }} />}
                style={{
                  backgroundColor: "#ff416c",
                  color: "#fff",
                  border: "none",
                }}
                onClick={() => showEditModal(record)}
              />
            </Tooltip>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Tooltip title="Delete">
              <Button
                shape="circle"
                icon={<DeleteOutlined style={{ fontSize: 20 }} />}
                style={{
                  backgroundColor: "#ff4d4f",
                  color: "#fff",
                  border: "none",
                }}
                onClick={() => showDeleteModal(record)}
              />
            </Tooltip>
          </motion.div>
        </div>
      ),
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0d1117",
        padding: "40px 20px",
        color: "#fff",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 30, flexWrap: "wrap" }}
      >
        <Image src={logo} preview={false} height={50} />
        <Title level={2} style={{ color: "#fff", margin: 0 }}>
          Bookings
        </Title>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Table
          columns={columns}
          dataSource={bookings}
          loading={loading}
          pagination={{ pageSize: 8 }}
          bordered
          style={{ background: "#fff", borderRadius: 8, overflow: "hidden" }}
          locale={{ emptyText: "Aucun booking trouvé" }}
        />
      </motion.div>

      {/* Modal pour View Details */}
      <Modal
        title="Booking Details"
        open={isViewModalVisible}
        onCancel={() => setIsViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsViewModalVisible(false)}>
            Close
          </Button>,
        ]}
      >
        {selectedBooking && (
          <div className="space-y-2">
            <p><strong>Name:</strong> {selectedBooking.name}</p>
            <p><strong>Email:</strong> {selectedBooking.email}</p>
            <p><strong>Class Name:</strong> {selectedBooking.className}</p>
            <p><strong>Package Type:</strong> {selectedBooking.package_type}</p>
            <p><strong>Price:</strong> {selectedBooking.price_per_month} SEK/month</p>
            <p><strong>Binding Time:</strong> {selectedBooking.binding_time}</p>
            <p><strong>District:</strong> {selectedBooking.district}</p>
            <p><strong>Phone:</strong> {selectedBooking.phone}</p>
            {selectedBooking.avatar && (
              <p>
                <strong>Avatar:</strong>
                <Image src={selectedBooking.avatar} width={100} style={{ marginTop: 8 }} />
              </p>
            )}
          </div>
        )}
      </Modal>

      {/* Modal pour Edit */}
      <Modal
        title="Edit Booking"
        open={isEditModalVisible}
        onOk={handleEditOk}
        onCancel={() => setIsEditModalVisible(false)}
        okText="Save"
        okButtonProps={{ style: { backgroundColor: "#ff416c", border: "none" } }}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Full Name *</label>
            <Input
              value={editFormData.fullname}
              onChange={(e) => setEditFormData({ ...editFormData, fullname: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Email *</label>
            <Input
              value={editFormData.email}
              onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Class Name *</label>
            <Input
              value={editFormData.package_name}
              onChange={(e) => setEditFormData({ ...editFormData, package_name: e.target.value })}
            />
          </div>
        </div>
      </Modal>

      {/* Modal pour Delete */}
      <Modal
        title="Confirm Deletion"
        open={isDeleteModalVisible}
        onOk={handleDeleteOk}
        onCancel={() => setIsDeleteModalVisible(false)}
        okText="Delete"
        okButtonProps={{ style: { backgroundColor: "#ff4d4f", border: "none" } }}
      >
        <p>Êtes-vous sûr de vouloir supprimer ce booking pour {selectedBooking?.name} ?</p>
      </Modal>
    </div>
  );
};

export default BookingsPage;