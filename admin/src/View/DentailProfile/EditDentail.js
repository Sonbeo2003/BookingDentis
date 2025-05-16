import React, { useState, useEffect } from 'react';
import './EditDentail.css';
import url from '../../ipconfig';
import { toast } from "react-toastify";

function EditDentailProfile({ profileToEdit, closeForm, onProfileUpdated }) {
  const [profile, setProfile] = useState(profileToEdit);
  const [users, setUsers] = useState([]); // State to store the list of users

  // Fetch users when the component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${url}/api_doctor/get_user_dental.php`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        setUsers(data); // Store the fetched users in state
      } catch (error) {
        console.error('Lỗi khi lấy danh sách người dùng:', error);
        toast.error('Không thể tải danh sách người dùng.');
      }
    };

    fetchUsers();
  }, []);

  // Update profile state when profileToEdit changes
  useEffect(() => {
    setProfile(profileToEdit);
  }, [profileToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Chuẩn bị dữ liệu để gửi
      const formData = new FormData();
      formData.append('profile_id', profile.profile_id);
      formData.append('user_id', profile.user_id);
      formData.append('current_issues', profile.current_issues);
      formData.append('general_status', profile.general_status);
      formData.append('last_checkup_date', profile.last_checkup_date);
      formData.append('last_treatment_date', profile.last_treatment_date);
      formData.append('note', profile.note);
      
      const response = await fetch(`${url}/api_doctor/suadentail.php`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      
      if (result.status) {
        toast.success(result.message);
        onProfileUpdated();
        closeForm();
      } else {
        toast.error(`Lỗi khi cập nhật hồ sơ răng: ${result.message}`);
      }
    } catch (error) {
      console.error('Lỗi khi kết nối tới server:', error);
      toast.error('Đã xảy ra lỗi khi kết nối tới server.');
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close-btn" onClick={closeForm}>×</span>
        <h3>Sửa Hồ Sơ Răng</h3>
        <form onSubmit={handleSubmit}>
          <label>ID Hồ Sơ:</label>
          <input type="text" name="profile_id" value={profile.profile_id} readOnly />

          <label>Tên Người Dùng:</label>
          <select 
            name="user_id" 
            value={profile.user_id} 
            onChange={handleChange} 
            required
            style={{ width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '5px', border: '1px solid #bdc3c7' }}
          >
            <option value="">Chọn người dùng</option>
            {users.map(user => (
              <option key={user.user_id} value={user.user_id}>
                {user.full_name}
              </option>
            ))}
          </select>

          <label>Vấn đề hiện tại:</label>
          <input type="text" name="current_issues" value={profile.current_issues} onChange={handleChange} required />

          <label>Tình trạng:</label>
          <input type="text" name="general_status" value={profile.general_status} onChange={handleChange} required />

          <label>Ngày kiểm tra cuối:</label>
          <input type="date" name="last_checkup_date" value={profile.last_checkup_date} onChange={handleChange} required />

          <label>Ngày điều trị cuối:</label>
          <input type="date" name="last_treatment_date" value={profile.last_treatment_date} onChange={handleChange} required />

          <label>Ghi chú:</label>
          <textarea
            name="note"
            value={profile.note}
            onChange={handleChange}
            rows="4"
            style={{ width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '5px', border: '1px solid #bdc3c7' }}
          ></textarea>

          <button type="submit">Cập Nhật Hồ Sơ</button>
        </form>
      </div>
    </div>
  );
}

export default EditDentailProfile;