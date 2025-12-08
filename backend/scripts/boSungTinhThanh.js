import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Đọc file JSON
const tinhThanhData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../data/tinhthanh.json'), 'utf8')
);

async function boSungTinhThanh() {
  try {
    console.log('Bắt đầu bổ sung tỉnh thành...\n');
    
    // Lấy danh sách tỉnh thành hiện có trong database
    const [existingTinh] = await pool.execute('SELECT ma, ten FROM tinhthanh');
    const existingMaSet = new Set(existingTinh.map(t => t.ma));
    const existingTenMap = new Map(existingTinh.map(t => [t.ma, t.ten]));
    
    console.log(`Đã có ${existingTinh.length} tỉnh thành trong database\n`);
    
    let addedCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const tinh of tinhThanhData) {
      try {
        if (existingMaSet.has(tinh.ma)) {
          // Kiểm tra xem tên có khác không
          const existingTen = existingTenMap.get(tinh.ma);
          if (existingTen !== tinh.ten) {
            // Cập nhật tên nếu khác
            await pool.execute(
              'UPDATE tinhthanh SET ten = ? WHERE ma = ?',
              [tinh.ten, tinh.ma]
            );
            console.log(`↻ Đã cập nhật: ${tinh.ma} - "${existingTen}" → "${tinh.ten}"`);
            updatedCount++;
          } else {
            console.log(`⊘ Đã tồn tại: ${tinh.ma} - ${tinh.ten}`);
            skippedCount++;
          }
        } else {
          // Thêm mới
          await pool.execute(
            'INSERT INTO tinhthanh (ma, ten) VALUES (?, ?)',
            [tinh.ma, tinh.ten]
          );
          console.log(`✓ Đã thêm mới: ${tinh.ma} - ${tinh.ten}`);
          addedCount++;
        }
      } catch (error) {
        console.error(`✗ Lỗi khi xử lý ${tinh.ma} - ${tinh.ten}:`, error.message);
        errorCount++;
      }
    }

    console.log('\n=== KẾT QUẢ ===');
    console.log(`✓ Thêm mới: ${addedCount}`);
    console.log(`↻ Cập nhật: ${updatedCount}`);
    console.log(`⊘ Đã tồn tại: ${skippedCount}`);
    console.log(`✗ Lỗi: ${errorCount}`);
    console.log(`📊 Tổng cộng trong file: ${tinhThanhData.length}`);
    console.log(`📊 Tổng cộng trong database sau khi bổ sung: ${existingTinh.length + addedCount}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Lỗi khi bổ sung tỉnh thành:', error);
    process.exit(1);
  }
}

boSungTinhThanh();

