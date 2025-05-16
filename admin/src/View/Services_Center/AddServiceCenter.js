import React, { useEffect, useState } from "react";
import "./AddServiceCenter.css";
import url from "../../ipconfig";
import { toast } from "react-toastify";

function AddServiceCenter({ closeForm, onServiceCenterAdded }) {
  const [serviceCenter, setServiceCenter] = useState({
    iddichvu: "",
    idtrungtam: "",
  });

  const [services, setServices] = useState([]); // State to hold services
  const [centers, setCenters] = useState([]); // State to hold centers

  useEffect(() => {
    const loadServicesAndCenters = async () => {
      try {
        // Fetch services
        const servicesResponse = await fetch(`${url}/api_doctor/getdichvu.php`);
        const servicesData = await servicesResponse.json();
        setServices(servicesData);

        // Fetch centers
        const centersResponse = await fetch(`${url}/api_doctor/gettrungtam.php`);
        const centersData = await centersResponse.json();
        setCenters(centersData);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu dịch vụ hoặc trung tâm:", error);
        toast.error(
          "Không thể tải danh sách dịch vụ hoặc trung tâm. Vui lòng kiểm tra kết nối hoặc dữ liệu."
        );
      }
    };

    loadServicesAndCenters();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setServiceCenter({ ...serviceCenter, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Kiểm tra dữ liệu trước khi gửi
    if (!serviceCenter.iddichvu || !serviceCenter.idtrungtam) {
      toast.warn("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
  
    try {
      const response = await fetch(`${url}/api_doctor/themdichvutrungtam.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(serviceCenter),
      });
  
      const result = await response.json(); // Lấy dữ liệu trả về từ API
  
      if (response.ok && result.message) {
        // Trường hợp thêm thành công
        toast.success(result.message); 
        onServiceCenterAdded(); 
        closeForm(); // Đóng form
        setServiceCenter({
          iddichvu: "",
          idtrungtam: "",
        });
      } else if (result.error) {
        // Trường hợp API trả về lỗi cụ thể
        toast.error(result.error); // Hiển thị lỗi từ API
      } else {
        toast.error("Đã xảy ra lỗi không xác định."); // Lỗi không rõ nguyên nhân
      }
    } catch (error) {
      // Lỗi khi gửi request hoặc kết nối
      console.error("Lỗi khi thêm dịch vụ:", error);
      toast.error("Đã xảy ra lỗi. Vui lòng thử lại.");
    }
  };
  
  
  return (
    <div className="modal">
      {/* <ToastContainer style={{ top: 70 }} /> */}
      <div className="modal-content">
        <span className="close-btn" onClick={closeForm}>
          &times;
        </span>
        <h3>Thêm Dịch Vụ Trung Tâm</h3>
        <form onSubmit={handleSubmit}>
          <label style={{marginLeft:10}}>ID Dịch Vụ:</label>
          <select className="select-container"
            name="iddichvu"
            value={serviceCenter.iddichvu}
            onChange={handleChange}
            required
          >
            <option value="">Chọn dịch vụ...</option>
            {services.map((service) => (
              <option key={service.iddichvu} value={service.iddichvu}>
                {service.tendichvu}
              </option>
            ))}
          </select>
            
          <label style={{marginLeft:10}}>ID Trung Tâm:</label>
          <select className="select-container"
            name="idtrungtam"
            value={serviceCenter.idtrungtam}
            onChange={handleChange}
            required
          >
            <option value="">Chọn trung tâm...</option>
            {centers.map((center) => (
              <option key={center.idtrungtam} value={center.idtrungtam}>
                {center.tentrungtam}
              </option>
            ))}
          </select>

          <button type="submit">Thêm Dịch Vụ</button>
        </form>
      </div>
    </div>
  );
}

export default AddServiceCenter;
