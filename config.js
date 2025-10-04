// ⚙️ CẤU HÌNH GOOGLE SHEETS API
// Paste URL từ Google Apps Script deployment vào đây
// Xem hướng dẫn chi tiết trong file HUONG_DAN_GOOGLE_SHEETS.md

const CONFIG = {
    // URL Web App từ Google Apps Script
    // Ví dụ: 'https://script.google.com/macros/s/AKfycbx.../exec'
    GOOGLE_SHEETS_URL: 'https://script.google.com/macros/s/AKfycbwOWICeV28yf-Q0POdd8YAY7JBc27Q4SFD0iG0_smOqMlj6R2ck8CrAG8qu7b3cortNew/exec',
    
    // Bật/tắt lưu vào Google Sheets
    ENABLE_GOOGLE_SHEETS: true,
    
    // Bật/tắt tải file JSON xuống máy
    ENABLE_LOCAL_DOWNLOAD: true,
    
    // Bật/tắt lưu vào localStorage
    ENABLE_LOCAL_STORAGE: true,
    
    // Hiển thị thông báo debug
    DEBUG_MODE: true  // Tạm bật để debug
};

// Kiểm tra cấu hình
if (CONFIG.ENABLE_GOOGLE_SHEETS && !CONFIG.GOOGLE_SHEETS_URL) {
    console.warn('⚠️ Chưa cấu hình Google Sheets URL! Vui lòng xem file HUONG_DAN_GOOGLE_SHEETS.md');
}
