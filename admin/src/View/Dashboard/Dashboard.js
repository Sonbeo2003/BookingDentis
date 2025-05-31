import React, { useEffect, useState } from "react";
import {
  FaUser,
  FaDollarSign,
  FaServicestack,
  FaCalendarAlt,
} from "react-icons/fa";
import "./Dashboard.css";
import { toast, ToastContainer } from "react-toastify";
import { useLocation } from "react-router-dom";
import url from "../../ipconfig";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { RiLoader2Fill } from "react-icons/ri";
import { db } from "../../Firebase";
import { ref, push, onValue } from "firebase/database";

const Dashboard = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [apiLoading, setApiLoading] = useState({
    users: true,
    services: true,
    bookings: true,
    stats: true,
  });

  // State để lưu dữ liệu từ API
  const [stats, setStats] = useState({
    userCount: 0,
    revenue: 0,
    serviceCount: 0,
    bookingCount: 0,
  });

  const [lineData, setLineData] = useState([]);
  const [pieData, setPieData] = useState([]);

  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");

  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(
    currentDate.getMonth() + 1
  );
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  // Hàm gọi API để lấy số lượng người dùng
  const fetchUserCount = async () => {
    try {
      const response = await fetch(
        `${url}/api_doctor/TongQuan/demnguoidung.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();

      if (data.status === "success") {
        setStats((prev) => ({ ...prev, userCount: data.total_users }));
      } else {
        console.error("Error fetching users:", data.message);
        toast.error("Lỗi khi tải dữ liệu người dùng");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Lỗi kết nối API người dùng");
    } finally {
      setApiLoading((prev) => ({ ...prev, users: false }));
    }
  };

  // Hàm gọi API để lấy số lượng dịch vụ
  const fetchServiceCount = async () => {
    try {
      const response = await fetch(`${url}/api_doctor/TongQuan/demDichVu.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      if (data.status === "success") {
        setStats((prev) => ({ ...prev, serviceCount: data.total_service }));
      } else {
        console.error("Error fetching services:", data.message);
        toast.error("Lỗi khi tải dữ liệu dịch vụ");
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      toast.error("Lỗi kết nối API dịch vụ");
    } finally {
      setApiLoading((prev) => ({ ...prev, services: false }));
    }
  };

  // Hàm gọi API để lấy số lượng booking
  const fetchBookingCount = async () => {
    try {
      const response = await fetch(
        `${url}/api_doctor/TongQuan/demLichHen.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();

      if (data.status === "success") {
        setStats((prev) => ({ ...prev, bookingCount: data.total_booking }));
      } else {
        console.error("Error fetching bookings:", data.message);
        toast.error("Lỗi khi tải dữ liệu lịch hẹn");
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Lỗi kết nối API lịch hẹn");
    } finally {
      setApiLoading((prev) => ({ ...prev, bookings: false }));
    }
  };

  // Hàm gọi API để lấy thống kê theo tháng
  const fetchMonthlyStats = async () => {
    try {
      const response = await fetch(
        `${url}/api_doctor/Tongquan/thongketheothang.php?month=${selectedMonth}&year=${selectedYear}`
      );
      const data = await response.json();

      if (data.status === "success") {
        const formattedLineData = data.daily_stats.map((stat) => ({
          month: new Date(stat.date).getDate().toString(),
          revenue: stat.bookings * 100000,
        }));
        setLineData(formattedLineData);

        const formattedPieData = [
          { name: "Người dùng", value: data.total_users },
          { name: "Lịch hẹn", value: data.total_bookings },
          { name: "Dịch vụ", value: stats.serviceCount || 10 },
        ];
        setPieData(formattedPieData);

        const totalRevenue = data.total_bookings * 100000;
        setStats((prev) => ({ ...prev, revenue: totalRevenue }));
      } else {
        toast.error("Lỗi khi tải thống kê tháng");
      }
    } catch (error) {
      toast.error("Lỗi kết nối API thống kê");
    } finally {
      setApiLoading((prev) => ({ ...prev, stats: false }));
    }
  };

  // Colors cho biểu đồ tròn
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
  
  useEffect(() => {
    const chatRef = ref(db, "messages");
    onValue(chatRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messages = Object.entries(data)
          .map(([key, value]) => ({
            id: key,
            ...value,
          }))
          .sort((a, b) => a.timestamp - b.timestamp);
        setChatMessages(messages);
      }
    });
  }, []);

  useEffect(() => {
    fetchMonthlyStats();
  }, [selectedMonth, selectedYear]);

  const sendMessage = () => {
    if (inputMessage.trim()) {
      const chatRef = ref(db, "messages");
      push(chatRef, {
        sender: "admin",
        text: inputMessage,
        timestamp: Date.now(),
      });
      setInputMessage("");
    }
  };

  // Gọi tất cả API khi component mount
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      await Promise.all([
        fetchUserCount(),
        fetchServiceCount(),
        fetchBookingCount(),
        fetchMonthlyStats(),
      ]);
      setLoading(false);
    };

    fetchAllData();

    if (location.state?.toastMessage) {
      toast.success(location.state.toastMessage);
    }
  }, [location]);

  return (
    <div id="dashboard" className="content-section">
      <ToastContainer style={{ top: 70 }} />
      <div className="card-container">
        <div className="card">
          <FaUser size={30} style={{ marginBottom: "5px" }} />
          <h3>Người dùng</h3>
          {apiLoading.users ? (
            <RiLoader2Fill className="spinner"></RiLoader2Fill>
          ) : (
            <p>{stats.userCount}</p>
          )}
        </div>
        <div className="card">
          <FaDollarSign size={30} style={{ marginBottom: "5px" }} />
          <h3>Doanh thu</h3>
          {apiLoading.stats ? (
            <RiLoader2Fill className="spinner"></RiLoader2Fill>
          ) : (
            <p>{stats.revenue.toLocaleString("vi-VN")} VNĐ</p>
          )}
        </div>
        <div className="card">
          <FaServicestack size={30} style={{ marginBottom: "5px" }} />
          <h3>Dịch vụ</h3>
          {apiLoading.services ? (
            <RiLoader2Fill className="spinner"></RiLoader2Fill>
          ) : (
            <p>{stats.serviceCount}</p>
          )}
        </div>
        <div className="card">
          <FaCalendarAlt size={30} style={{ marginBottom: "5px" }} />
          <h3>Tổng lịch hẹn</h3>
          {apiLoading.bookings ? (
            <RiLoader2Fill className="spinner"></RiLoader2Fill>
          ) : (
            <p>{stats.bookingCount}</p>
          )}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <div className="label-container">Tháng:</div>
        <select
          className="select"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
        >
          {[...Array(12).keys()].map((i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>

        <div className="label-container" style={{ marginLeft: "20px" }}>
          Năm:
        </div>
        <select
          className="select"
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
        >
          {[...Array(6).keys()].map((i) => {
            const y = new Date().getFullYear() - i;
            return (
              <option key={y} value={y}>
                {y}
              </option>
            );
          })}
        </select>

        <button
          className="select"
          style={{ marginLeft: "20px" }}
          onClick={fetchMonthlyStats}
        >
          Xem thống kê
        </button>
      </div>

      <div className="dashboard-chart-container">
        <div className="chart-container">
          <h4 style={{ textAlign: "center" }}>Revenue Over Time</h4>
          {apiLoading.stats ? (
            <div style={{ textAlign: "center" }}>
              <RiLoader2Fill className="spinner" />
              <p>Đang tải dữ liệu...</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineData} margin={{ left: 50 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value) => [
                    `${value.toLocaleString("vi-VN")} VNĐ`,
                    "Doanh thu",
                  ]}
                />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#ff6f61" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="chart-container">
          <h4 style={{ textAlign: "center" }}>Data Distribution</h4>
          {apiLoading.stats ? (
            <div style={{ textAlign: "center" }}>
              <RiLoader2Fill className="spinner" />
              <p>Đang tải dữ liệu...</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} (${(percent * 100).toFixed(0)}%)`
                  }
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="table-container">
        {/* Mini Chat Button */}
        <button
          className="chat-toggle-button"
          onClick={() => setShowChat(true)}
        >
          💬
        </button>

        {/* Chat Popup */}
        {showChat && (
          <div className="chat-popup">
            <div className="chat-header">
              <span>Hỗ trợ khách hàng</span>
              <button className="chat-close" onClick={() => setShowChat(false)}>
                ×
              </button>
            </div>
            <div className="chat-body">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`chat-message ${
                    msg.sender === "bot" ? "bot" : "user"
                  }`}
                >
                  {msg.text}
                </div>
              ))}
            </div>
            <div className="chat-input-area">
              <input
                type="text"
                value={inputMessage}
                placeholder="Nhập tin nhắn..."
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && inputMessage.trim()) {
                    sendMessage();
                  }
                }}
              />
              <button onClick={sendMessage}>Gửi</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
