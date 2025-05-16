import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import ServiceImage from "../../assets/images/seo-nha-khoa-scaled.jpg";
import url from "../../ipconfig";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.includes("@") || !email.includes(".")) {
      setError("Email không hợp lệ. Vui lòng nhập email đúng định dạng.");
      return;
    }

    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }

    try {
      const response = await fetch(`${url}/api_doctor/admin_dangnhap.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          email: email,
          matkhau: password,
        }),
      });

      const data = await response.json();
      console.log("API Response:", data);

      if (data && data.success) {
        localStorage.setItem("user", JSON.stringify({
          user_id: data.user.user_id,
          full_name: data.user.full_name,
          email: data.user.email,
          phone_number: data.user.phone_number,
          address: data.user.address,
          role: data.user.role
        }));
        toast.success("Đăng nhập thành công!");
        navigate("/dashboard", { state: { toastMessage: "Đăng nhập thành công!" } });
      } else {
        setError(data.message || "Sai thông tin email hoặc mật khẩu. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("Đã xảy ra lỗi trong quá trình đăng nhập, vui lòng thử lại sau.");
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${url}/api_doctor/forgot_password.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          email: email,
          oldPassword: oldPassword,
        }),
      });

      const data = await response.json();

      if (data && data.success) {
        setForgotMessage("Mật khẩu mới đã được gửi đến email của bạn!");
        setOldPassword("");
        setTimeout(() => setShowForgotPassword(false), 3000); // Hide form after 3 seconds
      } else {
        setForgotMessage(data.message || "Xác nhận mật khẩu cũ không đúng. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Error during forgot password:", error);
      setForgotMessage("Đã xảy ra lỗi, vui lòng thử lại sau.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="image-side"></div>
          <div className="form-side">
            <h2>Đăng Nhập</h2>
            {error && <div style={{ color: "red", marginBottom: "15px", textAlign: "center" }}>{error}</div>}
            {!showForgotPassword ? (
              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <div className="input-with-icon">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email"
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <div className="input-with-icon password-input-container">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      required
                    />
                    <span
                      className="eye-icon"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                </div>
                <div className="form-options">
                  <div className="remember-me">
                    <input
                      type="checkbox"
                      id="remember"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <label htmlFor="remember">Remember me</label>
                  </div>
                </div>
                <button type="submit" className="login-button">LOGIN</button>
                <div className="forgot-password-link">
                  <a href="#" onClick={() => setShowForgotPassword(true)}>Quên Mật Khẩu?</a>
                </div>
                <div className="alternative-login">
                  <p>or login with</p>
                  <div className="social-buttons">
                    <button type="button" className="facebook-btn">facebook</button>
                    <button type="button" className="google-btn">google</button>
                    <button type="button" className="twitter-btn">twitter</button>
                  </div>
                </div>
              </form>
            ) : (
              <form onSubmit={handleForgotPassword}>
                <div className="form-group">
                  <div className="input-with-icon">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email"
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <div className="input-with-icon">
                    <input
                      type="password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      placeholder="Mật khẩu cũ"
                      required
                    />
                  </div>
                </div>
                <button type="submit" className="login-button">Gửi mật khẩu mới</button>
                <div style={{ textAlign: "center", marginTop: "10px" }}>
                  {forgotMessage && <span style={{ color: forgotMessage.includes("thành công") ? "green" : "red" }}>{forgotMessage}</span>}
                  <br />
                  <a href="#" onClick={() => setShowForgotPassword(false)}>Quay lại đăng nhập</a>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;