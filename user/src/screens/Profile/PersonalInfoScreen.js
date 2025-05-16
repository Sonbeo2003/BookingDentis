import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import url from "../../../ipconfig";

const PersonalInfoScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userString = await AsyncStorage.getItem("user");
        let idnguoidung;

        if (userString) {
          const userObject = JSON.parse(userString); 
          console.log("Fetched user object:", userObject);
          idnguoidung = userObject.idnguoidung; 
        } else {
          idnguoidung = await AsyncStorage.getItem("idnguoidung");
        }

        console.log("ID Người Dùng:", idnguoidung);

        if (!idnguoidung) {
          console.error("Không tìm thấy idnguoidung trong AsyncStorage");
          return;
        }

        // Gửi yêu cầu API để lấy thông tin người dùng
        const response = await axios.get(
          `${url}API_Events/Account_User/getnguoidungbyid.php?idnguoidung=${idnguoidung}`
        );

        if (response.data) {
          setUser(response.data); // Lưu thông tin người dùng vào state
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
      }
    };

    fetchUserData(); // Gọi hàm lấy dữ liệu
  }, []);

  const handleSave = async () => {
    try {
      const userString = await AsyncStorage.getItem("user");
      let idnguoidung;

      if (userString) {
        const userObject = JSON.parse(userString);
        idnguoidung = userObject.idnguoidung;
      } else {
        idnguoidung = await AsyncStorage.getItem("idnguoidung");
      }

      if (!idnguoidung) {
        console.error("Không tìm thấy idnguoidung trong AsyncStorage");
        return;
      }

      // Tạo đối tượng dữ liệu người dùng để gửi
      const updatedUser = {
        idnguoidung,
        tennguoidung: user.tennguoidung,
        email: user.email,
        sodienthoai: user.sodienthoai,
        diachi: user.diachi,
      };

      // Gửi yêu cầu PUT để cập nhật thông tin người dùng
      const response = await axios.put(
        `${url}API_Events/Account_User/suanguoidungbyid.php`,
        updatedUser
      );

      if (response.data) {
        setUser(response.data); 
        setIsEditing(false);
        navigation.goBack();
       
      }
    } catch (error) {
      console.error("Lỗi khi lưu thông tin người dùng:", error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false); // Hủy thay đổi và quay lại chế độ không chỉnh sửa
  };

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Đang tải thông tin người dùng...</Text>
      </View>
    );
  }

  const defaultAvatar =
    "https://www.pngpacks.com/uploads/data/657/IMG_PotlniwbKVKj.png";

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* <Text style={styles.title}>Thông tin cá nhân</Text> */}

      {/* Ảnh đại diện */}
      <TouchableOpacity style={styles.avatarContainer}>
        <Image
          source={user.avatar ? { uri: user.avatar } : { uri: defaultAvatar }}
          style={styles.avatar}
        />
        <Ionicons
          name="camera"
          size={25}
          color="#fff"
          style={styles.cameraIcon}
        />
      </TouchableOpacity>

      {/* Thông tin người dùng */}
      <TextInput
        style={styles.input}
        value={user.tennguoidung}
        editable={isEditing}
        onChangeText={(text) => setUser({ ...user, tennguoidung: text })}
        placeholder="Tên"
      />
      <TextInput
        style={styles.input}
        value={user.email}
        editable={isEditing}
        onChangeText={(text) => setUser({ ...user, email: text })}
        placeholder="Email"
      />
      <TextInput
        style={styles.input}
        value={user.sodienthoai}
        editable={isEditing}
        onChangeText={(text) => setUser({ ...user, sodienthoai: text })}
        placeholder="Số điện thoại"
      />
      <TextInput
        style={styles.input}
        value={user.diachi}
        editable={isEditing}
        onChangeText={(text) => setUser({ ...user, diachi: text })}
        placeholder="Địa chỉ"
      />

      {/* Nút lưu hoặc hủy */}
      {isEditing ? (
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.button} onPress={handleSave}>
            <Text style={styles.buttonText}>Lưu</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleCancel}>
            <Text style={styles.buttonText}>Hủy</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setIsEditing(true)}
        >
          <Text style={styles.editButtonText}>Chỉnh sửa thông tin</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     textAlign: "center",
//     marginBottom: 20,
//   },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#f9b233",
  },
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: 130,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
    padding: 5,
  },
  input: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 15,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    backgroundColor: "#FF9900",
    padding: 10,
    borderRadius: 5,
    width: "45%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  editButton: {
    backgroundColor: "#ddd",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  editButtonText: {
    fontSize: 16,
    color: "#333",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default PersonalInfoScreen;
