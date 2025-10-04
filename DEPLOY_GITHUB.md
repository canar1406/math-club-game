# 🚀 HƯỚNG DẪN NHANH - DEPLOY LÊN GITHUB

## ✅ Checklist Trước Khi Deploy

- [ ] Đã tạo Google Sheets
- [ ] Đã setup Google Apps Script
- [ ] Đã có Web App URL
- [ ] Đã cấu hình `config.js` với URL đúng
- [ ] Đã test local (mở index.html) và hoạt động tốt

## 🎯 Các Bước Deploy

### 1️⃣ Tạo Repository Trên GitHub

1. Đăng nhập https://github.com
2. Click **New** (nút xanh) hoặc **+** > **New repository**
3. Điền thông tin:
   - **Repository name**: `mat-thu-anh-trang` (hoặc tên khác)
   - **Description**: Trò chơi giải đố Trung thu
   - **Public** ✅ (bắt buộc cho GitHub Pages free)
   - **Initialize**: Không tick gì cả
4. Click **Create repository**

### 2️⃣ Upload Code Lên GitHub

**CÁCH 1: Dùng Git (Nếu đã cài Git)**

```bash
# Mở terminal/command prompt tại thư mục project
cd "c:\Users\hoang\OneDrive\Máy tính\Math club"

# Khởi tạo git
git init

# Add tất cả file
git add .

# Commit
git commit -m "Initial commit: Mật Thư Ánh Trăng game"

# Đổi branch thành main
git branch -M main

# Link với GitHub (thay YOUR_USERNAME và YOUR_REPO)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Push code lên
git push -u origin main
```

**CÁCH 2: Upload Trực Tiếp (Dễ hơn)**

1. Vào repository vừa tạo trên GitHub
2. Click **uploading an existing file** (link màu xanh)
3. Kéo thả TẤT CẢ các file vào:
   - index.html
   - styles.css
   - script.js
   - config.js ← **QUAN TRỌNG**
   - README.md
   - HUONG_DAN_GOOGLE_SHEETS.md
   - .gitignore
4. Viết commit message: "Add game files"
5. Click **Commit changes**

### 3️⃣ Bật GitHub Pages

1. Trong repository, click tab **Settings** (⚙️)
2. Scroll xuống hoặc click **Pages** ở sidebar bên trái
3. Trong phần **Source**:
   - Branch: chọn **main**
   - Folder: chọn **/ (root)**
4. Click **Save**
5. Chờ 2-5 phút
6. Reload trang, sẽ thấy thông báo:
   ```
   Your site is published at https://YOUR_USERNAME.github.io/YOUR_REPO/
   ```
7. Click vào link để mở game!

## 🔗 Link Cuối Cùng

Website của bạn sẽ có dạng:
```
https://YOUR_USERNAME.github.io/mat-thu-anh-trang/
```

Ví dụ:
- Username: `hoangdev`
- Repo: `mat-thu-anh-trang`
- Link: `https://hoangdev.github.io/mat-thu-anh-trang/`

## 🧪 Test Website

Sau khi deploy:
1. Mở link GitHub Pages
2. Test form nhập thông tin
3. Chơi game từ đầu đến cuối
4. Kiểm tra Google Sheets xem đã lưu dữ liệu chưa
5. Test trên mobile/tablet

## 🐛 Xử Lý Lỗi

### Lỗi 1: 404 Not Found
- Đợi thêm 5-10 phút
- Check Settings > Pages đã enable đúng chưa
- Clear cache: Ctrl+Shift+R

### Lỗi 2: Không lưu được vào Google Sheets
- Mở Console (F12)
- Xem có lỗi gì không
- Kiểm tra lại config.js
- Xem lại Google Apps Script deployment

### Lỗi 3: CSS/JS không load
- Check file có đúng tên không (phân biệt hoa thường)
- Xem Console có lỗi 404 không

## 📱 Chia Sẻ Game

Copy link và gửi cho học sinh:
```
🌙 Mật Thư Ánh Trăng - Trò Chơi Trung Thu 🏮

Link: https://YOUR_USERNAME.github.io/mat-thu-anh-trang/

Hãy giải mã các câu đố để tìm ra bí mật của Chị Hằng và Chú Cuội! 🎉
```

## 🔄 Cập Nhật Code Sau Này

Khi cần sửa code:

**Cách 1: Git**
```bash
git add .
git commit -m "Update: mô tả thay đổi"
git push
```

**Cách 2: Web**
1. Vào file cần sửa trên GitHub
2. Click biểu tượng bút ✏️
3. Sửa code
4. Commit changes

Sau vài phút, website sẽ tự động cập nhật!

## ✨ Tips

- Bookmark link Google Sheets để xem dữ liệu nhanh
- Tạo custom domain (nếu có)
- Backup repository định kỳ
- Monitor lượng người chơi
- Tạo Google Data Studio dashboard

## 🎉 Hoàn Thành!

Bây giờ bạn đã có:
- ✅ Website live trên internet
- ✅ Tự động lưu dữ liệu vào Google Sheets
- ✅ Admin panel để quản lý
- ✅ Link chia sẻ cho học sinh

Good luck! 🚀
