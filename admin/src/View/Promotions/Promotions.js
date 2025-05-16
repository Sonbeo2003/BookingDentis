import React, { useEffect, useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./Promotions.css"; // Thêm file CSS cho trang khuyến mãi
import AddPromotion from "./AddPromotions";
import EditPromotions from "./EditPromotions";
import url from "../../ipconfig";

const Promotions = () => {
  const [promotions, setPromotions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPromotions, setFilteredPromotions] = useState([]);
  const [showAddPromotion, setShowAddPromotion] = useState(false);
  const [showEditPromotions, setShowEditPromotions] = useState(false);
  const [promotionsToEdit, setPromotionsToEdit] = useState(null);

  // Hàm tải danh sách khuyến mãi từ API
  const loadPromotions = async () => {
    try {
      const response = await fetch(`${url}/api_doctor/getkhuyenmai.php`);
      if (!response.ok) {
        throw new Error("Lỗi khi tải danh sách khuyến mãi");
      }
      const data = await response.json();
      setPromotions(data);
      setFilteredPromotions(data);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
      alert("Không thể tải danh sách khuyến mãi. Vui lòng thử lại sau.");
    }
  };

  useEffect(() => {
    loadPromotions();
  }, []);

  // Tìm kiếm khuyến mãi
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredPromotions(promotions);
    } else {
      const filtered = promotions.filter((promotion) =>
        promotion.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPromotions(filtered);
    }
  }, [searchTerm, promotions]);

  const editPromotions = (promotion) => {
    setPromotionsToEdit(promotion);
    setShowEditPromotions(true);
  };
  const tentrangthai = {
    "hoạt động": "Hoạt động",
    "hết hạn": "Hết hạn",
  };

  // Hàm xóa khuyến mãi
  const handleDeletePromotion = async (promotion_id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa khuyến mãi này không?")) {
      try {
        const response = await fetch(`${url}/api_doctor/xoakhuyenmai.php`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ promotion_id }), // Gửi ID khuyến mãi để xóa
        });

        const result = await response.json();
        if (response.ok) {
          alert(result.message); // Hiển thị thông báo thành công
          loadPromotions(); // Tải lại danh sách khuyến mãi sau khi xóa
        } else {
          alert("Có lỗi xảy ra: " + result.message); // Hiển thị thông báo lỗi nếu có
        }
      } catch (error) {
        console.error("Lỗi khi xóa khuyến mãi:", error);
        alert("Đã xảy ra lỗi. Vui lòng thử lại.");
      }
    }
  };

  return (
    <div id="promotions" className="promotions-content-section">
      {/* Thanh tìm kiếm */}
      <div className="promotions-search-container">
        <i className="fas fa-search promotions-search-icon"></i>
        <input
          type="text"
          placeholder="Tìm kiếm khuyến mãi..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="promotions-search-input"
        />
      </div>

      <div id="promotionsTable" className="promotions-table-section">
        {filteredPromotions.length > 0 ? (
          <table className="promotions-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên Khuyến Mãi</th>
                <th>Mô Tả</th>
                <th>Phần Trăm Giảm Giá (%)</th>
                <th>Số Tiền Giảm Giá (VNĐ)</th>
                <th>Ngày Bắt Đầu</th>
                <th>Ngày Kết Thúc</th>
                <th>Trạng Thái</th>
                <th>Chức năng</th>
              </tr>
            </thead>
            <tbody>
              {filteredPromotions.map((promotion) => (
                <tr key={promotion.promotion_id}>
                  <td>{promotion.promotion_id}</td>
                  <td>{promotion.name}</td>
                  <td>{promotion.description}</td>
                  <td>{promotion.discount_percent !== null ? promotion.discount_percent : 'N/A'}</td>
                  <td>{promotion.discount_amount !== null ? promotion.discount_amount : 'N/A'}</td>
                  <td>{promotion.start_date}</td>
                  <td>{promotion.end_date}</td>
                  <td>{tentrangthai[promotion.status]}</td>
                  <td>
                    <button
                      className="promotions-edit"
                      onClick={() => editPromotions(promotion)}
                    >
                      Sửa
                    </button>
                    <button
                      className="promotions-delete"
                      onClick={() => handleDeletePromotion(promotion.promotion_id)}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Không có khuyến mãi nào hiện tại</p>
        )}
      </div>

      {/* Nút thêm khuyến mãi */}
      <button
        className="promotions-floating-btn"
        onClick={() => setShowAddPromotion(true)}
      >
        +
      </button>

      {/* Hiển thị form thêm khuyến mãi nếu cần */}
      {showAddPromotion && (
        <AddPromotion
          closeForm={() => setShowAddPromotion(false)}
          onPromotionAdded={loadPromotions}
        />
      )}
      {showEditPromotions && (
        <EditPromotions
          promotionToEdit={promotionsToEdit}
          closeForm={() => setShowEditPromotions(false)}
          onPromotionUpdated={loadPromotions}
        />
      )}
    </div>
  );
};

export default Promotions;