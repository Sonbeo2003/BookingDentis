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

const TreatmentHistoryScreen = ({ navigation }) => {
  const [treatments, setTreatments] = useState([]);

  useEffect(() => {
    const fetchTreatments = async () => {
      try {
        const response = await axios.get(`${url}/api_doctor/getlichsu.php`);
        console.log("Dữ liệu lịch sử điều trị:", response.data);
        // Thêm base URL vào before_image và after_image
        const updatedTreatments = response.data.map((treatment) => ({
          ...treatment,
          before_image: treatment.before_image
            ? `${BASE_IMAGE_URL}${treatment.before_image}`
            : null,
          after_image: treatment.after_image
            ? `${BASE_IMAGE_URL}${treatment.after_image}`
            : null,
        }));
        setTreatments(updatedTreatments);
      } catch (error) {
        console.error("Lỗi khi tải lịch sử điều trị:", error);
      }
    };

    fetchTreatments();
  }, []);

  const renderTreatmentItem = ({ item }) => (
    <View style={styles.treatmentItem}>
      <Text style={styles.treatmentDate}>{item.treatment_date}</Text>
      <View style={styles.treatmentInfo}>
        <Text style={styles.doctorName}>
          Bác sĩ: {item.full_name || "Không rõ"}
        </Text>
        <Text style={styles.serviceName}>
          Dịch vụ: {item.name || "Không rõ"}
        </Text>
        <Text style={styles.healthStatus}>
          Tình trạng răng miệng: {item.oral_health_status || "Không có"}
        </Text>
      </View>
      <ScrollView horizontal style={styles.imageContainer}>
        {item.before_image && (
          <Image
            style={styles.treatmentImage}
            source={{ uri: item.before_image }}
            onError={(error) => console.log("Lỗi tải ảnh trước:", error.nativeEvent)}
          />
        )}
        {item.after_image && (
          <Image
            style={styles.treatmentImage}
            source={{ uri: item.after_image }}
            onError={(error) => console.log("Lỗi tải ảnh sau:", error.nativeEvent)}
          />
        )}
      </ScrollView>
      <TouchableOpacity
        style={styles.viewDetailButton}
        onPress={() =>
          navigation.navigate("TreatmentDetail", {
            treatment: item,
          })
        }
      >
        <Text style={styles.viewDetailText}>Xem chi tiết</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lịch sử điều trị</Text>
      <ScrollView>
        {treatments.length > 0 ? (
          treatments.map((item, index) => (
            <View key={item.treatment_id}>{renderTreatmentItem({ item })}</View>
          ))
        ) : (
          <Text style={styles.noDataText}>Không có lịch sử điều trị</Text>
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
  treatmentItem: {
    backgroundColor: "#fff",
    marginHorizontal: 10,
    marginBottom: 15,
    borderRadius: 10,
    elevation: 3,
    padding: 10,
  },
  treatmentDate: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 5,
  },
  treatmentInfo: {
    marginBottom: 10,
  },
  doctorName: {
    fontSize: 15,
    color: "#333",
  },
  serviceName: {
    fontSize: 15,
    color: "#333",
    marginTop: 5,
  },
  healthStatus: {
    fontSize: 14,
    color: "#7f8c8d",
    marginTop: 5,
  },
  imageContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  treatmentImage: {
    width: 100,
    height: 100,
    borderRadius: 5,
    marginRight: 10,
    resizeMode: "cover",
  },
  viewDetailButton: {
    backgroundColor: "#28a745",
    paddingVertical: 8,
    borderRadius: 5,
    alignItems: "center",
  },
  viewDetailText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  noDataText: {
    textAlign: "center",
    padding: 20,
    color: "#7f8c8d",
  },
});

export default TreatmentHistoryScreen;