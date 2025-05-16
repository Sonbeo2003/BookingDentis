import React, { useState } from 'react';
import './AddServices.css'; 
import url from '../../ipconfig';
import { toast } from "react-toastify";

function AddService({ closeForm, onServiceAdded }) {
  const [service, setService] = useState({
    name: '',
    description: '',
    price: '',
    duration_minutes: '',
    image: ''
  });

  const [profilePicture, setProfilePicture] = useState(null);
  const [previewImage, setPreviewImage] = useState('');

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
      let imageUrl = '';
      if (profilePicture) {
        const imageFormData = new FormData();
        imageFormData.append('image', profilePicture);
        
        try {
          const uploadResponse = await fetch(`${url}/api_doctor/upload_image_service.php`, {
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

      const serviceData = {
        ...service,
        image: imageUrl || service.image
      };
  
      const response = await fetch(`${url}/api_doctor/themdichvu.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(serviceData),
      });
  
      const result = await response.json();
  
      if (result.status) {
        toast.success(result.message);
        onServiceAdded();
        closeForm();
        setService({
          name: '',
          description: '',
          price: '',
          duration_minutes: '',
          image: ''
        });
      } else {
        toast.error("Có lỗi xảy ra: " + (result.error || result.message));
      }
    } catch (error) {
      console.error('Lỗi khi thêm dịch vụ:', error);
      toast.error('Đã xảy ra lỗi. Vui lòng thử lại.');
    }
  };
  
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close-btn" onClick={closeForm}>×</span>
        <h3>Thêm Dịch Vụ</h3>
        <form onSubmit={handleSubmit}>
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
              <img src={previewImage} alt="Xem trước ảnh" style={{ maxWidth: '100px', marginTop: '10px' }} />
            </div>
          )}

          <button type="submit">Thêm Dịch Vụ</button>
        </form>
      </div>
    </div>
  );
}

export default AddService;