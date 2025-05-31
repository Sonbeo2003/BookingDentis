import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import url from "../../../ipconfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
const TreatmentDetail = ({ route }) => {
  const { treatment, user_id, appointment_id, doctor_id } = route.params;

  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState([]);

  const getUserId = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");
      console.log("Raw user data from AsyncStorage:", userData);

      if (!userData) {
        console.error("Không tìm thấy dữ liệu người dùng trong AsyncStorage");
        return null;
      }

      try {
        const parsedUser = JSON.parse(userData);
        console.log("Parsed user data:", parsedUser);

        if (parsedUser && parsedUser.user_id) {
          console.log("User ID retrieved:", parsedUser.user_id);
          return parsedUser.user_id;
        } else {
          console.error("Không tìm thấy user_id trong dữ liệu người dùng");
          return null;
        }
      } catch (parseError) {
        console.error("Lỗi khi phân tích dữ liệu JSON:", parseError);
        return null;
      }
    } catch (error) {
      console.error("Lỗi khi truy cập AsyncStorage:", error);
      return null;
    }
  };

  const handleAddComment = async () => {
    if (comment.trim() === "" || rating === 0) return;

    try {
      const actualUserId = await getUserId(); // Đổi tên để tránh đè lên biến từ route.params
      if (!actualUserId) {
        alert("Không tìm thấy thông tin người dùng.");
        return;
      }
      console.log("Đang gọi API đến:", `${url}/api_doctor/review_app.php`);
      const resp = await fetch(`${url}/api_doctor/review_app.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appointment_id,
          user_id,
          doctor_id,
          rating,
          comment,
        }),
      });

      if (!resp.ok) {
        const errorText = await resp.text();
        console.error("Server lỗi:", errorText);
        alert(errorText);
        return;
      }

      // in ra code status để debug
      console.log("HTTP status:", resp.status);
      const data = await resp.json();
      console.log("Response body:", data);

      if (data.success) {
        setReviews((prev) => [
          ...prev,
          { id: prev.length + 1, user: "Bạn", rating, comment },
        ]);
        setComment("");
        setRating(0);
        alert("Đánh giá thành công!");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Error sending review:", err);
      alert("Lỗi khi gửi đánh giá.");
    }
  };

  const renderReview = ({ item }) => (
    <View style={styles.reviewItem}>
      <Text style={styles.reviewUser}>{item.user}</Text>
      <Text style={styles.reviewRating}>
        Đánh giá: {item.rating}/5{" "}
        {[...Array(5)].map((_, i) => (
          <Icon
            key={i}
            name={i < item.rating ? "star" : "star-o"}
            size={16}
            color="#fbbf24"
          />
        ))}
      </Text>
      <Text style={styles.reviewComment}>{item.comment}</Text>
    </View>
  );

  const renderHeader = () => (
    <View>
      <Text style={styles.title}>Chi tiết điều trị</Text>
      <Text style={styles.detailText}>Ngày: {treatment.treatment_date}</Text>
      <Text style={styles.detailText}>
        Bác sĩ: {treatment.full_name || "Không rõ"}
      </Text>
      <Text style={styles.detailText}>
        Dịch vụ: {treatment.name || "Không rõ"}
      </Text>
      <Text style={styles.detailText}>
        Mô tả: {treatment.description || "Không có"}
      </Text>
      <Text style={styles.detailText}>
        Tình trạng răng miệng: {treatment.oral_health_status || "Không có"}
      </Text>
      <View style={styles.imageContainer}>
        {treatment.before_image && (
          <Image
            style={styles.detailImage}
            source={{ uri: treatment.before_image }}
          />
        )}
        {treatment.after_image && (
          <Image
            style={styles.detailImage}
            source={{ uri: treatment.after_image }}
          />
        )}
      </View>
    </View>
  );

  const renderFooter = () => (
    <View style={styles.commentSection}>
      <Text style={{ fontWeight: "bold", marginBottom: 8 }}>
        Đánh giá của bạn:
      </Text>
      <View style={{ flexDirection: "row", marginBottom: 10 }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => setRating(star)}>
            <Icon
              name={star <= rating ? "star" : "star-o"}
              size={30}
              color="#fbbf24"
            />
          </TouchableOpacity>
        ))}
      </View>
      <TextInput
        style={styles.commentInput}
        placeholder="Nhập bình luận của bạn..."
        value={comment}
        onChangeText={setComment}
        multiline
        textAlignVertical="top" // để con trỏ ở trên cùng
        autoCorrect={false}
      />
      <TouchableOpacity style={styles.submitButton} onPress={handleAddComment}>
        <Icon name="send" size={20} color="#fff" />
        <Text style={styles.submitButtonText}>Gửi</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    // KeyboardAvoidingView giúp tránh view bị đẩy lên quá cao khi show keyboard
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.select({ ios: 0, android: 20 })}
    >
      <FlatList
        data={reviews}
        renderItem={renderReview}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled" // cho phép tap trong list mà không dismiss keyboard
        keyboardDismissMode="on-drag"
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f4f6f9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#2c3e50",
  },
  detailText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
  },
  imageContainer: {
    flexDirection: "row",
    marginVertical: 10,
  },
  detailImage: {
    width: 150,
    height: 150,
    borderRadius: 5,
    marginRight: 10,
    resizeMode: "cover",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    color: "#2c3e50",
  },
  reviewItem: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    elevation: 1,
  },
  reviewUser: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  reviewRating: {
    fontSize: 14,
    color: "#333",
    marginVertical: 5,
  },
  reviewComment: {
    fontSize: 14,
    color: "#555",
  },
  noReviewText: {
    textAlign: "center",
    color: "#7f8c8d",
    marginVertical: 10,
  },
  commentSection: {
    marginTop: 120,
  },
  commentInput: {
    height: 100, // cho nó cao hơn để dễ chạm
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#28a745",
    padding: 10,
    borderRadius: 5,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 5,
  },
});

export default TreatmentDetail;
