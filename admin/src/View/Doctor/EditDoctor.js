import React, { useState, useEffect } from 'react';
import './EditDoctor.css';
import url from '../../ipconfig';
import { toast } from "react-toastify";

function EditDoctor({ doctorToEdit, closeForm, onDoctorUpdated }) {
  const [doctor, setDoctor] = useState(doctorToEdit);
  const [clinics, setClinics] = useState([]);
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewImage, setPreviewImage] = useState(doctorToEdit.profile_picture || '');

  useEffect(() => {
    setDoctor(doctorToEdit);
    setPreviewImage(doctorToEdit.profile_picture || '');
  }, [doctorToEdit]);

  // Lấy danh sách chi nhánh
  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const response = await fetch(`${url}/api_doctor/get_clinic_doctor.php`);
        if (!response.ok) {
          throw new Error("Lỗi khi tải danh sách chi nhánh");
        }
        const data = await response.json();
        setClinics(data);
      } catch (error) {
        console.error("Lỗi khi tải danh sách chi nhánh:", error);
        toast.error("Không thể tải danh sách chi nhánh. Vui lòng kiểm tra kết nối.");
      }
    };
    fetchClinics();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDoctor({ ...doctor, [name]: value });
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
      let imagePath = doctor.profile_picture;
      
      // Nếu có chọn file ảnh mới, upload ảnh trước
      if (profilePicture) {
        const formData = new FormData();
        formData.append('profile_picture', profilePicture);
        
        const uploadResponse = await fetch(`${url}/api_doctor/upload_image.php`, {
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
      
      // Chuẩn bị FormData để gửi
      const formData = new FormData();
      formData.append('doctor_id', doctor.doctor_id);
      formData.append('full_name', doctor.full_name);
      formData.append('specialty', doctor.specialty);
      formData.append('phone_number', doctor.phone_number);
      formData.append('email', doctor.email);
      formData.append('profile_picture', imagePath);
      formData.append('description', doctor.description);
      formData.append('clinic_id', doctor.clinic_id);
      formData.append('working_schedule', doctor.working_schedule);
      formData.append('status', doctor.status);
      
      const response = await fetch(`${url}/api_doctor/suadoctor.php`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      
      if (result.status) {
        toast.success(result.message);
        onDoctorUpdated();
        closeForm();
      } else {
        toast.error(`Lỗi khi cập nhật bác sĩ: ${result.message}`);
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
        <h3>Sửa Thông Tin Bác Sĩ</h3>
        <form onSubmit={handleSubmit}>
          <label>ID Bác Sĩ:</label>
          <input type="text" name="doctor_id" value={doctor.doctor_id} readOnly />

          <label>Họ Tên:</label>
          <input type="text" name="full_name" value={doctor.full_name} onChange={handleChange} required />

          <label>Chuyên Khoa:</label>
          <input type="text" name="specialty" value={doctor.specialty} onChange={handleChange} required />

          <label>Số Điện Thoại:</label>
          <input type="text" name="phone_number" value={doctor.phone_number} onChange={handleChange} required />

          <label>Email:</label>
          <input type="email" name="email" value={doctor.email} onChange={handleChange} required />

          <label>Ảnh Đại Diện:</label>
          <input 
            type="file" 
            name="profile_picture" 
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

          <label>Mô Tả:</label>
          <textarea name="description" value={doctor.description} onChange={handleChange} required />

          <label>Chi Nhánh:</label>
          <select name="clinic_id" value={doctor.clinic_id} onChange={handleChange} required>
            {clinics.length > 0 ? (
              clinics.map(clinic => (
                <option key={clinic.clinic_id} value={clinic.clinic_id}>
                  {clinic.name}
                </option>
              ))
            ) : (
              <option value="">Đang tải danh sách chi nhánh...</option>
            )}
          </select>

          <label>Lịch Làm Việc:</label>
          <input type="text" name="working_schedule" value={doctor.working_schedule} onChange={handleChange} required />

          <label>Trạng Thái:</label>
          <select name="status" value={doctor.status} onChange={handleChange} required>
            <option value="đang làm việc">Đang làm việc</option>
            <option value="nghỉ">Nghỉ</option>
          </select>

          <button type="submit">Cập Nhật Thông Tin</button>
        </form>
      </div>
    </div>
  );
}

export default EditDoctor;