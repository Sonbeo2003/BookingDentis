import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import axios from "axios";
import Icon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import url from "../../../ipconfig";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import CancelModel from "../../compoment/CancelModal/CancelModel";
import PaymentScreen from "../../screens/PaymentScreen/PaymentScreen";
import { useFocusEffect } from '@react-navigation/native';

const Tab = createMaterialTopTabNavigator();

const BookingListScreen = ({ navigation }) => {
  const [userId, setUserId] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reloadPaidKey, setReloadPaidKey] = useState(0);

  // Improved user ID retrieval function
  const getUserId = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");
      console.log("Raw user data from AsyncStorage:", userData);

      if (!userData) {
        console.error("Không tìm thấy dữ liệu người dùng trong AsyncStorage");
        return null;
      }

      try {
        const parsedUser = JSON.parse(userData);
        console.log("Parsed user data:", parsedUser);

        if (parsedUser && parsedUser.user_id) {
          console.log("User ID retrieved:", parsedUser.user_id);
          return parsedUser.user_id;
        } else {
          console.error("Không tìm thấy user_id trong dữ liệu người dùng");
          return null;
        }
      } catch (parseError) {
        console.error("Lỗi khi phân tích dữ liệu JSON:", parseError);
        return null;
      }
    } catch (error) {
      console.error("Lỗi khi truy cập AsyncStorage:", error);
      return null;
    }
  };

  // Initialize the component
  useEffect(() => {
    const initialize = async () => {
      setIsLoading(true);
      console.log("Component được mount, kiểm tra user...");

      try {
        // Kiểm tra trạng thái đăng nhập
        const userData = await AsyncStorage.getItem("user");

        if (!userData) {
          console.warn(
            "Không tìm thấy dữ liệu người dùng, chuyển hướng đến trang đăng nhập"
          );
          Alert.alert("Thông báo", "Bạn cần đăng nhập để xem lịch hẹn", [
            {
              text: "Đăng nhập",
              onPress: () => navigation.navigate("Login"),
            },
          ]);
          setIsLoading(false);
          return;
        }

        // Nếu có dữ liệu, tiến hành lấy userId
        const id = await getUserId();
        if (id) {
          setUserId(id);
        } else {
          Alert.alert(
            "Lỗi",
            "Không thể lấy thông tin người dùng. Vui lòng đăng nhập lại.",
            [
              {
                text: "Đăng nhập",
                onPress: () => navigation.navigate("Login"),
              },
            ]
          );
        }
      } catch (error) {
        console.error("Lỗi khi kiểm tra trạng thái đăng nhập:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, [navigation]);

  // Improved pending bookings fetching function
  const fetchPendingBookings = async (user_id) => {
    if (!user_id) {
      console.error("fetchPendingBookings: Missing user_id parameter");
      return [];
    }

    try {
      console.log(`Fetching pending bookings for user: ${user_id}`);
      const endpoint = `${url}/api_doctor/Trangthai/get_pending_bookings.php?user_id=${user_id}`;
      console.log(`Endpoint URL: ${endpoint}`);

      const response = await axios.get(endpoint);

      // Log the raw response for debugging
      console.log("Raw API response:", JSON.stringify(response.data));

      // Handle null, undefined, or error responses appropriately
      if (!response.data || response.data.error) {
        console.warn("API returned error or null data:", response.data);
        return [];
      }

      // Ensure we always return an array
      const bookings = Array.isArray(response.data) ? response.data : [];
      console.log(`Retrieved ${bookings.length} pending bookings`);

      return bookings;
    } catch (error) {
      console.error("Error fetching pending bookings:", error);

      // More detailed error logging
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received:", error.request);
      } else {
        // Something happened in setting up the request
        console.error("Request setup error:", error.message);
      }

      Alert.alert(
        "Lỗi kết nối",
        "Không thể tải lịch hẹn chờ xác nhận. Vui lòng kiểm tra kết nối mạng và thử lại.",
        [{ text: "Đóng", style: "cancel" }]
      );

      return [];
    }
  };

  const fetchInProgressBookings = async (user_id) => {
    try {
      const response = await axios.get(
        `${url}/api_doctor/Trangthai/get_inprogress_bookings.php?user_id=${user_id}`
      );
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy lịch hẹn đang thực hiện:", error);
      Alert.alert(
        "Lỗi",
        "Không thể tải lịch hẹn đang thực hiện. Vui lòng thử lại."
      );
      return [];
    }
  };

  const fetchCompletedBookings = async (user_id) => {
    try {
      const response = await axios.get(
        `${url}/api_doctor/Trangthai/get_completed_bookings.php?user_id=${user_id}`
      );
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy lịch hẹn hoàn thành:", error);
      Alert.alert(
        "Lỗi",
        "Không thể tải lịch hẹn hoàn thành. Vui lòng thử lại."
      );
      return [];
    }
  };

  const fetchPaidBookings = async (user_id) => {
    try {
      const response = await axios.get(
        `${url}/api_doctor/Trangthai/get_paid_bookings.php?user_id=${user_id}`
      );
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy lịch hẹn đã thanh toán:", error);
      Alert.alert(
        "Lỗi",
        "Không thể tải lịch hẹn đã thanh toán. Vui lòng thử lại."
      );
      return [];
    }
  };

  const fetchCancelledBookings = async (user_id) => {
    try {
      const response = await axios.get(
        `${url}/api_doctor/Trangthai/get_cancelled_bookings.php?user_id=${user_id}`
      );
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy lịch hẹn đã hủy:", error);
      Alert.alert("Lỗi", "Không thể tải lịch hẹn đã hủy. Vui lòng thử lại.");
      return [];
    }
  };

  const fetchPaymentBookings = async (user_id) => {
  try {
    const response = await axios.get(
      `${url}/api_doctor/get_payment.php?user_id=${user_id}`
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy lịch hẹn đã thanh toán:", error);
    Alert.alert(
      "Lỗi",
      "Không thể tải lịch hẹn đã thanh toán. Vui lòng thử lại."
    );
    return [];
  }
};

  const handleCancel = async (reason) => {
    if (!reason) {
      Alert.alert("Thông báo", "Vui lòng nhập lý do hủy.");
      return;
    }

    try {
      const response = await axios.post(
        `${url}/api_doctor/cancel_booking.php`,
        {
          appointment_id: selectedBookingId,
          user_id: userId,
          cancel_reason: reason,
        }
      );

      if (response.data.success) {
        Alert.alert("Thông báo", "Hủy lịch hẹn thành công!");
      } else {
        Alert.alert(
          "Thông báo",
          response.data.message || "Có lỗi khi hủy lịch hẹn."
        );
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
      Alert.alert("Thông báo", "Có lỗi xảy ra. Vui lòng thử lại.");
    }

    setShowCancelModal(false);
    setSelectedBookingId(null);
  };

  const closeCancelModal = () => {
    setShowCancelModal(false);
    setSelectedBookingId(null);
  };

  const submitCancelReason = (reason) => {
    handleCancel(reason);
  };

  const openCancelModal = (bookingId) => {
    setSelectedBookingId(bookingId);
    setShowCancelModal(true);
  };

  const openPaymentModal = (booking) => {
  navigation.navigate("PaymentScreen", {
    booking,
    onPaymentSuccess: () => setReloadPaidKey(prev => prev + 1),
  });
};

  // Format currency function
  const formatCurrency = (amount) => {
    if (!amount) return "0 đ";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    })
      .format(amount)
      .replace(/\s/g, "");
  };

  // Status mapping based on the database schema
  const statuses = {
    0: "Chờ xác nhận",
    1: "Đang thực hiện",
    2: "Hoàn thành",
    3: "Đã thanh toán",
    4: "Đã hủy",
  };

  // Improved BookingTab component
  const BookingTab = ({
    fetchBookings,
    showCancelButton,
    showPaymentButton,
    showDepositPaymentButton,
    reloadKey,
    
  }) => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

useFocusEffect(
  React.useCallback(() => {
    const fetchData = async () => {
      if (!userId) {
        console.log("userId chưa sẵn sàng, đợi trước khi tải dữ liệu");
        return;
      }

      try {
        setLoading(true);
        console.log("Đang tải dữ liệu lịch hẹn với user_id:", userId);
        const data = await fetchBookings(userId);
        console.log("Dữ liệu lịch hẹn nhận được:", data);
        setBookings(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu lịch hẹn:", error);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, fetchBookings, reloadKey])
);

    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }

    return (
      <View style={styles.tabContainer}>
        {bookings && bookings.length > 0 ? (
          <FlatList
            data={bookings}
            renderItem={({ item }) => (
              <View style={styles.bookingCard}>
                {/* Các thông tin hiện có */}
                <View style={styles.bookingInfo}>
                  <Icon name="info-circle" size={20} color="#fff" />
                  <Text style={styles.text}>
                    Tên dịch vụ: {item.services || "Cuộc hẹn y tế"}
                  </Text>
                </View>
                <View style={styles.bookingInfo}>
                  <Icon name="map-marker" size={20} color="#fff" />
                  <Text style={styles.text}>
                    Địa điểm: {item.clinic_name || item.name || "Chưa xác định"}
                  </Text>
                </View>
                <View style={styles.bookingInfo}>
                  <Icon name="user-md" size={20} color="#fff" />
                  <Text style={styles.text}>
                    Bác sĩ:{" "}
                    {item.doctor_name || item.full_name || "Chưa xác định"}
                  </Text>
                </View>
                <View style={styles.bookingInfo}>
                  <Icon name="calendar" size={20} color="#fff" />
                  <Text style={styles.text}>
                    Ngày hẹn: {item.appointment_date || "Chưa xác định"}
                  </Text>
                </View>
                <View style={styles.bookingInfo}>
                  <Icon name="clock-o" size={20} color="#fff" />
                  <Text style={styles.text}>
                    Thời gian: {item.appointment_time || "Chưa xác định"}
                  </Text>
                </View>
                <View style={styles.bookingInfo}>
                  <Icon name="info-circle" size={20} color="#fff" />
                  <Text style={styles.text}>
                    Trạng thái: {statuses[item.status] || "Chưa xác định"}
                  </Text>
                </View>
                {item.note && (
                  <View style={styles.bookingInfo}>
                    <Icon name="sticky-note" size={20} color="#fff" />
                    <Text style={styles.text}>Ghi chú: {item.note}</Text>
                  </View>
                )}

                {/* Thêm phần hiển thị giảm giá và khuyến mãi tại đây */}
                {item.total_price && (
                  <View style={styles.bookingInfo}>
                    <Icon name="money" size={20} color="#fff" />
                    <Text style={styles.text}>
                      Tổng tiền: {formatCurrency(item.total_price)}
                    </Text>
                  </View>
                )}

                {item.promotion_code && (
                  <View style={styles.bookingInfo}>
                    <Icon name="tag" size={20} color="#fff" />
                    <Text style={styles.text}>
                      Khuyến mãi:{" "}
                      {item.promotion_code !== "Không áp dụng"
                        ? item.promotion_name || item.promotion_code
                        : "Không áp dụng"}
                    </Text>
                  </View>
                )}

                {item.discount_value &&
                  item.discount_value !== "0%" &&
                  item.discount_value !== "0 đ" && (
                    <View style={styles.bookingInfo}>
                      <Icon name="minus-circle" size={20} color="#fff" />
                      <Text style={styles.text}>
                        Giảm giá: {item.discount_value}
                      </Text>
                    </View>
                  )}

                  {item.deposit_amount && (
  <View style={styles.bookingInfo}>
    <Icon name="money" size={20} color="#fff" />
    <Text style={styles.text}>
      Đặt cọc: {formatCurrency(item.deposit_amount)}
    </Text>
  </View>
)}

                {item.final_price && (
                  <View style={styles.bookingInfo}>
                    <Icon name="money" size={20} color="#fff" />
                    <Text style={[styles.text, styles.finalPriceText]}>
                      Thanh toán: {formatCurrency(item.final_price)}
                    </Text>
                  </View>
                )}

                {/* Các nút chức năng như hủy hoặc thanh toán */}
                {showCancelButton && (
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => openCancelModal(item.appointment_id)}
                  >
                    <Text style={styles.cancelButtonText}>Hủy lịch hẹn</Text>
                  </TouchableOpacity>
                )}
                {showPaymentButton && (
                  <TouchableOpacity
                    style={styles.paymentButton}
                    onPress={() => openPaymentModal(item)}
                  >
                    <Text style={styles.paymentButtonText}>Thanh toán</Text>
                  </TouchableOpacity>
                )}

                {showDepositPaymentButton && item.deposit_amount > 0 && (
  <TouchableOpacity
    style={styles.paymentButton}
    onPress={() => {
      navigation.navigate("PaymentScreen", {
        booking: { ...item, isDepositOnly: true },
        onPaymentSuccess: () => setReloadPaidKey(prev => prev + 1),
      });
    }}
  >
    <Text style={styles.paymentButtonText}>Thanh toán đặt cọc</Text>
  </TouchableOpacity>
)}
              </View>
            )}
           keyExtractor={(item, index) =>
  item.payment_id
    ? `payment-${item.payment_id}`
    : `${item.appointment_id}-${index}`
}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.noBookingsContainer}>
            <Icon name="exclamation-circle" size={50} color="#FFCC33" />
            <Text style={styles.noBookingsText}>Không có lịch hẹn nào.</Text>
          </View>
        )}
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  // If userId is null after loading, show login prompt
  if (!userId) {
    return (
      <View style={styles.noBookingsContainer}>
        <Icon name="user-circle" size={50} color="#FFCC33" />
        <Text style={styles.noBookingsText}>
          Bạn cần đăng nhập để xem lịch hẹn.
        </Text>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.loginButtonText}>Đăng nhập</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Tab.Navigator
        screenOptions={{
          tabBarLabelStyle: { fontSize: 12, color: "#333" },
          tabBarIndicatorStyle: { backgroundColor: "#333" },
          tabBarScrollEnabled: true,
          tabBarItemStyle: { width: 120 },
          tabBarShowIcon: true,
          tabBarStyle: { backgroundColor: "#e0f7fa" },
        }}
      >
        <Tab.Screen
          name="Chờ xác nhận"
          children={() => (
            <BookingTab
              fetchBookings={fetchPendingBookings}
              showCancelButton={true}
              showPaymentButton={false}
              reloadKey={reloadPaidKey} // ✅ thêm dòng này
            />
          )}
          options={{
            tabBarLabel: "Chờ xác nhận",
            tabBarIcon: ({ color }) => (
              <Icon name="hourglass-start" size={20} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Đang thực hiện"
          children={() => (
            <BookingTab
              fetchBookings={fetchInProgressBookings}
              showCancelButton={false}
              showPaymentButton={false}
              reloadKey={reloadPaidKey} // ✅ thêm dòng này
            />
          )}
          options={{
            tabBarLabel: "Đang thực hiện",
            tabBarIcon: ({ color }) => (
              <Icon name="spinner" size={20} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Hoàn thành"
          children={() => (
            <BookingTab
              fetchBookings={fetchCompletedBookings}
              showCancelButton={false}
              showPaymentButton={true}
              reloadKey={reloadPaidKey} // ✅ thêm dòng này
              showDepositPaymentButton={true} // ✅ Thêm dòng này
            />
          )}
          options={{
            tabBarLabel: "Hoàn thành",
            tabBarIcon: ({ color }) => (
              <Icon name="trophy" size={20} color={color} />
            ),
          }}
        />
        <Tab.Screen
  name="Đã thanh toán"
  children={() => (
    <BookingTab
      fetchBookings={fetchPaymentBookings}
      showCancelButton={false}
      showPaymentButton={false}
      reloadKey={reloadPaidKey} // ✅ thêm dòng này
    />
  )}
  options={{
    tabBarLabel: "Đã thanh toán",
    tabBarIcon: ({ color }) => (
      <Icon name="check-circle" size={20} color={color} />
    ),
  }}
/>
        <Tab.Screen
          name="Đã hủy"
          children={() => (
            <BookingTab
              fetchBookings={fetchCancelledBookings}
              showCancelButton={false}
              showPaymentButton={false}
              reloadKey={reloadPaidKey} // ✅ thêm dòng này
            />
          )}
          options={{
            tabBarLabel: "Đã hủy",
            tabBarIcon: ({ color }) => (
              <Icon name="times-circle" size={20} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
      <CancelModel
        visible={showCancelModal}
        onCancel={closeCancelModal}
        onSubmit={submitCancelReason}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#333",
  },
  bookingCard: {
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    backgroundColor: "#ffd740",
    margin: 10,
  },
  bookingInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  text: {
    fontSize: 16,
    marginLeft: 10,
    color: "#333",
  },
  finalPriceText: {
    fontWeight: "bold",
  },
  noBookingsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  noBookingsText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
    color: "#333",
  },
  tabContainer: {
    flex: 1,
  },
  cancelButton: {
    marginTop: 10,
    backgroundColor: "#ff4d4d",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  paymentButton: {
    marginTop: 10,
    backgroundColor: "#4CAF50",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  paymentButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  loginButton: {
    marginTop: 20,
    backgroundColor: "#3498db",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default BookingListScreen;
