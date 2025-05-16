import React, { useState } from 'react';
import './AddUser.css';
import url from '../../ipconfig';
import { toast } from "react-toastify";

function AddUser({ closeForm, onUserAdded }) {
  const [user, setUser] = useState({
    full_name: '',
    email: '',
    password: '',
    phone_number: '',
    address: '',
    gender: 'Nam',
    date_of_birth: '',
    status: 1,
    role: 2
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Chuyển đổi role và status từ string sang số khi thay đổi
    if (name === 'role' || name === 'status') {
      setUser({ ...user, [name]: parseInt(value, 10) });
    } else {
      setUser({ ...user, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      console.log("Dữ liệu gửi đi:", user);
      
      const response = await fetch(`${url}/api_doctor/themnguoidung.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });
      
      // Kiểm tra response có phải JSON không
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const textResponse = await response.text();
        throw new Error(`API trả về không phải JSON: ${textResponse.substring(0, 100)}...`);
      }
      
      const result = await response.json();
      console.log("Kết quả từ API:", result);
      
      if (result.success) {
        toast.success(result.message);
        onUserAdded();
        closeForm();
        // Reset form
        setUser({
          full_name: '',
          email: '',
          password: '',
          phone_number: '',
          address: '',
          gender: 'Nam',
          date_of_birth: '',
          status: 1,
          role: 2
        });
      } else {
        toast.error(result.error || "Có lỗi xảy ra khi thêm người dùng");
      }
    } catch (error) {
      console.error('Lỗi khi thêm người dùng:', error);
      toast.error(`Lỗi kết nối: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close-btn" onClick={closeForm}>&times;</span>
        <h3>Thêm Người Dùng</h3>
        <form onSubmit={handleSubmit}>
          <label>Họ Tên:</label>
          <input type="text" name="full_name" value={user.full_name} onChange={handleChange} required />

          <label>Email:</label>
          <input type="email" name="email" value={user.email} onChange={handleChange} required />

          <label>Mật Khẩu:</label>
          <input type="password" name="password" value={user.password} onChange={handleChange} required />

          <label>Số Điện Thoại:</label>
          <input type="text" name="phone_number" value={user.phone_number} onChange={handleChange} required />

          <label>Địa Chỉ:</label>
          <input type="text" name="address" value={user.address} onChange={handleChange} required />

          <label>Giới Tính:</label>
          <select name="gender" value={user.gender} onChange={handleChange} required>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
          </select>

          <label>Ngày Sinh:</label>
          <input type="date" name="date_of_birth" value={user.date_of_birth} onChange={handleChange} required />

          <label>Trạng Thái:</label>
          <select name="status" value={user.status} onChange={handleChange} required>
            <option value={1}>Hoạt động</option>
            <option value={0}>Không hoạt động</option>
          </select>

          <label>Vai Trò:</label>
          <select name="role" value={user.role} onChange={handleChange} required>
            <option value={1}>Nhân viên</option>
            <option value={2}>Khách hàng</option>
          </select>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Đang xử lý...' : 'Thêm Người Dùng'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddUser;