import React, { useState, useEffect } from "react";
import "./Edithistory.css";
import url from "../../ipconfig";
import { toast } from "react-toastify";

function EditTreatment({ treatmentToEdit, closeForm, onTreatmentUpdated }) {
  const [treatment, setTreatment] = useState(treatmentToEdit);
  const [users, setUsers] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [services, setServices] = useState([]);
  const [beforeImage, setBeforeImage] = useState(null);
  const [afterImage, setAfterImage] = useState(null);
  const [previewBeforeImage, setPreviewBeforeImage] = useState(
    treatmentToEdit.before_image || ""
  );
  const [previewAfterImage, setPreviewAfterImage] = useState(
    treatmentToEdit.after_image || ""
  );

  // Lấy dữ liệu từ API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${url}/api_doctor/get_user_dental.php`);
        if (!response.ok) throw new Error("Lỗi khi tải danh sách người dùng");
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        toast.error(error.message);
      }
    };

    const fetchDoctors = async () => {
      try {
        const response = await fetch(`${url}/api_doctor/get_doctor_admin.php`);
        if (!response.ok) throw new Error("Lỗi khi tải danh sách nha sĩ");
        const data = await response.json();
        setDoctors(data);
      } catch (error) {
        toast.error(error.message);
      }
    };

    const fetchServices = async () => {
      try {
        const response = await fetch(`${url}/api_doctor/get_services_admin.php`);
        if (!response.ok) throw new Error("Lỗi khi tải danh sách dịch vụ");
        const data = await response.json();
        setServices(data);
      } catch (error) {
        toast.error(error.message);
      }
    };

    fetchUsers();
    fetchDoctors();
    fetchServices();

    // Cập nhật trạng thái treatment khi treatmentToEdit thay đổi
    setTreatment(treatmentToEdit);
    setPreviewBeforeImage(treatmentToEdit.before_image || "");
    setPreviewAfterImage(treatmentToEdit.after_image || "");
  }, [treatmentToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTreatment({ ...treatment, [name]: value });
  };

  const handleBeforeImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBeforeImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewBeforeImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAfterImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAfterImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewAfterImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let beforeImagePath = treatment.before_image;
      let afterImagePath = treatment.after_image;

      // Upload before image if new file selected
      if (beforeImage) {
        const formData = new FormData();
        formData.append("before_image", beforeImage);
        const uploadResponse = await fetch(
          `${url}/api_doctor/upload_image_history.php`,
          { method: "POST", body: formData }
        );
        const uploadResult = await uploadResponse.json();
        if (uploadResult.status) {
          beforeImagePath = uploadResult.file_path;
        } else {
          toast.error("Lỗi khi upload ảnh trước: " + uploadResult.message);
          return;
        }
      }

      // Upload after image if new file selected
      if (afterImage) {
        const formData = new FormData();
        formData.append("after_image", afterImage);
        const uploadResponse = await fetch(
          `${url}/api_doctor/upload_image_history.php`,
          { method: "POST", body: formData }
        );
        const uploadResult = await uploadResponse.json();
        if (uploadResult.status) {
          afterImagePath = uploadResult.file_path;
        } else {
          toast.error("Lỗi khi upload ảnh sau: " + uploadResult.message);
          return;
        }
      }

      const formData = new FormData();
      formData.append("id", treatment.treatment_id); // Đổi từ id thành treatment_id
      formData.append("user_id", treatment.user_id);
      formData.append("doctor_id", treatment.doctor_id);
      formData.append("service_id", treatment.service_id);
      formData.append("treatment_date", treatment.treatment_date);
      formData.append("description", treatment.description);
      formData.append("before_image", beforeImagePath);
      formData.append("after_image", afterImagePath);
      formData.append("oral_health_status", treatment.oral_health_status);

      const response = await fetch(`${url}/api_doctor/sualichsu.php`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.status) {
        toast.success(result.message);
        onTreatmentUpdated();
        closeForm();
      } else {
        toast.error(`Lỗi khi cập nhật lịch sử: ${result.message}`);
      }
    } catch (error) {
      console.error("Lỗi khi kết nối tới server:", error);
      toast.error("Đã xảy ra lỗi khi kết nối tới server.");
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close-btn" onClick={closeForm}>×</span>
        <h3>Sửa Lịch Sử Điều Trị</h3>
        <form onSubmit={handleSubmit}>
          <label>ID:</label>
          <input type="text" name="id" value={treatment.treatment_id} readOnly />

          <label>Người Dùng:</label>
          <select
            name="user_id"
            value={treatment.user_id}
            onChange={handleChange}
            required
          >
            <option value="">Chọn người dùng</option>
            {users.map((user) => (
              <option key={user.user_id} value={user.user_id}>
                {user.full_name}
              </option>
            ))}
          </select>

          <label>Nha Sĩ:</label>
          <select
            name="doctor_id"
            value={treatment.doctor_id}
            onChange={handleChange}
            required
          >
            <option value="">Chọn nha sĩ</option>
            {doctors.map((doctor) => (
              <option key={doctor.doctor_id} value={doctor.doctor_id}>
                {doctor.full_name}
              </option>
            ))}
          </select>

          <label>Dịch Vụ:</label>
          <select
            name="service_id"
            value={treatment.service_id}
            onChange={handleChange}
            required
          >
            <option value="">Chọn dịch vụ</option>
            {services.map((service) => (
              <option key={service.service_id} value={service.service_id}>
                {service.name}
              </option>
            ))}
          </select>

          <label>Ngày Điều Trị:</label>
          <input
            type="date"
            name="treatment_date"
            value={treatment.treatment_date}
            onChange={handleChange}
            required
          />

          <label>Mô Tả:</label>
          <textarea
            name="description"
            value={treatment.description}
            onChange={handleChange}
          />

          <label>Ảnh Trước:</label>
          <input
            type="file"
            name="before_image"
            accept="image/*"
            onChange={handleBeforeImageChange}
          />
          {previewBeforeImage && (
            <div className="image-preview">
              <img
                src={
                  previewBeforeImage.startsWith("data:")
                    ? previewBeforeImage
                    : `${url}/${previewBeforeImage}`
                }
                alt="Before Preview"
                style={{ maxWidth: "100px", marginTop: "10px" }}
              />
            </div>
          )}

          <label>Ảnh Sau:</label>
          <input
            type="file"
            name="after_image"
            accept="image/*"
            onChange={handleAfterImageChange}
          />
          {previewAfterImage && (
            <div className="image-preview">
              <img
                src={
                  previewAfterImage.startsWith("data:")
                    ? previewAfterImage
                    : `${url}/${previewAfterImage}`
                }
                alt="After Preview"
                style={{ maxWidth: "100px", marginTop: "10px" }}
              />
            </div>
          )}

          <label>Trạng Thái Sức Khỏe Răng Miệng:</label>
          <input
            type="text"
            name="oral_health_status"
            value={treatment.oral_health_status}
            onChange={handleChange}
          />

          <button type="submit">Cập Nhật Lịch Sử Điều Trị</button>
        </form>
      </div>
    </div>
  );
}

export default EditTreatment;