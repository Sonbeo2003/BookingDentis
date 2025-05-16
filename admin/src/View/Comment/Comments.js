import React, { useState, useEffect, useCallback } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./Comment.css";
import url from "../../ipconfig";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Custom hook for debounce
function useSearchDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

const Comments = () => {
  // Dữ liệu mẫu cho bình luận (sử dụng khi API không khả dụng)
  const initialComments = [
    {
      id: 1,
      username: "Nguyễn Văn A",
      content: "Dịch vụ rất tốt, bác sĩ thân thiện!",
      timestamp: "2025-05-10 10:30",
    },
    {
      id: 2,
      username: "Trần Thị B",
      content: "Thú cưng của tôi được chăm sóc chu đáo.",
      timestamp: "2025-05-10 11:15",
    },
    {
      id: 3,
      username: "Lê Văn C",
      content: "Thời gian chờ hơi lâu nhưng chất lượng dịch vụ ổn.",
      timestamp: "2025-05-10 12:00",
    },
  ];

  const [comments, setComments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredComments, setFilteredComments] = useState([]);

  const debounceKeyword = useSearchDebounce(searchTerm, 500);

  // Load comment list
  const loadComments = useCallback(async () => {
    try {
      const response = await fetch(`${url}/api_doctor/getcomments.php`);
      if (!response.ok) {
        throw new Error("Lỗi khi tải dữ liệu bình luận");
      }
      const data = await response.json();
      setComments(data);
      setFilteredComments(data);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
      toast.error("Không thể tải danh sách bình luận. Vui lòng kiểm tra kết nối hoặc dữ liệu.");
      // Sử dụng dữ liệu mẫu nếu API thất bại
      setComments(initialComments);
      setFilteredComments(initialComments);
    }
  }, []);

  // Search comments
  const searchComments = useCallback(async (searchTerm) => {
    try {
      const response = await fetch(
        `${url}/api_doctor/timkiemcomments.php?searchTerm=${searchTerm}`
      );
      if (!response.ok) {
        throw new Error("Lỗi khi tìm kiếm bình luận");
      }
      const data = await response.json();
      setFilteredComments(data);
    } catch (error) {
      console.error("Lỗi khi tìm kiếm:", error);
      toast.error("Không thể tìm kiếm bình luận. Vui lòng thử lại.");
    }
  }, []);

  // Search comments when input changes
  useEffect(() => {
    if (debounceKeyword.trim() === "") {
      setFilteredComments(comments);
    } else {
      searchComments(debounceKeyword);
    }
  }, [debounceKeyword, comments, searchComments]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  return (
    <div id="comments" className="comments-content-section">
      <ToastContainer style={{ top: 70 }} />
      <div className="comments-search-container">
        <i className="fas fa-search comments-search-icon"></i>
        <input
          type="text"
          placeholder="Tìm kiếm bình luận..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="comments-search-input"
        />
      </div>
      <div id="commentsTable" className="comments-table">
        {filteredComments.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên người dùng</th>
                <th>Nội dung</th>
                <th>Thời gian</th>
              </tr>
            </thead>
            <tbody>
              {filteredComments.map((comment) => (
                <tr key={comment.id}>
                  <td>{comment.id}</td>
                  <td>{comment.username}</td>
                  <td>{comment.content}</td>
                  <td>{comment.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Không có bình luận nào</p>
        )}
      </div>
    </div>
  );
};

export default Comments;