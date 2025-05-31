// BookingScreenWithImages.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
  Image,
  Modal,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import url from "../../../ipconfig";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import moment from "moment";
import "moment/locale/vi";

const BASE_IMAGE_URL = "http://192.168.1.6/api_doctor/";

const BookingScreen = () => {
  const [clinics, setClinics] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [services, setServices] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [note, setNote] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalItem, setModalItem] = useState(null);
  const [modalType, setModalType] = useState("");
  const navigation = useNavigation();

  const totalPrice = selectedServices.reduce((sum, id) => {
  const svc = services.find(s => s.service_id === id);
  return sum + (svc?.price || 0);
}, 0);

// Nếu có khuyến mãi, áp dụng tiếp...
const discount = selectedPromotion
  ? promotions.find(p => p.promotion_id === selectedPromotion)
      .discount_percent / 100 * totalPrice
  : 0;

const finalPrice = totalPrice - discount;
const deposit = finalPrice / 2;

const fetchDoctorsByClinic = async (clinicId) => {
  try {
    const response = await fetch(`${url}/api_doctor/get_doctor_by_clinic.php?clinic_id=${clinicId}`);
    const json = await response.json();

    if (json.success) {
      const updatedDoctors = json.doctors.map((d) => ({
        ...d,
        image: d.profile_picture ? `${BASE_IMAGE_URL}${d.profile_picture}` : null,
      }));
      setDoctors(updatedDoctors);

      if (updatedDoctors.length === 0) {
        Alert.alert("Thông báo", "Cơ sở này hiện tại chưa có bác sĩ làm việc.");
      }
    } else {
      setDoctors([]);
      Alert.alert("Lỗi", "Không thể lấy danh sách bác sĩ.");
    }
  } catch (error) {
    console.error("Lỗi khi lấy bác sĩ theo chi nhánh:", error);
    Alert.alert("Lỗi", "Không thể kết nối đến máy chủ.");
  }
};


  useEffect(() => {
    const fetchData = async () => {
      try {
        const clinicRes = await fetch(
          `${url}/api_doctor/get_clinic_doctor.php`
        );
        const clinicData = await clinicRes.json();
        const updatedClinics = clinicData.map((c) => ({
          ...c,
          image: c.picture ? `${BASE_IMAGE_URL}${c.picture}` : null,
        }));
        setClinics(updatedClinics);

        

        const serviceRes = await fetch(
          `${url}/api_doctor/get_services_admin.php`
        );
        const serviceData = await serviceRes.json();
        const updatedServices = serviceData.map((s) => ({
          ...s,
          image: s.image ? `${BASE_IMAGE_URL}${s.image}` : null,
        }));
        setServices(updatedServices);

        const promoRes = await fetch(
          `${url}/api_doctor/get_promotion_admin.php`
        );
        setPromotions(await promoRes.json());
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };
    fetchData();
  }, []);

  const handleServiceToggle = (id) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const openDetailModal = (item, type) => {
    setModalItem(item);
    setModalType(type);
    setModalVisible(true);
  };

  const selectFromModal = () => {
   if (modalType === "clinic") {
  const newClinicId = modalItem.clinic_id;
  const isSelected = selectedClinic === newClinicId;

  if (isSelected) {
    // Hủy chọn
    setSelectedClinic(null);
    setDoctors([]);
  } else {
    // Chọn mới
    setSelectedClinic(newClinicId);
    fetchDoctorsByClinic(newClinicId); // ✅ gọi API sau khi nhấn “Chọn”
  }

  setModalVisible(false);
  return;
}
    if (modalType === "doctor") {
      setSelectedDoctor((prev) =>
        prev === modalItem.doctor_id ? null : modalItem.doctor_id
      );
    }
    if (modalType === "promotion") {
      setSelectedPromotion((prev) =>
        prev === modalItem.promotion_id ? null : modalItem.promotion_id
      );
    }
    setModalVisible(false);
  };

  const formatDate = (date) => moment(date).format("dddd, D MMMM YYYY");

  const handleDateChange = (event, date) => {
    setShowDatePicker(false);
    if (date) {
      const today = new Date();
      if (date.setHours(0, 0, 0, 0) < today.setHours(0, 0, 0, 0)) {
        Alert.alert("Lỗi", "Không thể chọn ngày trong quá khứ.");
        return;
      }
      setSelectedDate(date);
    }
  };

  const handleTimeChange = (event, time) => {
    setShowTimePicker(false);
    if (time) {
      const hour = time.getHours();
      if (hour < 8 || hour >= 20) {
        Alert.alert("Lỗi", "Chỉ được chọn giờ từ 08:00 đến 12:00.");
        return;
      }
      setSelectedTime(time);
    }
  };

  const onConfirmBooking = async () => {
    if (!selectedClinic || !selectedDoctor || selectedServices.length === 0) {
      Alert.alert("Lỗi", "Vui lòng chọn đầy đủ chi nhánh, nha sĩ và dịch vụ.");
      return;
    }

    try {
      setIsLoading(true);
      const userData = await AsyncStorage.getItem("user");
      const { user_id } = JSON.parse(userData);
      const data = {
        user_id,
        doctor_id: selectedDoctor,
        clinic_id: selectedClinic,
        appointment_date: selectedDate.toISOString().split("T")[0],
        appointment_time: selectedTime.toTimeString().split(" ")[0],
        services: selectedServices,
        promotion_id: selectedPromotion || null,
        note: note || null,
        deposit_amount: deposit,
      };

      const res = await fetch(`${url}/api_doctor/themlichhen.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const text = await res.text();
      console.log("RESPONSE TEXT:", text); // Log ra để kiểm tra nếu là HTML error
      let result;
      try {
        result = JSON.parse(text);
      } catch (error) {
        Alert.alert("Lỗi phản hồi từ server", text);
        return;
      }

      if (result.success) {
  Toast.show({ type: "success", text1: "Đặt lịch thành công" });

  const bookingData = {
    ...result.appointment, // Dữ liệu trả từ PHP: appointment_id, date, time...
    deposit_amount: deposit,
    final_price: finalPrice,
    services: services.map(id => {
      const svc = services.find(s => s.service_id === id);
      return svc?.name || `Dịch vụ #${id}`;
    }).join(", "),
    doctor_name: doctors.find(d => d.doctor_id === selectedDoctor)?.full_name || "",
    clinic_name: clinics.find(c => c.clinic_id === selectedClinic)?.name || "",
    isDepositOnly: true
  };

  navigation.navigate("PaymentScreen", {
    booking: bookingData,
    onPaymentSuccess: () => navigation.navigate("Home", { screen: "Lịch hẹn" })
  });
} else {
        Toast.show({ type: "error", text1: "Lỗi", text2: result.message });
      }
    } catch (error) {
      Alert.alert("Lỗi", `Đặt lịch thất bại: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Chi nhánh</Text>
      <View style={styles.selectList}>
        {clinics.map((clinic) => (
          <TouchableOpacity
            key={clinic.clinic_id}
            style={[
              styles.circleItem,
              selectedClinic === clinic.clinic_id && styles.selectedItem,
            ]}
            onPress={() => openDetailModal(clinic, "clinic")}
          >
            <Image source={{ uri: clinic.image }} style={styles.circleImage} />
            {selectedClinic === clinic.clinic_id && (
              <Icon
                name="check-circle"
                size={20}
                color="#28a745"
                style={styles.checkIcon}
              />
            )}
            <Text style={styles.circleText}>{clinic.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Nha sĩ</Text>
      <View style={styles.selectList}>
        {doctors.map((doctor) => (
          <TouchableOpacity
            key={doctor.doctor_id}
            style={[
              styles.circleItem,
              selectedDoctor === doctor.doctor_id && styles.selectedItem,
            ]}
            onPress={() => openDetailModal(doctor, "doctor")}
          >
            <Image source={{ uri: doctor.image }} style={styles.circleImage} />
            {selectedDoctor === doctor.doctor_id && (
              <Icon
                name="check-circle"
                size={20}
                color="#28a745"
                style={styles.checkIcon}
              />
            )}
            <Text style={styles.circleText}>{doctor.full_name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Dịch vụ</Text>
      {services.map((service) => (
        <TouchableOpacity
          key={service.service_id}
          style={[
            styles.serviceContainer,
            selectedServices.includes(service.service_id) &&
              styles.serviceSelected,
          ]}
          onPress={() => handleServiceToggle(service.service_id)}
        >
          <Image source={{ uri: service.image }} style={styles.circleImage} />
          <View style={[styles.serviceInfo, { marginLeft: 10 }]}>
            <Text style={styles.serviceText}>{service.name}</Text>
            <Text style={styles.serviceDescription}>{service.description}</Text>
            <Text style={styles.serviceDuration}>
              Thời gian: {service.duration_minutes} phút
            </Text>
            <Text style={styles.servicePrice}>
              Giá:{" "}
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(service.price)}
            </Text>
          </View>
          {selectedServices.includes(service.service_id) && (
            <Icon name="check" size={20} color="#4caf50" />
          )}
        </TouchableOpacity>
      ))}

      <Text style={styles.label}>Khuyến mãi (không bắt buộc)</Text>
      <View style={styles.selectList}>
        {promotions.map((promo) => (
          <TouchableOpacity
            key={promo.promotion_id}
            style={[
              styles.circleItem,
              selectedPromotion === promo.promotion_id && styles.selectedItem,
            ]}
            onPress={() => openDetailModal(promo, "promotion")}
          >
            <Icon name="gift" size={40} color="#ff9800" />
            {selectedPromotion === promo.promotion_id && (
              <Icon
                name="check-circle"
                size={20}
                color="#28a745"
                style={styles.checkIcon}
              />
            )}
            <Text style={styles.circleText}>{promo.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        style={styles.dateButton}
      >
        <Text style={styles.dateButtonText}>
          Chọn ngày: {formatDate(selectedDate)}
        </Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      <TouchableOpacity
        onPress={() => setShowTimePicker(true)}
        style={styles.timeButton}
      >
        <Text style={styles.timeButtonText}>
          {selectedTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </TouchableOpacity>
      {showTimePicker && (
        <DateTimePicker
          value={selectedTime}
          mode="time"
          display="default"
          onChange={handleTimeChange}
        />
      )}

      <Text style={styles.label}>Ghi chú (không bắt buộc)</Text>
      <TextInput
        style={styles.noteInput}
        placeholder="Nhập ghi chú..."
        multiline
        value={note}
        onChangeText={setNote}
      />

      <View style={{ padding: 16, backgroundColor: "#fff", marginBottom: 20 }}>
  <Text>Tổng tiền: {new Intl.NumberFormat("vi-VN", { style: 'currency', currency: 'VND' }).format(finalPrice)}</Text>
  <Text>Đặt cọc (50%): {new Intl.NumberFormat("vi-VN", { style: 'currency', currency: 'VND' }).format(deposit)}</Text>
</View>



      <TouchableOpacity
        style={styles.confirmButton}
        onPress={onConfirmBooking}
        disabled={isLoading}
      >
        <Text style={styles.confirmButtonText}>
          {isLoading ? "Đang xử lý..." : "Xác nhận đặt lịch"}
        </Text>
      </TouchableOpacity>

      {/* Modal xem chi tiết */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {modalItem && (
              <>
                {(modalType === "clinic" || modalType === "doctor") &&
                  modalItem.image && (
                    <Image
                      source={{ uri: modalItem.image }}
                      style={styles.modalImage}
                    />
                  )}
                <Text style={styles.modalTitle}>
                  {modalItem.name || modalItem.full_name}
                </Text>
                {modalType === "clinic" && (
                  <View style={styles.modalInfoBox}>
                    <Text style={styles.modalLabel}>Địa chỉ:</Text>
                    <Text style={styles.modalText}>{modalItem.address}</Text>
                    <Text style={styles.modalLabel}>Giờ mở cửa:</Text>
                    <Text style={styles.modalText}>
                      {modalItem.opening_hours}
                    </Text>
                    <Text style={styles.modalLabel}>Trạng thái:</Text>
                    <Text style={styles.modalText}>{modalItem.status}</Text>
                  </View>
                )}
                {modalType === "doctor" && (
                  <View style={styles.modalInfoBox}>
                    <Text style={styles.modalLabel}>Chuyên môn:</Text>
                    <Text style={styles.modalText}>{modalItem.specialty}</Text>
                    <Text style={styles.modalLabel}>Lịch làm việc:</Text>
                    <Text style={styles.modalText}>
                      {modalItem.working_schedule}
                    </Text>
                    <Text style={styles.modalLabel}>Trạng thái:</Text>
                    <Text style={styles.modalText}>{modalItem.status}</Text>
                    <Text style={styles.modalLabel}>Mô tả:</Text>
                    <Text style={styles.modalText}>
                      {modalItem.description}
                    </Text>
                  </View>
                )}
                {modalType === "promotion" && (
                  <View style={styles.modalInfoBox}>
                    <Text style={styles.modalLabel}>Mô tả:</Text>
                    <Text style={styles.modalText}>
                      {modalItem.description}
                    </Text>
                    <Text style={styles.modalLabel}>Giảm:</Text>
                    <Text style={styles.modalText}>
                      {modalItem.discount_percent}% hoặc{" "}
                      {modalItem.discount_amount} VND
                    </Text>
                    <Text style={styles.modalLabel}>Ngày bắt đầu:</Text>
                    <Text style={styles.modalText}>{modalItem.start_date}</Text>
                    <Text style={styles.modalLabel}>Ngày kết thúc:</Text>
                    <Text style={styles.modalText}>{modalItem.end_date}</Text>
                    <Text style={styles.modalLabel}>Trạng thái:</Text>
                    <Text style={styles.modalText}>{modalItem.status}</Text>
                  </View>
                )}
                <TouchableOpacity
                  style={[
                    styles.modalButton,
                    (modalType === "clinic" &&
                      selectedClinic === modalItem.clinic_id) ||
                    (modalType === "doctor" &&
                      selectedDoctor === modalItem.doctor_id) ||
                    (modalType === "promotion" &&
                      selectedPromotion === modalItem.promotion_id)
                      ? styles.cancelButton
                      : null,
                  ]}
                  onPress={selectFromModal}
                >
                  <Text style={styles.modalButtonText}>
                    {(modalType === "clinic" &&
                      selectedClinic === modalItem.clinic_id) ||
                    (modalType === "doctor" &&
                      selectedDoctor === modalItem.doctor_id) ||
                    (modalType === "promotion" &&
                      selectedPromotion === modalItem.promotion_id)
                      ? "Hủy chọn"
                      : "Chọn"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalCancel}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.modalCancelText}>Đóng</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      <Toast position="bottom" bottomOffset={40} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f4f7fc" },
  label: { fontSize: 16, fontWeight: "bold", color: "#555", marginBottom: 8 },
  avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: "#eee" },
  circleImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: "#ccc",
  },
  circleItem: { alignItems: "center", marginRight: 15, marginBottom: 15 },
  checkIcon: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  circleText: { marginTop: 6, fontSize: 14, maxWidth: 80, textAlign: "center" },
  selectedItem: { borderColor: "#007bff" },
  selectList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 20,
  },
  serviceContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
    padding: 10,
    marginBottom: 10,
  },

  serviceDuration: {
    color: "#03a9f4",
    fontStyle: "italic",
    fontSize: 13,
    marginTop: 2,
    marginBottom: 2,
  },
  serviceSelected: { borderColor: "#4caf50", backgroundColor: "#e8f5e9" },
  serviceInfo: { flex: 1 },
  serviceText: { fontSize: 16, fontWeight: "bold", color: "#333" },
  serviceDescription: { fontSize: 14, color: "#666", marginTop: 4 },
  servicePrice: {
    fontSize: 14,
    color: "#e91e63",
    marginTop: 4,
    fontWeight: "bold",
  },
  dateButton: {
    padding: 12,
    backgroundColor: "#007bff",
    borderRadius: 8,
    marginBottom: 20,
    alignItems: "center",
  },
  dateButtonText: { color: "#fff", fontSize: 16 },
  timeButton: {
    padding: 12,
    backgroundColor: "#007bff",
    borderRadius: 8,
    marginBottom: 20,
    alignItems: "center",
  },
  timeButtonText: { color: "#fff", fontSize: 16 },
  noteInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fff",
    minHeight: 80,
    textAlignVertical: "top",
  },
  confirmButton: {
    paddingVertical: 12,
    backgroundColor: "#28a745",
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  confirmButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    width: "80%",
  },
  modalImage: { width: 120, height: 120, borderRadius: 60, marginBottom: 15 },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  modalButton: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 10,
  },
  modalButtonText: { color: "#fff", fontWeight: "bold" },
  modalCancel: { paddingVertical: 8 },
  modalCancelText: { color: "#999" },

  modalInfoBox: {
    marginTop: 10,
    marginBottom: 10,
    width: "100%",
  },
  modalLabel: {
    fontWeight: "bold",
    marginTop: 6,
    color: "#444",
  },
  modalText: {
    color: "#333",
    marginBottom: 4,
  },
});

export default BookingScreen;
