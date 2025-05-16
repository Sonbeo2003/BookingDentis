import React, { useEffect, useState } from "react";
import "./History.css";
import AddTreatment from "./AddTreatment";
import EditTreatment from "./EditTreatment";
import "@fortawesome/fontawesome-free/css/all.min.css";
import url from "../../ipconfig";
import { toast, ToastContainer } from "react-toastify";
import useDebounce from "../../common/useDebounce";

const TreatmentHistory = () => {
  const [treatments, setTreatments] = useState([]);
  const [error, setError] = useState(null);
  const [showAddTreatment, setShowAddTreatment] = useState(false);
  const [showEditTreatment, setShowEditTreatment] = useState(false);
  const [treatmentToEdit, setTreatmentToEdit] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTreatments, setFilteredTreatments] = useState([]);

  const debounceKeyword = useDebounce(searchTerm, 500);

  // Load danh sách lịch sử điều trị từ API
  const loadTreatments = async () => {
    try {
      const response = await fetch(`${url}/api_doctor/getlichsu.php`);
      if (!response.ok) {
        throw new Error("Lỗi khi tải danh sách lịch sử điều trị");
      }
      const data = await response.json();
      if (Array.isArray(data)) {
        setTreatments(data);
        setFilteredTreatments(data);
      } else {
        throw new Error("Dữ liệu trả về không phải là mảng");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  // Tìm kiếm lịch sử điều trị
  const searchTreatment = async (searchTerm) => {
    try {
      const response = await fetch(
        `${url}/api_doctor/timkiemlichsu.php?searchTerm=${encodeURIComponent(
          searchTerm
        )}`
      );
      if (!response.ok) {
        throw new Error("Lỗi khi tìm kiếm lịch sử điều trị");
      }
      const data = await response.json();
      if (Array.isArray(data)) {
        setFilteredTreatments(data);
      } else {
        throw new Error("Dữ liệu tìm kiếm không hợp lệ");
      }
    } catch (error) {
      console.error("Lỗi khi tìm kiếm:", error);
      toast.error("Không thể tìm kiếm lịch sử điều trị. Vui lòng thử lại.");
    }
  };

  useEffect(() => {
    loadTreatments();
  }, []);

  useEffect(() => {
    if (debounceKeyword.trim() === "") {
      setFilteredTreatments(treatments);
    } else {
      searchTreatment(debounceKeyword);
    }
  }, [debounceKeyword, treatments]);

  const editTreatment = (treatment) => {
    setTreatmentToEdit({ ...treatment });
    setShowEditTreatment(true);
  };

  const deleteTreatment = async (id) => {
    if (!id || !Number.isInteger(Number(id))) {
      toast.error("ID không hợp lệ");
      return;
    }

    const confirmDelete = window.confirm(
      "Bạn có muốn xóa lịch sử điều trị này không?"
    );
    if (confirmDelete) {
      try {
        const response = await fetch(
          `${url}/api_doctor/xoalichsu.php?id=${id}`,
          { method: "DELETE" }
        );

        if (response.ok) {
          const result = await response.json();
          toast.success(result.message);
          loadTreatments();
        } else {
          const errorResult = await response.json();
          toast.error("Có lỗi xảy ra khi xóa lịch sử: " + errorResult.message);
        }
      } catch (error) {
        console.error("Lỗi khi xóa lịch sử điều trị:", error);
        toast.error("Đã xảy ra lỗi. Vui lòng thử lại.");
      }
    }
  };

  return (
    <div id="treatmentHistory" className="treatment-content-section">
      <ToastContainer style={{ top: 70 }} />
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Thanh tìm kiếm */}
      <div className="treatment-search-container">
        <i className="fas fa-search treatment-search-icon"></i>
        <input
          type="text"
          placeholder="Tìm kiếm lịch sử điều trị..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="treatment-search-input"
        />
      </div>

      {/* Danh sách lịch sử điều trị */}
      {filteredTreatments.length > 0 ? (
        <table className="treatment-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên Người Dùng</th>
              <th>Tên Nha Sĩ</th>
              <th>Tên Dịch Vụ</th>
              <th>Ngày Điều Trị</th>
              <th>Mô Tả</th>
              <th>Ảnh Trước</th>
              <th>Ảnh Sau</th>
              <th>Trạng Thái Sức Khỏe Răng Miệng</th>
              <th>Chức năng</th>
            </tr>
          </thead>
          <tbody>
            {filteredTreatments.map((treatment) => (
              <tr key={treatment.treatment_id || Math.random()}>
                <td>{treatment.treatment_id || "N/A"}</td>
                <td>{treatment.full_name || "N/A"}</td>
                <td>{treatment.full_name || "N/A"}</td>
                <td>{treatment.name || "N/A"}</td>
                <td>{treatment.treatment_date || "N/A"}</td>
                <td>{treatment.description || "Không có mô tả"}</td>
                <td>
                  {treatment.before_image ? (
                    <img
                      src={`http://192.168.1.2/api_doctor/${treatment.before_image}`}
                      alt={`${treatment.description}'s profile`}
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    "Không có hình ảnh"
                  )}
                </td>
                <td>
                  {treatment.after_image ? (
                    <img
                      src={`http://192.168.1.2/api_doctor/${treatment.after_image}`}
                      alt={`${treatment.description}'s profile`}
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    "Không có hình ảnh"
                  )}
                </td>
                <td>{treatment.oral_health_status || "Không có trạng thái"}</td>
                <td>
                  <button
                    onClick={() => editTreatment(treatment)}
                    className="custom-edit-button"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => deleteTreatment(treatment.treatment_id)}
                    className="custom-delete-button"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Không có lịch sử điều trị nào.</p>
      )}

      <button
        className="treatment-floating-btn"
        onClick={() => setShowAddTreatment(true)}
      >
        +
      </button>

      {showAddTreatment && (
        <AddTreatment
          closeForm={() => setShowAddTreatment(false)}
          onTreatmentAdded={loadTreatments}
        />
      )}

      {showEditTreatment && (
        <EditTreatment
          treatmentToEdit={treatmentToEdit}
          closeForm={() => setShowEditTreatment(false)}
          onTreatmentUpdated={loadTreatments}
        />
      )}
    </div>
  );
};

export default TreatmentHistory;
