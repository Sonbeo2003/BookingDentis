import React, { useState, useEffect } from 'react';
import './AddDoctor.css'; 
import url from '../../ipconfig';
import { toast } from "react-toastify";

function AddDoctor({ closeForm, onDoctorAdded }) {
  const [doctor, setDoctor] = useState({
    full_name: '',
    specialty: '',
    phone_number: '',
    email: '',
    profile_picture: '',
    description: '',
    clinic_id: '',
    working_schedule: '',
    status: 'đang làm việc'
  });
  
  const [clinics, setClinics] = useState([]);
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewImage, setPreviewImage] = useState('');

  // Lấy danh sách chi nhánh khi component được tạo
  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const response = await fetch(`${url}/api_doctor/get_clinic_doctor.php`);
        if (!response.ok) {
          throw new Error("Lỗi khi tải danh sách chi nhánh");
        }
        const data = await response.json();
        setClinics(data);
        // Nếu có chi nhánh, đặt giá trị mặc định cho clinic_id
        if (data.length > 0) {
          setDoctor(prev => ({...prev, clinic_id: data[0].clinic_id}));
        }
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
      // Thay đổi phương thức để sử dụng FormData thay vì JSON
      const formData = new FormData();

      // Thêm thông tin bác sĩ vào FormData
      formData.append('full_name', doctor.full_name);
      formData.append('specialty', doctor.specialty);
      formData.append('phone_number', doctor.phone_number);
      formData.append('email', doctor.email);
      formData.append('description', doctor.description);
      formData.append('clinic_id', doctor.clinic_id);
      formData.append('working_schedule', doctor.working_schedule);
      formData.append('status', doctor.status);
      
      // Nếu có chọn file ảnh, upload ảnh trước
      if (profilePicture) {
        const imageFormData = new FormData();
        imageFormData.append('profile_picture', profilePicture);
        
        try {
          const uploadResponse = await fetch(`${url}/api_doctor/upload_image.php`, {
            method: 'POST',
            body: imageFormData,
          });
          
          const uploadResult = await uploadResponse.json();
          
          if (uploadResult.status) {
            formData.append('profile_picture', uploadResult.file_path);
          } else {
            toast.error("Lỗi khi upload ảnh: " + uploadResult.message);
            return;
          }
        } catch (uploadError) {
          console.error('Lỗi khi upload ảnh:', uploadError);
          toast.error('Lỗi khi upload ảnh. Vui lòng thử lại.');
          return;
        }
      } else {
        formData.append('profile_picture', ''); // Nếu không có ảnh, gửi chuỗi rỗng
      }
      
      // Chuyển đổi FormData thành JSON
      const doctorData = {};
      formData.forEach((value, key) => {
        doctorData[key] = value;
      });
      
      // Gửi dữ liệu để tạo bác sĩ
      const response = await fetch(`${url}/api_doctor/themdoctor.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(doctorData),
      });
      
      // Kiểm tra nếu response không phải là JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Response không phải là JSON:", text);
        toast.error("Phản hồi từ server không hợp lệ. Vui lòng kiểm tra lại.");
        return;
      }
  
      const result = await response.json();
  
      if (result.status) {
        toast.success(result.message);
        onDoctorAdded();
        closeForm();
        setDoctor({
          full_name: '',
          specialty: '',
          phone_number: '',
          email: '',
          profile_picture: '',
          description: '',
          clinic_id: clinics.length > 0 ? clinics[0].clinic_id : '',
          working_schedule: '',
          status: 'đang làm việc'
        });
      } else {
        toast.error("Có lỗi xảy ra: " + (result.error || result.message));
      }
    } catch (error) {
      console.error('Lỗi khi thêm bác sĩ:', error);
      toast.error('Đã xảy ra lỗi. Vui lòng thử lại.');
    }
  };
  
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close-btn" onClick={closeForm}>×</span>
        <h3>Thêm Bác Sĩ</h3>
        <form onSubmit={handleSubmit}>
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
            required 
          />
          
          {previewImage && (
            <div className="image-preview">
              <img src={previewImage} alt="Xem trước ảnh" style={{ maxWidth: '100px', marginTop: '10px' }} />
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

          <button type="submit">Thêm Bác Sĩ</button>
        </form>
      </div>
    </div>
  );
}

export default AddDoctor;