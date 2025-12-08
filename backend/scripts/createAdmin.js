import bcrypt from 'bcryptjs';
import pool from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Script tạo tài khoản admin mặc định
 */
async function createAdmin() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const adminName = process.env.ADMIN_NAME || 'Administrator';

    // Hash mật khẩu
    const matkhau_hash = await bcrypt.hash(adminPassword, 10);

    // Kiểm tra xem đã có admin chưa
    const [existing] = await pool.execute(
      'SELECT * FROM nguoidung WHERE email = ?',
      [adminEmail]
    );

    if (existing.length > 0) {
      // Cập nhật thành admin nếu đã tồn tại
      await pool.execute(
        'UPDATE nguoidung SET ten = ?, matkhau_hash = ?, vaitro = ?, la_admin = 1 WHERE email = ?',
        [adminName, matkhau_hash, 'admin', adminEmail]
      );
      console.log(`✅ Đã cập nhật tài khoản admin: ${adminEmail}`);
    } else {
      // Tạo mới admin
      await pool.execute(
        'INSERT INTO nguoidung (ten, email, matkhau_hash, vaitro, la_admin) VALUES (?, ?, ?, ?, ?)',
        [adminName, adminEmail, matkhau_hash, 'admin', 1]
      );
      console.log(`✅ Đã tạo tài khoản admin mới: ${adminEmail}`);
    }

    console.log(`📧 Email: ${adminEmail}`);
    console.log(`🔑 Mật khẩu: ${adminPassword}`);
    console.log(`👤 Tên: ${adminName}`);
    console.log(`\n⚠️  Lưu ý: Đổi mật khẩu sau lần đăng nhập đầu tiên!`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi tạo admin:', error);
    process.exit(1);
  }
}

createAdmin();

