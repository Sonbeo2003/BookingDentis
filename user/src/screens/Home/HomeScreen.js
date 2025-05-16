import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from "react-native";
import axios from "axios";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import url from "../../../ipconfig";

// Keep the original image imports
import imgService1 from "../../../assets/anh1.jpg";
import imgService2 from "../../../assets/anh2.jpg";
import imgService3 from "../../../assets/anh3.jpg";
import imgService4 from "../../../assets/12822749.png";

const { width } = Dimensions.get("window");

const HomeScreen = ({ navigation }) => {
  // Keep all the original state management
  const [dichvu, setDichvu] = useState([]);
  const [centers, setCenters] = useState([]);
  const [events, setEvents] = useState([]);
  const [filteredDichvu, setFilteredDichvu] = useState([]);
  const [user, setUser] = useState("");
  const [currentMonth, setCurrentMonth] = useState("10/2022"); // For calendar display
  const [activeSlide, setActiveSlide] = useState(0);
  const scrollViewRef = useRef();

  // Banner images for the slider
  const bannerImages = [
    "https://watermark.lovepik.com/photo/20220319/large/lovepik-image-of-female-doctor-holding-tooth-model-in-picture_502369313.jpg",
    "https://img.freepik.com/premium-photo/close-up-beautiful-young-woman-with-white-teeth-looking-camera_1301-7978.jpg",
    "https://img.freepik.com/premium-photo/beautiful-african-american-woman-with-bright-smile_1301-4251.jpg",
    "https://img.freepik.com/premium-photo/beautiful-girl-white-shirt-with-braces-teeth-blue-background_185193-8267.jpg",
    "https://img.freepik.com/premium-photo/dentist-patient-dental-clinic_85574-3069.jpg",
    "https://img.freepik.com/premium-photo/dentist-explaining-dental-procedure-female-patient-showing-tooth-model_249974-14570.jpg"
  ];

  // Keep the original image mapping
  const serviceImages = {
    events1: imgService1,
    events2: imgService2,
    events3: imgService3,
    events4: imgService4
  };

  // Auto sliding for banner
  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollViewRef.current) {
        const nextSlide = (activeSlide + 1) % bannerImages.length;
        scrollViewRef.current.scrollTo({
          x: nextSlide * width,
          y: 0,
          animated: true,
        });
        setActiveSlide(nextSlide);
      }
    }, 1500); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, [activeSlide]);

  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / width);
    if (currentIndex !== activeSlide) {
      setActiveSlide(currentIndex);
    }
  };

  // Keep all the original useEffect hooks
  // useEffect(() => {
  //   axios
  //     .get(`${url}api_doctor/sukien.php`)
  //     .then((response) => {
  //       setEvents(response.data);
  //     })
  //     .catch((error) => {
  //       console.error("Lỗi khi lấy danh sách sự kiện:", error);
  //     });
  // }, []);

  // useEffect(() => {
  //   axios
  //     .get(`${url}api_doctor/dichvu.php`)
  //     .then((response) => {
  //       setDichvu(response.data);
  //       setFilteredDichvu(response.data);
  //     })
  //     .catch((error) => {
  //       console.error("Lỗi khi lấy danh sách dịch vụ:", error);
  //     });
  // }, []);

  // useEffect(() => {
  //   axios
  //     .get(`${url}api_doctor/trungtam.php`)
  //     .then((response) => {
  //       setCenters(response.data);
  //     })
  //     .catch((error) => {
  //       console.error("Lỗi khi lấy danh sách trung tâm:", error);
  //     });
  // }, []);

  useEffect(() => {
    const getUser = async () => {
      try {
        const userString = await AsyncStorage.getItem("user");
        if (userString) {
          const userObject = JSON.parse(userString);
          console.log("Fetched user object:", userObject);
          setUser(userObject.full_name || "Fail"); // Use default name if not available
        } else {
          // If no user is found, set a default name for development purposes
          setUser("Fail");
        }
      } catch (error) {
        console.error("Lỗi khi lấy tên người dùng:", error);
        // Set default name in case of error
        setUser("Fail");
      }
    };
    getUser();
  }, []);

  // Main menu items for the grid
  const menuItems = [
    { id: 1, name: "Đặt Lịch", icon: "calendar-outline", navigate: "Booking" },
    { id: 2, name: "Nha sĩ", icon: "medkit-outline", navigate: "DoctorScreen" },
    { id: 3, name: "Lịch sử điều trị", icon: "time-outline", navigate: "TreatmentHistoryScreen" },
    { id: 4, name: "Hệ thống chi nhánh", icon: "globe-outline", navigate: "CenterDetails" },
    { id: 5, name: "Danh mục dịch vụ", icon: "list-outline", navigate: "ServiceDetails" },
    { id: 6, name: "Ảnh điều trị", icon: "images-outline", navigate: "TreatmentPhotosScreen" },
    { id: 7, name: "Khuyến mãi",icon: "images-outline", navigate: "PromotionScreen" },
    { id: 8, name: "Hồ sơ khám bệnh",icon: "medkit-outline", navigate: "PromotionScreen" },
  ];

  // Week days for calendar
  const weekdays = ["CN", "Th 2", "Th 3", "Th 4", "Th 5", "Th 6", "Th 7"];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.welcomeText}>
              Xin chào {user}
            </Text>
            <Text style={styles.subHeaderText}>
              Hôm nay bạn không có lịch hẹn
            </Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity onPress={() => navigation.navigate("Notifications")}>
              <Ionicons name="notifications-outline" size={24} color="#333" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Banner with auto-sliding */}
        <View style={styles.bannerContainer}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
            {bannerImages.map((image, index) => (
              <Image
                key={index}
                style={styles.bannerImage}
                source={{ uri: image }}
                resizeMode="cover"
              />
            ))}
          </ScrollView>
          <View style={styles.bannerDots}>
            {bannerImages.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  index === activeSlide ? styles.activeDot : null
                ]}
              />
            ))}
          </View>
        </View>

        {/* Main Menu Grid */}
        <View style={styles.menuGrid}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={() => navigation.navigate(item.navigate)}
            >
              <View style={styles.menuIconContainer}>
                <Ionicons name={item.icon} size={28} color="#333" />
              </View>
              <Text style={styles.menuText}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Calendar Section */}
        <View style={styles.calendarSection}>
          <View style={styles.calendarHeader}>
            <TouchableOpacity>
              <Ionicons name="chevron-back" size={24} color="#3498db" />
            </TouchableOpacity>
            <Text style={styles.calendarTitle}>{currentMonth}</Text>
            <TouchableOpacity>
              <Ionicons name="chevron-forward" size={24} color="#3498db" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.calendarWeekdays}>
            {weekdays.map((day, index) => (
              <Text key={index} style={styles.weekdayText}>{day}</Text>
            ))}
          </View>
          
          {/* Calendar days - Simple example */}
          <View style={styles.calendarDays}>
            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
              <TouchableOpacity 
                key={day} 
                style={[
                  styles.calendarDay,
                  day === 1 && { marginLeft: '14.28%' }  // Offset for first day (starts on Monday)
                ]}
              >
                <Text style={day === 10 ? styles.activeDay : styles.dayText}>
                  {day}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation (commented out as per your latest code) */}
      {/* <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Home")}>
          <Ionicons name="home" size={24} color="#8bc34a" />
          <Text style={styles.activeNavText}>Trang chủ</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Services")}>
          <Ionicons name="medical" size={24} color="#999" />
          <Text style={styles.navText}>Dịch vụ</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navBooking}>
          <View style={styles.bookingCircle}>
            <Ionicons name="calendar-outline" size={28} color="#fff" />
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Products")}>
          <Ionicons name="basket" size={24} color="#999" />
          <Text style={styles.navText}>Sản phẩm</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Profile")}>
          <Ionicons name="person" size={24} color="#999" />
          <Text style={styles.navText}>Cá nhân</Text>
        </TouchableOpacity>
      </View> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  headerLeft: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  subHeaderText: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  bannerContainer: {
    position: "relative",
    marginBottom: 16,
    height: 180,
  },
  bannerImage: {
    width: width,
    height: 180,
  },
  bannerDots: {
    flexDirection: "row",
    justifyContent: "center",
    position: "absolute",
    bottom: 10,
    width: "100%",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ddd",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#ff7c00",
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  menuGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  menuItem: {
    width: "33.33%",
    alignItems: "center",
    padding: 16,
  },
  menuIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#f2f2f2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  menuText: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
  },
  calendarSection: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  calendarTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  calendarWeekdays: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 8,
  },
  weekdayText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    width: 40,
  },
  calendarPlaceholder: {
    height: 220,
    justifyContent: "center",
    alignItems: "center",
  },
  calendarDays: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  calendarDay: {
    width: "14.28%",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  dayText: {
    fontSize: 14,
    color: "#333",
  },
  activeDay: {
    fontSize: 14,
    color: "#fff",
    backgroundColor: "#3498db",
    width: 28,
    height: 28,
    borderRadius: 14,
    textAlign: "center",
    textAlignVertical: "center",
    lineHeight: 28,
    overflow: "hidden",
  },
  bottomNav: {
    flexDirection: "row",
    height: 60,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  navItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  navBooking: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bookingCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#3366ff",
    justifyContent: "center",
    alignItems: "center",
    marginTop: -20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  navText: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
  activeNavText: {
    fontSize: 12,
    color: "#8bc34a",
    fontWeight: "500",
    marginTop: 2,
  },
});

export default HomeScreen;