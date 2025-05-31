import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar";
import Dashboard from "./View/Dashboard/Dashboard";
import Services from "./View/Services/Services";
import Users from "./View/Users/Users";
import Bookings from "./View/Booking/Bookings";
import Center from "./View/Center/Center";
import Login from "./View/Login/Login";
import Promotions from "./View/Promotions/Promotions";
import Profile from "./View/Profile/Profile";
import ServiceCenter from "./View/Services_Center/ServiceCenter";
import TopBar from "./components/Topbar/Topbar";
import DentailProfile from "./View/DentailProfile/Dentail";
import Payment from "./View/Payment/Payment";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import MedicationLiquidIcon from "@mui/icons-material/MedicationLiquid";
import History from "./View/History/History";
import Comments from "./View/Comment/Comments";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import RoomServiceIcon from "@mui/icons-material/RoomService";
import MapsHomeWorkIcon from "@mui/icons-material/MapsHomeWork";
import LoyaltyIcon from "@mui/icons-material/Loyalty";
import EventNoteIcon from "@mui/icons-material/EventNote";
import PaymentIcon from "@mui/icons-material/Payment";
import LogoutIcon from "@mui/icons-material/Logout";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import RestoreIcon from "@mui/icons-material/Restore";
import { Box } from "@mui/material";
import "./App.css";
import Doctors from "./View/Doctor/Doctor";

function App() {
  // Lấy thông tin người dùng từ localStorage
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const role = user.role || 0; // Mặc định role = 0 nếu không có thông tin
  console.log("User:", user);
  console.log("User Role:", role);

  // Danh sách đầy đủ các mục sidebar
  const items = [
    {
      title: "Quản lý tổng quan",
      text: "Tổng quan",
      icon: <DashboardIcon />,
      link: "/dashboard",
    },
    {
      title: "Quản lý tài khoản - người dùng",
      text: "Tài khoản - Người dùng",
      icon: <PersonIcon />,
      link: "/users",
    },
    {
      title: "Quản lý nha sĩ",
      text: "Nha sĩ",
      icon: <MedicationLiquidIcon />,
      link: "/doctor",
    },
    {
      title: "Quản lý dịch vụ",
      text: "Dịch vụ",
      icon: <RoomServiceIcon />,
      link: "/services",
    },
    {
      title: "Quản lý phòng khám",
      text: "Phòng khám",
      icon: <MapsHomeWorkIcon />,
      link: "/center",
    },
    {
      title: "Quản lý hồ sơ khám bệnh",
      text: "Hồ sơ khám bệnh",
      icon: <BusinessCenterIcon />,
      link: "/dentailprofile",
    },
    {
      title: "Quản lý khuyến mãi",
      text: "Khuyến mãi",
      icon: <LoyaltyIcon />,
      link: "/promotions",
    },
    {
      title: "Quản lý lịch hẹn",
      text: "Lịch hẹn",
      icon: <EventNoteIcon />,
      link: "/bookings",
    },
    {
      title: "Quản lý thanh toán",
      text: "Thanh toán",
      icon: <PaymentIcon />,
      link: "/payment",
    },
    {
      title: "Quản lý lịch sử khám bệnh",
      text: "Lịch sử khám bệnh",
      icon: <RestoreIcon />,
      link: "/history",
    },
   
    {
      title: "Thông tin tài khoản",
      text: "Thông tin tài khoản",
      icon: <PaymentIcon />,
      link: "/profile",
    },
  ];

  // Lọc các mục sidebar dựa trên role
  const sidebarItems = items.filter((item) => {
    // Nếu role = 2 (nhân viên), ẩn các mục "Tài khoản - Người dùng", "Nha sĩ", "Phòng khám"
    if (role === 2) {
      return ![
        "Quản lý tài khoản - người dùng",
        "Quản lý nha sĩ",
        "Quản lý phòng khám",
      ].includes(item.title);
    }
    // Nếu không phải role = 2, hiển thị tất cả trừ "Thông tin tài khoản"
    return item.title !== "Thông tin tài khoản";
  });

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="*"
            element={
              <div
                className="AppGlass"
                style={{ display: "flex", flexDirection: "row" }}
              >
                <TopBar items={items} />
                <div style={{ display: "flex", flex: 1 }}>
                  <Sidebar items={sidebarItems} />
                  <Box sx={{ flexGrow: 1, padding: "20px" }}>
                    <Routes>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/services" element={<Services />} />
                      <Route path="/users" element={<Users />} />
                      <Route
                        path="/dentailprofile"
                        element={<DentailProfile />}
                      />
                      <Route path="/doctor" element={<Doctors />} />
                      <Route path="/bookings" element={<Bookings />} />
                      <Route path="/center" element={<Center />} />
                      <Route
                        path="/ServiceCenter"
                        element={<ServiceCenter />}
                      />
                      <Route path="/promotions" element={<Promotions />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/payment" element={<Payment />} />
                      <Route path="/comments" element={<Comments />} />
                      <Route path="/history" element={<History />} />
                    </Routes>
                  </Box>
                </div>
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
