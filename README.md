# PE_MMA301_FALL26

Ứng dụng React Native xây dựng với **Expo** (SDK 58) và **TypeScript**, quản lý state bằng **React Context**, kết nối backend **Google Firebase** (Authentication & Cloud Firestore).

---

## 🛠️ Công nghệ & Thư viện sử dụng
- **React Native & Expo**: Quản lý vòng đời ứng dụng, hỗ trợ iOS/Android/Web.
- **TypeScript**: Định kiểu chặt chẽ cho Data Models & Props.
- **React Context**: 
  - `AuthContext`: Quản lý trạng thái xác thực (đăng nhập, đăng ký, đăng xuất, theo dõi auth state).
  - `BookContext`: Quản lý danh sách sách, realtime sync qua Firestore onSnapshot, CRUD.
- **Google Firebase**:
  - `firebase/auth`: Xác thực email/password với AsyncStorage persistence.
  - `firebase/firestore`: Cơ sở dữ liệu NoSQL đám mây.
- **Firebase CLI (`firebase-tools`)**: Hỗ trợ quản lý và deploy `firestore.rules`.

---

## 📁 Cấu trúc thư mục

```text
├── .env                  # Chứa Firebase config thực tế (được gitignore bảo vệ)
├── .env.example          # File mẫu các biến môi trường
├── firestore.rules       # Quy tắc bảo mật Firestore (bắt buộc)
├── firebase.json         # Cấu hình Firebase CLI
├── .firebaserc           # Định danh project Firebase
├── App.tsx               # Component gốc tích hợp Auth & Book Providers
└── src/
    ├── config/
    │   └── firebase.ts   # Khởi tạo Firebase App, Auth & Firestore
    ├── context/
    │   ├── AuthContext.tsx  # React Context cho Auth
    │   └── BookContext.tsx  # React Context cho Book CRUD
    ├── types/
    │   ├── index.ts      # Type definitions (Book, Genre, Status, ...)
    │   └── firebase.d.ts # Module declaration hỗ trợ React Native
    └── components/
        ├── AuthScreen.tsx      # Giao diện Đăng nhập / Đăng ký
        ├── BookListScreen.tsx  # Giao diện Danh sách sách & thao tác
        └── BookModal.tsx       # Modal thêm mới / chỉnh sửa sách
```

---

## 🔒 Quy tắc Firestore (`firestore.rules`)
File `firestore.rules` tuân thủ các điều kiện:
1. Người dùng phải đăng nhập (`request.auth != null`).
2. Chỉ đọc, sửa, xóa dữ liệu thuộc về chính mình (`resource.data.userId == request.auth.uid`).
3. Dữ liệu tạo mới (`create`):
   - `title`: Chuỗi không rỗng, tối đa 100 ký tự.
   - `author`: Chuỗi không rỗng, tối đa 60 ký tự.
   - `genre`: Thuộc một trong `['Fiction', 'Non-Fiction', 'Academic', 'Other']`.
   - `status`: Thuộc một trong `['To Read', 'Reading', 'Finished']`.
   - `rating` (tùy chọn): Số nguyên từ 0 đến 5.
   - `notes` (tùy chọn): Chuỗi tối đa 300 ký tự.

---

## 🚀 Hướng dẫn cài đặt & Chạy ứng dụng

1. **Cài đặt thư viện:**
   ```bash
   npm install
   ```

2. **Cấu hình biến môi trường:**
   Tạo file `.env` dựa trên `.env.example`:
   ```bash
   cp .env.example .env
   ```
   (Điền các giá trị `EXPO_PUBLIC_FIREBASE_*` tương ứng)

3. **Chạy ứng dụng:**
   ```bash
   npx expo start
   ```

4. **Deploy Firestore Rules với Firebase CLI:**
   ```bash
   npx firebase login
   npm run deploy:rules
   ```
