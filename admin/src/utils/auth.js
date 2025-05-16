// Lưu trạng thái đăng nhập vào localStorage
export const setLoginStatus = (user) => {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("user", JSON.stringify(user));
  };
  
  // Kiểm tra trạng thái đăng nhập
  export const isLoggedIn = () => {
    return localStorage.getItem("isLoggedIn") === "true";
  };
  
  // Lấy thông tin người dùng từ localStorage
  export const getUser = () => {
    return JSON.parse(localStorage.getItem("user"));
  };
  
  // Xóa trạng thái đăng nhập (đăng xuất)
  export const logout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
  };
  