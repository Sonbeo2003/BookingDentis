import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {user ? (
        <>
          {/* Ảnh nền bo tròn */}
          <ImageBackground
            source={{
              uri: "https://media.istockphoto.com/id/915629984/vi/video/n%E1%BB%81n-chuy%E1%BB%83n-%C4%91%E1%BB%99ng-tr%E1%BB%ABu-t%C6%B0%E1%BB%A3ng-m%C3%A0u-xanh-nh%E1%BA%A1t.jpg?s=256x256&k=20&c=4z_QXg6W6vT6yd6bmKejiRrGsIQXPRZJanJdrZ8CvfQ=",
            }}
            style={styles.backgroundImage}
            resizeMode="cover"
          >
            <TouchableOpacity
              style={styles.leftIcon}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={30} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.rightIcon}
              onPress={() => navigation.navigate("Menu")}
            >
              <Ionicons name="ellipsis-horizontal" size={30} color="white" />
            </TouchableOpacity>
          </ImageBackground>

          <Image
            source={{
              uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaU7H8XCsslaJa1DQJlr0_i1HzhBI5lvD1I93SbYriu4dEGU_2_apTOGZKNDqARjYAVJ0&usqp=CAU",
            }}
            style={styles.profileImage}
          />

          <Text style={styles.name}>{user.tennguoidung}</Text>

          <View style={styles.containerbutton}>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("PersonalInfoScreen")}>
              <Ionicons
                name="person-outline"
                size={20}
                color="#fff"
                style={styles.icon}
              />
              <Text style={styles.buttonText}>Thông tin cá nhân</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate("ChangePasswordScreen")}
            >
              <Ionicons
                name="key-outline"
                size={20}
                color="#fff"
                style={styles.icon}
              />
              <Text style={styles.buttonText}>Đổi mật khẩu</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.containerbutton}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate("PetScreen")}
            >
              <Ionicons
                name="help-circle-outline"
                size={20}
                color="#fff"
                style={styles.icon}
              />
              <Text style={styles.buttonText}>Lịch sử đặt lịch</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.containerbutton}>
            <TouchableOpacity style={styles.button}>
              <Ionicons
                name="notifications-outline"
                size={20}
                color="#fff"
                style={styles.icon}
              />
              <Text style={styles.buttonText}>Thông báo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate("SupportScreen")}
            >
              <Ionicons
                name="help-circle-outline"
                size={20}
                color="#fff"
                style={styles.icon}
              />
              <Text style={styles.buttonText}>Giúp đỡ & Hỗ trợ</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button}>
              <Ionicons
                name="settings-outline"
                size={20}
                color="#fff"
                style={styles.icon}
              />
              <Text style={styles.buttonText}>Cài đặt</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.containerbutton}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.replace("Login")}
            >
              <Icon
                name="sign-out"
                size={20}
                color="#fff"
                style={styles.icon}
              />
              <Text style={styles.buttonText}>Đăng xuất</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <Text style={styles.noUserText}>Không có thông tin người dùng.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f8ff", // Màu nền chính
    alignItems: "center",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 25,
    color: "#007aff", // Màu chữ tên người dùng
    textAlign: "center",
    marginBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noUserText: {
    fontSize: 16,
    color: "#6c757d", // Màu xám trung tính
    textAlign: "center",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#4caf50", // Màu xanh lá
    position: "absolute",
    top: 150,
    zIndex: 1,
    alignSelf: "center",
  },
  backgroundImage: {
    width: "100%",
    height: 230,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: "hidden",
  },
  leftIcon: {
    position: "absolute",
    top: 30,
    left: 20,
    zIndex: 2,
  },
  rightIcon: {
    position: "absolute",
    top: 30,
    right: 20,
    zIndex: 2,
  },
  containerbutton: {
    backgroundColor: "#ffffff", // Màu trắng
    width: "90%",
    borderRadius: 15,
    paddingVertical: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#b0bec5", // Viền xám nhạt
    shadowColor: "#eceff1", // Bóng xám nhạt
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
  },
  button: {
    flexDirection: "row",
    paddingVertical: 5,
    paddingHorizontal: 15,
    alignItems: "center",
  },
  icon: {
    marginLeft: 5,
    marginRight: 15,
    fontSize: 25,
    color: "#37474f", // Màu xám đậm
  },
  buttonText: {
    color: "#37474f", // Màu xám đậm
    fontSize: 16,
  },
});

export default ProfileScreen;
