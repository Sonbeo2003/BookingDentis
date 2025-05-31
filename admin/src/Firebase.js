import { initializeApp, getApps } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyC6Y3GWOUlKM413p-vFgQF86gSlW3R-cIw",
  authDomain: "doctorbooking-1494e.firebaseapp.com",
  databaseURL: "https://doctorbooking-1494e-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "doctorbooking-1494e",
  storageBucket: "doctorbooking-1494e.appspot.com",
  messagingSenderId: "533492899457",
  appId: "1:533492899457:web:a8558175b975f985933780",
  measurementId: "G-DGXZZ31S3V"
};

// ✅ Không tạo lại app nếu đã tồn tại
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getDatabase(app);

export { db };
