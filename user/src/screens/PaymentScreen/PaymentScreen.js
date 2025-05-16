import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";

const PaymentScreen = ({ route, navigation }) => {
  const { booking } = route.params;
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("cash");
  const [showBankInfo, setShowBankInfo] = useState(false); // Trạng thái hiển thị thông tin tài khoản

  const handleConfirmPayment = () => {
    console.log("Phương thức thanh toán:", selectedPaymentMethod);
    console.log("Thanh toán cho lịch hẹn:", booking);
    alert(
      `Thanh toán thành công bằng ${
        selectedPaymentMethod === "bank" ? "Tài khoản ngân hàng" : "Tiền mặt"
      }!`
    );
    navigation.goBack();
  };
  const sampleBooking = {
    tensukien: "Hội thảo Công nghệ AI 2025",
    tentrungtam: "Trung tâm Hội nghị Quốc gia",
    ngayhen: "20/05/2025",
    thoigianhen: "08:30 - 11:30",
    dichvu: "Thuê phòng hội thảo + Dịch vụ âm thanh ánh sáng",
  };
  

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Thông tin thanh toán</Text>

        {/* Hiển thị thông tin lịch hẹn */}
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Sự kiện:</Text>
          <Text style={styles.value}>{booking.tensukien}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Trung tâm:</Text>
          <Text style={styles.value}>{booking.tentrungtam}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Ngày hẹn:</Text>
          <Text style={styles.value}>{booking.ngayhen}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Thời gian:</Text>
          <Text style={styles.value}>{booking.thoigianhen}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Dịch vụ:</Text>
          <Text style={styles.value}>{booking.dichvu}</Text>
        </View>

        {/* Chọn phương thức thanh toán */}
        <Text style={styles.subtitle}>Phương thức thanh toán</Text>
        <TouchableOpacity
          style={[
            styles.paymentOption,
            selectedPaymentMethod === "cash" && styles.selectedOption,
          ]}
          onPress={() => {
            setSelectedPaymentMethod("cash");
            setShowBankInfo(false); // Ẩn thông tin tài khoản khi chọn tiền mặt
          }}
        >
          <Text style={styles.paymentOptionText}>Thanh toán tiền mặt</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.paymentOption,
            selectedPaymentMethod === "bank" && styles.selectedOption,
          ]}
          onPress={() => {
            setSelectedPaymentMethod("bank");
            setShowBankInfo(true); // Hiển thị thông tin tài khoản khi chọn phương thức ngân hàng
          }}
        >
          <Text style={styles.paymentOptionText}>Tài khoản ngân hàng</Text>
        </TouchableOpacity>

        {/* Hiển thị thông tin tài khoản ngân hàng và mã QR khi chọn "Tài khoản ngân hàng" */}
        {showBankInfo && selectedPaymentMethod === "bank" && (
          <View style={styles.bankInfoContainer}>
            <Text style={styles.bankInfo}>Ngân hàng: MB Bank</Text>
            <Text style={styles.bankInfo}>Chủ tài khoản: Trịnh Công Sơn</Text>
            <Text style={styles.bankInfo}>Số tài khoản: 0101200323333</Text>
            <Image
              style={styles.qrCode}
              source={{
                uri: "https://qrcode-gen.com/images/qrcode-default.png",
              }}
              resizeMode="contain"
            />
          </View>
        )}
      </ScrollView>

      {/* Nút xác nhận thanh toán */}
      <TouchableOpacity
        style={styles.confirmButton}
        onPress={handleConfirmPayment}
      >
        <Text style={styles.confirmButtonText}>Xác nhận thanh toán</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 80, // Thêm khoảng trống phía dưới để không bị che khuất nút
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 20,
    color: "#333",
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  value: {
    fontSize: 16,
    color: "#333",
  },
  paymentOption: {
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
  },
  selectedOption: {
    backgroundColor: "#FFCC33",
    borderColor: "#FF9900",
  },
  paymentOptionText: {
    fontSize: 16,
    color: "#333",
  },
  bankInfoContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
  },
  bankInfo: {
    fontSize: 16,
    color: "#333",
    marginVertical: 5,
  },
  qrCode: {
    width: 150,
    height: 150,
    marginTop: 15,
  },
  confirmButton: {
    position: "absolute",
    bottom: 10,
    left: 10,
    right: 10,
    backgroundColor: "#FF9900",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default PaymentScreen;
