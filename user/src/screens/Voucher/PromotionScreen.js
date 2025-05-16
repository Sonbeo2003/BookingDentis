import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import url from "../../../ipconfig";

const PromotionScreen = ({ navigation }) => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await axios.get(`${url}/api_doctor/getkhuyenmai.php`);
        console.log("Dữ liệu khuyến mãi từ API:", response.data);
        setPromotions(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi tải danh sách khuyến mãi:", error);
        setLoading(false);
        Alert.alert("Lỗi", "Không thể tải dữ liệu khuyến mãi. Vui lòng thử lại sau.");
      }
    };

    fetchPromotions();
  }, []);

  // Format date from YYYY-MM-DD to DD/MM/YYYY
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  // Check if promotion is currently active
  const isActive = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    return now >= start && now <= end;
  };

  const renderPromotionItem = (promotion) => {
    const active = isActive(promotion.start_date, promotion.end_date);
    
    return (
      <TouchableOpacity 
        key={promotion.promotion_id}
        style={[styles.promotionItem, active ? styles.activePromotion : styles.inactivePromotion]}
        onPress={() => {
          // Handle promotion press, e.g., navigate to detail screen
          Alert.alert("Thông báo", `Bạn đã chọn khuyến mãi: ${promotion.name}`);
        }}
      >
        <View style={styles.promotionHeader}>
          <Text style={styles.promotionName}>{promotion.name}</Text>
          <View style={[styles.statusBadge, active ? styles.activeBadge : styles.inactiveBadge]}>
            <Text style={styles.statusText}>
              {active ? "Đang áp dụng" : "Hết hạn"}
            </Text>
          </View>
        </View>
        
        <View style={styles.promotionDetails}>
          {promotion.discount_percent > 0 && (
            <Text style={styles.discountText}>
              Giảm giá: {promotion.discount_percent}%
            </Text>
          )}
          
          {promotion.discount_amount > 0 && (
            <Text style={styles.discountText}>
              Giảm giá: {parseInt(promotion.discount_amount).toLocaleString('vi-VN')} VNĐ
            </Text>
          )}
          
          <Text style={styles.dateText}>
            Thời gian: {formatDate(promotion.start_date)} - {formatDate(promotion.end_date)}
          </Text>
          
          <Text style={styles.descriptionText}>
            {promotion.description || "Không có mô tả"}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Khuyến Mãi</Text>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1e88e5" />
          <Text style={styles.loadingText}>Đang tải khuyến mãi...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {promotions && promotions.length > 0 ? (
            promotions.map((promotion) => renderPromotionItem(promotion))
          ) : (
            <View style={styles.noDataContainer}>
              <Text style={styles.noDataText}>Không có khuyến mãi nào</Text>
            </View>
          )}
        </ScrollView>
      )}
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
    marginVertical: 15,
    paddingHorizontal: 20,
    color: "#2c3e50",
    textAlign: "center",
  },
  scrollContent: {
    paddingBottom: 20,
  },
  promotionItem: {
    marginHorizontal: 15,
    marginBottom: 15,
    borderRadius: 10,
    padding: 15,
    elevation: 3,
  },
  activePromotion: {
    backgroundColor: "#fff",
    borderLeftWidth: 5,
    borderLeftColor: "#4caf50",
  },
  inactivePromotion: {
    backgroundColor: "#fff",
    borderLeftWidth: 5,
    borderLeftColor: "#9e9e9e",
    opacity: 0.8,
  },
  promotionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  promotionName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 15,
    marginLeft: 10,
  },
  activeBadge: {
    backgroundColor: "#e8f5e9",
  },
  inactiveBadge: {
    backgroundColor: "#eeeeee",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#2e7d32",
  },
  promotionDetails: {
    marginTop: 5,
  },
  discountText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#e53935",
    marginBottom: 5,
  },
  dateText: {
    fontSize: 14,
    color: "#455a64",
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: "#546e7a",
    lineHeight: 20,
    marginTop: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#546e7a",
  },
  noDataContainer: {
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  noDataText: {
    fontSize: 16,
    color: "#7f8c8d",
    textAlign: "center",
  },
});

export default PromotionScreen;