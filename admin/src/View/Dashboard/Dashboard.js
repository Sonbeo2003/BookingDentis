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

const Dashboard = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  // Sample data for the line chart
  const lineData = [
    { month: "Tháng 1", revenue: 12000 },
    { month: "Tháng 2", revenue: 15000 },
    { month: "Tháng 3", revenue: 17000 },
    { month: "Tháng 4", revenue: 20000 },
    { month: "Tháng 5", revenue: 22000 },
    { month: "Tháng 6", revenue: 25000 },
    { month: "Tháng 7", revenue: 23000 },
    { month: "Tháng 8", revenue: 24000 },
    { month: "Tháng 9", revenue: 26000 },
    { month: "Tháng 10", revenue: 27000 },
    { month: "Tháng 11", revenue: 30000 },
    { month: "Tháng 12", revenue: 31000 },
  ];

  // Sample data for the pie chart
  const pieData = [
    { name: "Users", value: 33 },
    { name: "Bookings", value: 55 },
    { name: "Services", value: 12 },
  ];

  const COLORS = ["#ff6f61", "#de4d7b", "#ffb347"];

  // Sample stats for cards
  const stats = {
    userCount: 6,
    revenue: 83486,
    serviceCount: 25,
    bookingCount: 1,
  };

  // Sample table data
  const tableData = [
    { id: 1, name: "John Doe", email: "john@example.com", role: "Admin", status: "Active" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User", status: "Inactive" },
    { id: 3, name: "Mike Johnson", email: "mike@example.com", role: "User", status: "Active" },
  ];

  useEffect(() => {
    if (location.state?.toastMessage) {
      toast.success(location.state.toastMessage);
    }
    // Simulate loading for demonstration
    setTimeout(() => setLoading(false), 1000);
  }, [location]);

  return (
    <div id="dashboard" className="content-section">
      <ToastContainer style={{ top: 70 }} />
      <div className="card-container">
        <div className="card">
          <FaUser size={30} style={{ marginBottom: "5px" }} />
          <h3>Người dùng</h3>
          {loading ? (
            <RiLoader2Fill className="spinner"></RiLoader2Fill>
          ) : (
            <p>{stats.userCount}</p>
          )}
        </div>
        <div className="card">
          <FaDollarSign size={30} style={{ marginBottom: "5px" }} />
          <h3>Doanh thu</h3>
          <p>${stats.revenue}</p>
        </div>
        <div className="card">
          <FaServicestack size={30} style={{ marginBottom: "5px" }} />
          <h3>Dịch vụ</h3>
          {loading ? (
            <RiLoader2Fill className="spinner"></RiLoader2Fill>
          ) : (
            <p>{stats.serviceCount}</p>
          )}
        </div>
        <div className="card">
          <FaCalendarAlt size={30} style={{ marginBottom: "5px" }} />
          <h3>Tổng lịch hẹn</h3>
          {loading ? (
            <RiLoader2Fill className="spinner"></RiLoader2Fill>
          ) : (
            <p>{stats.bookingCount}</p>
          )}
        </div>
      </div>

      <div className="dashboard-chart-container">
        <div className="chart-container">
          <h4 style={{ textAlign: "center" }}>Revenue Over Time</h4>
          {loading ? (
            <div style={{ textAlign: "center" }}>
              <RiLoader2Fill className="spinner" />
              <p>Đang tải dữ liệu...</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#ff6f61" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="chart-container">
          <h4 style={{ textAlign: "center" }}>Data Distribution</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="table-container">
        <h4 style={{ textAlign: "center" }}>Recent Users</h4>
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row) => (
              <tr key={row.id}>
                <td>{row.id}</td>
                <td>{row.name}</td>
                <td>{row.email}</td>
                <td>{row.role}</td>
                <td>{row.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;