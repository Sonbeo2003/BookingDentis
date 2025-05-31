import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from './firebase';

WebBrowser.maybeCompleteAuthSession();

const GoogleLoginScreen = () => {
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: 'YOUR_CLIENT_ID.apps.googleusercontent.com',
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      const credential = GoogleAuthProvider.credential(null, authentication.accessToken);
      signInWithCredential(auth, credential)
        .then((userCredential) => {
          const user = userCredential.user;
          Alert.alert("Đăng nhập thành công", `Chào ${user.displayName}`);
          // 👉 Bạn có thể lưu vào AsyncStorage hoặc chuyển trang tại đây
        })
        .catch((error) => {
          console.error(error);
          Alert.alert("Lỗi", "Không thể đăng nhập");
        });
    }
  }, [response]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng nhập bằng Google</Text>
      <TouchableOpacity style={styles.button} onPress={() => promptAsync()}>
        <Text style={styles.buttonText}>Google Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
    color: '#333',
  },
  button: {
    backgroundColor: '#4285F4',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default GoogleLoginScreen;
