import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';  // Thêm import cho LottieView
import SplashScreen from 'react-native-splash-screen';

const Splash = ({ navigation }) => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    // Ẩn splash screen sau 3 giây và chuyển đến trang login
    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 30);

    // Dấu chấm loading
    const dotTimer = setInterval(() => {
      setDots(prev => (prev.length === 3 ? '' : prev + '.'));
    }, 500);

    return () => {
      clearTimeout(timer);
      clearInterval(dotTimer);
    };
  }, []);

  return (
    <View style={styles.container}>
      {/* Sử dụng LottieView để thay thế hình ảnh */}
      {/* <LottieView
        source={require('D:/bookingevents/BookingEvents/Booking/assets/Animationpet.json')}
        autoPlay
        loop
        style={styles.animation}  
      /> */}
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading{dots}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  animation: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  loadingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default Splash;
