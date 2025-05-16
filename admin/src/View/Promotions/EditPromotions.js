import React, { useState, useEffect } from 'react';
import './EditPromotions.css'; // Tạo file CSS tương ứng
import url from '../../ipconfig';
import { toast } from "react-toastify";

function EditPromotions({ promotionToEdit, closeForm, onPromotionUpdated }) {
  const [promotion, setPromotion] = useState(promotionToEdit);

  useEffect(() => {
    setPromotion(promotionToEdit);
  }, [promotionToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Đảm bảo discount_percent và discount_amount là số
    if (name === 'discount_percent' || name === 'discount_amount') {
      setPromotion({ ...promotion, [name]: value === '' ? null : parseFloat(value) });
    } else {
      setPromotion({ ...promotion, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Chuẩn bị dữ liệu để gửi
      const formData = new FormData();
      formData.append('promotion_id', promotion.promotion_id);
      formData.append('name', promotion.name);
      formData.append('description', promotion.description);
      formData.append('discount_percent', promotion.discount_percent || null);
      formData.append('discount_amount', promotion.discount_amount || null);
      formData.append('start_date', promotion.start_date);
      formData.append('end_date', promotion.end_date);
      formData.append('status', promotion.status.toLowerCase());

      const response = await fetch(`${url}/api_doctor/suakhuyenmai.php`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.status) {
        toast.success(result.message);
        onPromotionUpdated();
        closeForm();
      } else {
        toast.error(`Lỗi khi cập nhật khuyến mãi: ${result.message}`);
      }
    } catch (error) {
      console.error('Lỗi khi kết nối tới server:', error);
      toast.error('Đã xảy ra lỗi khi kết nối tới server.');
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close-btn" onClick={closeForm}>×</span>
        <h3>Sửa Khuyến Mãi</h3>
        <form onSubmit={handleSubmit}>
          <label>ID Khuyến Mãi:</label>
          <input type="text" name="promotion_id" value={promotion.promotion_id} readOnly />

          <label>Tên Khuyến Mãi:</label>
          <input type="text" name="name" value={promotion.name} onChange={handleChange} required />

          <label>Mô Tả:</label>
          <textarea name="description" value={promotion.description} onChange={handleChange} required />

          <label>Phần Trăm Giảm Giá (%):</label>
          <input type="number" step="0.01" name="discount_percent" value={promotion.discount_percent || ''} onChange={handleChange} />

          <label>Số Tiền Giảm Giá (VNĐ):</label>
          <input type="number" step="0.01" name="discount_amount" value={promotion.discount_amount || ''} onChange={handleChange} />

          <label>Ngày Bắt Đầu:</label>
          <input type="date" name="start_date" value={promotion.start_date} onChange={handleChange} required />

          <label>Ngày Kết Thúc:</label>
          <input type="date" name="end_date" value={promotion.end_date} onChange={handleChange} required />

          <label>Trạng Thái:</label>
          <select name="status" value={promotion.status} onChange={handleChange} required>
            <option value="hoạt động">Hoạt động</option>
            <option value="hết hạn">Hết hạn</option>
          </select>

          <button type="submit">Cập Nhật Khuyến Mãi</button>
        </form>
      </div>
    </div>
  );
}

export default EditPromotions;