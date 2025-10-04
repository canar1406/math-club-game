# 📊 HƯỚNG DẪN CÀI ĐẶT GOOGLE SHEETS API

## Bước 1: Tạo Google Sheets
1. Truy cập: https://sheets.google.com
2. Tạo sheet mới với tên: **Mật Thư Ánh Trăng - Dữ Liệu Người Chơi**
3. Đặt tên cho Sheet1: **Players**
4. Tạo tiêu đề cột ở dòng 1:
   - A1: `STT`
   - B1: `Họ và Tên`
   - C1: `Email`
   - D1: `Học sinh TVG`
   - E1: `Lớp`
   - F1: `Thời gian hoàn thành`
   - G1: `Thời gian (giây)`
   - H1: `Ngày giờ hoàn thành`
   - I1: `Timestamp`
   - J1: `Password` (mới thêm)

## Bước 2: Tạo Google Apps Script
1. Trong Google Sheets, vào menu: **Extensions** > **Apps Script**
2. Xóa code mặc định, paste code sau:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Players');
    
    // Parse dữ liệu từ request
    var data = JSON.parse(e.postData.contents);
    
    // Nếu là request kiểm tra email
    if (data.action === 'checkEmail') {
      return checkEmailExists(sheet, data.email, data.password);
    }
    
    // Nếu là request lưu dữ liệu mới
    if (data.action === 'saveData') {
      return savePlayerData(sheet, data);
    }
    
    // Default: lưu dữ liệu (backward compatibility)
    return savePlayerData(sheet, data);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      'status': 'error',
      'message': error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Kiểm tra email đã tồn tại chưa
function checkEmailExists(sheet, email, password) {
  var data = sheet.getDataRange().getValues();
  
  // Bỏ qua dòng tiêu đề (dòng 1)
  for (var i = 1; i < data.length; i++) {
    var rowEmail = data[i][2]; // Cột C (Email)
    var rowPassword = data[i][9]; // Cột J (Password)
    
    if (rowEmail.toLowerCase() === email.toLowerCase()) {
      // Email đã tồn tại - kiểm tra password
      if (password !== rowPassword) {
        return ContentService.createTextOutput(JSON.stringify({
          'status': 'error',
          'message': 'Mật khẩu không đúng!',
          'exists': true,
          'passwordRequired': true
        })).setMimeType(ContentService.MimeType.JSON);
      }
      
      // Password đúng - trả về thông tin người chơi
      return ContentService.createTextOutput(JSON.stringify({
        'status': 'exists',
        'message': 'Email đã từng chơi!',
        'exists': true,
        'data': {
          'name': data[i][1],
          'email': data[i][2],
          'isStudent': data[i][3] === 'Có',
          'class': data[i][4],
          'completionTime': data[i][5],
          'completionTimeSeconds': data[i][6],
          'completedAtLocal': data[i][7],
          'password': rowPassword
        }
      })).setMimeType(ContentService.MimeType.JSON);
    }
  }
  
  // Email chưa tồn tại
  return ContentService.createTextOutput(JSON.stringify({
    'status': 'success',
    'message': 'Email chưa được sử dụng',
    'exists': false
  })).setMimeType(ContentService.MimeType.JSON);
}

// Lưu dữ liệu người chơi mới
function savePlayerData(sheet, data) {
  // Đếm số dòng hiện có
  var lastRow = sheet.getLastRow();
  var stt = lastRow > 0 ? lastRow : 1;
  
  // Thêm dòng mới
  sheet.appendRow([
    stt,
    data.name,
    data.email,
    data.isStudent ? 'Có' : 'Không',
    data.class || 'N/A',
    data.completionTime,
    data.completionTimeSeconds,
    data.completedAtLocal,
    data.completedAt,
    data.password || '' // Cột J - Password
  ]);
  
  // Trả về kết quả thành công
  return ContentService.createTextOutput(JSON.stringify({
    'status': 'success',
    'message': 'Dữ liệu đã được lưu thành công!',
    'row': stt
  })).setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    'status': 'ok',
    'message': 'Google Sheets API đang hoạt động!'
  })).setMimeType(ContentService.MimeType.JSON);
}
```

3. Lưu project (Ctrl+S), đặt tên: **Mật Thư Ánh Trăng API**

## Bước 3: Deploy Web App
1. Click nút **Deploy** > **New deployment**
2. Click biểu tượng ⚙️ bên cạnh "Select type"
3. Chọn **Web app**
4. Cấu hình:
   - **Description**: Mật Thư Ánh Trăng API v1
   - **Execute as**: Me (email của bạn)
   - **Who has access**: Anyone
5. Click **Deploy**
6. Click **Authorize access**
7. Chọn tài khoản Google
8. Click **Advanced** > **Go to [Project name] (unsafe)** > **Allow**
9. **QUAN TRỌNG**: Copy **Web app URL** (dạng: https://script.google.com/macros/s/.../exec)

## Bước 4: Cấu hình Code
1. Mở file `config.js` trong project
2. Paste URL vừa copy vào biến `GOOGLE_SHEETS_URL`

```javascript
const GOOGLE_SHEETS_URL = 'PASTE_URL_Ở_ĐÂY';
```

3. Lưu file

## Bước 5: Test
1. Chơi game và hoàn thành
2. Kiểm tra Google Sheets xem dữ liệu đã được lưu chưa
3. Nếu có lỗi, mở Console (F12) để xem thông báo lỗi

## 🔧 Troubleshooting

### Lỗi CORS
- Đảm bảo đã chọn "Who has access: **Anyone**" khi deploy

### Không lưu được dữ liệu
- Kiểm tra lại URL đã paste đúng chưa
- Kiểm tra tên Sheet phải là "Players"
- Xem lại quyền truy cập trong Apps Script

### Cập nhật Code Apps Script
1. Sửa code trong Apps Script
2. Click **Deploy** > **Manage deployments**
3. Click ✏️ bên cạnh deployment
4. Chọn **New version**
5. Click **Deploy**

## 📈 Xem Dữ Liệu
- Truy cập Google Sheets bất cứ lúc nào
- Dữ liệu tự động cập nhật real-time
- Có thể tạo biểu đồ, phân tích, xuất Excel

## 🔒 Bảo Mật
- URL Apps Script là public nhưng chỉ cho phép ghi dữ liệu
- Không ai có thể xem/sửa/xóa Sheet ngoài bạn
- Có thể thu hồi quyền truy cập bất cứ lúc nào

## 💡 Tips
- Tạo thêm sheet "Statistics" để tính toán thống kê
- Dùng Google Data Studio để tạo dashboard
- Set up email notification khi có người chơi mới
