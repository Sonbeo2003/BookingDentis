import React, { useState, useEffect } from 'react';
import url from '../../ipconfig';
import { toast } from "react-toastify";

function EditUser({ userToEdit, closeForm, onUserUpdated }) {
  const [user, setUser] = useState(() => {
    // Đảm bảo role và status luôn là số khi nhận từ prop
    return {
      ...userToEdit,
      role: typeof userToEdit.role === 'string' ? parseInt(userToEdit.role, 10) : userToEdit.role,
      status: typeof userToEdit.status === 'string' ? parseInt(userToEdit.status, 10) : userToEdit.status
    };
  });

  useEffect(() => {
    // Cập nhật state khi prop thay đổi, đảm bảo role và status là số
    setUser({
      ...userToEdit,
      role: typeof userToEdit.role === 'string' ? parseInt(userToEdit.role, 10) : userToEdit.role,
      status: typeof userToEdit.status === 'string' ? parseInt(userToEdit.status, 10) : userToEdit.status
    });
  }, [userToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Đảm bảo role và status là số
    if (name === 'role' || name === 'status') {
      setUser({ ...user, [name]: parseInt(value, 10) });
    } else {
      setUser({ ...user, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Dữ liệu gửi đi:", user);
      
      // Tạo một bản sao của user và đảm bảo status và role là số
      const userData = {
        ...user,
        status: Number(user.status),
        role: Number(user.role)
      };
      
      // Sử dụng JSON thay vì FormData để đảm bảo kiểu dữ liệu được giữ nguyên
      const response = await fetch(`${url}/api_doctor/suanguoidung.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      const result = await response.json();
      
      if (response.ok) {
        toast.success(result.message);
        onUserUpdated();
        closeForm();
      } else {
        toast.error(`Lỗi khi cập nhật: ${result.message}`);
      }
    } catch (error) {
      console.error('Lỗi khi kết nối tới server:', error);
      toast.error('Đã xảy ra lỗi khi kết nối tới server.');
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close-btn" onClick={closeForm}>&times;</span>
        <h3>Sửa Người Dùng</h3>
        <form onSubmit={handleSubmit}>
          <label>ID:</label>
          <input type="text" name="user_id" value={user.user_id} readOnly />

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
            <option value="Khác">Khác</option>
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

          <button type="submit">Cập Nhật Người Dùng</button>
        </form>
      </div>
    </div>
  );
}

export default EditUser;