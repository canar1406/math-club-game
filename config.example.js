// ⚙️ CẤU HÌNH MẪU GOOGLE SHEETS API
// Copy file này thành 'config.js' và điền URL Google Sheets của bạn

const CONFIG = {
    // ============================================
    // GOOGLE SHEETS URL
    // ============================================
    // Xem hướng dẫn trong HUONG_DAN_GOOGLE_SHEETS.md
    // URL có dạng: https://script.google.com/macros/s/AKfycbx.../exec
    GOOGLE_SHEETS_URL: 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec',
    
    // ============================================
    // TÙY CHỌN LƯU DỮ LIỆU
    // ============================================
    
    // Lưu vào Google Sheets (khuyên dùng khi deploy lên web)
    ENABLE_GOOGLE_SHEETS: true,
    
    // Tải file JSON xuống máy người chơi (khuyên dùng cho backup)
    ENABLE_LOCAL_DOWNLOAD: true,
    
    // Lưu vào localStorage của trình duyệt (dùng cho admin panel)
    ENABLE_LOCAL_STORAGE: true,
    
    // ============================================
    // DEBUG
    // ============================================
    
    // Hiển thị thông báo chi tiết trong Console (F12)
    // Bật khi đang test, tắt khi đã deploy
    DEBUG_MODE: false
};

// ============================================
// TỰ ĐỘNG KIỂM TRA
// ============================================
if (CONFIG.ENABLE_GOOGLE_SHEETS && !CONFIG.GOOGLE_SHEETS_URL) {
    console.warn('⚠️ GOOGLE SHEETS URL CHƯA ĐƯỢC CẤU HÌNH!');
    console.warn('Vui lòng xem hướng dẫn trong file HUONG_DAN_GOOGLE_SHEETS.md');
}

if (CONFIG.GOOGLE_SHEETS_URL.includes('YOUR_DEPLOYMENT_ID')) {
    console.error('❌ BẠN CHƯA THAY ĐỔI URL MẪU!');
    console.error('Hãy thay YOUR_DEPLOYMENT_ID bằng deployment ID thật của bạn');
}
