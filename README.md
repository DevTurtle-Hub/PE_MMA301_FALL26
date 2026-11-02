# PE_MMA301_FALL26 - BOILERPLATE CHUẨN THI PE (45 PHÚT)

Boilerplate hoàn chỉnh cho môn **MMA301** xây dựng với **Expo (SDK 58) + TypeScript + React Navigation + Firebase Auth/Firestore + React Context State Management**.

Khung dự án được thiết kế cố định 100%, chuẩn bị sẵn mọi thành phần để khi đi thi chỉ cần đổi model/chủ đề dữ liệu (Quản lý Sách, Chi tiêu, Khóa học, Task) là hoàn thành bài thi trong vòng 30 - 45 phút.

---

## 🛠️ Công nghệ & Thư viện sử dụng
- **React Native & Expo**: SDK 58.0.22, React Native 0.88.1.
- **Navigation**: `@react-navigation/native` & `@react-navigation/native-stack` + `react-native-screens` + `react-native-safe-area-context`.
- **State Management**: **React Context** (`AuthContext`, `BookContext`).
- **Backend Firebase**: `firebase` 13.x với persistence qua `@react-native-async-storage/async-storage`.
- **Firebase CLI**: `firebase-tools` cài sẵn trong devDependencies để quản lý và deploy `firestore.rules`.
- **Clean Code & Linting**: Tuân thủ chuẩn strict TypeScript và ESLint (`npx expo lint` & `npx tsc --noEmit` pass 100%).

---

## 📁 Cấu trúc thư mục chuẩn bị sẵn

```text
├── .env                          # Chứa config Firebase (được .gitignore bảo vệ)
├── .env.example                  # Mẫu các biến môi trường EXPO_PUBLIC_*
├── firestore.rules               # Quy tắc bảo mật Firestore
├── firebase.json                 # Cấu hình Firestore rules cho Firebase CLI
├── .firebaserc                   # Project id Firebase
├── App.tsx                       # NavigationContainer + SafeAreaProvider + AuthProvider
└── src/
    ├── config/
    │   └── firebaseConfig.ts     # Khởi tạo App, Auth (AsyncStorage persistence), Firestore
    ├── context/
    │   ├── AuthContext.tsx       # login(), register(), logout(), user, onAuthStateChanged
    │   └── BookContext.tsx       # Realtime onSnapshot, addBook, updateBook, deleteBook
    ├── navigation/
    │   ├── types.ts              # ParamList cho Stack Navigator
    │   └── AppNavigator.tsx      # Logic: user == null (Home, Login, Register) | user != null (List, Detail)
    ├── components/
    │   ├── ui/                   # Reusable UI Base Components có sẵn bóng đổ & bo góc:
    │   │   ├── Card.tsx          # Card có shadow iOS & elevation Android
    │   │   ├── Button.tsx        # Button variants (primary, secondary, danger, outline) + loading
    │   │   ├── Input.tsx         # Input hiển thị lỗi theo state `submitted`, đếm ký tự
    │   │   ├── Badge.tsx         # Pill badge hiển thị trạng thái / danh mục
    │   │   └── RatingPicker.tsx  # Bộ chọn sao 0 - 5
    │   └── BookModal.tsx         # Modal thêm mới / sửa theo đúng validation
    └── screens/
        ├── HomeScreen.tsx        # Màn hình chào mừng khách (Home)
        ├── LoginScreen.tsx       # Regex email, đếm ký tự pass, ẩn/hiện lỗi theo `submitted`
        ├── RegisterScreen.tsx    # Regex email, pass min 6, confirm pass, ẩn/hiện lỗi
        ├── ListScreen.tsx        # Danh sách sách, search, filter chips, button "+ Add"
        └── DetailScreen.tsx      # Xem chi tiết, nút Sửa & Xóa có Alert xác nhận
```

---

## 🔒 Quy tắc bảo mật Firestore (`firestore.rules`)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /books/{bookId} {
      allow read, delete: if request.auth != null && resource.data.userId == request.auth.uid;
      
      allow create: if request.auth != null 
        && request.resource.data.userId == request.auth.uid
        && request.resource.data.title is string 
        && request.resource.data.title.trim().size() > 0 
        && request.resource.data.title.size() <= 100
        && request.resource.data.author is string 
        && request.resource.data.author.trim().size() > 0 
        && request.resource.data.author.size() <= 60
        && request.resource.data.genre in ['Fiction', 'Non-Fiction', 'Academic', 'Other']
        && request.resource.data.status in ['To Read', 'Reading', 'Finished']
        && (!('rating' in request.resource.data) || (request.resource.data.rating is int && request.resource.data.rating >= 0 && request.resource.data.rating <= 5))
        && (!('notes' in request.resource.data) || (request.resource.data.notes is string && request.resource.data.notes.size() <= 300));

      allow update: if request.auth != null 
        && resource.data.userId == request.auth.uid
        && request.resource.data.userId == request.auth.uid;
    }
  }
}
```

---

## 🎯 BÍ KÍP ĐI THI: CÁCH ĐỔI ĐỀ BÀI TRONG 10 PHÚT

Khi đề thi yêu cầu chủ đề khác (ví dụ: Quản lý Chi tiêu `expenses` hoặc Quản lý Khóa học `courses`):
1. **Đổi Type trong `src/types/index.ts`**:
   - Đổi tên các trường (`title`, `amount`, `category`, `date`, ...).
2. **Đổi `firestore.rules`**:
   - Đổi `match /books/{bookId}` thành `match /expenses/{expenseId}` và các field tương ứng.
3. **Đổi `BookContext.tsx`**:
   - Đổi collection `'books'` thành tên collection mới.
4. **Form & Màn hình đã chuẩn bị sẵn**:
   - Dùng sẵn `Input`, `Button`, `Card`, `Badge` đã có đầy đủ style và validation, chỉ cần gắn field mới vào là chạy mượt mà!

---

## 🚀 Các lệnh thường dùng

```bash
# Chạy app trên máy ảo hoặc thiết bị thật (Expo Go)
npx expo start

# Kiểm tra cú pháp & type
npx tsc --noEmit

# Kiểm tra linting
npx expo lint

# Deploy firestore rules lên Firebase
npm run deploy:rules
```
