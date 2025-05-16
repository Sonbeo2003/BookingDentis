import React from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const BookingModal = ({
  showModal,
  selectedCenter,
  selectedDate,
  selectedTime,
  selectedServices,
  services,
  pets,
  selectedPet,
  onConfirmBooking,
  onCancelBooking,
}) => {
  return (
    <Modal visible={showModal} animationType="slide" transparent={true} onRequestClose={onCancelBooking}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Thông tin đặt lịch</Text>
          
          {/* Trung tâm */}
          <Text style={styles.modalText}>Trung tâm: {selectedCenter?.tentrungtam}</Text>
          
          {/* Ngày tháng */}
          <Text style={styles.modalText}>Ngày: {selectedDate.toLocaleDateString()}</Text>
          
          {/* Giờ */}
          <Text style={styles.modalText}>Giờ: {selectedTime.toLocaleTimeString()}</Text>
          
          {/* Dịch vụ */}
          <Text style={styles.modalText}>
            Dịch vụ:{" "}
            {services
              .filter((service) => selectedServices.includes(service.iddichvu))
              .map((service) => service.tendichvu)
              .join(", ")}
          </Text>
          
          {/* Thú cưng */}
          <Text style={styles.modalText}>
            Thú cưng: {pets.find((pet) => pet.idthucung === selectedPet)?.tenthucung}
          </Text>

          {/* Tổng tiền */}
          <Text style={styles.modalText}>
            Tổng tiền dịch vụ:{" "}
            {services
              .filter((service) => selectedServices.includes(service.iddichvu))
              .reduce((total, service) => total + service.gia, 0)
              .toLocaleString("vi-VN")}{" "}
            VND
          </Text>

          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.modalButton} onPress={onConfirmBooking}>
              <Text style={styles.modalButtonText}>Xác nhận</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={onCancelBooking}>
              <Text style={[styles.modalButtonText, styles.cancelButtonText]}>Hủy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",  // Màu nền mờ đen giúp nổi bật modal
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,  // Bo góc đẹp hơn
    width: "85%",  // Rộng hơn một chút để cảm giác thoải mái hơn
    shadowColor: "#000",  // Thêm shadow để modal có cảm giác nổi bật
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  modalTitle: {
    fontSize: 22,  // Tăng kích thước chữ cho tiêu đề
    fontWeight: "bold",
    color: "#2c3e50",  // Màu tối cho tiêu đề
    marginBottom: 15,
    textAlign: "center",
  },
  modalText: {
    fontSize: 16,
    color: "#34495e",  // Màu chữ tối, dễ đọc
    marginBottom: 10,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalButton: {
    backgroundColor: "#27ae60",  // Màu xanh lá cây tươi sáng cho nút xác nhận
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,  // Bo góc nhẹ cho nút
    width: "48%",  // Đảm bảo cả 2 nút có độ rộng cân đối
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#e74c3c",  // Màu đỏ cho nút hủy
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",  
  },
  cancelButtonText: {
    color: "#fff",  
  },
});

export default BookingModal;
