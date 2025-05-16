import React, { useState, useEffect } from 'react';
import './EditService.css';
import url from '../../ipconfig';
import { toast } from "react-toastify";

function EditService({ serviceToEdit, closeForm, onServiceUpdated }) {
  const [service, setService] = useState(serviceToEdit);
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewImage, setPreviewImage] = useState(serviceToEdit.image || '');

  useEffect(() => {
    setService(serviceToEdit);
    setPreviewImage(serviceToEdit.image || '');
  }, [serviceToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setService({ ...service, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      
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
      let imagePath = service.image;
      
      if (profilePicture) {
        const formData = new FormData();
        formData.append('image', profilePicture);
        
        const uploadResponse = await fetch(`${url}/api_doctor/upload_image_service.php`, {
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
      
      const formData = new FormData();
      formData.append('service_id', service.service_id);
      formData.append('name', service.name);
      formData.append('description', service.description);
      formData.append('price', service.price);
      formData.append('duration_minutes', service.duration_minutes);
      formData.append('image', imagePath);
      
      const response = await fetch(`${url}/api_doctor/suadichvu.php`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      
      if (result.status) {
        toast.success(result.message);
        onServiceUpdated();
        closeForm();
      } else {
        toast.error(`Lỗi khi cập nhật dịch vụ: ${result.message}`);
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
        <h3>Sửa Dịch Vụ</h3>
        <form onSubmit={handleSubmit}>
          <label>ID Dịch Vụ:</label>
          <input type="text" name="service_id" value={service.service_id} readOnly />

          <label>Tên Dịch Vụ:</label>
          <input type="text" name="name" value={service.name} onChange={handleChange} required />

          <label>Mô Tả:</label>
          <input type="text" name="description" value={service.description} onChange={handleChange} required />

          <label>Giá:</label>
          <input type="number" name="price" value={service.price} onChange={handleChange} required />

          <label>Thời Gian Thực Hiện (phút):</label>
          <input type="number" name="duration_minutes" value={service.duration_minutes} onChange={handleChange} required />

          <label>Hình Ảnh:</label>
          <input 
            type="file" 
            name="image" 
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

          <button type="submit">Cập Nhật Dịch Vụ</button>
        </form>
      </div>
    </div>
  );
}

export default EditService;