import React, { useEffect, useState } from "react";
import "./Profile.css";
import imgprofile from "../../assets/images/image.png";
import { FaKey, FaUserEdit, FaEye, FaEyeSlash } from "react-icons/fa";
import { PiUserList, PiEnvelope, PiPhone, PiMapPin } from "react-icons/pi";
import { MdOutlineCake } from "react-icons/md";
import { FaVenusMars } from "react-icons/fa";
import url from "../../ipconfig";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [showChangePass, setShowChangePass] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  if (!user) {
    return <p>Loading...</p>;
  }

  const handleChangePassword = async () => {
    const response = await fetch(`${url}/api_doctor/Doimatkhau.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: user.user_id,
        oldPassword: oldPassword,
        newPassword: newPassword,
      }),
    });
    const result = await response.json();
    setMessage(result.message);
    if (result.success) {
      setOldPassword("");
      setNewPassword("");
      setShowChangePass(false);
    }
  };

  // Function to determine the role display text
  const getRoleDisplay = (role) => {
    switch (role) {
      case 0:
        return "Admin";
      case 2:
        return "Quản lý";
      case 1:
      default:
        return "Người dùng";
    }
  };

  return (
    <div className="profile-page">
      <div>
        <p style={{ fontSize: 30, color: "black", fontWeight: "bold", margin: 0 }}>
          Thông tin tài khoản
        </p>
        <p>Chào mừng {user.full_name} đến với hệ thống</p>
      </div>
      <div className="user-info-container">
        <img src={imgprofile} alt="Avatar" className="user-avatar" />
        <div className="user-details">
          <h2 className="user-name">{user.full_name}</h2>
          <p className="user-role">
            {getRoleDisplay(user.role)}
          </p>
          <div className="button-container">
            <button className="button-changepass" onClick={() => setShowChangePass(true)}>
              <FaKey style={{ marginRight: "5px" }} />
              Đổi mật khẩu
            </button>
            <button className="button-updateprofile">
              <FaUserEdit style={{ marginRight: "5px" }} />
              Chỉnh sửa thông tin
            </button>
          </div>
        </div>
      </div>

      <div className="user-info">
        <p style={{ fontSize: 25, color: "black", fontWeight: "bold", marginBottom: 20 }}>
          Thông tin cơ bản
        </p>
        <p>
          <PiUserList style={{ marginRight: 10, verticalAlign: "middle", fontSize: 30 }} />
          <strong>Họ và tên:</strong> {user.full_name}
        </p>
        <p>
          <PiEnvelope style={{ marginRight: 10, verticalAlign: "middle", fontSize: 30 }} />
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <PiPhone style={{ marginRight: 10, verticalAlign: "middle", fontSize: 30 }} />
          <strong>Số điện thoại:</strong> {user.phone_number}
        </p>
        <p>
          <PiMapPin style={{ marginRight: 10, verticalAlign: "middle", fontSize: 30 }} />
          <strong>Địa chỉ:</strong> {user.address || "Chưa cập nhật"}
        </p>
      </div>

      {showChangePass && (
        <div className="modal">
          <div className="modal-content">
            <h2>Đổi mật khẩu</h2>
            <div className="password-input-container">
              <input
                type={showOldPassword ? "text" : "password"}
                placeholder="Mật khẩu cũ"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
              <span
                className="eye-icon"
                onClick={() => setShowOldPassword(!showOldPassword)}
              >
                {showOldPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <div className="password-input-container">
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="Mật khẩu mới"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <span
                className="eye-icon"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <button onClick={handleChangePassword}>Xác nhận</button>
            <button onClick={() => setShowChangePass(false)}>Hủy</button>
            {message && <p>{message}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;