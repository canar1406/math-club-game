# 🌙 Mật Thư Ánh Trăng

Trò chơi giải đố Trung thu với 4 câu hỏi toán học hấp dẫn, thu thập chữ cái để giải mã mật khẩu bí mật!

## 🎮 Chức Năng

- ✅ 4 câu đố toán học với nhiều dạng bài khác nhau
- ✅ Thu thập thông tin người chơi (tên, email, trường, lớp)
- ✅ Đếm thời gian hoàn thành
- ✅ Tự động lưu dữ liệu vào Google Sheets
- ✅ Backup dữ liệu với localStorage và file JSON
- ✅ Admin panel để quản lý dữ liệu (Ctrl+Shift+A)
- ✅ Giao diện đẹp với hiệu ứng sao, mặt trăng, pháo hoa

## 🚀 Deploy Lên GitHub Pages

### Bước 1: Tạo Repository
1. Đăng nhập GitHub
2. Click **New repository**
3. Đặt tên: `mat-thu-anh-trang` (hoặc tên bạn thích)
4. Chọn **Public**
5. Click **Create repository**

### Bước 2: Upload Code
```bash
# Trong thư mục project
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/USERNAME/mat-thu-anh-trang.git
git push -u origin main
```

Hoặc upload trực tiếp trên GitHub:
1. Vào repository vừa tạo
2. Click **uploading an existing file**
3. Kéo thả tất cả file vào
4. Click **Commit changes**

### Bước 3: Enable GitHub Pages
1. Vào **Settings** của repository
2. Chọn **Pages** (bên trái)
3. Source: chọn **main** branch
4. Folder: chọn **/ (root)**
5. Click **Save**
6. Đợi vài phút, link sẽ xuất hiện: `https://USERNAME.github.io/mat-thu-anh-trang/`

## ⚙️ Cấu Hình Google Sheets

**QUAN TRỌNG**: Phải cấu hình Google Sheets để lưu dữ liệu người chơi!

Xem hướng dẫn chi tiết trong file: **[HUONG_DAN_GOOGLE_SHEETS.md](HUONG_DAN_GOOGLE_SHEETS.md)**

Tóm tắt nhanh:
1. Tạo Google Sheets
2. Tạo Google Apps Script
3. Deploy Web App
4. Copy URL vào file `config.js`

## 📁 Cấu Trúc Project

```
mat-thu-anh-trang/
├── index.html                      # Trang chính
├── styles.css                      # CSS styling
├── script.js                       # JavaScript game logic
├── config.js                       # Cấu hình Google Sheets
├── README.md                       # File này
└── HUONG_DAN_GOOGLE_SHEETS.md     # Hướng dẫn setup Google Sheets
```

## 🔧 Cấu Hình (file config.js)

```javascript
const CONFIG = {
    // Paste URL từ Google Apps Script
    GOOGLE_SHEETS_URL: 'https://script.google.com/macros/s/.../exec',
    
    // Bật/tắt các tính năng
    ENABLE_GOOGLE_SHEETS: true,    // Lưu vào Google Sheets
    ENABLE_LOCAL_DOWNLOAD: true,   // Tải file JSON
    ENABLE_LOCAL_STORAGE: true,    // Lưu localStorage
    DEBUG_MODE: false               // Debug mode
};
```

## 👨‍💼 Admin Panel

Nhấn **Ctrl+Shift+A** để mở/đóng admin panel:
- 📊 Xuất dữ liệu tất cả người chơi
- 👁️ Xem dữ liệu trong console
- 🗑️ Xóa dữ liệu localStorage

## 📊 Xem Dữ Liệu

### Google Sheets (Real-time)
- Mở Google Sheets đã tạo
- Dữ liệu tự động cập nhật khi có người chơi mới
- Có thể tạo biểu đồ, phân tích, xuất Excel

### Console (F12)
- Nhấn Ctrl+Shift+A
- Click "👁️ Xem Dữ Liệu"
- Xem trong Console

## 🎯 Luồng Chơi

1. Điền thông tin cá nhân
2. Đọc câu chuyện
3. Giải 4 câu đố toán học
4. Thu thập chữ cái: **a, u, n, g, u, e, y, t, l**
5. Sắp xếp thành mật khẩu: **NGUYETLAU**
6. Hoàn thành! 🎉

## 🛠️ Công Nghệ Sử Dụng

- HTML5
- CSS3 (Animations, Gradients, Backdrop Filter)
- Vanilla JavaScript (ES6+)
- Google Apps Script (Backend)
- Google Sheets API

## 📝 Ghi Chú

- Game chỉ cho phép chuyển câu khi trả lời đúng
- Dữ liệu được lưu 3 nơi: Google Sheets, localStorage, file JSON
- Có thể tắt bất kỳ tính năng nào trong `config.js`
- Code hoàn toàn client-side (trừ Google Sheets API)

## 🐛 Troubleshooting

### Không lưu được vào Google Sheets
- Kiểm tra `GOOGLE_SHEETS_URL` trong `config.js`
- Xem hướng dẫn trong `HUONG_DAN_GOOGLE_SHEETS.md`
- Mở Console (F12) xem log lỗi

### GitHub Pages không hoạt động
- Đợi 5-10 phút sau khi enable
- Clear cache trình duyệt (Ctrl+Shift+R)
- Kiểm tra Settings > Pages có link chưa

### Game không chạy
- Kiểm tra Console (F12) xem lỗi
- Đảm bảo đã load đủ 3 file: config.js, script.js, styles.css

## 📧 Liên Hệ

Nếu có thắc mắc hoặc cần hỗ trợ, vui lòng:
- Mở Issue trên GitHub
- Liên hệ qua email: [your-email@example.com]

## 📄 License

MIT License - Free to use and modify!

---

Made with ❤️ for Trung Thu Festival 🏮🌙
