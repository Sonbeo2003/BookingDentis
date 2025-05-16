import React, { useState, useEffect } from 'react';
import './EditCenter.css';
import url from '../../ipconfig';
import { toast } from "react-toastify";

function EditCenter({ CenterToEdit, closeForm, onCenterUpdated }) {
  const [center, setCenter] = useState(CenterToEdit);
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewImage, setPreviewImage] = useState(CenterToEdit.picture || '');

  useEffect(() => {
    setCenter(CenterToEdit);
    setPreviewImage(CenterToEdit.picture || '');
  }, [CenterToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCenter({ ...center, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      
      // Tạo preview cho ảnh
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imagePath = center.picture;
      
      // Nếu có chọn file ảnh mới, upload ảnh trước
      if (profilePicture) {
        const formData = new FormData();
        formData.append('picture', profilePicture);
        
        const uploadResponse = await fetch(`${url}/api_doctor/upload_image_center.php`, {
          method: 'POST',
          body: formData,
        });
        
        const uploadResult = await uploadResponse.json();
        
        if (uploadResult.status) {
          imagePath = uploadResult.file_path;
        } else {
          toast.error("Lỗi khi upload ảnh: " + uploadResult.message);
          return;
        }
      }
      
      // Chuẩn bị dữ liệu để gửi
      const formData = new FormData();
      formData.append('clinic_id', center.clinic_id);
      formData.append('name', center.name);
      formData.append('address', center.address);
      formData.append('phone_number', center.phone_number);
      formData.append('email', center.email);
      formData.append('X_location', center.X_location);
      formData.append('Y_location', center.Y_location);
      formData.append('picture', imagePath);
      formData.append('opening_hours', center.opening_hours);
      formData.append('status', center.status);
      
      const response = await fetch(`${url}/api_doctor/suatrungtam.php`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      
      if (result.status) {
        toast.success(result.message);
        onCenterUpdated();
        closeForm();
      } else {
        toast.error(`Lỗi khi cập nhật chi nhánh: ${result.message}`);
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
        <h3>Sửa Chi Nhánh</h3>
        <form onSubmit={handleSubmit}>
          <label>ID Chi Nhánh:</label>
          <input type="text" name="clinic_id" value={center.clinic_id} readOnly />

          <label>Tên Chi Nhánh:</label>
          <input type="text" name="name" value={center.name} onChange={handleChange} required />

          <label>Địa Chỉ:</label>
          <input type="text" name="address" value={center.address} onChange={handleChange} required />

          <label>Số Điện Thoại:</label>
          <input type="text" name="phone_number" value={center.phone_number} onChange={handleChange} required />

          <label>Email:</label>
          <input type="email" name="email" value={center.email} onChange={handleChange} required />

          <label>X-Location:</label>
          <input type="text" name="X_location" value={center.X_location} onChange={handleChange} />

          <label>Y-Location:</label>
          <input type="text" name="Y_location" value={center.Y_location} onChange={handleChange} />

          <label>Giờ Mở Cửa:</label>
          <input type="text" name="opening_hours" value={center.opening_hours} onChange={handleChange} required />

          <label>Trạng Thái:</label>
          <select name="status" value={center.status} onChange={handleChange} required>
            <option value="Hoạt động">Hoạt động</option>
            <option value="Không hoạt động">Không hoạt động</option>
          </select>

          <label>Hình Ảnh:</label>
          <input 
            type="file" 
            name="picture" 
            accept="image/*" 
            onChange={handleFileChange} 
          />
          
          {previewImage && (
            <div className="image-preview">
              <img 
                src={previewImage.startsWith('data:') ? previewImage : `${url}/${previewImage}`} 
                alt="Xem trước ảnh" 
                style={{ maxWidth: '100px', marginTop: '10px' }} 
              />
            </div>
          )}

          <button type="submit">Cập Nhật Chi Nhánh</button>
        </form>
      </div>
    </div>
  );
}

export default EditCenter;