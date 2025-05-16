import React, { useState, useEffect, useCallback } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./Users.css";
import AddUser from "./AddUser";
import EditUser from "./EditUser";
import url from "../../ipconfig";
import { toast, ToastContainer } from "react-toastify";
import useDebounce from "../../common/useDebounce";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showEditUser, setShowEditUser] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);

  const debounceKeyword = useDebounce(searchTerm, 500);

  const getRoleLabel = (role) => {
    switch (parseInt(role)) {
      case 0:
        return "Admin";
      case 1:
        return "Nhân viên";
      case 2:
        return "Khách hàng";
      default:
        return "Không rõ";
    }
  };

  const getStatusLabel = (status) => {
    switch (parseInt(status)) {
      case 1:
        return "Hoạt động";
      case 0:
        return "Không hoạt động";
      default:
        return "Không rõ";
    }
  };

  // Get logged in user's ID from localStorage
  const loggedInUserId = JSON.parse(localStorage.getItem("user"))?.user_id;

  // Load user list
  const loadUsers = useCallback(async () => {
    console.log("Logged-in User ID:", loggedInUserId);

    try {
      const response = await fetch(
        `${url}/api_doctor/getnguoidung.php?user_id=${loggedInUserId}`
      );
      if (!response.ok) {
        throw new Error("Lỗi khi tải dữ liệu");
      }
      const data = await response.json();
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
      alert(
        "Không thể tải danh sách người dùng. Vui lòng kiểm tra kết nối hoặc dữ liệu."
      );
    }
  }, [loggedInUserId]);

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  // Search users
  const searchUsers = useCallback(
    async (searchTerm) => {
      try {
        const response = await fetch(
          `${url}/api_doctor/timkiemnguoidung.php?searchTerm=${searchTerm}&user_id=${loggedInUserId}`
        );
        if (!response.ok) {
          throw new Error("Lỗi khi tìm kiếm người dùng");
        }
        const data = await response.json();
        setFilteredUsers(data);
      } catch (error) {
        console.error("Lỗi khi tìm kiếm:", error);
        alert("Không thể tìm kiếm người dùng. Vui lòng thử lại.");
      }
    },
    [loggedInUserId]
  );

  // Search users when input changes
  useEffect(() => {
    if (debounceKeyword.trim() === "") {
      setFilteredUsers(users);
    } else {
      searchUsers(debounceKeyword);
    }
  }, [debounceKeyword, users, searchUsers]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Edit user
  const editUser = (user) => {
    setUserToEdit(user);
    setShowEditUser(true);
  };

  // Delete user
  const deleteUser = async (id) => {
    const confirmDelete = window.confirm(
      "Bạn có muốn xóa người dùng này không?"
    );
    if (confirmDelete) {
      try {
        const response = await fetch(`${url}/api_doctor/XOANGUOIDUNG.php?id=${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          const result = await response.json();
          toast.success(result.message);
          loadUsers();
        } else {
          const errorResult = await response.json();
          alert("Có lỗi xảy ra khi xóa người dùng: " + errorResult.message);
        }
      } catch (error) {
        console.error("Lỗi khi xóa người dùng:", error);
        alert("Đã xảy ra lỗi. Vui lòng thử lại.");
      }
    }
  };

  return (
    <div id="user" className="user-content-section">
      <ToastContainer style={{ top: 70 }} />
      <div className="user-search-container">
        <i className="fas fa-search user-search-icon"></i>
        <input
          type="text"
          placeholder="Tìm kiếm người dùng..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="user-search-input"
        />
      </div>
      <div id="userTable" className="user-table">
        {filteredUsers.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên người dùng</th>
                <th>Email</th>
                <th>Số điện thoại</th>
                <th>Mật khẩu</th>
                <th>Địa chỉ</th>
                <th>Giới tính</th>
                <th>Ngày sinh</th>
                <th>Trạng thái</th>
                <th>Vai trò</th>
                <th>Chức năng</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.user_id}>
                  <td>{user.user_id}</td>
                  <td>{user.full_name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone_number}</td>
                  <td>{user.password}</td>
                  <td>{user.address}</td>
                  <td>{user.gender}</td>
                  <td>{formatDate(user.date_of_birth)}</td>
                  <td>{getStatusLabel(user.status)}</td>
                  <td>{getRoleLabel(user.role)}</td>
                  <td>
                    <button
                      className="custom-edit-button"
                      onClick={() => editUser(user)}
                    >
                      Sửa
                    </button>
                    <button
                      className="custom-delete-button"
                      onClick={() => deleteUser(user.user_id)}
                    >
                      Khóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Không có người dùng nào</p>
        )}
      </div>

      <button
        className="user-floating-btn"
        onClick={() => setShowAddUser(true)}
      >
        +
      </button>

      {/* Hiển thị form thêm người dùng nếu cần */}
      {showAddUser && (
        <AddUser
          closeForm={() => setShowAddUser(false)}
          onUserAdded={loadUsers}
        />
      )}

      {/* Hiển thị form chỉnh sửa người dùng nếu cần */}
      {showEditUser && (
        <EditUser
          userToEdit={userToEdit}
          closeForm={() => setShowEditUser(false)}
          onUserUpdated={loadUsers}
        />
      )}
    </div>
  );
};

export default Users;