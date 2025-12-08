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

async function importTinhThanh() {
  try {
    console.log('Bắt đầu import tỉnh thành...');
    
    let successCount = 0;
    let errorCount = 0;

    for (const tinh of tinhThanhData) {
      try {
        await pool.execute(
          'INSERT INTO tinhthanh (ma, ten) VALUES (?, ?)',
          [tinh.ma, tinh.ten]
        );
        console.log(`✓ Đã thêm: ${tinh.ma} - ${tinh.ten}`);
        successCount++;
      } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
          console.log(`⚠ Đã tồn tại: ${tinh.ma} - ${tinh.ten}`);
        } else {
          console.error(`✗ Lỗi khi thêm ${tinh.ma} - ${tinh.ten}:`, error.message);
          errorCount++;
        }
      }
    }

    console.log('\n=== KẾT QUẢ ===');
    console.log(`Thành công: ${successCount}`);
    console.log(`Lỗi: ${errorCount}`);
    console.log(`Tổng cộng: ${tinhThanhData.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Lỗi khi import:', error);
    process.exit(1);
  }
}

importTinhThanh();

