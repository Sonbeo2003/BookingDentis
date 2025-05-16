import React, { useEffect, useState } from "react";
import "./Dentail.css";
import AddDentailProfile from "./AddDentail";
import EditDentailProfile from "./EditDentail";
import "@fortawesome/fontawesome-free/css/all.min.css";
import url from "../../ipconfig";
import { toast, ToastContainer } from "react-toastify";
import useDebounce from "../../common/useDebounce";

const DentailProfile = () => {
  const [profiles, setProfiles] = useState([]);
  const [error, setError] = useState(null);
  const [showAddProfile, setShowAddProfile] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [profileToEdit, setProfileToEdit] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProfiles, setFilteredProfiles] = useState([]);

  const debounceKeyword = useDebounce(searchTerm, 500);

  // Hàm load danh sách hồ sơ răng từ API
  const loadProfiles = async () => {
    try {
      const response = await fetch(`${url}/api_doctor/get_dentail.php`);
      if (!response.ok) {
        throw new Error("Lỗi khi tải danh sách hồ sơ răng");
      }
      const data = await response.json();
      setProfiles(data);
      setFilteredProfiles(data);
    } catch (error) {
      setError(error.message);
    }
  };

  // Hàm tìm kiếm hồ sơ răng
  const searchProfile = async (searchTerm) => {
    try {
      const response = await fetch(
        `${url}/api_doctor/timkiemdentail.php?searchTerm=${searchTerm}`
      );
      if (!response.ok) {
        throw new Error("Lỗi khi tìm kiếm hồ sơ răng");
      }
      const data = await response.json();
      setFilteredProfiles(data);
    } catch (error) {
      console.error("Lỗi khi tìm kiếm:", error);
      toast.error("Không thể tìm kiếm hồ sơ răng. Vui lòng thử lại.");
    }
  };

  useEffect(() => {
    loadProfiles(); // Gọi API khi component được load
  }, []);

  useEffect(() => {
    if (debounceKeyword.trim() === "") {
      setFilteredProfiles(profiles);
    } else {
      searchProfile(debounceKeyword);
    }
  }, [debounceKeyword, profiles]);

  const editProfile = (profile) => {
    setProfileToEdit(profile);
    setShowEditProfile(true);
  };

  const deleteProfile = async (id) => {
    const confirmDelete = window.confirm(
      "Bạn có muốn xóa hồ sơ này không?"
    );
    if (confirmDelete) {
      try {
        const response = await fetch(
          `${url}/api_doctor/xoadentail.php?id=${id}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          const result = await response.json();
          toast.success(result.message);
          loadProfiles();
        } else {
          const errorResult = await response.json();
          toast.error(
            "Có lỗi xảy ra khi xóa hồ sơ: " + errorResult.message
          );
        }
      } catch (error) {
        console.error("Lỗi khi xóa hồ sơ:", error);
        toast.error("Đã xảy ra lỗi. Vui lòng thử lại.");
      }
    }
  };

  return (
    <div id="dentailprofile" className="center-content-section">
      <ToastContainer style={{ top: 70 }} />
      {/* Hiển thị lỗi nếu có */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Thanh tìm kiếm */}
      <div className="center-search-container">
        <i className="fas fa-search center-search-icon"></i>
        <input
          type="text"
          placeholder="Tìm kiếm hồ sơ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="center-search-input"
        />
      </div>

      {/* Hiển thị danh sách hồ sơ răng */}
      {filteredProfiles.length > 0 ? (
        <table className="center-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên Người dùng</th>
              <th>Vấn đề hiện tại</th>
              <th>Tình trạng</th>
              <th>Ngày kiểm tra cuối</th>
              <th>Ngày điều trị cuối</th>
              <th>Ghi chú</th>
              <th>Chức năng</th>
            </tr>
          </thead>
          <tbody>
            {filteredProfiles.map((profile) => (
              <tr key={profile.profile_id}>
                <td>{profile.profile_id}</td>
                <td>{profile.full_name}</td>
                <td>{profile.current_issues}</td>
                <td>{profile.general_status}</td>
                <td>{profile.last_checkup_date}</td>
                <td>{profile.last_treatment_date}</td>
                <td>{profile.note}</td>
                <td>
                  <button
                    onClick={() => editProfile(profile)}
                    className="custom-edit-button"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => deleteProfile(profile.profile_id)}
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
        <p>Không có hồ sơ răng nào.</p>
      )}
      <button
        className="center-floating-btn"
        onClick={() => setShowAddProfile(true)}
      >
        +
      </button>

      {showAddProfile && (
        <AddDentailProfile
          closeForm={() => setShowAddProfile(false)}
          onProfileAdded={loadProfiles}
        />
      )}

      {showEditProfile && (
        <EditDentailProfile
          profileToEdit={profileToEdit}
          closeForm={() => setShowEditProfile(false)}
          onProfileUpdated={loadProfiles}
        />
      )}
    </div>
  );
};

export default DentailProfile;