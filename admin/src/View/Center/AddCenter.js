import React, { useState } from 'react';
import './AddCenter.css'; 
import url from '../../ipconfig';
import { toast } from "react-toastify";

function AddCenter({ closeForm, onCenterAdded }) {
  const [center, setCenter] = useState({
    name: '',
    address: '',
    phone_number: '',
    email: '',
    X_location: '',
    Y_location: '',
    picture: '',
    opening_hours: '',
    status: 'Hoạt động',
  });
  
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewImage, setPreviewImage] = useState('');

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
      // Nếu có chọn file ảnh, upload ảnh trước
      let imageUrl = '';
      if (profilePicture) {
        const imageFormData = new FormData();
        imageFormData.append('picture', profilePicture);
        
        try {
          const uploadResponse = await fetch(`${url}/api_doctor/upload_image_center.php`, {
            method: 'POST',
            body: imageFormData,
          });
          
          const uploadResult = await uploadResponse.json();
          
          if (uploadResult.status) {
            imageUrl = uploadResult.file_path;
          } else {
            toast.error("Lỗi khi upload ảnh: " + uploadResult.message);
            return;
          }
        } catch (uploadError) {
          console.error('Lỗi khi upload ảnh:', uploadError);
          toast.error('Lỗi khi upload ảnh. Vui lòng thử lại.');
          return;
        }
      }

      // Chuẩn bị dữ liệu để gửi
      const centerData = {
        ...center,
        picture: imageUrl || center.picture
      };
  
      const response = await fetch(`${url}/api_doctor/themtrungtam.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(centerData),
      });
  
      const result = await response.json();
  
      if (result.status) {
        toast.success(result.message);
        onCenterAdded();
        closeForm();
        setCenter({
          name: '',
          address: '',
          phone_number: '',
          email: '',
          X_location: '',
          Y_location: '',
          picture: '',
          opening_hours: '',
          status: 'Hoạt động',
        });
      } else {
        toast.error("Có lỗi xảy ra: " + (result.error || result.message));
      }
    } catch (error) {
      console.error('Lỗi khi thêm chi nhánh:', error);
      toast.error('Đã xảy ra lỗi. Vui lòng thử lại.');
    }
  };
  
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close-btn" onClick={closeForm}>×</span>
        <h3>Thêm Chi Nhánh</h3>
        <form onSubmit={handleSubmit}>
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
          <input type="text" name="opening_hours" value={center.opening_hours} onChange={handleChange} placeholder="Thứ 2 - Chủ nhật: 8h - 20h" required />

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
              <img src={previewImage} alt="Xem trước ảnh" style={{ maxWidth: '100px', marginTop: '10px' }} />
            </div>
          )}

          <button type="submit">Thêm Chi Nhánh</button>
        </form>
      </div>
    </div>
  );
}

export default AddCenter;