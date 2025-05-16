import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Sử dụng icon từ Expo

const SupportScreen = () => {
  const [emailInput, setEmailInput] = useState('');
  const [message, setMessage] = useState('');

//   const sendEmail = () => {
//     // Cấu hình email
//     Mailer.mail({
//       subject: 'Hỗ trợ từ ứng dụng',
//       recipients: ['support@yourdomain.com'],
//       body: `Email: ${emailInput}\n\nMessage: ${message}`,
//       isHTML: false,
//     }, (error, event) => {
//       if (error) {
//         Alert.alert('Lỗi', 'Không thể mở ứng dụng email.');
//       } else if (event === 'sent') {
//         Alert.alert('Thành công', 'Email đã được gửi thành công.');
//       }
//     });
//   };

  return (
    <View style={styles.container}>
      {/* Logo hoặc Hình ảnh */}
      <Image 
        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/780/780575.png' }} 
        style={styles.logo}
      />
      <Text style={styles.title}>Hỗ Trợ Khách Hàng</Text>
      
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Nhập email của bạn"
          value={emailInput}
          onChangeText={setEmailInput}
        />
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Nhập thông điệp của bạn"
          value={message}
          onChangeText={setMessage}
          multiline
        />
        <Button title="Gửi Email" color="#FF6347" />
      </View>
      
      {/* Icon Hỗ Trợ */}
      <View style={styles.iconContainer}>
        <Ionicons name="help-outline" size={50} color="#FF6347" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',  
    padding: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FF6347',  // Màu chủ đạo cho ứng dụng Booking PetCare
    marginBottom: 20,
  },
  form: {
    width: '100%',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  input: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  iconContainer: {
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SupportScreen;
