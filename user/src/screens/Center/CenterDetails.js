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
import Icon from "react-native-vector-icons/FontAwesome";
import MapView, { Marker } from "react-native-maps";
import url from "../../../ipconfig";

const BASE_IMAGE_URL = "http://172.20.10.3/api_doctor/"; // Base URL cho ảnh

const CenterDetails = ({ navigation }) => {
  const [centers, setCenters] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState(null);

  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const response = await axios.get(`${url}/api_doctor/gettrungtam.php`);
        console.log("Dữ liệu từ API:", response.data);
        // Thêm base URL vào picture
        const updatedCenters = response.data.map((center) => ({
          ...center,
          picture: center.picture ? `${BASE_IMAGE_URL}${center.picture}` : null,
        }));
        setCenters(updatedCenters);
      } catch (error) {
        console.error("Error fetching centers:", error);
      }
    };

    fetchCenters();
  }, []);

  const renderCenterItem = ({ item }) => (
    <TouchableOpacity
      style={styles.centerItem}
      onPress={() => setSelectedCenter(item)}
    >
      {item.picture ? (
        <Image
          style={styles.centerImage}
          source={{ uri: item.picture }}
          onError={(error) => console.log("Lỗi tải ảnh:", error.nativeEvent)}
        />
      ) : (
        <Text style={styles.noImageText}>Không có hình ảnh</Text>
      )}
      <Text style={styles.centerName}>{item.name}</Text>
      <Text style={styles.centerAddress}>
        {item.address}, {item.X_location}, {item.Y_location}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={centers}
        renderItem={renderCenterItem}
        keyExtractor={(item) => item.clinic_id.toString()}
        ListHeaderComponent={
          selectedCenter && (
            <View style={styles.detailsContainer}>
              {selectedCenter.picture ? (
                <Image
                  style={styles.centerImage}
                  source={{ uri: selectedCenter.picture }}
                  onError={(error) => console.log("Lỗi tải ảnh chi tiết:", error.nativeEvent)}
                />
              ) : (
                <Text style={styles.noImageText}>Không có hình ảnh</Text>
              )}
              <Text style={styles.title}>{selectedCenter.name}</Text>
              <View style={styles.contactContainer}>
                <View style={styles.contactItem}>
                  <Icon name="map-marker" size={20} color="#f9b233" />
                  <Text style={styles.text}>
                    {selectedCenter.address} ({selectedCenter.X_location}, {selectedCenter.Y_location})
                  </Text>
                </View>
                <View style={styles.contactItem}>
                  <Icon name="phone" size={20} color="#f9b233" />
                  <Text style={styles.text}>{selectedCenter.phone_number}</Text>
                </View>
                <View style={styles.contactItem}>
                  <Icon name="envelope" size={20} color="#f9b233" />
                  <Text style={styles.text}>{selectedCenter.email}</Text>
                </View>
              </View>
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: parseFloat(selectedCenter.Y_location),
                  longitude: parseFloat(selectedCenter.X_location),
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
              >
                <Marker
                  coordinate={{
                    latitude: parseFloat(selectedCenter.Y_location),
                    longitude: parseFloat(selectedCenter.X_location),
                  }}
                  title={selectedCenter.name}
                />
              </MapView>
              <TouchableOpacity
                style={styles.scheduleButton}
                onPress={() =>
                  navigation.navigate("Booking", { centerId: selectedCenter.clinic_id })
                }
              >
                <Text style={styles.scheduleButtonText}>Đặt lịch ngay</Text>
              </TouchableOpacity>
            </View>
          )
        }
        ListEmptyComponent={<Text style={styles.noDataText}>Không có dữ liệu</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6f9",
  },
  centerItem: {
    marginBottom: 15,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#fff",
    elevation: 3,
  },
  centerImage: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
  },
  centerName: {
    fontSize: 18,
    fontWeight: "bold",
    padding: 10,
    color: "#2c3e50",
  },
  centerAddress: {
    fontSize: 14,
    paddingHorizontal: 10,
    paddingBottom: 10,
    color: "#7f8c8d",
  },
  detailsContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 10,
    color: "#2c3e50",
    textAlign: "center",
  },
  contactContainer: {
    marginVertical: 20,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  text: {
    fontSize: 14,
    marginLeft: 10,
    color: "#34495e",
  },
  map: {
    width: "100%",
    height: 300,
    marginVertical: 20,
  },
  scheduleButton: {
    backgroundColor: "#e67e22",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  scheduleButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  noDataText: {
    textAlign: "center",
    padding: 20,
    color: "#7f8c8d",
  },
  noImageText: {
    textAlign: "center",
    padding: 20,
    color: "#7f8c8d",
  },
});

export default CenterDetails;