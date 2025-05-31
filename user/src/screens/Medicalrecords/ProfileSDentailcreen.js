import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import url from "../../../ipconfig";

const ProfileSDentailcreen = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await axios.get(`${url}/api_doctor/get_dentailprofile.php`);
        setProfiles(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy hồ sơ khám bệnh:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Hồ sơ khám bệnh</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : profiles.length > 0 ? (
        profiles.map((profile) => (
          <View key={profile.profile_id} style={styles.card}>
            <Text style={styles.label}>ID hồ sơ: <Text style={styles.value}>{profile.profile_id}</Text></Text>
            <Text style={styles.label}>ID người dùng: <Text style={styles.value}>{profile.user_id}</Text></Text>
            <Text style={styles.label}>Vấn đề hiện tại: <Text style={styles.value}>{profile.current_issues}</Text></Text>
            <Text style={styles.label}>Tình trạng chung: <Text style={styles.value}>{profile.general_status}</Text></Text>
            <Text style={styles.label}>Ngày kiểm tra gần nhất: <Text style={styles.value}>{profile.last_checkup_date}</Text></Text>
            <Text style={styles.label}>Ngày điều trị gần nhất: <Text style={styles.value}>{profile.last_treatment_date}</Text></Text>
            <Text style={styles.label}>Ghi chú: <Text style={styles.value}>{profile.note}</Text></Text>
          </View>
        ))
      ) : (
        <Text style={styles.noData}>Không có hồ sơ khám bệnh</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f4f6f9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#2c3e50",
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  label: {
    fontWeight: "600",
    color: "#555",
    marginBottom: 5,
  },
  value: {
    fontWeight: "400",
    color: "#000",
  },
  noData: {
    textAlign: "center",
    marginTop: 30,
    fontSize: 16,
    color: "#888",
  },
});

export default ProfileSDentailcreen;
