# 📖 HƯỚNG DẪN THI PE MMA301 (QUY TRÌNH THỰC CHIẾN TỰ ĐỘNG)

Tài liệu này hướng dẫn chi tiết quy trình thi PE, từ lúc nhận đề, cập nhật code tự động, chụp ảnh minh chứng đến đóng gói file nộp bài chuẩn 100% theo yêu cầu của hội đồng chấm thi.

---

## 1. Cấu trúc file nộp bài (Quy định bắt buộc của đề thi)
Đề thi yêu cầu nộp **1 thư mục** mang tên mã sinh viên của bạn (ví dụ `QE190042`), bên trong chứa **đúng 2 file**:
1. `<StudentCode>.docx`: File Word báo cáo theo đúng mẫu quy định, chứa thông tin sinh viên, link repo, link Expo, tài khoản test và **16 ảnh chụp màn hình có chú thích (caption)**.
2. `<StudentCode>.zip`: File nén mã nguồn dự án (chứa `package.json` ở thư mục gốc, `firestore.rules`, `.env.example`, mã nguồn trong `src/`... **tuyệt đối không chứa `node_modules`, `.expo`, `.git` và file `.env` chứa key thật**).

---

## 2. Kịch bản khi nhận đề thi thật (Chỉ mất 5 phút)

### Bước 1: Gửi đề cho AI
Khi giám thị phát đề, bạn chỉ cần copy nội dung đề hoặc gửi file đề vào chat.
Tôi sẽ tự động:
- Cập nhật đúng các trường dữ liệu mới (ví dụ: Task, Expense, Course...).
- Cập nhật file [`firestore.rules`](./firestore.rules) và kiểm tra typecheck (`tsc --noEmit`).
- Đồng bộ lại các `testID` và các câu thông báo lỗi chính xác theo đề thi mới.

### Bước 2: Deploy rules lên Firebase
Chạy 1 lệnh duy nhất trên PowerShell:
```powershell
npm run deploy:rules
```

---

## 3. Quy trình tạo tài liệu báo cáo (.docx) tự động

### Bước 1: Chụp 16 ảnh minh chứng
Mở app trên điện thoại (Expo Go) hoặc máy ảo, chụp 16 tấm ảnh và lưu vào thư mục `screenshots/` theo số thứ tự từ `1.png` đến `16.png`:

| Tên file | Nội dung ảnh cần chụp |
| :--- | :--- |
| `screenshots/1.png` | **Firebase Console - Authentication**: Danh sách người dùng có tài khoản test. |
| `screenshots/2.png` | **Firebase Console - Firestore data**: Collection với ít nhất 3 document mẫu. |
| `screenshots/3.png` | **Firebase Console - Security Rules**: Tab Rules trên web Firebase đã xuất bản. |
| `screenshots/4.png` | **Register Screen - Validation**: Form đăng ký bấm nút khi để trống (hiện lỗi). |
| `screenshots/5.png` | **Register Screen - Success**: Ngay sau khi đăng ký thành công (`Registration successful`). |
| `screenshots/6.png` | **Login Screen**: Form đăng nhập khi để trống. |
| `screenshots/7.png` | **List Screen - After login**: Hiện email người dùng, nút Logout và ít nhất 3 mục trong list. |
| `screenshots/8.png` | **Add Form - Validation**: Form thêm mới bấm nút khi để trống hoặc nhập sai. |
| `screenshots/9.png` | **Add Form - Success**: Ngay sau khi thêm thành công (`Book added` và mục mới hiện trong list). |
| `screenshots/10.png` | **Filters and Search**: Minh họa bộ lọc Category, Status, Favorites only và Search. |
| `screenshots/11.png` | **Summary**: Thống kê số lượng (`book-count`, `favorite-count`) và danh sách trạng thái. |
| `screenshots/12.png` | **Detail Screen - View mode**: Xem chi tiết 1 mục đầy đủ các trường. |
| `screenshots/13.png` | **Detail Screen - Edit validation**: Chế độ sửa khi nhập dữ liệu không hợp lệ. |
| `screenshots/14.png` | **Detail Screen - After Save**: Sau khi bấm Save hiện giá trị mới đã lưu. |
| `screenshots/15.png` | **Favorite toggle & Delete**: Cặp ảnh minh họa đổi trạng thái sao và xóa mục khỏi danh sách. |
| `screenshots/16.png` | **Empty state**: Màn hình rỗng hiện đúng text `No books found` (dùng tài khoản test mới). |

### Bước 2: Tạo file Word tự động
Chạy lệnh:
```powershell
python scripts/create_report_template.py
```
> **Tác dụng**: Script sẽ tự động lấy toàn bộ ảnh trong thư mục `screenshots/` chèn vào file Word `<StudentCode>.docx`, căn chỉnh kích thước chuẩn và tạo chú thích (caption) in đậm đúng chuẩn barem chấm điểm của trường!

---

## 4. Đóng gói bài thi nộp tự động

Chạy lệnh:
```powershell
python scripts/pack_submission.py
```

Lệnh này sẽ tự động:
1. Tạo thư mục mang mã sinh viên (ví dụ: `QE190042/`).
2. Copy file `<StudentCode>.docx` vào thư mục đó.
3. Nén mã nguồn thành file `<StudentCode>.zip` chuẩn cấu trúc (chứa `package.json`, `firestore.rules`, `.env.example`, loại bỏ sạch sẽ `node_modules`, `.git`, `.expo`, `.env`).

Bạn chỉ việc nộp thư mục này lên hệ thống thi cử là hoàn thành 100%!
