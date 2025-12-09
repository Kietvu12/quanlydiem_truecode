-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 08, 2025 at 06:08 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `quanly_bts`
--

-- --------------------------------------------------------

--
-- Table structure for table `hopdong`
--

CREATE TABLE `hopdong` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tram_id` bigint(20) UNSIGNED NOT NULL,
  `sohopdong` varchar(255) NOT NULL,
  `chudautu` varchar(255) NOT NULL,
  `ngayky` date NOT NULL,
  `tonggiatri` decimal(18,2) NOT NULL DEFAULT 0.00,
  `trangthai` enum('dangxuly','hoanthanh','tretien_do') NOT NULL DEFAULT 'dangxuly',
  `daxoa` tinyint(1) NOT NULL DEFAULT 0,
  `ngaytao` datetime NOT NULL DEFAULT current_timestamp(),
  `ngaysua` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `hopdong`
--

INSERT INTO `hopdong` (`id`, `tram_id`, `sohopdong`, `chudautu`, `ngayky`, `tonggiatri`, `trangthai`, `daxoa`, `ngaytao`, `ngaysua`) VALUES
(1, 2, '1402052-BQLDA/VTNet-ANTHANHSON/TV2025', 'VTnet', '2025-12-04', 10000000.00, 'dangxuly', 1, '2025-12-04 22:44:54', '2025-12-08 11:33:00');

-- --------------------------------------------------------

--
-- Table structure for table `hopdong_cot`
--

CREATE TABLE `hopdong_cot` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `hopdong_id` bigint(20) UNSIGNED NOT NULL,
  `cot_id` bigint(20) UNSIGNED NOT NULL,
  `soluong` int(11) NOT NULL DEFAULT 0,
  `tongtien` decimal(18,2) NOT NULL DEFAULT 0.00,
  `ngaytao` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `hopdong_volume_khac`
--

CREATE TABLE `hopdong_volume_khac` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `hopdong_id` bigint(20) UNSIGNED NOT NULL,
  `volume_id` bigint(20) UNSIGNED NOT NULL COMMENT 'FK đến thuvien_volume_khac',
  `soluong` int(11) NOT NULL DEFAULT 0 COMMENT 'Số lượng',
  `tongtien` decimal(18,2) NOT NULL DEFAULT 0.00 COMMENT 'Tổng tiền',
  `ngaytao` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Volume khác trong hợp đồng';

-- --------------------------------------------------------

--
-- Table structure for table `kstk_thucte`
--

CREATE TABLE `kstk_thucte` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `hopdong_id` bigint(20) UNSIGNED NOT NULL,
  `cot_id` bigint(20) UNSIGNED NOT NULL COMMENT 'FK đến thuviencot - chỉ dành cho cột',
  `soluong_thucte` int(11) NOT NULL DEFAULT 0,
  `chenhlech` int(11) NOT NULL DEFAULT 0,
  `phantram_chenhlech` float NOT NULL DEFAULT 0,
  `nguoinhap_id` bigint(20) UNSIGNED NOT NULL,
  `ngaytao` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `kstk_thucte_volume_khac`
--

CREATE TABLE `kstk_thucte_volume_khac` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `hopdong_id` bigint(20) UNSIGNED NOT NULL,
  `volume_id` bigint(20) UNSIGNED NOT NULL COMMENT 'FK đến thuvien_volume_khac',
  `soluong_thucte` int(11) NOT NULL DEFAULT 0 COMMENT 'Số lượng thực tế',
  `chenhlech` int(11) NOT NULL DEFAULT 0 COMMENT 'Chênh lệch',
  `phantram_chenhlech` float NOT NULL DEFAULT 0 COMMENT 'Phần trăm chênh lệch',
  `nguoinhap_id` bigint(20) UNSIGNED NOT NULL COMMENT 'Người nhập KSTK',
  `ngaytao` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Khối lượng thực tế KSTK cho volume khác';

-- --------------------------------------------------------

--
-- Table structure for table `lichsu`
--

CREATE TABLE `lichsu` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nguoidung_id` bigint(20) UNSIGNED DEFAULT NULL,
  `hanhdong` varchar(255) NOT NULL,
  `dulieu_truoc` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`dulieu_truoc`)),
  `dulieu_sau` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`dulieu_sau`)),
  `ngaytao` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `lichsu`
--

INSERT INTO `lichsu` (`id`, `nguoidung_id`, `hanhdong`, `dulieu_truoc`, `dulieu_sau`, `ngaytao`) VALUES
(1, 1, 'Tạo trạm mới: NAN1927', NULL, '{\"matram\":\"NAN1927\",\"tinhthanh_id\":12,\"diachi\":null,\"loaiproject\":\"btsmoi\"}', '2025-12-04 22:35:09'),
(2, 1, 'Tạo trạm mới: NAN1928', NULL, '{\"matram\":\"NAN1928\",\"tinhthanh_id\":20,\"diachi\":\"Nghệ An\",\"loaiproject\":\"btsmoi\"}', '2025-12-04 22:35:35'),
(3, 1, 'Tạo hợp đồng mới: 1402052-BQLDA/VTNet-ANTHANHSON/TV2025', NULL, '{\"tram_id\":2,\"sohopdong\":\"1402052-BQLDA/VTNet-ANTHANHSON/TV2025\",\"chudautu\":\"VTnet\",\"ngayky\":\"2025-12-04\",\"tonggiatri\":10000000}', '2025-12-04 22:44:54'),
(4, 1, 'Tạo cột mới: Cột cóc H=3m trên mái', NULL, '{\"macot\":\"COT-001\",\"tencot\":\"Cột cóc H=3m trên mái\",\"loaicot\":\"Dưới đất\",\"cao\":3,\"giadonvi\":10000000,\"mota\":null}', '2025-12-04 22:51:04'),
(5, 1, 'Tạo volume khác mới: Phòng máy', NULL, '{\"mavolume\":\"VOL001\",\"tenvolume\":\"Phòng máy\",\"loaivolume\":\"Phòng máy\",\"donvitinh\":\"cái\",\"giadonvi\":12,\"mota\":null}', '2025-12-04 22:53:18'),
(6, 1, 'Cập nhật cột ID: 1', '{\"id\":1,\"macot\":\"COT-001\",\"tencot\":\"Cột cóc H=3m trên mái\",\"cao\":3,\"mota\":null,\"ngaytao\":\"2025-12-04T15:51:04.000Z\",\"vitri\":null}', '{\"macot\":\"COT-001\",\"tencot\":\"Cột cóc H=3m trên mái\",\"vitri\":\"Trên mái\",\"cao\":3,\"mota\":null}', '2025-12-04 23:01:25'),
(7, 1, 'Tạo hợp đồng mới: qưewqe', NULL, '{\"tram_id\":2,\"sohopdong\":\"qưewqe\",\"chudautu\":\"eqew\",\"ngayky\":\"2025-12-05\",\"tonggiatri\":1111111}', '2025-12-04 23:09:59'),
(8, 1, 'Thêm cột vào hợp đồng 2', NULL, '{\"cot_id\":1,\"soluong\":4,\"tongtien\":0}', '2025-12-04 23:13:51'),
(9, 1, 'Xóa cột khỏi hợp đồng 2', '{\"id\":1,\"hopdong_id\":2,\"cot_id\":1,\"soluong\":4,\"tongtien\":\"0.00\",\"ngaytao\":\"2025-12-04T16:13:51.000Z\"}', NULL, '2025-12-04 23:14:49'),
(10, 1, 'Cập nhật cột ID: 1', '{\"id\":1,\"macot\":\"COT-001\",\"tencot\":\"Cột cóc H=3m trên mái\",\"cao\":3,\"mota\":null,\"ngaytao\":\"2025-12-04T15:51:04.000Z\",\"vitri\":\"Trên mái\",\"giadonvi\":\"0.00\"}', '{\"macot\":\"COT-001\",\"tencot\":\"Cột cóc H=3m trên mái\",\"vitri\":\"Trên mái\",\"cao\":3,\"giadonvi\":1000000,\"mota\":null}', '2025-12-04 23:26:41'),
(11, 1, 'Thêm cột vào hợp đồng 2', NULL, '{\"cot_id\":1,\"soluong\":4,\"tongtien\":4000000}', '2025-12-04 23:30:24'),
(12, 1, 'Xóa cột khỏi hợp đồng 2', '{\"id\":2,\"hopdong_id\":2,\"cot_id\":1,\"soluong\":4,\"tongtien\":\"4000000.00\",\"ngaytao\":\"2025-12-04T16:30:24.000Z\"}', NULL, '2025-12-04 23:30:40'),
(13, 1, 'Thêm cột vào hợp đồng 2', NULL, '{\"cot_id\":1,\"soluong\":1,\"tongtien\":1000000}', '2025-12-04 23:34:53'),
(14, 1, 'Tạo người dùng mới: ktv@example.com', NULL, '{\"ten\":\"Kĩ Thuật Viên\",\"email\":\"ktv@example.com\",\"vaitro\":\"admin\"}', '2025-12-08 11:23:16'),
(15, 1, 'Tạo tiến độ hợp đồng 2', NULL, '{\"ngayks\":\"2025-12-08\",\"ngaytk\":\"\",\"ngaydutoan\":\"\",\"ngaypheduyet\":\"\",\"ngaynhan_dhtc\":\"\",\"trangthai_tc\":\"\",\"nguoiks_id\":\"2\"}', '2025-12-08 11:28:00'),
(16, 1, 'Xóa trạm ID: 1', '{\"id\":1,\"matram\":\"NAN1927\",\"tinhthanh_id\":12,\"diachi\":null,\"lat\":null,\"lng\":null,\"loaiproject\":\"btsmoi\",\"ngaytao\":\"2025-12-04T15:35:09.000Z\",\"ngaysua\":\"2025-12-04T15:35:09.000Z\"}', NULL, '2025-12-08 11:32:48'),
(17, 1, 'Xóa hợp đồng ID: 2', '{\"id\":2,\"tram_id\":2,\"sohopdong\":\"qưewqe\",\"chudautu\":\"eqew\",\"ngayky\":\"2025-12-04T17:00:00.000Z\",\"tonggiatri\":\"1000000.00\",\"trangthai\":\"dangxuly\",\"daxoa\":0,\"ngaytao\":\"2025-12-04T16:09:59.000Z\",\"ngaysua\":\"2025-12-04T16:34:53.000Z\"}', NULL, '2025-12-08 11:32:58'),
(18, 1, 'Xóa hợp đồng ID: 1', '{\"id\":1,\"tram_id\":2,\"sohopdong\":\"1402052-BQLDA/VTNet-ANTHANHSON/TV2025\",\"chudautu\":\"VTnet\",\"ngayky\":\"2025-12-03T17:00:00.000Z\",\"tonggiatri\":\"10000000.00\",\"trangthai\":\"dangxuly\",\"daxoa\":0,\"ngaytao\":\"2025-12-04T15:44:54.000Z\",\"ngaysua\":\"2025-12-04T15:44:54.000Z\"}', NULL, '2025-12-08 11:33:00'),
(19, 1, 'Tạo hợp đồng mới: 1402039-BQLDA/VTNet-ANTHANHSON/TV2025', NULL, '{\"tram_id\":2,\"sohopdong\":\"1402039-BQLDA/VTNet-ANTHANHSON/TV2025\",\"chudautu\":\"VTNet\",\"ngayky\":\"2025-12-08\",\"tonggiatri\":650000000}', '2025-12-08 11:34:58'),
(20, 1, 'Tạo tiến độ hợp đồng 3', NULL, '{\"ngayks\":\"2025-12-08\",\"ngaytk\":\"\",\"ngaydutoan\":\"\",\"ngaypheduyet\":\"\",\"ngaynhan_dhtc\":\"\",\"trangthai_tc\":\"\",\"nguoiks_id\":\"2\"}', '2025-12-08 11:35:15'),
(21, 1, 'Xóa cột ID: 1', '{\"id\":1,\"macot\":\"COT-001\",\"tencot\":\"Cột cóc H=3m trên mái\",\"cao\":3,\"mota\":null,\"ngaytao\":\"2025-12-04T15:51:04.000Z\",\"vitri\":\"Trên mái\",\"giadonvi\":\"1000000.00\"}', NULL, '2025-12-08 11:38:35'),
(22, 1, 'Tạo cột mới: Cột cóc H=3m trên mái', NULL, '{\"macot\":\"COT001\",\"tencot\":\"Cột cóc H=3m trên mái\",\"vitri\":\"Trên mái\",\"cao\":3,\"giadonvi\":10,\"mota\":null}', '2025-12-08 11:39:15'),
(23, 1, 'Tạo cột mới: Cột cóc H=5m trên mái', NULL, '{\"macot\":\"COT002Cột cóc H=3m trên mái\",\"tencot\":\"Cột cóc H=5m trên mái\",\"vitri\":\"Trên mái\",\"cao\":5,\"giadonvi\":10,\"mota\":null}', '2025-12-08 11:40:10'),
(24, 1, 'Tạo cột mới: Cột cóc H=6m trên mái', NULL, '{\"macot\":\"COT003\",\"tencot\":\"Cột cóc H=6m trên mái\",\"vitri\":\"Trên mái\",\"cao\":6,\"giadonvi\":0,\"mota\":null}', '2025-12-08 11:40:27'),
(25, 1, 'Tạo cột mới: Cột chống cứng H=9m trên mái', NULL, '{\"macot\":\"COT004\",\"tencot\":\"Cột chống cứng H=9m trên mái\",\"vitri\":\"Trên mái\",\"cao\":9,\"giadonvi\":10,\"mota\":null}', '2025-12-08 11:40:50'),
(26, 1, 'Tạo cột mới: Cột chống cứng H=9m trên mái', NULL, '{\"macot\":\"COT005\",\"tencot\":\"Cột chống cứng H=9m trên mái\",\"vitri\":\"Trên mái\",\"cao\":6,\"giadonvi\":10,\"mota\":null}', '2025-12-08 11:41:43'),
(27, 1, 'Tạo cột mới: Monopole H=9m trên mái', NULL, '{\"macot\":\"COT006\",\"tencot\":\"Monopole H=9m trên mái\",\"vitri\":\"Trên mái\",\"cao\":9,\"giadonvi\":0,\"mota\":null}', '2025-12-08 11:42:19'),
(28, 1, 'Tạo cột mới: Monopole H=6m trên mái', NULL, '{\"macot\":\"COT007\",\"tencot\":\"Monopole H=6m trên mái\",\"vitri\":\"Trên mái\",\"cao\":6,\"giadonvi\":0,\"mota\":null}', '2025-12-08 11:42:48'),
(29, 1, 'Tạo cột mới: Monopole H=25m dưới đất', NULL, '{\"macot\":\"COT008\",\"tencot\":\"Monopole H=25m dưới đất\",\"vitri\":\"Trên mái\",\"cao\":25,\"giadonvi\":10,\"mota\":null}', '2025-12-08 11:46:13'),
(30, 1, 'Tạo cột mới: Monopole H=28m dưới đất', NULL, '{\"macot\":\"COT009\",\"tencot\":\"Monopole H=28m dưới đất\",\"vitri\":\"Dưới đất\",\"cao\":25,\"giadonvi\":10,\"mota\":null}', '2025-12-08 11:46:39'),
(31, 1, 'Tạo cột mới: Monopole H=30m dưới đất', NULL, '{\"macot\":\"COT010\",\"tencot\":\"Monopole H=30m dưới đất\",\"vitri\":\"Dưới đất\",\"cao\":null,\"giadonvi\":0,\"mota\":null}', '2025-12-08 11:47:03'),
(32, 1, 'Tạo cột mới: Monopole H=36m dưới đất', NULL, '{\"macot\":\"COT011\",\"tencot\":\"Monopole H=36m dưới đất\",\"vitri\":\"Dưới đất\",\"cao\":36,\"giadonvi\":0,\"mota\":null}', '2025-12-08 11:47:23'),
(33, 1, 'Xóa volume khác ID: 1', '{\"id\":1,\"mavolume\":\"VOL001\",\"tenvolume\":\"Phòng máy\",\"mota\":null,\"ngaytao\":\"2025-12-04T15:53:18.000Z\",\"giadonvi\":\"0.00\"}', NULL, '2025-12-08 11:47:31'),
(34, 1, 'Tạo cột mới: Dây co 300x300 H=12m trên mái', NULL, '{\"macot\":\"COT012\",\"tencot\":\"Dây co 300x300 H=12m trên mái\",\"vitri\":\"Trên mái\",\"cao\":12,\"giadonvi\":0,\"mota\":null}', '2025-12-08 11:48:18'),
(35, 1, 'Tạo cột mới: Dây co 300x300 H=15m trên mái', NULL, '{\"macot\":\"COT013\",\"tencot\":\"Dây co 300x300 H=15m trên mái\",\"vitri\":\"Trên mái\",\"cao\":15,\"giadonvi\":0,\"mota\":null}', '2025-12-08 11:48:35'),
(36, 1, 'Tạo cột mới: Dây co 300x300 H=18m trên mái', NULL, '{\"macot\":\"COT014\",\"tencot\":\"Dây co 300x300 H=18m trên mái\",\"vitri\":\"Trên mái\",\"cao\":18,\"giadonvi\":0,\"mota\":null}', '2025-12-08 11:48:52'),
(37, 1, 'Tạo cột mới: Dây co 600x600 H=18m dưới đất', NULL, '{\"macot\":\"COT015\",\"tencot\":\"Dây co 600x600 H=18m dưới đất\",\"vitri\":\"Dưới đất\",\"cao\":18,\"giadonvi\":0,\"mota\":null}', '2025-12-08 11:49:17'),
(38, 1, 'Tạo cột mới: Dây co 600x600 H=21m dưới đất', NULL, '{\"macot\":\"COT018\",\"tencot\":\"Dây co 600x600 H=21m dưới đất\",\"vitri\":\"Dưới đất\",\"cao\":21,\"giadonvi\":0,\"mota\":null}', '2025-12-08 11:50:07'),
(39, 1, 'Tạo cột mới: Dây co 600x600 H=24m dưới đất', NULL, '{\"macot\":\"COT019\",\"tencot\":\"Dây co 600x600 H=24m dưới đất\",\"vitri\":\"Dưới đất\",\"cao\":24,\"giadonvi\":0,\"mota\":null}', '2025-12-08 11:50:27'),
(40, 1, 'Tạo cột mới: Dây co 600x600 H=30m dưới đất', NULL, '{\"macot\":\"COT020\",\"tencot\":\"Dây co 600x600 H=30m dưới đất\",\"vitri\":\"Dưới đất\",\"cao\":30,\"giadonvi\":0,\"mota\":null}', '2025-12-08 11:50:52'),
(41, 1, 'Tạo cột mới: Dây co 600x600 H=36m dưới đất', NULL, '{\"macot\":\"COT021\",\"tencot\":\"Dây co 600x600 H=36m dưới đất\",\"vitri\":\"Dưới đất\",\"cao\":36,\"giadonvi\":0,\"mota\":null}', '2025-12-08 11:51:14'),
(42, 1, 'Tạo cột mới: Dây co 600x600 H=42m dưới đất', NULL, '{\"macot\":\"COT022\",\"tencot\":\"Dây co 600x600 H=42m dưới đất\",\"vitri\":\"Dưới đất\",\"cao\":42,\"giadonvi\":0,\"mota\":null}', '2025-12-08 11:51:32'),
(43, 1, 'Tạo cột mới: Bê tông ly tâm H=18m dưới đất', NULL, '{\"macot\":\"COT023\",\"tencot\":\"Bê tông ly tâm H=18m dưới đất\",\"vitri\":\"Dưới đất\",\"cao\":18,\"giadonvi\":0,\"mota\":null}', '2025-12-08 11:51:50'),
(44, 1, 'Tạo cột mới: Tự đứng H=12m trên mái', NULL, '{\"macot\":\"COT025\",\"tencot\":\"Tự đứng H=12m trên mái\",\"vitri\":\"Trên mái\",\"cao\":12,\"giadonvi\":0,\"mota\":null}', '2025-12-08 11:52:12'),
(45, 1, 'Tạo cột mới: Tự đứng H=15m trên mái', NULL, '{\"macot\":\"COT026\",\"tencot\":\"Tự đứng H=15m trên mái\",\"vitri\":\"Trên mái\",\"cao\":15,\"giadonvi\":0,\"mota\":null}', '2025-12-08 11:52:27'),
(46, 1, 'Tạo cột mới: Tự đứng H=18m trên mái', NULL, '{\"macot\":\"COT028\",\"tencot\":\"Tự đứng H=18m trên mái\",\"vitri\":\"Trên mái\",\"cao\":18,\"giadonvi\":0,\"mota\":null}', '2025-12-08 11:52:52'),
(47, 1, 'Tạo cột mới: Tự đứng 600x600 H=12m dưới đất', NULL, '{\"macot\":\"COT027\",\"tencot\":\"Tự đứng 600x600 H=12m dưới đất\",\"vitri\":\"Dưới đất\",\"cao\":12,\"giadonvi\":0,\"mota\":null}', '2025-12-08 11:53:05'),
(48, 1, 'Tạo cột mới: Tự đứng 600x600 H=18m dưới đất', NULL, '{\"macot\":\"COT029\",\"tencot\":\"Tự đứng 600x600 H=18m dưới đất\",\"vitri\":\"Dưới đất\",\"cao\":18,\"giadonvi\":0,\"mota\":null}', '2025-12-08 11:53:44'),
(49, 1, 'Tạo cột mới: Tự đứng 600x600 H=18m dưới đất', NULL, '{\"macot\":\"COT030\",\"tencot\":\"Tự đứng 600x600 H=18m dưới đất\",\"vitri\":\"Dưới đất\",\"cao\":18,\"giadonvi\":0,\"mota\":null}', '2025-12-08 11:54:01'),
(50, 1, 'Xóa cột ID: 32', '{\"id\":32,\"macot\":\"COT030\",\"tencot\":\"Tự đứng 600x600 H=18m dưới đất\",\"cao\":18,\"mota\":null,\"ngaytao\":\"2025-12-08T04:54:01.000Z\",\"vitri\":\"Dưới đất\",\"giadonvi\":\"0.00\"}', NULL, '2025-12-08 11:54:12'),
(51, 1, 'Tạo cột mới: Tự đứng 3 chân thân 1000x1000 H=18m dưới đất', NULL, '{\"macot\":\"COT030\",\"tencot\":\"Tự đứng 3 chân thân 1000x1000 H=18m dưới đất\",\"vitri\":\"Dưới đất\",\"cao\":18,\"giadonvi\":0,\"mota\":null}', '2025-12-08 11:54:39'),
(52, 1, 'Tạo cột mới: Tự đứng 3 chân thân 1000x1000 H=24m dưới đất', NULL, '{\"macot\":\"COT031\",\"tencot\":\"Tự đứng 3 chân thân 1000x1000 H=24m dưới đất\",\"vitri\":\"Dưới đất\",\"cao\":24,\"giadonvi\":0,\"mota\":null}', '2025-12-08 11:55:03'),
(53, 1, 'Tạo cột mới: Tự đứng 3 chân H=30m dưới đất', NULL, '{\"macot\":\"COT032\",\"tencot\":\"Tự đứng 3 chân H=30m dưới đất\",\"vitri\":\"Dưới đất\",\"cao\":30,\"giadonvi\":0,\"mota\":null}', '2025-12-08 11:55:19'),
(54, 1, 'Tạo cột mới: Tự đứng 3 chân H=30m dưới đất', NULL, '{\"macot\":\"COT033\",\"tencot\":\"Tự đứng 3 chân H=30m dưới đất\",\"vitri\":\"Dưới đất\",\"cao\":30,\"giadonvi\":0,\"mota\":null}', '2025-12-08 11:55:32'),
(55, 1, 'Tạo cột mới: Tự đứng 3 chân H=36m dưới đất', NULL, '{\"macot\":\"COT034\",\"tencot\":\"Tự đứng 3 chân H=36m dưới đất\",\"vitri\":\"Dưới đất\",\"cao\":36,\"giadonvi\":0,\"mota\":null}', '2025-12-08 11:55:49'),
(56, 1, 'Tạo cột mới: Tự đứng 3 chân H=42m dưới đất', NULL, '{\"macot\":\"COT035\",\"tencot\":\"Tự đứng 3 chân H=42m dưới đất\",\"vitri\":\"Dưới đất\",\"cao\":42,\"giadonvi\":0,\"mota\":null}', '2025-12-08 11:56:02'),
(57, 1, 'Tạo cột mới: Cột ngụy trang cây  cọ H=12m dưới đất', NULL, '{\"macot\":\"COT036\",\"tencot\":\"Cột ngụy trang cây  cọ H=12m dưới đất\",\"vitri\":\"Dưới đất\",\"cao\":12,\"giadonvi\":0,\"mota\":null}', '2025-12-08 11:56:18'),
(58, 1, 'Tạo cột mới: Cột ngụy trang cây thông H=30m dưới đất', NULL, '{\"macot\":\"COT037\",\"tencot\":\"Cột ngụy trang cây thông H=30m dưới đất\",\"vitri\":\"Dưới đất\",\"cao\":30,\"giadonvi\":0,\"mota\":null}', '2025-12-08 11:56:32'),
(59, 1, 'Tạo cột mới: Ngụy trang cây dừa H=25m dưới đất', NULL, '{\"macot\":\"COT038\",\"tencot\":\"Ngụy trang cây dừa H=25m dưới đất\",\"vitri\":\"Dưới đất\",\"cao\":25,\"giadonvi\":0,\"mota\":null}', '2025-12-08 11:56:53'),
(60, 1, 'Tạo cột mới: Ngụy trang cây dừa H=30m dưới đất', NULL, '{\"macot\":\"COT039\",\"tencot\":\"Ngụy trang cây dừa H=30m dưới đất\",\"vitri\":\"Dưới đất\",\"cao\":30,\"giadonvi\":0,\"mota\":null}', '2025-12-08 11:57:06'),
(61, 1, 'Tạo cột mới: Ngụy trang cây dừa H=25m dưới đất', NULL, '{\"macot\":\"COT040\",\"tencot\":\"Ngụy trang cây dừa H=25m dưới đất\",\"vitri\":\"Dưới đất\",\"cao\":25,\"giadonvi\":0,\"mota\":null}', '2025-12-08 11:57:31'),
(62, 1, 'Tạo cột mới: Ngụy trang cây dừa H=30m dưới đất', NULL, '{\"macot\":\"COT042\",\"tencot\":\"Ngụy trang cây dừa H=30m dưới đất\",\"vitri\":\"Dưới đất\",\"cao\":30,\"giadonvi\":0,\"mota\":null}', '2025-12-08 11:57:48'),
(63, 1, 'Tạo cột mới: Ngụy trang lồng đèn H=25m dưới đất', NULL, '{\"macot\":\"COT043\",\"tencot\":\"Ngụy trang lồng đèn H=25m dưới đất\",\"vitri\":\"Dưới đất\",\"cao\":25,\"giadonvi\":0,\"mota\":null}', '2025-12-08 11:58:13'),
(64, 1, 'Tạo cột mới: Ngụy trang lồng đèn H=28m dưới đất', NULL, '{\"macot\":\"COT044\",\"tencot\":\"Ngụy trang lồng đèn H=28m dưới đất\",\"vitri\":\"Dưới đất\",\"cao\":28,\"giadonvi\":0,\"mota\":null}', '2025-12-08 11:58:33'),
(65, 1, 'Tạo cột mới: Ngụy trang cánh sen H=25m dưới đất', NULL, '{\"macot\":\"COT045\",\"tencot\":\"Ngụy trang cánh sen H=25m dưới đất\",\"vitri\":\"Dưới đất\",\"cao\":25,\"giadonvi\":0,\"mota\":null}', '2025-12-08 11:58:59'),
(66, 1, 'Tạo cột mới: Ngụy trang cánh sen H=25m dưới đất', NULL, '{\"macot\":\"COT046\",\"tencot\":\"Ngụy trang cánh sen H=25m dưới đất\",\"vitri\":\"Dưới đất\",\"cao\":25,\"giadonvi\":0,\"mota\":null}', '2025-12-08 11:59:24'),
(67, 1, 'Tạo cột mới: Ngụy trang cánh sen H=28m dưới đất', NULL, '{\"macot\":\"COT048\",\"tencot\":\"Ngụy trang cánh sen H=28m dưới đất\",\"vitri\":\"Dưới đất\",\"cao\":28,\"giadonvi\":0,\"mota\":null}', '2025-12-08 11:59:43'),
(68, 1, 'Tạo cột mới: Ngụy trang cánh sen H=25m dưới đất', NULL, '{\"macot\":\"COT049\",\"tencot\":\"Ngụy trang cánh sen H=25m dưới đất\",\"vitri\":\"Dưới đất\",\"cao\":25,\"giadonvi\":0,\"mota\":null}', '2025-12-08 12:00:04'),
(69, 1, 'Xóa cột ID: 55', '{\"id\":55,\"macot\":\"COT049\",\"tencot\":\"Ngụy trang cánh sen H=25m dưới đất\",\"cao\":25,\"mota\":null,\"ngaytao\":\"2025-12-08T05:00:04.000Z\",\"vitri\":\"Dưới đất\",\"giadonvi\":\"0.00\"}', NULL, '2025-12-08 12:00:14'),
(70, 1, 'Tạo volume khác mới: Khảo sát trên mái', NULL, '{\"mavolume\":\"VOL001\",\"tenvolume\":\"Khảo sát trên mái\",\"giadonvi\":10,\"mota\":null}', '2025-12-08 12:00:47'),
(71, 1, 'Tạo volume khác mới: Khảo sát dưới đất', NULL, '{\"mavolume\":\"VOL002\",\"tenvolume\":\"Khảo sát dưới đất\",\"giadonvi\":1,\"mota\":null}', '2025-12-08 12:01:01'),
(72, 1, 'Tạo volume khác mới: PM Minishelter dưới đất', NULL, '{\"mavolume\":\"VOL4\",\"tenvolume\":\"PM Minishelter dưới đất\",\"giadonvi\":1,\"mota\":null}', '2025-12-08 12:01:24'),
(73, 1, 'Tạo volume khác mới: Phòng máy cải tạo trên mái', NULL, '{\"mavolume\":\"VOL003\",\"tenvolume\":\"Phòng máy cải tạo trên mái\",\"giadonvi\":0,\"mota\":null}', '2025-12-08 12:01:38'),
(74, 1, 'Tạo volume khác mới: PMLG C05 trên mái', NULL, '{\"mavolume\":\"VOL005\",\"tenvolume\":\"PMLG C05 trên mái\",\"giadonvi\":1,\"mota\":null}', '2025-12-08 12:01:59'),
(75, 1, 'Tạo volume khác mới: PMLG C05 dưới đất thông thường', NULL, '{\"mavolume\":\"VOL06\",\"tenvolume\":\"PMLG C05 dưới đất thông thường\",\"giadonvi\":0,\"mota\":null}', '2025-12-08 12:02:17'),
(76, 1, 'Tạo volume khác mới: PMLG C04 dưới đất thông thường', NULL, '{\"mavolume\":\"VOL007\",\"tenvolume\":\"PMLG C04 dưới đất thông thường\",\"giadonvi\":0,\"mota\":null}', '2025-12-08 12:02:59'),
(77, 1, 'Tạo volume khác mới: PM xây X04 dưới đất thông thường', NULL, '{\"mavolume\":\"VOL009\",\"tenvolume\":\"PM xây X04 dưới đất thông thường\",\"giadonvi\":0,\"mota\":null}', '2025-12-08 12:03:15'),
(78, 1, 'Tạo volume khác mới: PMLG C04 trên mái', NULL, '{\"mavolume\":\"VOL010\",\"tenvolume\":\"PMLG C04 trên mái\",\"giadonvi\":0,\"mota\":null}', '2025-12-08 12:03:26'),
(79, 1, 'Tạo volume khác mới: PMLG C05 dưới đất vượt lũ 1,5m', NULL, '{\"mavolume\":\"VOL011\",\"tenvolume\":\"PMLG C05 dưới đất vượt lũ 1,5m\",\"giadonvi\":0,\"mota\":null}', '2025-12-08 12:03:35'),
(80, 1, 'Tạo volume khác mới: PMLG C04 dưới đất vượt lũ 1,5m', NULL, '{\"mavolume\":\"VOL012\",\"tenvolume\":\"PMLG C04 dưới đất vượt lũ 1,5m\",\"giadonvi\":0,\"mota\":null}', '2025-12-08 12:03:45'),
(81, 1, 'Tạo volume khác mới: PM xây X04 dưới đất vượt lũ 1,5m', NULL, '{\"mavolume\":\"VOL013\",\"tenvolume\":\"PM xây X04 dưới đất vượt lũ 1,5m\",\"giadonvi\":0,\"mota\":null}', '2025-12-08 12:04:02'),
(82, 1, 'Tạo volume khác mới: Tiếp địa dưới đất - cọc thép', NULL, '{\"mavolume\":\"VOL014\",\"tenvolume\":\"Tiếp địa dưới đất - cọc thép\",\"giadonvi\":0,\"mota\":null}', '2025-12-08 12:04:13'),
(83, 1, 'Tạo volume khác mới: Tiếp địa trên mái - khoan thả cọc', NULL, '{\"mavolume\":\"VOL015\",\"tenvolume\":\"Tiếp địa trên mái - khoan thả cọc\",\"giadonvi\":0,\"mota\":null}', '2025-12-08 12:04:27'),
(84, 1, 'Tạo volume khác mới: Tiếp địa dưới đất - hố gem', NULL, '{\"mavolume\":\"VOL016\",\"tenvolume\":\"Tiếp địa dưới đất - hố gem\",\"giadonvi\":0,\"mota\":null}', '2025-12-08 12:04:40'),
(85, 1, 'Tạo volume khác mới: Kéo điện 1 pha', NULL, '{\"mavolume\":\"VOL017\",\"tenvolume\":\"Kéo điện 1 pha\",\"giadonvi\":0,\"mota\":null}', '2025-12-08 12:04:58'),
(86, 1, 'Tạo volume khác mới: Kéo điện 3 pha', NULL, '{\"mavolume\":\"VOL018\",\"tenvolume\":\"Kéo điện 3 pha\",\"giadonvi\":0,\"mota\":null}', '2025-12-08 12:05:14');

-- --------------------------------------------------------

--
-- Table structure for table `nguoidung`
--

CREATE TABLE `nguoidung` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `ten` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `matkhau_hash` varchar(255) NOT NULL,
  `vaitro` enum('admin','ktv') NOT NULL DEFAULT 'ktv',
  `la_admin` tinyint(1) NOT NULL DEFAULT 0 COMMENT '1 = admin, 0 = ktv',
  `ngaytao` datetime NOT NULL DEFAULT current_timestamp(),
  `ngaysua` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `nguoidung`
--

INSERT INTO `nguoidung` (`id`, `ten`, `email`, `matkhau_hash`, `vaitro`, `la_admin`, `ngaytao`, `ngaysua`) VALUES
(1, 'Admin', 'admin@example.com', '$2b$10$c/D5dcQcyjtQ10FmhTZ25OD2/f2OB8jfc4nEOVJkXkkx/hhVCXdEC', 'admin', 1, '2025-12-04 21:55:52', '2025-12-04 22:02:57'),
(2, 'Kĩ Thuật Viên', 'ktv@example.com', '$2b$10$Nxz2eStIJdRKAhZpVh7wa.EfnekX3fPxvzONSShG/ho7Zh3u5DYTe', 'admin', 0, '2025-12-08 11:23:16', '2025-12-08 11:23:16');

-- --------------------------------------------------------

--
-- Table structure for table `phancong_khaosat`
--

CREATE TABLE `phancong_khaosat` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `hopdong_id` bigint(20) UNSIGNED NOT NULL,
  `ktv_id` bigint(20) UNSIGNED NOT NULL COMMENT 'Kỹ thuật viên được phân công',
  `admin_id` bigint(20) UNSIGNED NOT NULL COMMENT 'Admin phân công',
  `trangthai` enum('chua_ks','dang_ks','hoan_thanh','da_huy') NOT NULL DEFAULT 'chua_ks',
  `ngay_phan_cong` datetime NOT NULL DEFAULT current_timestamp() COMMENT 'Ngày admin phân công',
  `ngay_bat_dau` date DEFAULT NULL COMMENT 'Ngày KTV bắt đầu khảo sát',
  `ngay_hoan_thanh` date DEFAULT NULL COMMENT 'Ngày KTV hoàn thành khảo sát',
  `ghichu` text DEFAULT NULL COMMENT 'Ghi chú của admin khi phân công',
  `ghichu_ktv` text DEFAULT NULL COMMENT 'Ghi chú của KTV sau khi khảo sát',
  `ngaytao` datetime NOT NULL DEFAULT current_timestamp(),
  `ngaysua` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Bảng phân công KTV đi khảo sát hợp đồng';

-- --------------------------------------------------------

--
-- Table structure for table `thuviencot`
--

CREATE TABLE `thuviencot` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `macot` varchar(100) NOT NULL,
  `tencot` varchar(255) NOT NULL,
  `cao` int(11) DEFAULT NULL,
  `mota` text DEFAULT NULL,
  `ngaytao` datetime NOT NULL DEFAULT current_timestamp(),
  `vitri` varchar(50) DEFAULT NULL COMMENT 'Vị trí lắp đặt (Dưới đất, Trên mái)',
  `giadonvi` decimal(18,2) NOT NULL DEFAULT 0.00 COMMENT 'Giá đơn vị'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `thuviencot`
--

INSERT INTO `thuviencot` (`id`, `macot`, `tencot`, `cao`, `mota`, `ngaytao`, `vitri`, `giadonvi`) VALUES
(2, 'COT001', 'Cột cóc H=3m trên mái', 3, NULL, '2025-12-08 11:39:15', 'Trên mái', 10.00),
(3, 'COT002Cột cóc H=3m trên mái', 'Cột cóc H=5m trên mái', 5, NULL, '2025-12-08 11:40:10', 'Trên mái', 10.00),
(4, 'COT003', 'Cột cóc H=6m trên mái', 6, NULL, '2025-12-08 11:40:27', 'Trên mái', 0.00),
(5, 'COT004', 'Cột chống cứng H=9m trên mái', 9, NULL, '2025-12-08 11:40:50', 'Trên mái', 10.00),
(6, 'COT005', 'Cột chống cứng H=9m trên mái', 6, NULL, '2025-12-08 11:41:43', 'Trên mái', 10.00),
(8, 'COT006', 'Monopole H=9m trên mái', 9, NULL, '2025-12-08 11:42:19', 'Trên mái', 0.00),
(9, 'COT007', 'Monopole H=6m trên mái', 6, NULL, '2025-12-08 11:42:48', 'Trên mái', 0.00),
(10, 'COT008', 'Monopole H=25m dưới đất', 25, NULL, '2025-12-08 11:46:13', 'Trên mái', 10.00),
(11, 'COT009', 'Monopole H=28m dưới đất', 25, NULL, '2025-12-08 11:46:39', 'Dưới đất', 10.00),
(12, 'COT010', 'Monopole H=30m dưới đất', NULL, NULL, '2025-12-08 11:47:03', 'Dưới đất', 0.00),
(13, 'COT011', 'Monopole H=36m dưới đất', 36, NULL, '2025-12-08 11:47:23', 'Dưới đất', 0.00),
(14, 'COT012', 'Dây co 300x300 H=12m trên mái', 12, NULL, '2025-12-08 11:48:18', 'Trên mái', 0.00),
(15, 'COT013', 'Dây co 300x300 H=15m trên mái', 15, NULL, '2025-12-08 11:48:35', 'Trên mái', 0.00),
(16, 'COT014', 'Dây co 300x300 H=18m trên mái', 18, NULL, '2025-12-08 11:48:52', 'Trên mái', 0.00),
(18, 'COT015', 'Dây co 600x600 H=18m dưới đất', 18, NULL, '2025-12-08 11:49:17', 'Dưới đất', 0.00),
(19, 'COT018', 'Dây co 600x600 H=21m dưới đất', 21, NULL, '2025-12-08 11:50:07', 'Dưới đất', 0.00),
(20, 'COT019', 'Dây co 600x600 H=24m dưới đất', 24, NULL, '2025-12-08 11:50:27', 'Dưới đất', 0.00),
(21, 'COT020', 'Dây co 600x600 H=30m dưới đất', 30, NULL, '2025-12-08 11:50:52', 'Dưới đất', 0.00),
(22, 'COT021', 'Dây co 600x600 H=36m dưới đất', 36, NULL, '2025-12-08 11:51:14', 'Dưới đất', 0.00),
(23, 'COT022', 'Dây co 600x600 H=42m dưới đất', 42, NULL, '2025-12-08 11:51:32', 'Dưới đất', 0.00),
(24, 'COT023', 'Bê tông ly tâm H=18m dưới đất', 18, NULL, '2025-12-08 11:51:50', 'Dưới đất', 0.00),
(25, 'COT025', 'Tự đứng H=12m trên mái', 12, NULL, '2025-12-08 11:52:12', 'Trên mái', 0.00),
(26, 'COT026', 'Tự đứng H=15m trên mái', 15, NULL, '2025-12-08 11:52:27', 'Trên mái', 0.00),
(27, 'COT028', 'Tự đứng H=18m trên mái', 18, NULL, '2025-12-08 11:52:52', 'Trên mái', 0.00),
(28, 'COT027', 'Tự đứng 600x600 H=12m dưới đất', 12, NULL, '2025-12-08 11:53:05', 'Dưới đất', 0.00),
(31, 'COT029', 'Tự đứng 600x600 H=18m dưới đất', 18, NULL, '2025-12-08 11:53:44', 'Dưới đất', 0.00),
(33, 'COT030', 'Tự đứng 3 chân thân 1000x1000 H=18m dưới đất', 18, NULL, '2025-12-08 11:54:39', 'Dưới đất', 0.00),
(34, 'COT031', 'Tự đứng 3 chân thân 1000x1000 H=24m dưới đất', 24, NULL, '2025-12-08 11:55:03', 'Dưới đất', 0.00),
(35, 'COT032', 'Tự đứng 3 chân H=30m dưới đất', 30, NULL, '2025-12-08 11:55:18', 'Dưới đất', 0.00),
(36, 'COT033', 'Tự đứng 3 chân H=30m dưới đất', 30, NULL, '2025-12-08 11:55:32', 'Dưới đất', 0.00),
(37, 'COT034', 'Tự đứng 3 chân H=36m dưới đất', 36, NULL, '2025-12-08 11:55:49', 'Dưới đất', 0.00),
(38, 'COT035', 'Tự đứng 3 chân H=42m dưới đất', 42, NULL, '2025-12-08 11:56:02', 'Dưới đất', 0.00),
(39, 'COT036', 'Cột ngụy trang cây  cọ H=12m dưới đất', 12, NULL, '2025-12-08 11:56:18', 'Dưới đất', 0.00),
(40, 'COT037', 'Cột ngụy trang cây thông H=30m dưới đất', 30, NULL, '2025-12-08 11:56:32', 'Dưới đất', 0.00),
(41, 'COT038', 'Ngụy trang cây dừa H=25m dưới đất', 25, NULL, '2025-12-08 11:56:53', 'Dưới đất', 0.00),
(42, 'COT039', 'Ngụy trang cây dừa H=30m dưới đất', 30, NULL, '2025-12-08 11:57:06', 'Dưới đất', 0.00),
(44, 'COT040', 'Ngụy trang cây dừa H=25m dưới đất', 25, NULL, '2025-12-08 11:57:31', 'Dưới đất', 0.00),
(45, 'COT042', 'Ngụy trang cây dừa H=30m dưới đất', 30, NULL, '2025-12-08 11:57:48', 'Dưới đất', 0.00),
(47, 'COT043', 'Ngụy trang lồng đèn H=25m dưới đất', 25, NULL, '2025-12-08 11:58:13', 'Dưới đất', 0.00),
(48, 'COT044', 'Ngụy trang lồng đèn H=28m dưới đất', 28, NULL, '2025-12-08 11:58:33', 'Dưới đất', 0.00),
(50, 'COT045', 'Ngụy trang cánh sen H=25m dưới đất', 25, NULL, '2025-12-08 11:58:59', 'Dưới đất', 0.00),
(52, 'COT046', 'Ngụy trang cánh sen H=25m dưới đất', 25, NULL, '2025-12-08 11:59:24', 'Dưới đất', 0.00),
(53, 'COT048', 'Ngụy trang cánh sen H=28m dưới đất', 28, NULL, '2025-12-08 11:59:42', 'Dưới đất', 0.00);

-- --------------------------------------------------------

--
-- Table structure for table `thuvien_volume_khac`
--

CREATE TABLE `thuvien_volume_khac` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `mavolume` varchar(100) NOT NULL COMMENT 'Mã volume',
  `tenvolume` varchar(255) NOT NULL COMMENT 'Tên volume',
  `mota` text DEFAULT NULL COMMENT 'Mô tả',
  `ngaytao` datetime NOT NULL DEFAULT current_timestamp(),
  `giadonvi` decimal(18,2) NOT NULL DEFAULT 0.00 COMMENT 'Giá đơn vị'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Thư viện volume khác (ngoài cột)';

--
-- Dumping data for table `thuvien_volume_khac`
--

INSERT INTO `thuvien_volume_khac` (`id`, `mavolume`, `tenvolume`, `mota`, `ngaytao`, `giadonvi`) VALUES
(2, 'VOL001', 'Khảo sát trên mái', NULL, '2025-12-08 12:00:47', 10.00),
(3, 'VOL002', 'Khảo sát dưới đất', NULL, '2025-12-08 12:01:01', 1.00),
(4, 'VOL4', 'PM Minishelter dưới đất', NULL, '2025-12-08 12:01:24', 1.00),
(5, 'VOL003', 'Phòng máy cải tạo trên mái', NULL, '2025-12-08 12:01:38', 0.00),
(6, 'VOL005', 'PMLG C05 trên mái', NULL, '2025-12-08 12:01:59', 1.00),
(7, 'VOL06', 'PMLG C05 dưới đất thông thường', NULL, '2025-12-08 12:02:17', 0.00),
(8, 'VOL007', 'PMLG C04 dưới đất thông thường', NULL, '2025-12-08 12:02:59', 0.00),
(9, 'VOL009', 'PM xây X04 dưới đất thông thường', NULL, '2025-12-08 12:03:15', 0.00),
(10, 'VOL010', 'PMLG C04 trên mái', NULL, '2025-12-08 12:03:26', 0.00),
(11, 'VOL011', 'PMLG C05 dưới đất vượt lũ 1,5m', NULL, '2025-12-08 12:03:35', 0.00),
(12, 'VOL012', 'PMLG C04 dưới đất vượt lũ 1,5m', NULL, '2025-12-08 12:03:45', 0.00),
(13, 'VOL013', 'PM xây X04 dưới đất vượt lũ 1,5m', NULL, '2025-12-08 12:04:02', 0.00),
(14, 'VOL014', 'Tiếp địa dưới đất - cọc thép', NULL, '2025-12-08 12:04:13', 0.00),
(15, 'VOL015', 'Tiếp địa trên mái - khoan thả cọc', NULL, '2025-12-08 12:04:27', 0.00),
(16, 'VOL016', 'Tiếp địa dưới đất - hố gem', NULL, '2025-12-08 12:04:40', 0.00),
(17, 'VOL017', 'Kéo điện 1 pha', NULL, '2025-12-08 12:04:58', 0.00),
(20, 'VOL018', 'Kéo điện 3 pha', NULL, '2025-12-08 12:05:14', 0.00);

-- --------------------------------------------------------

--
-- Table structure for table `tiendotc`
--

CREATE TABLE `tiendotc` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `hopdong_id` bigint(20) UNSIGNED NOT NULL,
  `ngayks` date DEFAULT NULL,
  `nguoiks_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ngaytk` date DEFAULT NULL,
  `ngaydutoan` date DEFAULT NULL,
  `ngaypheduyet` date DEFAULT NULL,
  `ngaynhan_dhtc` date DEFAULT NULL,
  `trangthai_tc` enum('khaosat','thietke','dutoan','pheduyet','dhtc','hoanthanh') DEFAULT NULL,
  `phantram_ht` float NOT NULL DEFAULT 0,
  `ngaysua` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tinhthanh`
--

CREATE TABLE `tinhthanh` (
  `id` int(10) UNSIGNED NOT NULL,
  `ma` varchar(50) NOT NULL,
  `ten` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tinhthanh`
--

INSERT INTO `tinhthanh` (`id`, `ma`, `ten`) VALUES
(1, 'AGG', 'An Giang'),
(2, 'CBG', 'Cao Bằng'),
(3, 'CMU', 'Cà Mau'),
(4, 'CTO', 'Cần Thơ'),
(5, 'DBN', 'Điện Biên'),
(6, 'DLK', 'Đắk Lắk'),
(7, 'DNG', 'Đà Nẵng'),
(8, 'DNI', 'Đồng Nai'),
(9, 'DTP', 'Đồng Tháp'),
(10, 'GLI', 'Gia Lai'),
(11, 'HCM', 'TP. Hồ Chí Minh'),
(12, 'HNI', 'Hà Nội'),
(13, 'HTH', 'Hà Tĩnh'),
(14, 'HYN', 'Hưng Yên'),
(15, 'KHA', 'Khánh Hòa'),
(16, 'LCI', 'Lào Cai'),
(17, 'LCU', 'Lai Châu'),
(18, 'LDG', 'Lâm Đồng'),
(19, 'LSN', 'Lạng Sơn'),
(20, 'NAN', 'Nghệ An'),
(21, 'NBH', 'Ninh Bình'),
(22, 'PTO', 'Phú Thọ'),
(23, 'QNI', 'Quảng Ngãi'),
(24, 'QNH', 'Quảng Ninh'),
(25, 'QTI', 'Quảng Trị'),
(26, 'SLA', 'Sơn La'),
(27, 'TNN', 'Thái Nguyên'),
(28, 'THA', 'Thanh Hóa'),
(29, 'TQG', 'Tuyên Quang'),
(30, 'TTH', 'Thừa Thiên Huế'),
(31, 'VLG', 'Vĩnh Long'),
(32, 'BNH', 'Bắc Ninh'),
(33, 'HPG', 'Hải Phòng'),
(34, 'TNH', 'Tây Ninh');

-- --------------------------------------------------------

--
-- Table structure for table `tram`
--

CREATE TABLE `tram` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `matram` varchar(100) NOT NULL,
  `tinhthanh_id` int(10) UNSIGNED NOT NULL,
  `diachi` text DEFAULT NULL,
  `lat` double DEFAULT NULL,
  `lng` double DEFAULT NULL,
  `loaiproject` enum('btsmoi','kienco') NOT NULL,
  `ngaytao` datetime NOT NULL DEFAULT current_timestamp(),
  `ngaysua` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tram`
--

INSERT INTO `tram` (`id`, `matram`, `tinhthanh_id`, `diachi`, `lat`, `lng`, `loaiproject`, `ngaytao`, `ngaysua`) VALUES
(2, 'NAN1928', 20, 'Nghệ An', NULL, NULL, 'btsmoi', '2025-12-04 22:35:35', '2025-12-04 22:35:35');

-- --------------------------------------------------------

--
-- Stand-in structure for view `v_phancong_khaosat`
-- (See below for the actual view)
--
CREATE TABLE `v_phancong_khaosat` (
`id` bigint(20) unsigned
,`hopdong_id` bigint(20) unsigned
,`sohopdong` varchar(255)
,`chudautu` varchar(255)
,`matram` varchar(100)
,`diachi` text
,`tinhthanh_ten` varchar(255)
,`ktv_id` bigint(20) unsigned
,`ktv_ten` varchar(255)
,`ktv_email` varchar(255)
,`admin_id` bigint(20) unsigned
,`admin_ten` varchar(255)
,`trangthai` enum('chua_ks','dang_ks','hoan_thanh','da_huy')
,`ngay_phan_cong` datetime
,`ngay_bat_dau` date
,`ngay_hoan_thanh` date
,`ghichu` text
,`ghichu_ktv` text
,`ngaytao` datetime
,`ngaysua` datetime
);

-- --------------------------------------------------------

--
-- Structure for view `v_phancong_khaosat`
--
DROP TABLE IF EXISTS `v_phancong_khaosat`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_phancong_khaosat`  AS SELECT `pc`.`id` AS `id`, `pc`.`hopdong_id` AS `hopdong_id`, `hd`.`sohopdong` AS `sohopdong`, `hd`.`chudautu` AS `chudautu`, `t`.`matram` AS `matram`, `t`.`diachi` AS `diachi`, `tt`.`ten` AS `tinhthanh_ten`, `pc`.`ktv_id` AS `ktv_id`, `ktv`.`ten` AS `ktv_ten`, `ktv`.`email` AS `ktv_email`, `pc`.`admin_id` AS `admin_id`, `admin`.`ten` AS `admin_ten`, `pc`.`trangthai` AS `trangthai`, `pc`.`ngay_phan_cong` AS `ngay_phan_cong`, `pc`.`ngay_bat_dau` AS `ngay_bat_dau`, `pc`.`ngay_hoan_thanh` AS `ngay_hoan_thanh`, `pc`.`ghichu` AS `ghichu`, `pc`.`ghichu_ktv` AS `ghichu_ktv`, `pc`.`ngaytao` AS `ngaytao`, `pc`.`ngaysua` AS `ngaysua` FROM (((((`phancong_khaosat` `pc` join `hopdong` `hd` on(`pc`.`hopdong_id` = `hd`.`id`)) join `tram` `t` on(`hd`.`tram_id` = `t`.`id`)) join `tinhthanh` `tt` on(`t`.`tinhthanh_id` = `tt`.`id`)) join `nguoidung` `ktv` on(`pc`.`ktv_id` = `ktv`.`id`)) join `nguoidung` `admin` on(`pc`.`admin_id` = `admin`.`id`)) WHERE `hd`.`daxoa` = 0 ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `hopdong`
--
ALTER TABLE `hopdong`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_hopdong_tram` (`tram_id`);

--
-- Indexes for table `hopdong_cot`
--
ALTER TABLE `hopdong_cot`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_hopdongcot` (`hopdong_id`,`cot_id`),
  ADD KEY `idx_hopdongcot_hd` (`hopdong_id`),
  ADD KEY `idx_hopdongcot_cot` (`cot_id`);

--
-- Indexes for table `hopdong_volume_khac`
--
ALTER TABLE `hopdong_volume_khac`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_hopdongvolume` (`hopdong_id`,`volume_id`),
  ADD KEY `idx_hdvolume_hd` (`hopdong_id`),
  ADD KEY `idx_hdvolume_volume` (`volume_id`);

--
-- Indexes for table `kstk_thucte`
--
ALTER TABLE `kstk_thucte`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_kstk_hd` (`hopdong_id`),
  ADD KEY `idx_kstk_cot` (`cot_id`),
  ADD KEY `idx_kstk_user` (`nguoinhap_id`);

--
-- Indexes for table `kstk_thucte_volume_khac`
--
ALTER TABLE `kstk_thucte_volume_khac`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_kstkvolume_hd` (`hopdong_id`),
  ADD KEY `idx_kstkvolume_volume` (`volume_id`),
  ADD KEY `idx_kstkvolume_user` (`nguoinhap_id`);

--
-- Indexes for table `lichsu`
--
ALTER TABLE `lichsu`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_lichsu_user` (`nguoidung_id`);

--
-- Indexes for table `nguoidung`
--
ALTER TABLE `nguoidung`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `phancong_khaosat`
--
ALTER TABLE `phancong_khaosat`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_pc_hopdong` (`hopdong_id`),
  ADD KEY `idx_pc_ktv` (`ktv_id`),
  ADD KEY `idx_pc_admin` (`admin_id`),
  ADD KEY `idx_pc_trangthai` (`trangthai`);

--
-- Indexes for table `thuviencot`
--
ALTER TABLE `thuviencot`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `macot` (`macot`);

--
-- Indexes for table `thuvien_volume_khac`
--
ALTER TABLE `thuvien_volume_khac`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `mavolume` (`mavolume`);

--
-- Indexes for table `tiendotc`
--
ALTER TABLE `tiendotc`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_tiendotc_hd` (`hopdong_id`),
  ADD KEY `idx_td_hd` (`hopdong_id`),
  ADD KEY `idx_td_ks` (`nguoiks_id`);

--
-- Indexes for table `tinhthanh`
--
ALTER TABLE `tinhthanh`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ma` (`ma`);

--
-- Indexes for table `tram`
--
ALTER TABLE `tram`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `matram` (`matram`),
  ADD KEY `idx_tram_tinh` (`tinhthanh_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `hopdong`
--
ALTER TABLE `hopdong`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `hopdong_cot`
--
ALTER TABLE `hopdong_cot`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `hopdong_volume_khac`
--
ALTER TABLE `hopdong_volume_khac`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `kstk_thucte`
--
ALTER TABLE `kstk_thucte`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `kstk_thucte_volume_khac`
--
ALTER TABLE `kstk_thucte_volume_khac`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `lichsu`
--
ALTER TABLE `lichsu`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=87;

--
-- AUTO_INCREMENT for table `nguoidung`
--
ALTER TABLE `nguoidung`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `phancong_khaosat`
--
ALTER TABLE `phancong_khaosat`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `thuviencot`
--
ALTER TABLE `thuviencot`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;

--
-- AUTO_INCREMENT for table `thuvien_volume_khac`
--
ALTER TABLE `thuvien_volume_khac`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `tiendotc`
--
ALTER TABLE `tiendotc`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `tinhthanh`
--
ALTER TABLE `tinhthanh`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `tram`
--
ALTER TABLE `tram`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `hopdong`
--
ALTER TABLE `hopdong`
  ADD CONSTRAINT `fk_hopdong_tram` FOREIGN KEY (`tram_id`) REFERENCES `tram` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `hopdong_cot`
--
ALTER TABLE `hopdong_cot`
  ADD CONSTRAINT `fk_hopdongcot_cot` FOREIGN KEY (`cot_id`) REFERENCES `thuviencot` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_hopdongcot_hopdong` FOREIGN KEY (`hopdong_id`) REFERENCES `hopdong` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `hopdong_volume_khac`
--
ALTER TABLE `hopdong_volume_khac`
  ADD CONSTRAINT `fk_hdvolume_hopdong` FOREIGN KEY (`hopdong_id`) REFERENCES `hopdong` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_hdvolume_volume` FOREIGN KEY (`volume_id`) REFERENCES `thuvien_volume_khac` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `kstk_thucte`
--
ALTER TABLE `kstk_thucte`
  ADD CONSTRAINT `fk_kstk_cot` FOREIGN KEY (`cot_id`) REFERENCES `thuviencot` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_kstk_hd` FOREIGN KEY (`hopdong_id`) REFERENCES `hopdong` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_kstk_user` FOREIGN KEY (`nguoinhap_id`) REFERENCES `nguoidung` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `kstk_thucte_volume_khac`
--
ALTER TABLE `kstk_thucte_volume_khac`
  ADD CONSTRAINT `fk_kstkvolume_hd` FOREIGN KEY (`hopdong_id`) REFERENCES `hopdong` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_kstkvolume_user` FOREIGN KEY (`nguoinhap_id`) REFERENCES `nguoidung` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_kstkvolume_volume` FOREIGN KEY (`volume_id`) REFERENCES `thuvien_volume_khac` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `lichsu`
--
ALTER TABLE `lichsu`
  ADD CONSTRAINT `fk_lichsu_user` FOREIGN KEY (`nguoidung_id`) REFERENCES `nguoidung` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `phancong_khaosat`
--
ALTER TABLE `phancong_khaosat`
  ADD CONSTRAINT `fk_pc_admin` FOREIGN KEY (`admin_id`) REFERENCES `nguoidung` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_pc_hopdong` FOREIGN KEY (`hopdong_id`) REFERENCES `hopdong` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_pc_ktv` FOREIGN KEY (`ktv_id`) REFERENCES `nguoidung` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `tiendotc`
--
ALTER TABLE `tiendotc`
  ADD CONSTRAINT `fk_td_hd` FOREIGN KEY (`hopdong_id`) REFERENCES `hopdong` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_td_nguoiks` FOREIGN KEY (`nguoiks_id`) REFERENCES `nguoidung` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `tram`
--
ALTER TABLE `tram`
  ADD CONSTRAINT `fk_tram_tinhthanh` FOREIGN KEY (`tinhthanh_id`) REFERENCES `tinhthanh` (`id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
