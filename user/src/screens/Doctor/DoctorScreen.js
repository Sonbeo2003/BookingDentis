import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import url from "../../../ipconfig";

const BASE_IMAGE_URL = "http://192.168.1.9/api_doctor/"; // Base URL cho ảnh

const DoctorScreen = ({ navigation }) => {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(`${url}/api_doctor/getdoctor.php`);
        console.log("Dữ liệu nha sĩ từ API:", response.data);
        // Thêm base URL vào profile_picture
        const updatedDoctors = response.data.map((doctor) => ({
          ...doctor,
          profile_picture: doctor.profile_picture
            ? `${BASE_IMAGE_URL}${doctor.profile_picture}`
            : null,
        }));
        setDoctors(updatedDoctors);
      } catch (error) {
        console.error("Lỗi khi tải danh sách nha sĩ:", error);
      }
    };

    fetchDoctors();
  }, []);

  const renderDoctorItem = ({ item }) => (
    <View style={styles.doctorItem}>
      <View style={styles.doctorHeader}>
        {item.profile_picture ? (
          <Image
            style={styles.doctorImage}
            source={{ uri: item.profile_picture }}
            onError={(error) => console.log("Lỗi tải ảnh:", error.nativeEvent)}
          />
        ) : (
          <View style={styles.noImagePlaceholder}>
            <Text style={styles.noImageText}>Không có ảnh</Text>
          </View>
        )}
        <View style={styles.doctorInfo}>
          <Text style={styles.doctorName}>{item.full_name}</Text>
          <Text style={styles.doctorSpecialty}>{item.specialty}</Text>
        </View>
      </View>
      <View style={styles.doctorDetails}>
        <Text style={styles.detailText}>
          SĐT: {item.phone_number || "Không có"}
        </Text>
        <Text style={styles.detailText}>
          Email: {item.email || "Không có"}
        </Text>
        <Text style={styles.detailText}>
          Chi nhánh: {item.clinic_name || "Chưa cập nhật"}
        </Text>
        <Text style={styles.detailText}>
          Lịch làm việc: {item.working_schedule || "Chưa cập nhật"}
        </Text>
        <Text style={styles.detailText}>
          Trạng thái: {item.status === "dang lam viec" ? "Hoạt động" : "Không hoạt động"}
        </Text>
        <Text style={styles.descriptionText}>
          Mô tả: {item.description || "Không có"}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thông tin nha sĩ</Text>
      <ScrollView>
        {doctors.length > 0 ? (
          doctors.map((doctor, index) => (
            <View key={doctor.doctor_id}>{renderDoctorItem({ item: doctor })}</View>
          ))
        ) : (
          <Text style={styles.noDataText}>Không có nha sĩ nào</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6f9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 10,
    paddingHorizontal: 20,
    color: "#2c3e50",
    textAlign: "center",
  },
  doctorItem: {
    backgroundColor: "#fff",
    marginHorizontal: 10,
    marginBottom: 15,
    borderRadius: 10,
    elevation: 3,
    padding: 10,
  },
  doctorHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  doctorImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
    resizeMode: "cover",
  },
  noImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  noImageText: {
    color: "#7f8c8d",
    fontSize: 12,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  doctorSpecialty: {
    fontSize: 14,
    color: "#7f8c8d",
  },
  doctorDetails: {
    marginTop: 10,
  },
  detailText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
  },
  descriptionText: {
    fontSize: 14,
    color: "#555",
    marginTop: 10,
  },
  noDataText: {
    textAlign: "center",
    padding: 20,
    color: "#7f8c8d",
  },
});

export default DoctorScreen;