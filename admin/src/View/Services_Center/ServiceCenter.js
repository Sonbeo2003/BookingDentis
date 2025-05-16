import React, { useEffect, useState } from "react";
import AddServiceCenter from "./AddServiceCenter";
import "./ServiceCenter.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import url from "../../ipconfig";
import { toast, ToastContainer } from "react-toastify";

function ServiceCenter() {
  const [serviceCenter, setServiceCenter] = useState([]);
  const [showAddServiceCenter, setShowAddServiceCenter] = useState(false);

  const loadServiceCenter = async () => {
    try {
      const response = await fetch(`${url}/api_doctor/getdichvutrungtam.php`);
      if (!response.ok) {
        throw new Error("Lỗi khi tải dữ liệu");
      }
      const data = await response.json();
      setServiceCenter(data);
      // setFilteredServiceCenter(data);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
      alert(
        "Không thể tải danh sách dịch vụ. Vui lòng kiểm tra kết nối hoặc dữ liệu."
      );
    }
  };


  useEffect(() => {
    loadServiceCenter();
  }, []);

  const deleteServiceCenter = async (id) => {
    console.log("data", serviceCenter);
    console.log("id là:", id);
    const confirmDelete = window.confirm(
      "Bạn có muốn xóa dịch vụ trung tâm này không?"
    );
  
    if (confirmDelete) {
      try {
        // Gửi yêu cầu DELETE với id trong body
        const response = await fetch(
          `${url}/api_doctor/Dichvu-Trungtam/xoadichvutrungtam.php`,
          {
            method: "DELETE", // Chắc chắn là DELETE
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id }), // Gửi id dưới dạng JSON trong body
          }
        );
  
        if (response.ok) {
          const result = await response.json();
          alert(result.message);
          loadServiceCenter(); // Reload danh sách sau khi xóa
        } else {
          const errorResult = await response.json();
          alert(
            "Có lỗi xảy ra khi xóa dịch vụ trung tâm: " + errorResult.message
          );
        }
      } catch (error) {
        console.error("Lỗi khi xóa dịch vụ trung tâm:", error);
        alert("Đã xảy ra lỗi. Vui lòng thử lại.");
      }
    }
  };
    

  return (
    <div id="services" className="serviceCenter-content-section">
       <ToastContainer style={{top:70}}/>
      <div id="serviceCenterTable">
        {serviceCenter.length > 0 ? (
          <table className="serviceCenter-table">
            <thead>
              <tr>
                <th>Tên địa điểm</th>
                <th>Tên dịch vụ</th>
                <th>Chức năng</th>
              </tr>
            </thead>
            <tbody>
              {serviceCenter.map((serviceCenter) => (
                
                <tr key={serviceCenter.tendichvu}>
                  <td>{serviceCenter.tentrungtam}</td>
                  <td>{serviceCenter.tendichvu}</td>
                  <td>
                    <button
                      className="serviceCenter-delete"
                      onClick={() => deleteServiceCenter(serviceCenter.id)}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Không có dịch vụ trung tâm nào</p>
        )}
      </div>

      <button
        className="serviceCenter-floating-btn"
        onClick={() => setShowAddServiceCenter(true)}
      >
        +
      </button>

      {showAddServiceCenter && (
        <AddServiceCenter
          closeForm={() => setShowAddServiceCenter(false)}
          onServiceCenterAdded={loadServiceCenter}
        />
      )}
    </div>
  );
}

export default ServiceCenter;
