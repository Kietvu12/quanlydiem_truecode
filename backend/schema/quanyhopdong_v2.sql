-- ==================================================================================
--  DATABASE: QUAN LY HOP DONG THI CONG TRAM BTS
--  Version: 2.0 - Thiết kế lại
-- ==================================================================================

CREATE DATABASE IF NOT EXISTS quanly_bts
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE quanly_bts;

-- ==================================================================================
--  1. BẢNG: nguoidung (Giữ nguyên)
-- ==================================================================================
CREATE TABLE nguoidung (
  id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  ten           VARCHAR(255) NOT NULL,
  email         VARCHAR(255) NOT NULL UNIQUE,
  matkhau_hash  VARCHAR(255) NOT NULL,
  vaitro        ENUM('admin','qlda','ktv','chudautu') NOT NULL DEFAULT 'ktv',
  la_admin      TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'Là admin (1 = admin, 0 = không phải admin)',
  ngaytao       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ngaysua       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==================================================================================
--  2. BẢNG: khuvuc (Khu vực - MỚI)
-- ==================================================================================
CREATE TABLE khuvuc (
  id         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  ma         VARCHAR(50) NOT NULL UNIQUE,
  ten        VARCHAR(255) NOT NULL,
  mota       TEXT NULL,
  ngaytao    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ngaysua    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
COMMENT='Khu vực (Miền Bắc, Miền Trung, Miền Nam...)';

-- ==================================================================================
--  3. BẢNG: tinhthanh (Tỉnh - Cập nhật: thêm khuvuc_id)
-- ==================================================================================
CREATE TABLE tinhthanh (
  id         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  ma         VARCHAR(50) NOT NULL UNIQUE,
  ten        VARCHAR(255) NOT NULL,
  khuvuc_id  INT UNSIGNED NOT NULL,
  ngaytao    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ngaysua    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_tinh_khuvuc (khuvuc_id),
  CONSTRAINT fk_tinh_khuvuc
    FOREIGN KEY (khuvuc_id) REFERENCES khuvuc(id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
COMMENT='Tỉnh thành - Một khu vực chứa nhiều tỉnh';

-- ==================================================================================
--  4. BẢNG: tram (Trạm - Giữ nguyên cấu trúc)
-- ==================================================================================
CREATE TABLE tram (
  id             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  matram         VARCHAR(100) NOT NULL UNIQUE,
  tinhthanh_id   INT UNSIGNED NOT NULL,
  diachi         TEXT NULL,
  lat            DOUBLE NULL,
  lng            DOUBLE NULL,
  loaiproject    ENUM('btsmoi','kienco') NOT NULL,
  ngaytao        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ngaysua        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_tram_tinh (tinhthanh_id),
  CONSTRAINT fk_tram_tinhthanh
    FOREIGN KEY (tinhthanh_id) REFERENCES tinhthanh(id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
COMMENT='Trạm - Một tỉnh chứa nhiều trạm';

-- ==================================================================================
--  5. BẢNG: duan (Dự án - MỚI)
-- ==================================================================================
CREATE TABLE duan (
  id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  maduan      VARCHAR(100) NOT NULL UNIQUE,
  tenduan     VARCHAR(255) NOT NULL,
  mota        TEXT NULL,
  ngaytao     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ngaysua     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
COMMENT='Dự án';

-- ==================================================================================
--  6. BẢNG: hopdong (Hợp đồng - Cập nhật: thêm duan_id, bỏ tram_id)
-- ==================================================================================
CREATE TABLE hopdong (
  id             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  duan_id        BIGINT UNSIGNED NOT NULL,
  sohopdong      VARCHAR(255) NOT NULL,
  chudautu       VARCHAR(255) NOT NULL,
  ngayky         DATE NOT NULL,
  tonggiatri     DECIMAL(18,2) NOT NULL DEFAULT 0.00,
  trangthai      ENUM('dangxuly','hoanthanh','tretien_do') NOT NULL DEFAULT 'dangxuly',
  daxoa          TINYINT(1) NOT NULL DEFAULT 0,
  ngaytao        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ngaysua        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_hopdong_duan (duan_id),
  CONSTRAINT fk_hopdong_duan
    FOREIGN KEY (duan_id) REFERENCES duan(id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
COMMENT='Hợp đồng - Một hợp đồng thuộc một dự án';

-- ==================================================================================
--  7. BẢNG: hopdong_tram (Liên kết hợp đồng - trạm - MỚI)
-- ==================================================================================
CREATE TABLE hopdong_tram (
  id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  hopdong_id  BIGINT UNSIGNED NOT NULL,
  tram_id     BIGINT UNSIGNED NOT NULL,
  ngaytao     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_hopdong_tram (hopdong_id, tram_id),
  KEY idx_hdt_hd (hopdong_id),
  KEY idx_hdt_tram (tram_id),
  CONSTRAINT fk_hdt_hopdong
    FOREIGN KEY (hopdong_id) REFERENCES hopdong(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_hdt_tram
    FOREIGN KEY (tram_id) REFERENCES tram(id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
COMMENT='Liên kết hợp đồng - trạm: Một hợp đồng có nhiều trạm';

-- ==================================================================================
--  8. BẢNG: thuviencot (Thư viện cột - GIỮ NGUYÊN)
-- ==================================================================================
CREATE TABLE thuviencot (
  id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  macot      VARCHAR(100) NOT NULL UNIQUE,
  tencot     VARCHAR(255) NOT NULL,
  vitri      VARCHAR(50) NULL COMMENT 'Vị trí lắp đặt (Dưới đất, Trên mái)',
  cao        INT NULL,
  giadonvi   DECIMAL(18,2) NOT NULL DEFAULT 0.00,
  mota       TEXT NULL,
  ngaytao    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
COMMENT='Thư viện cột - GIỮ NGUYÊN';

-- ==================================================================================
--  9. BẢNG: thuvien_volume_khac (Thư viện volume khác - GIỮ NGUYÊN)
-- ==================================================================================
CREATE TABLE thuvien_volume_khac (
  id           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  mavolume     VARCHAR(100) NOT NULL UNIQUE,
  tenvolume    VARCHAR(255) NOT NULL,
  mota         TEXT NULL,
  giadonvi     DECIMAL(18,2) NOT NULL DEFAULT 0.00,
  ngaytao      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
COMMENT='Thư viện volume khác - GIỮ NGUYÊN';

-- ==================================================================================
--  10. BẢNG: tram_cot (Volume cột của trạm - MỚI)
-- ==================================================================================
CREATE TABLE tram_cot (
  id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  tram_id     BIGINT UNSIGNED NOT NULL,
  cot_id      BIGINT UNSIGNED NOT NULL,
  soluong     INT NOT NULL DEFAULT 0,
  tongtien    DECIMAL(18,2) NOT NULL DEFAULT 0.00,
  ngaytao     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ngaysua     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_tram_cot (tram_id, cot_id),
  KEY idx_tramcot_tram (tram_id),
  KEY idx_tramcot_cot (cot_id),
  CONSTRAINT fk_tramcot_tram
    FOREIGN KEY (tram_id) REFERENCES tram(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_tramcot_cot
    FOREIGN KEY (cot_id) REFERENCES thuviencot(id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
COMMENT='Volume cột của trạm - Mỗi trạm có volume cột nhất định';

-- ==================================================================================
--  11. BẢNG: tram_volume_khac (Volume khác của trạm - MỚI)
-- ==================================================================================
CREATE TABLE tram_volume_khac (
  id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  tram_id     BIGINT UNSIGNED NOT NULL,
  volume_id   BIGINT UNSIGNED NOT NULL,
  soluong     INT NOT NULL DEFAULT 0,
  tongtien    DECIMAL(18,2) NOT NULL DEFAULT 0.00,
  ngaytao     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ngaysua     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_tram_volume (tram_id, volume_id),
  KEY idx_tramvol_tram (tram_id),
  KEY idx_tramvol_volume (volume_id),
  CONSTRAINT fk_tramvol_tram
    FOREIGN KEY (tram_id) REFERENCES tram(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_tramvol_volume
    FOREIGN KEY (volume_id) REFERENCES thuvien_volume_khac(id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
COMMENT='Volume khác của trạm - Mỗi trạm có volume khác nhất định';

-- ==================================================================================
--  12. BẢNG: tram_tiendo (Tiến độ trạm - MỚI)
-- ==================================================================================
CREATE TABLE tram_tiendo (
  id               BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  tram_id          BIGINT UNSIGNED NOT NULL,
  hopdong_id       BIGINT UNSIGNED NOT NULL,
  -- KCS
  ngay_kcs         DATE NULL,
  trangthai_kcs    ENUM('chua_bat_dau','dang_thuc_hien','hoan_thanh') NOT NULL DEFAULT 'chua_bat_dau',
  phantram_kcs     FLOAT NOT NULL DEFAULT 0 COMMENT 'Phần trăm hoàn thành KCS',
  -- Dự toán
  ngay_du_toan     DATE NULL,
  trangthai_dutoan ENUM('chua_bat_dau','dang_thuc_hien','hoan_thanh') NOT NULL DEFAULT 'chua_bat_dau',
  phantram_dutoan  FLOAT NOT NULL DEFAULT 0 COMMENT 'Phần trăm hoàn thành dự toán',
  -- Khảo sát
  ngay_khao_sat    DATE NULL,
  nguoi_ks_id      BIGINT UNSIGNED NULL,
  trangthai_ks     ENUM('chua_bat_dau','dang_thuc_hien','hoan_thanh') NOT NULL DEFAULT 'chua_bat_dau',
  phantram_ks      FLOAT NOT NULL DEFAULT 0 COMMENT 'Phần trăm hoàn thành khảo sát',
  -- Tình trạng và vướng mắc
  tinh_trang       ENUM('binh_thuong','vuong_mac','tam_dung') NOT NULL DEFAULT 'binh_thuong',
  vuong_mac        TEXT NULL COMMENT 'Mô tả vướng mắc nếu có',
  ngaytao          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ngaysua          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_tram_hopdong (tram_id, hopdong_id),
  KEY idx_tiendo_tram (tram_id),
  KEY idx_tiendo_hd (hopdong_id),
  KEY idx_tiendo_ks (nguoi_ks_id),
  CONSTRAINT fk_tiendo_tram
    FOREIGN KEY (tram_id) REFERENCES tram(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_tiendo_hopdong
    FOREIGN KEY (hopdong_id) REFERENCES hopdong(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_tiendo_nguoiks
    FOREIGN KEY (nguoi_ks_id) REFERENCES nguoidung(id)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
COMMENT='Tiến độ hoàn thành hợp đồng của từng trạm (KCS, Dự toán, Khảo sát, Tình trạng)';

-- ==================================================================================
--  13. BẢNG: tram_thucte_cot (Volume thực tế cột của trạm sau khảo sát - MỚI)
-- ==================================================================================
CREATE TABLE tram_thucte_cot (
  id               BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  tram_id          BIGINT UNSIGNED NOT NULL,
  hopdong_id       BIGINT UNSIGNED NOT NULL,
  cot_id           BIGINT UNSIGNED NOT NULL,
  soluong_thucte   INT NOT NULL DEFAULT 0,
  nguoinhap_id     BIGINT UNSIGNED NOT NULL,
  ngaytao          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ngaysua          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_tram_thucte_cot (tram_id, hopdong_id, cot_id),
  KEY idx_thucte_tram (tram_id),
  KEY idx_thucte_hd (hopdong_id),
  KEY idx_thucte_cot (cot_id),
  KEY idx_thucte_user (nguoinhap_id),
  CONSTRAINT fk_thucte_tram
    FOREIGN KEY (tram_id) REFERENCES tram(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_thucte_hopdong
    FOREIGN KEY (hopdong_id) REFERENCES hopdong(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_thucte_cot
    FOREIGN KEY (cot_id) REFERENCES thuviencot(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_thucte_user
    FOREIGN KEY (nguoinhap_id) REFERENCES nguoidung(id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
COMMENT='Volume thực tế cột của trạm sau khảo sát';

-- ==================================================================================
--  14. BẢNG: tram_thucte_volume_khac (Volume thực tế khác của trạm sau khảo sát - MỚI)
-- ==================================================================================
CREATE TABLE tram_thucte_volume_khac (
  id               BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  tram_id          BIGINT UNSIGNED NOT NULL,
  hopdong_id       BIGINT UNSIGNED NOT NULL,
  volume_id        BIGINT UNSIGNED NOT NULL,
  soluong_thucte   INT NOT NULL DEFAULT 0,
  nguoinhap_id     BIGINT UNSIGNED NOT NULL,
  ngaytao          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ngaysua          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_tram_thucte_vol (tram_id, hopdong_id, volume_id),
  KEY idx_thuctevol_tram (tram_id),
  KEY idx_thuctevol_hd (hopdong_id),
  KEY idx_thuctevol_volume (volume_id),
  KEY idx_thuctevol_user (nguoinhap_id),
  CONSTRAINT fk_thuctevol_tram
    FOREIGN KEY (tram_id) REFERENCES tram(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_thuctevol_hopdong
    FOREIGN KEY (hopdong_id) REFERENCES hopdong(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_thuctevol_volume
    FOREIGN KEY (volume_id) REFERENCES thuvien_volume_khac(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_thuctevol_user
    FOREIGN KEY (nguoinhap_id) REFERENCES nguoidung(id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
COMMENT='Volume thực tế khác của trạm sau khảo sát';

-- ==================================================================================
--  15. BẢNG: chenhlech_hopdong (Chênh lệch hợp đồng theo ngày - MỚI)
-- ==================================================================================
CREATE TABLE chenhlech_hopdong (
  id                    BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  hopdong_id            BIGINT UNSIGNED NOT NULL,
  ngay                  DATE NOT NULL,
  -- Chênh lệch cột
  chenhlech_cot         INT NOT NULL DEFAULT 0 COMMENT 'Chênh lệch số lượng cột (thực tế - dự toán)',
  phantram_chenhlech_cot FLOAT NOT NULL DEFAULT 0 COMMENT 'Phần trăm chênh lệch cột',
  -- Chênh lệch volume khác
  chenhlech_volume_khac INT NOT NULL DEFAULT 0 COMMENT 'Chênh lệch số lượng volume khác',
  phantram_chenhlech_vol FLOAT NOT NULL DEFAULT 0 COMMENT 'Phần trăm chênh lệch volume khác',
  -- Chênh lệch tổng giá trị
  chenhlech_tongtien    DECIMAL(18,2) NOT NULL DEFAULT 0.00 COMMENT 'Chênh lệch tổng tiền',
  phantram_chenhlech_tien FLOAT NOT NULL DEFAULT 0 COMMENT 'Phần trăm chênh lệch tiền',
  nguoinhap_id          BIGINT UNSIGNED NOT NULL,
  ghi_chu               TEXT NULL,
  ngaytao               DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_chenhlech_hd_ngay (hopdong_id, ngay),
  KEY idx_chenhlech_hd (hopdong_id),
  KEY idx_chenhlech_ngay (ngay),
  KEY idx_chenhlech_user (nguoinhap_id),
  CONSTRAINT fk_chenhlech_hopdong
    FOREIGN KEY (hopdong_id) REFERENCES hopdong(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_chenhlech_user
    FOREIGN KEY (nguoinhap_id) REFERENCES nguoidung(id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
COMMENT='Chênh lệch hợp đồng theo ngày - Cập nhật chênh lệch của các hợp đồng theo ngày';

-- ==================================================================================
--  16. BẢNG: lichsu (Lịch sử thay đổi - Giữ nguyên)
-- ==================================================================================
CREATE TABLE lichsu (
  id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  nguoidung_id  BIGINT UNSIGNED NULL,
  hanhdong      VARCHAR(255) NOT NULL,
  dulieu_truoc  JSON NULL,
  dulieu_sau    JSON NULL,
  ngaytao       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_lichsu_user (nguoidung_id),
  CONSTRAINT fk_lichsu_user
    FOREIGN KEY (nguoidung_id) REFERENCES nguoidung(id)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
COMMENT='Lịch sử thay đổi - Log các thao tác';

-- ==================================================================================
--  GHI CHÚ:
--  - Volume hợp đồng = Tổng volume của các trạm thuộc hợp đồng đó
--    (tính từ tram_cot và tram_volume_khac)
--  - Volume thực tế hợp đồng = Tổng volume thực tế sau khảo sát của các trạm
--    (tính từ tram_thucte_cot và tram_thucte_volume_khac)
--  - Bảng chenhlech_hopdong được cập nhật theo ngày để theo dõi chênh lệch
-- ==================================================================================

