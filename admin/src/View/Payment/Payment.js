import React, { useState, useEffect, useCallback } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { toast, ToastContainer } from "react-toastify";
import useDebounce from "../../common/useDebounce";
import url from "../../ipconfig";
import "./Payment.css"

const Payment = () => {
  const [payments, setPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Dữ liệu mẫu

  const debounceKeyword = useDebounce(searchTerm, 500);

  // Load danh sách thanh toán
  const loadPayments = useCallback(async () => {
    try {
      // Comment API call để dùng dữ liệu mẫu
      // const response = await fetch(`${url}/api_doctor/Thanhtoan_Admin/getthanhtoan.php`);
      // if (!response.ok) {
      //   throw new Error("Lỗi khi tải dữ liệu thanh toán");
      // }
      // const data = await response.json();
      // const data = samplePayments;
const response = await fetch(`${url}/api_doctor/Thanhtoan_Admin/getthanhtoan.php`);
if (!response.ok) {
  throw new Error("Lỗi khi tải dữ liệu thanh toán");
}
const data = await response.json();
setPayments(data);
setFilteredPayments(data);


    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
      toast.error("Không thể tải danh sách thanh toán. Vui lòng thử lại.");
    }
  }, []);

  // Hàm tìm kiếm thanh toán
  const filterByDate = async (startDate, endDate) => {
    console.log("Ngày bắt đầu:", startDate, "Ngày kết thúc:", endDate);

    // Kiểm tra và định dạng lại ngày
    const formattedStartDate = new Date(startDate);
    const formattedEndDate = new Date(endDate);

    if (
      isNaN(formattedStartDate.getTime()) ||
      isNaN(formattedEndDate.getTime())
    ) {
      toast.error("Ngày không hợp lệ!");
      return; // Dừng nếu ngày không hợp lệ
    }

    const isoStartDate = formattedStartDate.toISOString().split("T")[0];
    const isoEndDate = formattedEndDate.toISOString().split("T")[0];
    console.log("Ngày định dạng:", isoStartDate, isoEndDate);

    try {
      const response = await fetch(
        `${url}/api_doctor/Lichhen_Admin/timkiemlichhen.php?startDate=${isoStartDate}&endDate=${isoEndDate}`
      );
      const data = await response.json();
      console.log("Kết quả API:", data);

      if (data.success) {
        setPayments(data.lichhen);
        toast.success("Tìm kiếm thành công");
      } else {
        setPayments([]); // Không có kết quả
        toast.error(
          data.message || "Không có lịch hẹn trong khoảng thời gian này."
        );
      }
    } catch (error) {
      console.error("Lỗi API:", error);
      toast.error("Không thể tải danh sách đặt lịch. Vui lòng thử lại.");
    }
  };


  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  return (
    <div id="payment" className="payment-content-section">
      <ToastContainer style={{ top: 70 }} />

      <div style={{ display: "flex", alignItems: "center" }}>
        <div className="date-filter-container">
          <label>Từ ngày:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="date-input"
          />
          <label>Đến ngày:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="date-input"
          />
          <button
            onClick={() => filterByDate(startDate, endDate)}
            className="search-button"
          >
            Tìm kiếm
          </button>
          <button onClick={() => loadPayments()} className="reload-button">
            Tải lại
          </button>
        </div>
      </div>
     
      <div id="paymentTable" className="payment-table">
        {filteredPayments.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>ID Thanh toán</th>
                <th>ID Lịch hẹn</th>
                <th>Phương thức</th>
                <th>Ngày thanh toán</th>
                <th>Tổng tiền</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment) => (
                <tr key={payment.appointment_id}>
                  <td>{payment.idthanhtoan}</td>
                  <td>{payment.idlichhen}</td>
                  <td>{payment.phuongthuc}</td>
                  <td>{payment.ngaythanhtoan}</td>
                  <td>{payment.tongtien}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Không có dữ liệu thanh toán</p>
        )}
      </div>
    </div>
  );
};

export default Payment;
