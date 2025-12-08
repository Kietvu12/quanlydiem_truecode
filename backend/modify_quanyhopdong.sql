-- ==================================================================================
--  MODIFY DATABASE: QUAN LY HOP DONG THI CONG TRAM BTS
--  Version: 1.1
--  Mô tả: 
--    1. Sửa bảng nguoidung: chỉ còn 2 quyền (admin, ktv)
--    2. Thêm bảng phancong_khaosat: Admin phân công KTV đi khảo sát hợp đồng
-- ==================================================================================

USE quanly_bts;

-- ==================================================================================
--  BƯỚC 1: Thêm cột la_admin vào bảng nguoidung
-- ==================================================================================
-- Thêm cột la_admin: 1 = admin, 0 = ktv
ALTER TABLE nguoidung 
ADD COLUMN la_admin TINYINT(1) NOT NULL DEFAULT 0 COMMENT '1 = admin, 0 = ktv' AFTER vaitro;

-- Cập nhật dữ liệu hiện có: nếu vaitro = 'admin' thì la_admin = 1
UPDATE nguoidung 
SET la_admin = 1 
WHERE vaitro = 'admin';

-- Chuyển các vai trò không hợp lệ về ktv
UPDATE nguoidung 
SET vaitro = 'ktv', la_admin = 0
WHERE vaitro NOT IN ('admin', 'ktv');

-- ==================================================================================
--  BƯỚC 2: Sửa ENUM vaitro trong bảng nguoidung (tùy chọn - có thể giữ để tương thích)
-- ==================================================================================
ALTER TABLE nguoidung 
MODIFY COLUMN vaitro ENUM('admin','ktv') NOT NULL DEFAULT 'ktv';

-- ==================================================================================
--  BƯỚC 3: Tạo bảng phancong_khaosat
--  Mục đích: Admin phân công KTV đi khảo sát thực tế hợp đồng
-- ==================================================================================
-- Xóa bảng nếu đã tồn tại (để tránh lỗi CHECK constraint)
DROP TABLE IF EXISTS phancong_khaosat;

CREATE TABLE phancong_khaosat (
  id                  BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  hopdong_id          BIGINT UNSIGNED NOT NULL,
  ktv_id              BIGINT UNSIGNED NOT NULL COMMENT 'Kỹ thuật viên được phân công',
  admin_id            BIGINT UNSIGNED NOT NULL COMMENT 'Admin phân công',
  trangthai           ENUM('chua_ks','dang_ks','hoan_thanh','da_huy') NOT NULL DEFAULT 'chua_ks',
  ngay_phan_cong      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Ngày admin phân công',
  ngay_bat_dau        DATE NULL COMMENT 'Ngày KTV bắt đầu khảo sát',
  ngay_hoan_thanh     DATE NULL COMMENT 'Ngày KTV hoàn thành khảo sát',
  ghichu              TEXT NULL COMMENT 'Ghi chú của admin khi phân công',
  ghichu_ktv          TEXT NULL COMMENT 'Ghi chú của KTV sau khi khảo sát',
  ngaytao             DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ngaysua             DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_pc_hopdong (hopdong_id),
  KEY idx_pc_ktv (ktv_id),
  KEY idx_pc_admin (admin_id),
  KEY idx_pc_trangthai (trangthai),
  CONSTRAINT fk_pc_hopdong
    FOREIGN KEY (hopdong_id) REFERENCES hopdong(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_pc_ktv
    FOREIGN KEY (ktv_id) REFERENCES nguoidung(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_pc_admin
    FOREIGN KEY (admin_id) REFERENCES nguoidung(id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
COMMENT='Bảng phân công KTV đi khảo sát hợp đồng';

-- ==================================================================================
--  BƯỚC 4: Không cần trigger - ràng buộc sẽ được kiểm tra ở application level
--  Logic: admin_id phải có la_admin = 1, ktv_id phải có la_admin = 0
-- ==================================================================================

-- ==================================================================================
--  BƯỚC 5: Tạo view để xem danh sách phân công (tùy chọn)
-- ==================================================================================
CREATE OR REPLACE VIEW v_phancong_khaosat AS
SELECT 
  pc.id,
  pc.hopdong_id,
  hd.sohopdong,
  hd.chudautu,
  t.matram,
  t.diachi,
  tt.ten AS tinhthanh_ten,
  pc.ktv_id,
  ktv.ten AS ktv_ten,
  ktv.email AS ktv_email,
  pc.admin_id,
  admin.ten AS admin_ten,
  pc.trangthai,
  pc.ngay_phan_cong,
  pc.ngay_bat_dau,
  pc.ngay_hoan_thanh,
  pc.ghichu,
  pc.ghichu_ktv,
  pc.ngaytao,
  pc.ngaysua
FROM phancong_khaosat pc
INNER JOIN hopdong hd ON pc.hopdong_id = hd.id
INNER JOIN tram t ON hd.tram_id = t.id
INNER JOIN tinhthanh tt ON t.tinhthanh_id = tt.id
INNER JOIN nguoidung ktv ON pc.ktv_id = ktv.id
INNER JOIN nguoidung admin ON pc.admin_id = admin.id
WHERE hd.daxoa = 0;

-- ==================================================================================
--  BƯỚC 6: Tạo index để tối ưu truy vấn
-- ==================================================================================
-- Index đã được tạo trong CREATE TABLE, không cần thêm

-- ==================================================================================
--  BƯỚC 7: Tạo bảng thư viện volume khác (tương tự thuviencot)
-- ==================================================================================
CREATE TABLE IF NOT EXISTS thuvien_volume_khac (
  id           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  mavolume     VARCHAR(100) NOT NULL UNIQUE COMMENT 'Mã volume',
  tenvolume    VARCHAR(255) NOT NULL COMMENT 'Tên volume',
  loaivolume   VARCHAR(100) NULL COMMENT 'Loại volume (ví dụ: PMLG, Cáp, Thiết bị...)',
  donvitinh    VARCHAR(50) NOT NULL DEFAULT 'cái' COMMENT 'Đơn vị tính',
  giadonvi     DECIMAL(18,2) NOT NULL DEFAULT 0 COMMENT 'Giá đơn vị',
  mota         TEXT NULL COMMENT 'Mô tả',
  ngaytao      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_volume_loai (loaivolume)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
COMMENT='Thư viện volume khác (ngoài cột)';

-- ==================================================================================
--  BƯỚC 8: Tạo bảng hopdong_volume_khac (Volume khác trong hợp đồng)
-- ==================================================================================
CREATE TABLE IF NOT EXISTS hopdong_volume_khac (
  id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  hopdong_id  BIGINT UNSIGNED NOT NULL,
  volume_id   BIGINT UNSIGNED NOT NULL COMMENT 'FK đến thuvien_volume_khac',
  soluong     INT NOT NULL DEFAULT 0 COMMENT 'Số lượng',
  tongtien    DECIMAL(18,2) NOT NULL DEFAULT 0 COMMENT 'Tổng tiền',
  ngaytao     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_hopdongvolume (hopdong_id, volume_id),
  KEY idx_hdvolume_hd (hopdong_id),
  KEY idx_hdvolume_volume (volume_id),
  CONSTRAINT fk_hdvolume_hopdong
    FOREIGN KEY (hopdong_id) REFERENCES hopdong(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_hdvolume_volume
    FOREIGN KEY (volume_id) REFERENCES thuvien_volume_khac(id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
COMMENT='Volume khác trong hợp đồng';

-- ==================================================================================
--  BƯỚC 9: Tạo bảng kstk_thucte_volume_khac (Khối lượng thực tế KSTK cho volume khác)
-- ==================================================================================
CREATE TABLE IF NOT EXISTS kstk_thucte_volume_khac (
  id                   BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  hopdong_id           BIGINT UNSIGNED NOT NULL,
  volume_id            BIGINT UNSIGNED NOT NULL COMMENT 'FK đến thuvien_volume_khac',
  soluong_thucte       INT NOT NULL DEFAULT 0 COMMENT 'Số lượng thực tế',
  chenhlech            INT NOT NULL DEFAULT 0 COMMENT 'Chênh lệch',
  phantram_chenhlech   FLOAT NOT NULL DEFAULT 0 COMMENT 'Phần trăm chênh lệch',
  nguoinhap_id         BIGINT UNSIGNED NOT NULL COMMENT 'Người nhập KSTK',
  ngaytao              DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_kstkvolume_hd (hopdong_id),
  KEY idx_kstkvolume_volume (volume_id),
  KEY idx_kstkvolume_user (nguoinhap_id),
  CONSTRAINT fk_kstkvolume_hd
    FOREIGN KEY (hopdong_id) REFERENCES hopdong(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_kstkvolume_volume
    FOREIGN KEY (volume_id) REFERENCES thuvien_volume_khac(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_kstkvolume_user
    FOREIGN KEY (nguoinhap_id) REFERENCES nguoidung(id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
COMMENT='Khối lượng thực tế KSTK cho volume khác';

-- ==================================================================================
--  BƯỚC 10: Cập nhật bảng kstk_thucte để thêm comment rõ ràng
-- ==================================================================================
ALTER TABLE kstk_thucte 
MODIFY COLUMN cot_id BIGINT UNSIGNED NOT NULL COMMENT 'FK đến thuviencot - chỉ dành cho cột';

-- ==================================================================================
--  BƯỚC 11: Tạo view tổng hợp volume hợp đồng (cả cột và volume khác)
-- ==================================================================================
CREATE OR REPLACE VIEW v_hopdong_volume AS
SELECT 
  hd.id AS hopdong_id,
  hd.sohopdong,
  'cot' AS loai_volume,
  cot.id AS item_id,
  cot.macot AS ma_item,
  cot.tencot AS ten_item,
  hdc.soluong,
  hdc.tongtien,
  hdc.ngaytao
FROM hopdong hd
INNER JOIN hopdong_cot hdc ON hd.id = hdc.hopdong_id
INNER JOIN thuviencot cot ON hdc.cot_id = cot.id
WHERE hd.daxoa = 0

UNION ALL

SELECT 
  hd.id AS hopdong_id,
  hd.sohopdong,
  'volume_khac' AS loai_volume,
  volume.id AS item_id,
  volume.mavolume AS ma_item,
  volume.tenvolume AS ten_item,
  hdvol.soluong,
  hdvol.tongtien,
  hdvol.ngaytao
FROM hopdong hd
INNER JOIN hopdong_volume_khac hdvol ON hd.id = hdvol.hopdong_id
INNER JOIN thuvien_volume_khac volume ON hdvol.volume_id = volume.id
WHERE hd.daxoa = 0;

-- ==================================================================================
--  BƯỚC 12: Tạo view tổng hợp KSTK thực tế (cả cột và volume khác)
-- ==================================================================================
CREATE OR REPLACE VIEW v_kstk_thucte_all AS
SELECT 
  kstk.id,
  kstk.hopdong_id,
  hd.sohopdong,
  'cot' AS loai_volume,
  cot.id AS item_id,
  cot.macot AS ma_item,
  cot.tencot AS ten_item,
  kstk.soluong_thucte,
  kstk.chenhlech,
  kstk.phantram_chenhlech,
  kstk.nguoinhap_id,
  nd.ten AS nguoinhap_ten,
  kstk.ngaytao
FROM kstk_thucte kstk
INNER JOIN hopdong hd ON kstk.hopdong_id = hd.id
INNER JOIN thuviencot cot ON kstk.cot_id = cot.id
INNER JOIN nguoidung nd ON kstk.nguoinhap_id = nd.id
WHERE hd.daxoa = 0

UNION ALL

SELECT 
  kstkvol.id,
  kstkvol.hopdong_id,
  hd.sohopdong,
  'volume_khac' AS loai_volume,
  volume.id AS item_id,
  volume.mavolume AS ma_item,
  volume.tenvolume AS ten_item,
  kstkvol.soluong_thucte,
  kstkvol.chenhlech,
  kstkvol.phantram_chenhlech,
  kstkvol.nguoinhap_id,
  nd.ten AS nguoinhap_ten,
  kstkvol.ngaytao
FROM kstk_thucte_volume_khac kstkvol
INNER JOIN hopdong hd ON kstkvol.hopdong_id = hd.id
INNER JOIN thuvien_volume_khac volume ON kstkvol.volume_id = volume.id
INNER JOIN nguoidung nd ON kstkvol.nguoinhap_id = nd.id
WHERE hd.daxoa = 0;

-- ==================================================================================
--  BƯỚC 13: Insert dữ liệu mẫu (tùy chọn - chỉ để test)
-- ==================================================================================
-- INSERT INTO phancong_khaosat (hopdong_id, ktv_id, admin_id, ghichu)
-- VALUES (1, 2, 1, 'Phân công KTV đi khảo sát trạm THA2281');

-- ==================================================================================
-- DONE!
-- ==================================================================================
-- Lưu ý:
-- 1. Đã thêm cột la_admin (TINYINT) vào bảng nguoidung: 1 = admin, 0 = ktv
-- 2. Ràng buộc vai trò sẽ được kiểm tra ở application level:
--    - admin_id phải có la_admin = 1
--    - ktv_id phải có la_admin = 0
-- 3. View v_phancong_khaosat giúp truy vấn dữ liệu dễ dàng hơn
-- 4. Cả cột và volume khác đều là volume của hợp đồng và đều cần khảo sát
-- 5. View v_hopdong_volume: Tổng hợp tất cả volume (cột + volume khác) trong hợp đồng
-- 6. View v_kstk_thucte_all: Tổng hợp tất cả KSTK thực tế (cột + volume khác)
-- ==================================================================================

