import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList, // Thêm FlatList vào đây
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const TreatmentDetail = ({ route }) => {
  const { treatment } = route.params;
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState([
    // Dữ liệu đánh giá mẫu
    { id: 1, user: "Nguyen Van A", rating: 4, comment: "Dịch vụ tốt, bác sĩ nhiệt tình!" },
    { id: 2, user: "Tran Thi B", rating: 5, comment: "Rất hài lòng với kết quả!" },
  ]);

  const handleAddComment = () => {
    if (comment.trim()) {
      setReviews([...reviews, { id: reviews.length + 1, user: "Current User", rating: 5, comment }]);
      setComment("");
    }
  };

  const renderReview = ({ item }) => (
    <View style={styles.reviewItem}>
      <Text style={styles.reviewUser}>{item.user}</Text>
      <Text style={styles.reviewRating}>Đánh giá: {item.rating}/5</Text>
      <Text style={styles.reviewComment}>{item.comment}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
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

      {/* Phần đánh giá và bình luận */}
      <Text style={styles.sectionTitle}>Đánh giá và Bình luận</Text>
      <FlatList
        data={reviews}
        renderItem={renderReview}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text style={styles.noReviewText}>Chưa có đánh giá</Text>}
      />

      {/* Form thêm bình luận */}
      <View style={styles.commentSection}>
        <TextInput
          style={styles.commentInput}
          placeholder="Nhập bình luận của bạn..."
          value={comment}
          onChangeText={setComment}
          multiline
        />
        <TouchableOpacity style={styles.submitButton} onPress={handleAddComment}>
          <Icon name="send" size={20} color="#fff" />
          <Text style={styles.submitButtonText}>Gửi</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6f9",
    padding: 20,
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
    marginTop: 20,
  },
  commentInput: {
    height: 80,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    textAlignVertical: "top",
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