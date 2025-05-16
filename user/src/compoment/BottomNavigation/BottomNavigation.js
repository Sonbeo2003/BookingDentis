import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import Splash from "../../screens/Login/Splash";
import HomeScreen from "../../screens/Home/HomeScreen";
import BookingScreen from "../../screens/Booking/BookingScreen";
import LoginScreen from "../../screens/Login/LoginScreen";
import SignUpScreen from "../../screens/Login/SignUpScreen";
import CenterDetails from "../../screens/Center/CenterDetails";
import ProfileScreen from "../../screens/Profile/ProfileScreen";
import SearchScreen from "../../screens/Search/SearchScreen";
import BookingListScreen from "../../screens/Booking/BookingListScreen";
import TreatmentPhotosScreen from "../../screens/Photos/TreatmentPhotosScreen";
import TreatmentHistoryScreen from "../../screens/History/TreatmentHistoryScreen";
import TreatmentDetail from "../../screens/History/TreatmentDetail";
import DoctorScreen from "../../screens/Doctor/DoctorScreen";
import PromotionScreen from "../../screens/Voucher/PromotionScreen";

// import PetDetail from "../../screens/Pet/PetDetail";
import ServiceDetails from "../../screens/Service/ServiceDetails";
import ChangePasswordScreen from "../../screens/ChangePassword/ChangePasswordScreen";
import SupportScreen from "../../screens/Support/SupportScreen";
import PaymentScreen from "../../screens/PaymentScreen/PaymentScreen";
import PersonalInfoScreen from "../../screens/Profile/PersonalInfoScreen";


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Trang chủ") {
            iconName = "home-outline";
          } else if (route.name === "Tìm kiếm") {
            iconName = "search-outline";
          } else if (route.name === "Lịch hẹn") {
            iconName = "calendar-outline";
          } else if (route.name === "Cá nhân") {
            iconName = "person-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FFCC33', // Màu khi tab được chọn (active)
        // tabBarInactiveTintColor: '#AAAAAA',
      })}
    >
      <Tab.Screen
        name="Trang chủ"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Tìm kiếm"
        component={SearchScreen}
        options={{ title: "Tìm kiếm " }}
      />
      <Tab.Screen
        name="Lịch hẹn"
        component={BookingListScreen}
        options={{
          title: "Quản lý lịch hẹn ",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "bold",

          },
        }}
      />
      <Tab.Screen
        name="Cá nhân"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
};

const Rootnavi = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen
          name="Splash"
          component={Splash}
          options={{ title: "Splash", headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: "Login", headerShown: false }}
        />
        <Stack.Screen
          name="DoctorScreen"
          component={DoctorScreen}
          options={{ title: "Nha sĩ", headerShown: false }}
        />
        <Stack.Screen
          name="TreatmentHistoryScreen"
          component={TreatmentHistoryScreen}
          options={{ title: "Lịch sử khám bệnh", headerShown: false }}
        />
        <Stack.Screen
          name="TreatmentDetail"
          component={TreatmentDetail}
          options={{ title: "Chi tiết lịch sử khám bệnh", headerShown: false }}
        />
        <Stack.Screen
          name="TreatmentPhotosScreen"
          component={TreatmentPhotosScreen}
          options={{ title: "Photo", headerShown: false }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUpScreen}
          options={{ title: "Signup", headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={BottomTabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CenterDetails"
          component={CenterDetails}
          options={{ title: "Chi tiết chi nhánh" }}
        />
        <Stack.Screen
          name="Booking"
          component={BookingScreen}
          options={{ title: "Đặt lịch dịch vụ" }}
        />
        {/* <Stack.Screen
          name="PetScreen"
          component={PetScreen}
          options={{ title: "Quản lý thú cưng" }}
        /> */}
        {/* <Stack.Screen
          name="PetDetail"
          component={PetDetail}
          options={{ title: "PetDetail" }}
        /> */}
        <Stack.Screen
          name="ServiceDetails"
          component={ServiceDetails}
          options={{ title: "Chi tiết dịch vụ" }}
        />
        <Stack.Screen
          name="ChangePasswordScreen"
          component={ChangePasswordScreen}
          options={{ title: "Đổi mật khẩu" }}
        />
        <Stack.Screen
          name="PromotionScreen"
          component={PromotionScreen}
          options={{ title: "Khuyến mãi" }}
        />
        <Stack.Screen
          name="SupportScreen"
          component={SupportScreen}
          options={{ title: "Hỗ trợ khách hàng" }}
        />
        <Stack.Screen
          name="PaymentScreen"
          component={PaymentScreen}
          options={{ title: "Thanh toán" }}
        />
        <Stack.Screen
          name="PersonalInfoScreen"
          component={PersonalInfoScreen}
          options={{ title: "Thông tin cá nhân" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Rootnavi;
