import React, { useEffect, useState } from "react";
import "./Center.css";
import AddCenter from "./AddCenter";
import EditCenter from "./EditCenter";
import "@fortawesome/fontawesome-free/css/all.min.css";
import url from "../../ipconfig";
import { toast, ToastContainer } from "react-toastify";
import useDebounce from "../../common/useDebounce";

const Center = () => {
  const [centers, setCenters] = useState([]);
  const [error, setError] = useState(null);
  const [showAddCenter, setShowAddCenter] = useState(false);
  const [showEditCenter, setShowEditCenter] = useState(false);
  const [CenterToEdit, setCenterToEdit] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCenters, setFilteredCenters] = useState([]);

  const debounceKeyword = useDebounce(searchTerm, 500);

  // Hàm load danh sách trung tâm từ API
  const loadCenters = async () => {
    try {
      const response = await fetch(`${url}/api_doctor/gettrungtam.php`); // Đường dẫn đến file PHP API
      if (!response.ok) {
        throw new Error("Lỗi khi tải danh sách trung tâm");
      }
      const data = await response.json();
      setCenters(data); // Lưu danh sách trung tâm vào state
      setFilteredCenters(data); // Cập nhật danh sách trung tâm đã lọc
    } catch (error) {
      setError(error.message);
    }
  };

  // Hàm tìm kiếm trung tâm
  const searchCenter = async (searchTerm) => {
    try {
      const response = await fetch(
        `${url}/api_doctor/timkiemtrungtam.php?searchTerm=${searchTerm}`
      );
      if (!response.ok) {
        throw new Error("Lỗi khi tìm kiếm trung tâm");
      }
      const data = await response.json();
      setFilteredCenters(data);
    } catch (error) {
      console.error("Lỗi khi tìm kiếm:", error);
      toast.error("Không thể tìm kiếm trung tâm. Vui lòng thử lại.");
    }
  };

  useEffect(() => {
    loadCenters(); // Gọi API khi component được load
  }, []);

  useEffect(() => {
    if (debounceKeyword.trim() === "") {
      setFilteredCenters(centers);
    } else {
      searchCenter(debounceKeyword);
    }
  }, [debounceKeyword, centers]);

  const editCenter = (Center) => {
    setCenterToEdit(Center);
    setShowEditCenter(true);
  };

  const deleteCenter = async (id) => {
    const confirmDelete = window.confirm(
      "Bạn có muốn xóa chi nhánh này không?"
    );
    if (confirmDelete) {
      try {
        const response = await fetch(
          `${url}/api_doctor/xoatrungtam.php?id=${id}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          const result = await response.json();
          toast.success(result.message);
          loadCenters();
        } else {
          const errorResult = await response.json();
          toast.error(
            "Có lỗi xảy ra khi xóa chi nhánh: " + errorResult.message
          );
        }
      } catch (error) {
        console.error("Lỗi khi xóa chi nhánh:", error);
        toast.error("Đã xảy ra lỗi. Vui lòng thử lại.");
      }
    }
  };

  // Xử lý trạng thái hiển thị
  const getStatusLabel = (status) => {
    return status === "Hoạt động" ? "Hoạt động" : "Không hoạt động";
  };

  return (
    <div id="center" className="center-content-section">
      <ToastContainer style={{ top: 70 }} />
      {/* Hiển thị lỗi nếu có */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Thanh tìm kiếm */}
      <div className="center-search-container">
        <i className="fas fa-search center-search-icon"></i>
        <input
          type="text"
          placeholder="Tìm kiếm chi nhánh..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="center-search-input"
        />
      </div>

      {/* Hiển thị danh sách trung tâm */}
      {filteredCenters.length > 0 ? (
        <table className="center-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên Chi Nhánh</th>
              <th>Địa chỉ</th>
              <th>Số điện thoại</th>
              <th>Email</th>
              <th>X-Location</th>
              <th>Y-Location</th>
              <th>Hình ảnh</th>
              <th>Giờ mở cửa</th>
              <th>Trạng thái</th>
              <th>Chức năng</th>
            </tr>
          </thead>
          <tbody>
            {filteredCenters.map((center) => (
              <tr key={center.clinic_id}>
                <td>{center.clinic_id}</td>
                <td>{center.name}</td>
                <td>{center.address}</td>
                <td>{center.phone_number}</td>
                <td>{center.email}</td>
                <td>{center.X_location}</td>
                <td>{center.Y_location}</td>
                <td>
                  {center.picture ? (
                    <img
                      src={`http://172.20.10.3/api_doctor/${center.picture}`}
                      alt={`${center.name}'s profile`}
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
                <td>{center.opening_hours}</td>
                <td>{getStatusLabel(center.status)}</td>
                <td>
                  <button
                    onClick={() => editCenter(center)}
                    className="custom-edit-button"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => deleteCenter(center.clinic_id)}
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
        <p>Không có chi nhánh nào.</p>
      )}
      <button
        className="center-floating-btn"
        onClick={() => setShowAddCenter(true)}
      >
        +
      </button>

      {showAddCenter && (
        <AddCenter
          closeForm={() => setShowAddCenter(false)}
          onCenterAdded={loadCenters}
        />
      )}

      {showEditCenter && (
        <EditCenter
          CenterToEdit={CenterToEdit}
          closeForm={() => setShowEditCenter(false)}
          onCenterUpdated={loadCenters}
        />
      )}
    </div>
  );
};

export default Center;