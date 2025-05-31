import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  Linking,
} from "react-native";
import url from "../../../ipconfig";

const PaymentScreen = ({ route, navigation }) => {
  const { booking, onPaymentSuccess } = route.params;
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("cash");
  const [showBankInfo, setShowBankInfo] = useState(false);
  const [payDepositOnly, setPayDepositOnly] = useState(!!booking.isDepositOnly); // nếu từ màn booking truyền vào là đặt cọc thì mặc định true

  const handleConfirmPayment = async () => {
    console.log("Phương thức thanh toán:", selectedPaymentMethod);
    console.log("Thanh toán cho lịch hẹn:", booking);

    if (selectedPaymentMethod === "bank") {
      try {
        const amount = payDepositOnly
          ? booking.deposit_amount
          : booking.final_price || 10000;
        const response = await fetch(
          `${url}/api_doctor/vnpay_php/thanhtoan_vnpay.php`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: `amount=${amount}&order_desc=Thanh toan hoa don&language=vn&appointment_id=${booking.appointment_id}&payment_method=${selectedPaymentMethod}&is_deposit_only=${payDepositOnly}`,
          }
        );

        const data = await response.json();
        if (data.payment_url) {
          Linking.openURL(data.payment_url);
          if (onPaymentSuccess) onPaymentSuccess();
          navigation.goBack();
        } else {
          Alert.alert("Không tạo được link thanh toán");
        }
      } catch (error) {
        Alert.alert("Lỗi gọi API thanh toán", error.message);
      }
    } else {
      Alert.alert("Thanh toán tiền mặt!", "Bạn sẽ thanh toán tại quầy.");
      if (onPaymentSuccess) onPaymentSuccess();
      navigation.goBack();
    }
  };

  const statuses = {
    0: "Chờ xác nhận",
    1: "Đang thực hiện",
    2: "Hoàn thành",
    3: "Đã thanh toán",
    4: "Đã hủy",
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Thông tin thanh toán</Text>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Tên dịch vụ:</Text>
          <Text style={styles.value}>
  {Array.isArray(booking.services)
    ? booking.services.map(s => (typeof s === 'string' ? s : s.name)).join(", ")
    : booking.services}
</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Địa điểm:</Text>
          <Text style={styles.value}>{booking.clinic_name}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Bác sĩ:</Text>
          <Text style={styles.value}>{booking.doctor_name}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Ngày hẹn:</Text>
          <Text style={styles.value}>{booking.appointment_date}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Thời gian:</Text>
          <Text style={styles.value}>{booking.appointment_time}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Trạng thái:</Text>
          <Text style={styles.value}>{statuses[booking.status]}</Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Số tiền đặt cọc:</Text>
          <Text
            style={[styles.value, { color: "#d32f2f", fontWeight: "bold" }]}
          >
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(
              payDepositOnly ? booking.deposit_amount : booking.final_price || 0
            )}
          </Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Số tiền cần thanh toán:</Text>
          <Text style={[styles.value, { color: "#d32f2f", fontWeight: "bold" }]}>
  {new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(
    payDepositOnly
      ? booking.deposit_amount
      : booking.final_price
  )}
</Text>
        </View>

        <Text style={styles.subtitle}>Chọn loại thanh toán</Text>
        <View style={styles.infoContainer}>
          <TouchableOpacity
            style={[
              styles.paymentOption,
              payDepositOnly && styles.selectedOption,
              { flex: 1, marginRight: 5 },
            ]}
            onPress={() => setPayDepositOnly(true)}
          >
            <Text style={styles.paymentOptionText}>Đặt cọc</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.paymentOption,
              !payDepositOnly && styles.selectedOption,
              { flex: 1, marginLeft: 5 },
            ]}
            onPress={() => setPayDepositOnly(false)}
          >
            <Text style={styles.paymentOptionText}>Toàn bộ</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.subtitle}>Phương thức thanh toán</Text>
        <TouchableOpacity
          style={[
            styles.paymentOption,
            selectedPaymentMethod === "cash" && styles.selectedOption,
          ]}
          onPress={() => {
            setSelectedPaymentMethod("cash");
            setShowBankInfo(false);
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
            setShowBankInfo(true);
          }}
        >
          <Text style={styles.paymentOptionText}>Tài khoản ngân hàng</Text>
        </TouchableOpacity>
      </ScrollView>

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
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContainer: { padding: 20, paddingBottom: 80 },
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
  label: { fontSize: 16, fontWeight: "bold", color: "#333" },
  value: { fontSize: 16, color: "#333" },
  paymentOption: {
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
  },
  selectedOption: { backgroundColor: "#FFCC33", borderColor: "#FF9900" },
  paymentOptionText: { fontSize: 16, color: "#333" },
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
  confirmButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});

export default PaymentScreen;
