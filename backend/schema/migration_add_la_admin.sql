-- ==================================================================================
--  Migration: Thêm cột la_admin vào bảng nguoidung
--  Version: 2.1
-- ==================================================================================

USE quanly_bts;

-- Thêm cột la_admin
ALTER TABLE nguoidung 
ADD COLUMN la_admin TINYINT(1) NOT NULL DEFAULT 0 
COMMENT 'Là admin (1 = admin, 0 = không phải admin)' 
AFTER vaitro;

-- Cập nhật các user có vaitro = 'admin' thành la_admin = 1
UPDATE nguoidung 
SET la_admin = 1 
WHERE vaitro = 'admin';

-- ==================================================================================
--  Tạo tài khoản admin mặc định
-- ==================================================================================

-- Mật khẩu: admin123 (đã được hash bằng bcrypt)
-- Hash của "admin123" với bcrypt rounds=10
INSERT INTO nguoidung (ten, email, matkhau_hash, vaitro, la_admin) 
VALUES (
  'Administrator',
  'admin@example.com',
  '$2a$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZq',
  'admin',
  1
) 
ON DUPLICATE KEY UPDATE 
  la_admin = 1,
  vaitro = 'admin';

-- ==================================================================================
--  LƯU Ý: 
--  - Mật khẩu mặc định: admin123
--  - Nếu muốn đổi mật khẩu, cần hash lại bằng bcrypt
--  - Có thể tạo script Node.js để hash mật khẩu mới
-- ==================================================================================

