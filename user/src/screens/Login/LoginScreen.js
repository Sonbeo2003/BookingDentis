import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import url from '../../../ipconfig';
import Icon from 'react-native-vector-icons/MaterialIcons';  

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);  

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
      return;
    }
    
    try {
      const response = await fetch(`${url}api_doctor/dangnhap.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `email=${encodeURIComponent(email)}&matkhau=${encodeURIComponent(password)}`,
      });

      const json = await response.json();
      console.log('Phản hồi từ API:', json);

      if (json.success) {
        Alert.alert('Thành công', 'Đăng nhập thành công');

        // Lưu thông tin người dùng
        const userInfo = {
          user_id: json.user.user_id, // Changed from idnguoidung
          full_name: json.user.full_name, // Changed from tennguoidung
          email: json.user.email,
          address: json.user.address, // Changed from diachi
          phone_number: json.user.phone_number, // Changed from sodienthoai
        };
        await AsyncStorage.setItem('user', JSON.stringify(userInfo));

        navigation.navigate('Home');
      } else {
        Alert.alert('Thất bại', json.message || 'Email hoặc mật khẩu không đúng');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi kết nối đến API');
      console.error(error);
    }
  };

  const handleGoogleLogin = () => {
    console.log('Login with Google');
  };

  const handleFacebookLogin = () => {
    console.log('Login with Facebook');
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image 
          source={{ uri: 'https://static.vecteezy.com/system/resources/previews/010/332/073/non_2x/people-equality-color-icon-illustration-vector.jpg' }} 
          style={styles.logo}
        />
        <Text style={styles.title}>VIET SMILE</Text>
      </View>

      {/* Form Input */}
      <View style={styles.inputContainer}>
        {/* Email Input */}
        <View style={styles.inputWithIcon}>
          <Icon name="email" size={24} color="#007AFF" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Password Input */}
        <View style={styles.passwordContainer}>
          <View style={styles.inputWithIcon}>
            <Icon name="lock" size={24} color="#007AFF" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Mật khẩu"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!isPasswordVisible}
            />
          </View>
          {/* Eye Icon */}
          <TouchableOpacity 
            style={styles.eyeIcon} 
            onPress={() => setIsPasswordVisible(!isPasswordVisible)} 
          >
            <Icon name={isPasswordVisible ? 'visibility' : 'visibility-off'} size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Login Button */}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Đăng nhập</Text>
      </TouchableOpacity>

      {/* Sign Up Link */}
      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.signUpText}>Chưa có tài khoản? Đăng ký ngay</Text>
      </TouchableOpacity>

      {/* Social Media Login */}
      <View style={styles.socialContainer}>
        <TouchableOpacity style={styles.socialButton} onPress={handleGoogleLogin}>
          <Image 
            source={{ uri: 'https://cdn4.iconfinder.com/data/icons/logos-brands-7/512/google_logo-google_icongoogle-512.png' }} 
            style={styles.socialIcon}
          />
          <Text style={styles.socialText}>Đăng nhập bằng Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.socialButton} onPress={handleFacebookLogin}>
          <Image 
            source={{ uri: 'https://e7.pngegg.com/pngimages/631/1001/png-clipart-computer-icons-facebook-social-media-email-share-icon-facebook-blue-text-thumbnail.png' }} 
            style={styles.socialIcon}
          />
          <Text style={styles.socialText}>Đăng nhập bằng Facebook</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#007AFF',
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#007AFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 4,
  },
  inputContainer: {
    width: '100%',
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    height: 50,
    borderRadius: 8,
    marginBottom: 15,
  },
  inputIcon: {
    marginLeft: 15,
  },
  input: {
    width: '80%',
    height: '100%',
    paddingLeft: 10,
    fontSize: 16,
  },
  passwordContainer: {
    position: 'relative',
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    top: 12,
  },
  loginButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signUpText: {
    marginTop: 15,
    color: '#007AFF',
    fontSize: 14,
  },
  socialContainer: {
    marginTop: 30,
    width: '100%',
    alignItems: 'center',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFEFEF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    width: '100%',
    justifyContent: 'center',
  },
  socialIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  socialText: {
    fontSize: 16,
    color: '#333',
  },
});

export default LoginScreen;