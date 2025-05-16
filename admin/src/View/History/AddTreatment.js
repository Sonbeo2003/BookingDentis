import React, { useState, useEffect } from "react";
import "./Addhistory.css";
import url from "../../ipconfig";
import { toast } from "react-toastify";

function AddTreatment({ closeForm, onTreatmentAdded }) {
  const [treatment, setTreatment] = useState({
    user_id: "",
    doctor_id: "",
    service_id: "",
    treatment_date: "",
    description: "",
    before_image: "",
    after_image: "",
    oral_health_status: "",
  });

  const [users, setUsers] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [services, setServices] = useState([]);
  const [beforeImage, setBeforeImage] = useState(null);
  const [afterImage, setAfterImage] = useState(null);
  const [previewBeforeImage, setPreviewBeforeImage] = useState("");
  const [previewAfterImage, setPreviewAfterImage] = useState("");

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
  }, []);

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
      let beforeImageUrl = "";
      let afterImageUrl = "";

      // Upload before image
      if (beforeImage) {
        const beforeImageFormData = new FormData();
        beforeImageFormData.append("before_image", beforeImage);
        const uploadResponse = await fetch(
          `${url}/api_doctor/upload_image_history.php`,
          { method: "POST", body: beforeImageFormData }
        );
        const uploadResult = await uploadResponse.json();
        if (uploadResult.status) {
          beforeImageUrl = uploadResult.file_path;
        } else {
          toast.error("Lỗi khi upload ảnh trước: " + uploadResult.message);
          return;
        }
      }

      // Upload after image
      if (afterImage) {
        const afterImageFormData = new FormData();
        afterImageFormData.append("after_image", afterImage);
        const uploadResponse = await fetch(
          `${url}/api_doctor/upload_image_history.php`,
          { method: "POST", body: afterImageFormData }
        );
        const uploadResult = await uploadResponse.json();
        if (uploadResult.status) {
          afterImageUrl = uploadResult.file_path;
        } else {
          toast.error("Lỗi khi upload ảnh sau: " + uploadResult.message);
          return;
        }
      }

      const treatmentData = {
        ...treatment,
        before_image: beforeImageUrl,
        after_image: afterImageUrl,
      };

      const response = await fetch(`${url}/api_doctor/themlichsu.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(treatmentData),
      });

      const result = await response.json();

      if (result.status) {
        toast.success(result.message);
        onTreatmentAdded();
        closeForm();
        setTreatment({
          user_id: "",
          doctor_id: "",
          service_id: "",
          treatment_date: "",
          description: "",
          before_image: "",
          after_image: "",
          oral_health_status: "",
        });
      } else {
        toast.error("Có lỗi xảy ra: " + (result.error || result.message));
      }
    } catch (error) {
      console.error("Lỗi khi thêm lịch sử điều trị:", error);
      toast.error("Đã xảy ra lỗi. Vui lòng thử lại.");
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close-btn" onClick={closeForm}>×</span>
        <h3>Thêm Lịch Sử Điều Trị</h3>
        <form onSubmit={handleSubmit}>
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
                src={previewBeforeImage}
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
                src={previewAfterImage}
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

          <button type="submit">Thêm Lịch Sử Điều Trị</button>
        </form>
      </div>
    </div>
  );
}

export default AddTreatment;