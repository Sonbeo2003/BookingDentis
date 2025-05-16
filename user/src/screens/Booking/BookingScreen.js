import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import url from "../../../ipconfig";
import { Picker } from "@react-native-picker/picker";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import moment from "moment";
import "moment/locale/vi";

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
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch clinics
        const clinicResponse = await fetch(`${url}/api_doctor/get_clinic_doctor.php`);
        const clinicData = await clinicResponse.json();
        setClinics(clinicData);

        // Fetch doctors
        const doctorResponse = await fetch(`${url}/api_doctor/get_doctor_admin.php`);
        const doctorData = await doctorResponse.json();
        setDoctors(doctorData);

        // Fetch services
        const serviceResponse = await fetch(`${url}/api_doctor/get_services_admin.php`);
        const serviceData = await serviceResponse.json();
        setServices(serviceData);

        // Fetch promotions
        const promotionResponse = await fetch(`${url}/api_doctor/get_promotion_admin.php`);
        const promotionData = await promotionResponse.json();
        setPromotions(promotionData);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      }
    };

    fetchData();
  }, []);

  const handleServiceToggle = (serviceId) => {
    setSelectedServices((prevSelected) => {
      if (prevSelected.includes(serviceId)) {
        return prevSelected.filter((s) => s !== serviceId);
      } else {
        return [...prevSelected, serviceId];
      }
    });
  };
  
  const onConfirmBooking = async () => {
    if (!selectedClinic || !selectedDoctor || selectedServices.length === 0) {
      Alert.alert("Lỗi", "Vui lòng chọn đầy đủ chi nhánh, nha sĩ và dịch vụ.");
      return;
    }
  
    try {
      setIsLoading(true);
      const userData = await AsyncStorage.getItem("user");
      const parsedUserData = JSON.parse(userData);
  
      const bookingData = {
        user_id: parsedUserData.user_id,
        doctor_id: selectedDoctor,
        clinic_id: selectedClinic,
        appointment_date: selectedDate.toISOString().split("T")[0],
        appointment_time: selectedTime.toTimeString().split(" ")[0],
        services: selectedServices,
        promotion_id: selectedPromotion || null,
        note: note || null,
      };
  
      console.log("Dữ liệu gửi đi:", JSON.stringify(bookingData));
  
      const response = await fetch(`${url}/api_doctor/themlichhen.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });
  
      // Kiểm tra phản hồi trước khi parse JSON
      const responseText = await response.text();
      console.log("Phản hồi từ server:", responseText);
  
      if (!response.ok) {
        throw new Error(`Lỗi HTTP: ${response.status} - ${responseText}`);
      }
  
      const result = JSON.parse(responseText);
      if (result.success) {
        Toast.show({
          type: "success",
          text1: "Thành công",
          text2: "Đặt lịch hẹn thành công!",
        });
        
        // Hiển thị thông tin chi tiết về lịch hẹn nếu có
        if (result.appointment) {
          console.log("Chi tiết lịch hẹn:", result.appointment);
        }
        
        setTimeout(() => {
          navigation.navigate("Home", { screen: "Lịch hẹn" });
        }, 2000);
      } else {
        Toast.show({
          type: "error",
          text1: "Lỗi",
          text2: result.message || "Có lỗi xảy ra khi đặt lịch hẹn.",
        });
      }
    } catch (error) {
      console.error("Lỗi khi đặt lịch hẹn:", error);
      Alert.alert("Lỗi", `Có lỗi xảy ra: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date) => {
    return moment(date).format("dddd, D MMMM YYYY");
  };

  return (
    <ScrollView style={styles.container}>
      {/* Chọn chi nhánh */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Chi nhánh</Text>
        <Picker
          selectedValue={selectedClinic}
          onValueChange={(itemValue) => setSelectedClinic(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Chọn chi nhánh" value={null} />
          {clinics.map((clinic) => (
            <Picker.Item
              key={clinic.clinic_id}
              label={clinic.name}
              value={clinic.clinic_id}
            />
          ))}
        </Picker>
      </View>

      {/* Chọn nha sĩ */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nha sĩ</Text>
        <Picker
          selectedValue={selectedDoctor}
          onValueChange={(itemValue) => setSelectedDoctor(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Chọn nha sĩ" value={null} />
          {doctors.map((doctor) => (
            <Picker.Item
              key={doctor.doctor_id}
              label={doctor.full_name}
              value={doctor.doctor_id}
            />
          ))}
        </Picker>
      </View>

      {/* Chọn dịch vụ */}
      <Text style={styles.label}>Chọn dịch vụ</Text>
      {services.map((service) => (
        <TouchableOpacity
          key={service.service_id}
          style={[
            styles.serviceContainer,
            selectedServices.includes(service.service_id) && styles.serviceSelected
          ]}
          onPress={() => handleServiceToggle(service.service_id)}
        >
          <View style={styles.serviceInfo}>
            <Text style={styles.serviceText}>{service.name}</Text>
            <Text style={styles.serviceDescription}>{service.description}</Text>
            <Text style={styles.servicePrice}>Giá: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(service.price)}</Text>
          </View>
          {selectedServices.includes(service.service_id) && (
            <Icon name="check" size={20} color="#4caf50" />
          )}
        </TouchableOpacity>
      ))}

      {/* Chọn khuyến mãi (không bắt buộc) */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Khuyến mãi (không bắt buộc)</Text>
        <Picker
          selectedValue={selectedPromotion}
          onValueChange={(itemValue) => setSelectedPromotion(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Không chọn khuyến mãi" value={null} />
          {promotions.map((promotion) => (
            <Picker.Item
              key={promotion.promotion_id}
              label={promotion.name}
              value={promotion.promotion_id}
            />
          ))}
        </Picker>
      </View>

      {/* Chọn ngày */}
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
          onChange={(event, date) => {
            setShowDatePicker(false);
            if (date) {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              if (date < today) {
                Alert.alert("Lỗi", "Không thể chọn ngày trước ngày hiện tại.");
              } else {
                setSelectedDate(date);
              }
            }
          }}
        />
      )}

      {/* Chọn giờ */}
      <TouchableOpacity
        onPress={() => setShowTimePicker(true)}
        style={styles.timeButton}
      >
        <Text style={styles.timeButtonText}>
          Chọn giờ:{" "}
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
          onChange={(event, time) => {
            setShowTimePicker(false);
            if (time) {
              setSelectedTime(time);
            }
          }}
        />
      )}

      {/* Ghi chú */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Ghi chú (không bắt buộc)</Text>
        <TextInput
          style={styles.noteInput}
          placeholder="Nhập ghi chú..."
          value={note}
          onChangeText={setNote}
          multiline
        />
      </View>

      {/* Xác nhận đặt lịch */}
      <TouchableOpacity 
        onPress={onConfirmBooking} 
        style={styles.confirmButton}
        disabled={isLoading}
      >
        <Text style={styles.confirmButtonText}>
          {isLoading ? "Đang xử lý..." : "Xác nhận đặt lịch"}
        </Text>
      </TouchableOpacity>

      <Toast position="bottom" bottomOffset={40} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f4f7fc",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#555",
    marginBottom: 8,
  },
  picker: {
    height: 45,
    width: "100%",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "#fff",
    paddingHorizontal: 8,
  },
  serviceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  serviceSelected: {
    borderColor: "#4caf50",
    backgroundColor: "#e8f5e9",
  },
  serviceInfo: {
    flex: 1,
  },
  serviceText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  serviceDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
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
  dateButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  timeButton: {
    padding: 12,
    backgroundColor: "#007bff",
    borderRadius: 8,
    marginBottom: 20,
    alignItems: "center",
  },
  timeButtonText: {
    color: "#fff",
    fontSize: 16,
  },
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
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default BookingScreen;