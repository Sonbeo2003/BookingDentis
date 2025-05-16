import React, { useState, useEffect, useCallback } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./Doctor.css";
import url from "../../ipconfig";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddDoctor from "./AddDoctor";
import EditDoctor from "./EditDoctor";

// Custom hook for debounce
function useSearchDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [showAddDoctor, setShowAddDoctor] = useState(false);
  const [showEditDoctor, setShowEditDoctor] = useState(false);
  const [doctorToEdit, setDoctorToEdit] = useState(null);

  const debounceKeyword = useSearchDebounce(searchTerm, 500);

  // Load doctor list
  const loadDoctors = useCallback(async () => {
    try {
      const response = await fetch(`${url}/api_doctor/getdoctor.php`);
      if (!response.ok) {
        throw new Error("Lỗi khi tải dữ liệu");
      }
      const data = await response.json();
      setDoctors(data);
      setFilteredDoctors(data);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
      toast.error("Không thể tải danh sách bác sĩ. Vui lòng kiểm tra kết nối hoặc dữ liệu.");
    }
  }, []);

  // Search doctors
  const searchDoctors = useCallback(async (searchTerm) => {
    try {
      const response = await fetch(
        `${url}/api_doctor/timkiemdoctor.php?searchTerm=${searchTerm}`
      );
      if (!response.ok) {
        throw new Error("Lỗi khi tìm kiếm bác sĩ");
      }
      const data = await response.json();
      setFilteredDoctors(data);
    } catch (error) {
      console.error("Lỗi khi tìm kiếm:", error);
      toast.error("Không thể tìm kiếm bác sĩ. Vui lòng thử lại.");
    }
  }, []);

  // Search doctors when input changes
  useEffect(() => {
    if (debounceKeyword.trim() === "") {
      setFilteredDoctors(doctors);
    } else {
      searchDoctors(debounceKeyword);
    }
  }, [debounceKeyword, doctors, searchDoctors]);

  useEffect(() => {
    loadDoctors();
  }, [loadDoctors]);

  // Edit doctor
  const editDoctor = (doctor) => {
    setDoctorToEdit(doctor);
    setShowEditDoctor(true);
  };

  // Delete doctor
  const deleteDoctor = async (id) => {
    const confirmDelete = window.confirm("Bạn có muốn xóa bác sĩ này không?");
    if (confirmDelete) {
      try {
        const response = await fetch(`${url}/api_doctor/xoadoctor.php?id=${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          const result = await response.json();
          toast.success(result.message || "Xóa bác sĩ thành công");
          loadDoctors();
        } else {
          const errorResult = await response.json();
          toast.error("Có lỗi xảy ra khi xóa bác sĩ: " + (errorResult.message || "Không rõ lỗi"));
        }
      } catch (error) {
        console.error("Lỗi khi xóa bác sĩ:", error);
        toast.error("Đã xảy ra lỗi. Vui lòng thử lại.");
      }
    }
  };
  
  // Format status for display
  const getStatusLabel = (status) => {
    switch (parseInt(status)) {
      case 1:
        return "Hoạt động";
      case 0:
        return "Không hoạt động";
      default:
        return "Không rõ";
    }
  };

  return (
    <div id="doctor" className="doctor-content-section">
      <ToastContainer style={{ top: 70 }} />
      <div className="doctor-search-container">
        <i className="fas fa-search doctor-search-icon"></i>
        <input
          type="text"
          placeholder="Tìm kiếm bác sĩ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="doctor-search-input"
        />
      </div>
      <div id="doctorTable" className="doctor-table">
        {filteredDoctors.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên bác sĩ</th>
                <th>Chuyên khoa</th>
                <th>Số điện thoại</th>
                <th>Email</th>
                <th>Hình ảnh</th>
                <th>Mô tả</th>
                <th>Chi nhánh</th>
                <th>Lịch làm việc</th>
                <th>Trạng thái</th>
                <th>Chức năng</th>
              </tr>
            </thead>
            <tbody>
              {filteredDoctors.map((doctor) => (
                <tr key={doctor.doctor_id}>
                  <td>{doctor.doctor_id}</td>
                  <td>{doctor.full_name}</td>
                  <td>{doctor.specialty}</td>
                  <td>{doctor.phone_number}</td>
                  <td>{doctor.email}</td>
                  <td>
  {doctor.profile_picture ? (
    <img
      src={`http://172.20.10.3/api_doctor/${doctor.profile_picture}`}
      alt={`${doctor.full_name}'s profile`}
      style={{ width: "50px", height: "50px", objectFit: "cover" }}
    />
  ) : (
    "Không có hình ảnh"
  )}
</td>
                  <td>{doctor.description}</td>
                  <td>{doctor.clinic_name || `Chi nhánh ${doctor.clinic_id}`}</td>
                  <td>{doctor.working_schedule}</td>
                  <td>{getStatusLabel(doctor.status)}</td>
                  <td>
                    <button
                      className="custom-edit-button"
                      onClick={() => editDoctor(doctor)}
                    >
                      Sửa
                    </button>
                    <button
                      className="custom-delete-button"
                      onClick={() => deleteDoctor(doctor.doctor_id)}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Không có bác sĩ nào</p>
        )}
      </div>

      <button
        className="doctor-floating-btn"
        onClick={() => setShowAddDoctor(true)}
      >
        +
      </button>

      {/* Hiển thị form thêm bác sĩ nếu cần */}
      {showAddDoctor && (
        <AddDoctor
          closeForm={() => setShowAddDoctor(false)}
          onDoctorAdded={loadDoctors}
        />
      )}

      {/* Hiển thị form chỉnh sửa bác sĩ nếu cần */}
      {showEditDoctor && (
        <EditDoctor
          doctorToEdit={doctorToEdit}
          closeForm={() => setShowEditDoctor(false)}
          onDoctorUpdated={loadDoctors}
        />
      )}
    </div>
  );
};

export default Doctors;