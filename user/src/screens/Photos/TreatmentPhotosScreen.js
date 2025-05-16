import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";

const TreatmentPhotosScreen = ({ navigation }) => {
  // Dữ liệu tĩnh với 10 ảnh mặc định
  const photos = [
    {
      photo_id: "1",
      patient_name: "Nguyen Van A",
      photo_date: "2023-10-15",
      image_url: "https://media.istockphoto.com/id/1205919664/vi/anh/k%E1%BA%BFt-xu%E1%BA%A5t-h%C3%A0m-3d-v%E1%BB%9Bi-r%C4%83ng-n%E1%BB%A9t.jpg?s=612x612&w=0&k=20&c=uQU5L4xSD7L1NH3BcPNt0h50LI6e7UIAnG8xyv9IsqE=",
    },
    {
      photo_id: "2",
      patient_name: "Tran Thi B",
      photo_date: "2023-11-20",
      image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCvUy8kQqEPYiQiv2sz9T16Ij09DA0aQZiphJ6ndXR6QWF5OycTUo2GRPL8EkJI8bhfVI&usqp=CAU",
    },
    {
      photo_id: "3",
      patient_name: "Le Van C",
      photo_date: "2023-09-10",
      image_url: "https://media.istockphoto.com/id/1170308441/vi/anh/m%C3%B4-h%C3%ACnh-nha-khoa-c%E1%BB%A7a-r%C4%83ng-ti%E1%BB%81n-h%C3%A0m-k%E1%BA%BFt-xu%E1%BA%A5t-3d-tr%C3%AAn-backgroun-m%C3%A0u-xanh-%E1%BA%A3nh-minh-h%E1%BB%8Da-3d-nh%C6%B0-m%E1%BB%99t.jpg?s=612x612&w=0&k=20&c=Q3ROvRCW1cFMj-YGyTwQBy1wUWWrxEYu9wu4dcsMWbk=",
    },
    {
      photo_id: "4",
      patient_name: "Pham Thi D",
      photo_date: "2023-12-05",
      image_url: "https://media.istockphoto.com/id/1440070744/vector/cute-baby-kawaii-tooth-3d.jpg?s=612x612&w=0&k=20&c=UzLznu2nWTYUm2hOk9MxHa64UgKieSRDPwzo6TjLlU8=",
    },
    {
      photo_id: "5",
      patient_name: "Hoang Van E",
      photo_date: "2023-08-25",
      image_url: "https://static.vecteezy.com/system/resources/previews/022/958/949/non_2x/3d-realistic-happy-white-tooth-tooth-cartoon-characters-with-thumbs-up-on-bright-background-cleaning-and-whitening-teeth-concept-free-photo.jpg",
    },
    {
      photo_id: "6",
      patient_name: "Nguyen Thi F",
      photo_date: "2023-11-15",
      image_url: "https://cdn2.tuoitre.vn/thumb_w/480/471584752817336320/2024/12/13/hinh-rang-sun-17340887257461030525560.png",
    },
    {
      photo_id: "7",
      patient_name: "Tran Van G",
      photo_date: "2023-10-20",
      image_url: "https://ranghammat.org.vn/Upload/Bai%20dang%20tham%20khao/Phuc%20hinh/nhung-loai-rang-su-tot-nhat-hien-nay-06.jpg",
    },

  ];

  const renderPhotoItem = ({ item }) => (
    <TouchableOpacity
      style={styles.photoItem}
      onPress={() =>
        navigation.navigate("PhotoDetail", {
          patientName: item.patient_name,
          photoDate: item.photo_date,
          imageUrl: item.image_url,
        })
      }
    >
      {item.image_url ? (
        <Image
          style={styles.photoImage}
          source={{ uri: item.image_url }}
          onError={(error) => console.log("Lỗi tải ảnh:", error.nativeEvent)}
        />
      ) : (
        <Text style={styles.noImageText}>Không có ảnh</Text>
      )}
      <View style={styles.photoInfo}>
        <Text style={styles.patientName}>{item.patient_name}</Text>
        <Text style={styles.photoDate}>{item.photo_date}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kho ảnh điều trị</Text>
      <FlatList
        data={photos}
        renderItem={renderPhotoItem}
        keyExtractor={(item) => item.photo_id.toString()}
        numColumns={2} // Hiển thị dạng lưới 2 cột
        columnWrapperStyle={styles.row}
        ListEmptyComponent={<Text style={styles.noDataText}>Không có ảnh điều trị</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6f9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 10,
    paddingHorizontal: 20,
    color: "#2c3e50",
    textAlign: "center",
  },
  photoItem: {
    flex: 1,
    margin: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
    elevation: 3,
    overflow: "hidden",
  },
  photoImage: {
    width: "100%",
    height: 150,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    resizeMode: "cover",
  },
  photoInfo: {
    padding: 10,
  },
  patientName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  photoDate: {
    fontSize: 14,
    color: "#7f8c8d",
    marginTop: 5,
  },
  row: {
    justifyContent: "space-between",
  },
  noDataText: {
    textAlign: "center",
    padding: 20,
    color: "#7f8c8d",
  },
  noImageText: {
    textAlign: "center",
    padding: 20,
    color: "#7f8c8d",
  },
});

export default TreatmentPhotosScreen;