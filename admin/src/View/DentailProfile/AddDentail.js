import React, { useState, useEffect } from 'react';
import './AddDentail.css'; 
import url from '../../ipconfig';
import { toast } from "react-toastify";

function AddDentailProfile({ closeForm, onProfileAdded }) {
  const [profile, setProfile] = useState({
    user_id: '',
    current_issues: '',
    general_status: '',
    last_checkup_date: '',
    last_treatment_date: '',
    note: ''
  });
  
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Chuẩn bị dữ liệu để gửi
      const profileData = {
        ...profile
      };
  
      const response = await fetch(`${url}/api_doctor/themdentail.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });
  
      const result = await response.json();
  
      if (result.status) {
        toast.success(result.message);
        onProfileAdded();
        closeForm();
        setProfile({
          user_id: '',
          current_issues: '',
          general_status: '',
          last_checkup_date: '',
          last_treatment_date: '',
          note: ''
        });
      } else {
        toast.error("Có lỗi xảy ra: " + (result.error || result.message));
      }
    } catch (error) {
      console.error('Lỗi khi thêm hồ sơ răng:', error);
      toast.error('Đã xảy ra lỗi. Vui lòng thử lại.');
    }
  };
  
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close-btn" onClick={closeForm}>×</span>
        <h3>Thêm Hồ Sơ Răng</h3>
        <form onSubmit={handleSubmit}>
          <label>ID Người dùng:</label>
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

          <button type="submit">Thêm Hồ Sơ</button>
        </form>
      </div>
    </div>
  );
}

export default AddDentailProfile;