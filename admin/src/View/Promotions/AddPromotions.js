import React, { useState } from 'react';
import './AddPromotions.css';
import url from '../../ipconfig';

function AddPromotion({ closeForm, onPromotionAdded }) {
  const [promotion, setPromotion] = useState({
    name: '',
    description: '',
    discount_percent: '',
    discount_amount: '',
    start_date: '',
    end_date: '',
    status: 'hoạt động'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPromotion({ ...promotion, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log("Dữ liệu gửi đi:", promotion); // Kiểm tra dữ liệu

    // Chuẩn bị dữ liệu gửi đi
    const promotionData = {
      ...promotion,
      discount_percent: promotion.discount_percent === '' ? null : parseFloat(promotion.discount_percent),
      discount_amount: promotion.discount_amount === '' ? null : parseFloat(promotion.discount_amount),
      status: promotion.status // Giữ nguyên giá trị chuỗi
    };

    try {
      const response = await fetch(`${url}/api_doctor/themkhuyenmai.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(promotionData),
      });

      const result = await response.json();
      console.log("Kết quả từ server:", result); // Kiểm tra kết quả từ API

      if (response.ok) {
        alert(result.message); // Hiển thị thông báo thành công
        onPromotionAdded(); // Gọi callback để tải lại danh sách khuyến mãi
        closeForm();
        setPromotion({
          name: '',
          description: '',
          discount_percent: '',
          discount_amount: '',
          start_date: '',
          end_date: '',
          status: 'hoạt động'
        });
      } else {
        alert("Có lỗi xảy ra: " + result.message); // Hiển thị thông báo lỗi nếu có
      }
    } catch (error) {
      console.error('Lỗi khi thêm khuyến mãi:', error);
      alert('Đã xảy ra lỗi. Vui lòng thử lại.');
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close-btn" onClick={closeForm}>×</span>
        <h3>Thêm Khuyến Mãi</h3>
        <form onSubmit={handleSubmit}>
          <label>Tên Khuyến Mãi:</label>
          <input type="text" name="name" value={promotion.name} onChange={handleChange} required />

          <label>Mô Tả:</label>
          <textarea name="description" value={promotion.description} onChange={handleChange} required />

          <label>Phần Trăm Giảm Giá (%):</label>
          <input type="number" step="0.01" name="discount_percent" value={promotion.discount_percent} onChange={handleChange} />

          <label>Số Tiền Giảm Giá (VNĐ):</label>
          <input type="number" step="0.01" name="discount_amount" value={promotion.discount_amount} onChange={handleChange} />

          <label>Ngày Bắt Đầu:</label>
          <input type="date" name="start_date" value={promotion.start_date} onChange={handleChange} required />

          <label>Ngày Kết Thúc:</label>
          <input type="date" name="end_date" value={promotion.end_date} onChange={handleChange} required />

          <label>Trạng Thái:</label>
          <select className='promotion-select' name="status" value={promotion.status} onChange={handleChange} required>
            <option value="hoạt động">Hoạt động</option>
            <option value="hết hạn">Hết hạn</option>
          </select>

          <button type="submit">Thêm Khuyến Mãi</button>
        </form>
      </div>
    </div>
  );
}

export default AddPromotion;