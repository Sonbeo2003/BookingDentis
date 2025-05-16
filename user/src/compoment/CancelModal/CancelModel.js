import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";

const CancelModal = ({
    visible,
    onCancel,
    onSubmit,
  }) => {
    const [reason, setReason] = useState("");
  
    const handleCancel = () => {
      if (typeof onCancel === "function") {
        setReason("");
        onCancel(); // Gọi hàm đóng modal
      } else {
        console.error('onCancel is not a function');
      }
    };
  
    const handleSubmit = () => {
      if (typeof onSubmit === "function") {
        onSubmit(reason); // Gửi lý do hủy
        setReason("");
        onCancel(); // Đóng modal
      } else {
        console.error('onSubmit is not a function');
      }
    };
  
    return (
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={handleCancel}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>Nhập lý do hủy</Text>
            <TextInput
              style={styles.input}
              placeholder="Lý do hủy..."
              value={reason}
              onChangeText={setReason}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.buttonCancel} onPress={handleCancel}>
                <Text style={styles.buttonText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonSubmit} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Xác nhận</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };
  
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  buttonCancel: {
    backgroundColor: "#ff4d4d",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonSubmit: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default CancelModal;
