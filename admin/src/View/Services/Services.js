import React, { useEffect, useState } from "react";
import AddService from "./AddService";
import EditService from "./EditService";
import "./Services.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import url from "../../ipconfig";
import { toast, ToastContainer } from "react-toastify";
import useDebounce from "../../common/useDebounce";

function Services() {
  const [services, setServices] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredServices, setFilteredServices] = useState([]);
  const [showAddService, setShowAddService] = useState(false);
  const [showEditService, setShowEditService] = useState(false);
  const [serviceToEdit, setServiceToEdit] = useState(null);

  const debounceKeyword = useDebounce(searchTerm, 500);

  const loadServices = async () => {
    try {
      const response = await fetch(`${url}/api_doctor/getdichvu.php`);
      if (!response.ok) {
        throw new Error("Lỗi khi tải danh sách dịch vụ");
      }
      const data = await response.json();
      setServices(data);
      setFilteredServices(data);
    } catch (error) {
      setError(error.message);
    }
  };

  const searchServices = async (searchTerm) => {
    try {
      const response = await fetch(
        `${url}/api_doctor/timkiemdichvu.php?searchTerm=${searchTerm}`
      );
      if (!response.ok) {
        throw new Error("Lỗi khi tìm kiếm dịch vụ");
      }
      const data = await response.json();
      setFilteredServices(data);
    } catch (error) {
      console.error("Lỗi khi tìm kiếm:", error);
      toast.error("Không thể tìm kiếm dịch vụ. Vui lòng thử lại.");
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  useEffect(() => {
    if (debounceKeyword.trim() === "") {
      setFilteredServices(services);
    } else {
      searchServices(debounceKeyword);
    }
  }, [debounceKeyword, services]);

  const editService = (service) => {
    setServiceToEdit(service);
    setShowEditService(true);
  };

  const deleteService = async (id) => {
    const confirmDelete = window.confirm("Bạn có muốn xóa dịch vụ này không?");
    if (confirmDelete) {
      try {
        const response = await fetch(`${url}/api_doctor/xoadichvu.php?id=${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          const result = await response.json();
          toast.success(result.message);
          loadServices();
        } else {
          const errorResult = await response.json();
          toast.error("Có lỗi xảy ra khi xóa dịch vụ: " + errorResult.message);
        }
      } catch (error) {
        console.error("Lỗi khi xóa dịch vụ:", error);
        toast.error("Đã xảy ra lỗi. Vui lòng thử lại.");
      }
    }
  };

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div id="services" className="services-content-section">
      <ToastContainer style={{ top: 70 }} />
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="services-search-container">
        <i className="fas fa-search services-search-icon"></i>
        <input
          type="text"
          placeholder="Tìm kiếm dịch vụ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="services-search-input"
        />
      </div>

      {filteredServices.length > 0 ? (
        <table className="services-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên Dịch Vụ</th>
              <th>Mô Tả</th>
              <th>Giá</th>
              <th>Thời Gian Thực Hiện (phút)</th>
              <th>Hình Ảnh</th>
              <th>Chức Năng</th>
            </tr>
          </thead>
          <tbody>
            {filteredServices.map((service) => (
              <tr key={service.service_id}>
                <td>{service.service_id}</td>
                <td>{service.name}</td>
                <td>{service.description}</td>
                <td>{formatPrice(service.price)}</td>
                <td>{service.duration_minutes}</td>
                <td>
                  {service.image ? (
                    <img
                      src={`http://172.20.10.3/api_doctor/${service.image}`}
                      alt={`${service.name}'s profile`}
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
                  <button
                    onClick={() => editService(service)}
                    className="custom-edit-button"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => deleteService(service.service_id)}
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
        <p>Không có dịch vụ nào.</p>
      )}

      <button
        className="services-floating-btn"
        onClick={() => setShowAddService(true)}
      >
        +
      </button>

      {showAddService && (
        <AddService
          closeForm={() => setShowAddService(false)}
          onServiceAdded={loadServices}
        />
      )}

      {showEditService && (
        <EditService
          serviceToEdit={serviceToEdit}
          closeForm={() => setShowEditService(false)}
          onServiceUpdated={loadServices}
        />
      )}
    </div>
  );
}

export default Services;