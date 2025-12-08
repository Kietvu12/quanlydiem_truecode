import pool from '../config/database.js';
import { KhuVucModel } from './KhuVucModel.js';

/**
 * Model Tỉnh Thành
 * Thuộc tính hóa đối tượng Tỉnh Thành
 */
export class TinhThanhModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.ma = data.ma || '';
    this.ten = data.ten || '';
    this.khuvuc_id = data.khuvuc_id || null;
    this.ngaytao = data.ngaytao || null;
    this.ngaysua = data.ngaysua || null;
    // Quan hệ
    this.khuvuc = data.khuvuc || null;
  }

  /**
   * Lấy tất cả tỉnh thành
   */
  static async getAll(includeKhuVuc = false) {
    let query = 'SELECT * FROM tinhthanh ORDER BY ten ASC';
    const [rows] = await pool.execute(query);
    
    const tinhThanhs = rows.map(row => new TinhThanhModel(row));
    
    if (includeKhuVuc) {
      for (const tinh of tinhThanhs) {
        if (tinh.khuvuc_id) {
          tinh.khuvuc = await KhuVucModel.getById(tinh.khuvuc_id);
        }
      }
    }
    
    return tinhThanhs;
  }

  /**
   * Lấy tỉnh thành theo ID
   */
  static async getById(id, includeKhuVuc = false) {
    const [rows] = await pool.execute('SELECT * FROM tinhthanh WHERE id = ?', [id]);
    if (rows.length === 0) return null;
    
    const tinh = new TinhThanhModel(rows[0]);
    if (includeKhuVuc && tinh.khuvuc_id) {
      tinh.khuvuc = await KhuVucModel.getById(tinh.khuvuc_id);
    }
    
    return tinh;
  }

  /**
   * Lấy tỉnh thành theo mã
   */
  static async getByMa(ma) {
    const [rows] = await pool.execute('SELECT * FROM tinhthanh WHERE ma = ?', [ma]);
    if (rows.length === 0) return null;
    return new TinhThanhModel(rows[0]);
  }

  /**
   * Lấy tỉnh thành theo khu vực
   */
  static async getByKhuVuc(khuvuc_id) {
    const [rows] = await pool.execute(
      'SELECT * FROM tinhthanh WHERE khuvuc_id = ? ORDER BY ten ASC',
      [khuvuc_id]
    );
    return rows.map(row => new TinhThanhModel(row));
  }

  /**
   * Tạo tỉnh thành mới
   */
  async create() {
    const [result] = await pool.execute(
      'INSERT INTO tinhthanh (ma, ten, khuvuc_id) VALUES (?, ?, ?)',
      [this.ma, this.ten, this.khuvuc_id]
    );
    this.id = result.insertId;
    return this;
  }

  /**
   * Cập nhật tỉnh thành
   */
  async update() {
    await pool.execute(
      'UPDATE tinhthanh SET ma = ?, ten = ?, khuvuc_id = ? WHERE id = ?',
      [this.ma, this.ten, this.khuvuc_id, this.id]
    );
    return this;
  }

  /**
   * Xóa tỉnh thành
   */
  async delete() {
    await pool.execute('DELETE FROM tinhthanh WHERE id = ?', [this.id]);
    return true;
  }

  /**
   * Chuyển đổi thành object thuần
   */
  toJSON() {
    return {
      id: this.id,
      ma: this.ma,
      ten: this.ten,
      khuvuc_id: this.khuvuc_id,
      ngaytao: this.ngaytao,
      ngaysua: this.ngaysua,
      khuvuc: this.khuvuc ? this.khuvuc.toJSON() : null
    };
  }
}

