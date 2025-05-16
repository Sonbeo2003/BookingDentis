import React, { useState } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import url from "../../../ipconfig";

const BASE_IMAGE_URL = "http://192.168.1.2/api_doctor/"; // Base URL cho ảnh

const SearchScreen = ({ navigation }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!query) return; // Không thực hiện tìm kiếm nếu không có từ khóa

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${url}/api_doctor/timkiemdv_tt.php?searchTerm=${encodeURIComponent(query)}`
      );
      const data = await response.json();

      console.log("API Response:", data);

      // Ánh xạ dữ liệu từ API
      const combinedResults = [
        ...data.services.map((service) => ({
          id: service.service_id,
          name: service.name,
          type: "services",
          image: service.image ? `${BASE_IMAGE_URL}${service.image}` : null,
          price: parseFloat(service.price),
          description: service.description,
          time: `${service.duration_minutes} phút`,
        })),
        ...data.centers.map((center) => ({
          id: center.clinic_id,
          name: center.name,
          type: "clinic",
          image: center.picture ? `${BASE_IMAGE_URL}${center.picture}` : null,
          address: center.address,
          phone_number: center.phone_number,
          email: center.email,
          X_location: center.X_location,
          Y_location: center.Y_location,
          opening_hours: center.opening_hours,
        })),
      ];

      const validResults = combinedResults.filter((item) => item.id !== undefined);
      setResults(validResults);
    } catch (err) {
      setError("Có lỗi xảy ra khi tìm kiếm.");
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => {
        if (item.type === "services") {
          navigation.navigate("ServiceDetails", {
            tenDichVu: item.name,
            hinhAnhDichVu: item.image,
            moTaDichVu: item.description,
            giaDichVu: item.price,
            thoiGianThucHien: item.time,
          });
        } else if (item.type === "center") {
          navigation.navigate("Center", {
            center: {
              clinic_id: item.id,
              name: item.name,
              picture: item.image,
              address: item.address,
              phone_number: item.phone_number,
              email: item.email,
              X_location: item.X_location,
              Y_location: item.Y_location,
              opening_hours: item.opening_hours,
            },
          });
        }
      }}
      key={`${item.id}-${item.type}`} // Sử dụng id kết hợp với type để tạo key duy nhất
    >
      <Image
        source={{ uri: item.image || "https://via.placeholder.com/60" }}
        style={styles.resultImage}
        onError={(error) => console.log("Lỗi tải ảnh:", error.nativeEvent)}
      />
      <View style={styles.resultInfo}>
        <Text style={styles.resultText} numberOfLines={1} ellipsizeMode="tail">
          {item.name} ({item.type === "service" ? "Dịch vụ" : "Trung tâm"})
        </Text>
        {item.type === "service" && (
          <>
            <View style={styles.infoRow}>
              <Icon
                name="money"
                size={16}
                color="#f9b233"
                style={styles.iconStyle}
              />
              <Text style={styles.productPrice}>
                {formatPrice(item.price)} VND
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Icon
                name="clock-o"
                size={16}
                color="#f9b233"
                style={styles.iconStyle}
              />
              <Text style={styles.productTime}>
                {item.time ? item.time : "Chưa có"}
              </Text>
            </View>
          </>
        )}
        {item.type === "center" && (
          <>
            <View style={styles.infoRow}>
              <Icon
                name="map-marker"
                size={16}
                color="#f9b233"
                style={styles.iconStyle}
              />
              <Text style={styles.centerAddress}>{item.address}</Text>
            </View>
            <View style={styles.infoRow}>
              <Icon
                name="phone"
                size={16}
                color="#f9b233"
                style={styles.iconStyle}
              />
              <Text style={styles.centerPhone}>{item.phone_number}</Text>
            </View>
          </>
        )}
      </View>
    </TouchableOpacity>
  );

  const formatPrice = (Gia) => {
    return Gia.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Tìm kiếm dịch vụ hoặc chi nhánh..."
        value={query}
        onChangeText={setQuery}
      />
      <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
        <Text style={styles.searchButtonText}>Tìm kiếm</Text>
      </TouchableOpacity>
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {error && <Text style={styles.errorText}>{error}</Text>}
      {results.length === 0 && !loading && (
        <Text style={styles.noResultsText}>
          Không có kết quả nào được tìm thấy.
        </Text>
      )}
      {query === "" && (
        <Image
          source={{
            uri: "https://nhakhoaleanh.com/wp-content/uploads/2020/11/Tooth.G01.2k.png",
          }}
          style={styles.petImage}
        />
      )}
      <FlatList
        data={results}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.id}-${item.type}-${index}`}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#e0f7fa",
  },
  searchInput: {
    height: 50,
    borderColor: "#00796b",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  searchButton: {
    backgroundColor: "#00796b",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  searchButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
  resultItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomColor: "#b2dfdb",
    borderBottomWidth: 1,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    marginVertical: 4,
    elevation: 1,
  },
  resultImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
    borderColor: "#00796b",
    borderWidth: 2,
  },
  resultInfo: {
    flex: 1,
  },
  resultText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#00796b",
  },
  productPrice: {
    fontSize: 16,
    color: "#00796b",
  },
  productTime: {
    fontSize: 14,
    color: "#555",
  },
  centerAddress: {
    fontSize: 14,
    color: "#555",
  },
  centerPhone: {
    fontSize: 14,
    color: "#555",
  },
  iconStyle: {
    marginRight: 8,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 2,
  },
  errorText: {
    color: "red",
    marginVertical: 10,
    textAlign: "center",
  },
  noResultsText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "grey",
  },
  petImage: {
    width: 300,
    height: 300,
    borderRadius: 10,
    marginTop: 50,
    marginLeft: 40,
    resizeMode: "cover",
  },
});

export default SearchScreen;