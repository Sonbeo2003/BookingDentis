import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import axios from "axios";
import url from "../../../ipconfig";

const BASE_IMAGE_URL = "http://172.20.10.3/api_doctor/"; // Base URL cho ảnh

const ServicesListScreen = ({ navigation }) => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(`${url}/api_doctor/getdichvu.php`);
        console.log("Dữ liệu dịch vụ từ API:", response.data);
        // Thêm base URL vào image
        const updatedServices = response.data.map((service) => ({
          ...service,
          image: service.image ? `${BASE_IMAGE_URL}${service.image}` : null,
        }));
        setServices(updatedServices);
      } catch (error) {
        console.error("Lỗi khi tải dịch vụ:", error);
      }
    };

    fetchServices();
  }, []);

  const renderServiceItem = ({ item }) => (
    <TouchableOpacity
      style={styles.serviceItem}
      onPress={() =>
        navigation.navigate("ServiceDetails", {
          tenDichVu: item.name,
          hinhAnhDichVu: item.image,
          moTaDichVu: item.description,
          giaDichVu: parseFloat(item.price),
          thoiGianThucHien: `${item.duration_minutes} phút`,
        })
      }
    >
      <Image
        style={styles.serviceImage}
        source={{ uri: item.image || "https://via.placeholder.com/150" }}
        onError={(error) => console.log("Lỗi tải ảnh:", error.nativeEvent)}
      />
      <View style={styles.serviceInfo}>
        <Text style={styles.serviceName}>{item.name}</Text>
        <Text style={styles.serviceDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <TouchableOpacity
          style={styles.bookButton}
          onPress={() =>
            navigation.navigate("Booking", { serviceId: item.service_id })
          }
        >
          <Text style={styles.bookButtonText}>Đặt lịch</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dịch vụ</Text>
      <FlatList
        data={services}
        renderItem={renderServiceItem}
        keyExtractor={(item) => item.service_id.toString()}
        ListEmptyComponent={<Text style={styles.noDataText}>Không có dịch vụ</Text>}
      />
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
  serviceItem: {
    flexDirection: "row",
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: "#fff",
    elevation: 3,
    marginHorizontal: 20,
    overflow: "hidden",
  },
  serviceImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    margin: 10,
  },
  serviceInfo: {
    flex: 1,
    padding: 10,
    justifyContent: "space-between",
  },
  serviceName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  serviceDescription: {
    fontSize: 14,
    color: "#7f8c8d",
    marginVertical: 5,
  },
  bookButton: {
    backgroundColor: "#28a745",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignSelf: "flex-start",
  },
  bookButtonText: {
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

export default ServicesListScreen;