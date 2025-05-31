import React, { useEffect, useState } from "react";
import "./Booking.css";
import url from "../../ipconfig";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import { Tabs, Tab } from "@mui/material";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [value, setValue] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [bookingIdToCancel, setBookingIdToCancel] = useState(null);
  const [startDate, setStartDate] = useState(""); // Ngày bắt đầu
  const [endDate, setEndDate] = useState(""); // Ngày kết thúc

  // Lọc lịch hẹn theo tab
  const filteredBookings = bookings.filter((booking) => {
    const trangThaiSo = parseInt(booking.appointment_status, 10); // Đảm bảo là số
    if (value === 0 && trangThaiSo === 0) return true; // Chưa xác nhận
    if (value === 1 && trangThaiSo === 1) return true; // Đang thực hiện
    if (value === 2 && trangThaiSo === 2) return true; // Hoàn thành
    if (value === 3 && trangThaiSo === 3) return true; // Đã thanh toán
    if (value === 4 && trangThaiSo === 4) return true; // Đã hủy
    return false;
  });

  // Load danh sách đặt lịch
  const loadBookings = async () => {
    try {
      const response = await fetch(`${url}/api_doctor/Lichhen_Admin/getlichhen.php`);
      if (!response.ok) {
        throw new Error("Lỗi khi tải danh sách đặt lịch");
      }
      const data = await response.json();
      if (Array.isArray(data)) {
        setBookings(data);
      } else {
        console.error("Lỗi khi tải lịch hẹn:", data);
        toast.error("Không thể tải danh sách đặt lịch.");
      }
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
      toast.error("Không thể tải danh sách đặt lịch. Vui lòng thử lại.");
    }
  };

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
        setBookings(data.lichhen);
        toast.success("Tìm kiếm thành công");
      } else {
        setBookings([]); // Không có kết quả
        toast.error(
          data.message || "Không có lịch hẹn trong khoảng thời gian này."
        );
      }
    } catch (error) {
      console.error("Lỗi API:", error);
      toast.error("Không thể tải danh sách đặt lịch. Vui lòng thử lại.");
    }
  };

  // Xác nhận đặt lịch và chuyển sang trạng thái "Đang thực hiện"
  const confirmBooking = async (idlichhen) => {
    try {
      const response = await fetch(
        `${url}/api_doctor/Lichhen_Admin/xacnhanlichhen.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ appointment_id: idlichhen }),
        }
      );

      if (!response.ok) {
        throw new Error("Lỗi khi xác nhận lịch hẹn");
      }

      // Sau khi xác nhận thành công, tải lại dữ liệu mới
      loadBookings();
      
      // Sau khi xác nhận, chuyển sang tab "Đang thực hiện"
      setValue(1); // Chuyển sang tab Đang thực hiện
      
      toast.success("Lịch hẹn đã được xác nhận và chuyển sang đang thực hiện!");
    } catch (error) {
      console.error("Lỗi khi xác nhận:", error);
      toast.error("Không thể xác nhận lịch hẹn. Vui lòng thử lại.");
    }
  };

  // Hoàn thành lịch hẹn
  const completeBooking = async (idlichhen) => {
    try {
      const response = await fetch(
        `${url}/api_doctor/Lichhen_Admin/hoanthanhlichhen.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ appointment_id: idlichhen }),
        }
      );

      if (!response.ok) {
        throw new Error("Lỗi khi hoàn thành lịch hẹn");
      }
      
      const data = await response.json(); // Nhận kết quả JSON từ API
      
      if (data.booking) {
        // Cập nhật booking trong state nếu API trả về chi tiết booking
        setBookings(prevBookings => {
          return prevBookings.map(booking => {
            if (booking.appointment_id === idlichhen) {
              return { ...booking, appointment_status: "2" };
            }
            return booking;
          });
        });
      } else {
        // Nếu API không trả về chi tiết booking, chỉ tải lại toàn bộ dữ liệu
        await loadBookings();
      }
      
      // Sau khi hoàn thành, chuyển sang tab "Hoàn thành"
      setValue(2);
      toast.success(data.message || "Lịch hẹn đã được hoàn thành");
    } catch (error) {
      console.error("Lỗi khi hoàn thành:", error);
      toast.error("Không thể hoàn thành lịch hẹn. Vui lòng thử lại.");
    }
  };

  // Thanh toán lịch hẹn
  const payBooking = async (idlichhen) => {
    try {
      const response = await fetch(
        `${url}/api_doctor/Lichhen_Admin/Xacnhanthanhtoan.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ idlichhen }),
        }
      );

      if (!response.ok) {
        throw new Error("Lỗi khi xác nhận thanh toán");
      }
      loadBookings();
      // Sau khi thanh toán, chuyển sang tab "Đã thanh toán"
      setValue(3);
      toast.success("Lịch hẹn đã được thanh toán");
    } catch (error) {
      console.error("Lỗi khi thanh toán:", error);
      toast.error("Không thể xác nhận thanh toán. Vui lòng thử lại.");
    }
  };

  // Hủy lịch hẹn
  const cancelBooking = async () => {
    try {
      const response = await fetch(`${url}/api_doctor/Lichhen_Admin/huylichhen.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idlichhen: bookingIdToCancel,
          reason: cancelReason,
        }),
      });

      if (!response.ok) {
        throw new Error("Lỗi khi hủy lịch hẹn");
      }
      loadBookings();
      closeCancelModal();
      // Sau khi hủy, chuyển sang tab "Đã hủy"
      setValue(4);
      toast.success("Lịch hẹn đã được hủy");
    } catch (error) {
      console.error("Lỗi khi hủy lịch hẹn:", error);
      toast.error("Không thể hủy lịch hẹn. Vui lòng thử lại.");
    }
  };

  const openCancelModal = (idlichhen) => {
    setBookingIdToCancel(idlichhen);
    setIsModalOpen(true);
  };

  const closeCancelModal = () => {
    setIsModalOpen(false);
    setCancelReason("");
  };

  // Sắp xếp thứ tự useEffect
  useEffect(() => {
    loadBookings();
  }, []);

  const convertTrangThai = (trangThai) => {
    const trangThaiMap = {
      0: "Chờ xác nhận",
      1: "Đang thực hiện",
      2: "Hoàn thành",
      3: "Đã thanh toán",
      4: "Đã hủy",
    };
    return trangThaiMap[trangThai] || "Không xác định";
  };
  
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div id="bookings" className="booking-content-section">
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
          <button onClick={() => loadBookings()} className="reload-button">
            Tải lại
          </button>
        </div>
      </div>

      {/* Tab chọn trạng thái */}
      <Tabs
        className="status-tabs"
        value={value}
        onChange={handleChange}
        aria-label="Appointment Status Tabs"
      >
        <Tab className="status-tab" label="Chưa xác nhận" />
        <Tab className="status-tab" label="Đang thực hiện" />
        <Tab className="status-tab" label="Hoàn thành" />
        <Tab className="status-tab" label="Đã thanh toán" />
        <Tab className="status-tab" label="Đã hủy" />
      </Tabs>

      <div id="bookingsTable">
        {filteredBookings.length > 0 ? (
          <table className="booking-table">
            <thead>
              <tr>
                <th>ID Lịch Hẹn</th>
                <th>Người Đặt Lịch</th>
                <th>Bác sĩ khám</th>
                <th>Chi Nhánh</th>
                <th>Tên Dịch Vụ</th>
                <th>Ngày Hẹn</th>
                <th>Thời Gian Hẹn</th>
                <th>Trạng Thái</th>
                <th>Ghi Chú</th>
                <th>Giá Dịch Vụ</th>
                <th>Khuyến Mãi</th>
                <th>Tiền Đặt Cọc</th>
                <th>Giảm Giá</th>
                <th>Giá Sau Giảm</th>
                <th>Chức Năng</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <tr key={booking.appointment_id}>
                  <td>{booking.appointment_id}</td>
                  <td>{booking.user_id}</td>
                  <td>{booking.doctor_name}</td>
                  <td>{booking.clinic_name}</td>
                  <td>{booking.services}</td>
                  <td>{booking.appointment_date}</td>
                  <td>{booking.appointment_time}</td>
                  <td>{convertTrangThai(booking.appointment_status)}</td>
                  <td>{booking.note}</td>
                  <td>{booking.total_price ? `${booking.total_price} đ` : "Chưa xác định"}</td>
                  <td>{booking.promotion_code ? booking.promotion_code : "Không áp dụng"}</td>
                  <td>{booking.deposit_amount ? `${booking.deposit_amount} đ` : "Không có"}</td>
                  <td>{booking.discount_value || "Không có"}</td>
                  <td>{booking.final_price ? `${booking.final_price} đ` : "Chưa xác định"}</td>
                  <td>
                    {booking.appointment_status === "0" ? (
                      <div className="booking-actions">
                        <button
                          onClick={() => confirmBooking(booking.appointment_id)}
                          className="confirm-button"
                        >
                          Xác Nhận
                        </button>
                        <button
                          onClick={() => openCancelModal(booking.appointment_id)}
                          className="cancel-button"
                        >
                          Hủy
                        </button>
                      </div>
                    ) : booking.appointment_status === "1" ? (
                      <button
                        onClick={() => completeBooking(booking.appointment_id)}
                        className="complete-button"
                      >
                        Hoàn thành
                      </button>
                    ) : booking.appointment_status === "2" ? (
                      <button
                        onClick={() => payBooking(booking.appointment_id)}
                        className="pay-button"
                      >
                        Xác nhận thanh toán
                      </button>
                    ) : (
                      <button
                        className="disabled-button"
                        disabled
                        style={{ backgroundColor: "gray", color: "white" }}
                      >
                        Không khả dụng
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Không có đặt lịch nào</p>
        )}
      </div>
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Vui lòng nhập lý do hủy</h3>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Nhập lý do hủy..."
            ></textarea>
            <div className="modal-actions">
              <button
                className="button-modal-actions"
                onClick={cancelBooking}
                disabled={!cancelReason}
              >
                Xác nhận hủy
              </button>
              <button className="close-button" onClick={closeCancelModal}>
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;