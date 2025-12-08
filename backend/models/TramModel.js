import pool from '../config/database.js';
import { TinhThanhModel } from './TinhThanhModel.js';

/**
 * Model Trạm
 * Thuộc tính hóa đối tượng Trạm
 */
export class TramModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.matram = data.matram || '';
    this.tinhthanh_id = data.tinhthanh_id || null;
    this.diachi = data.diachi || null;
    this.lat = data.lat || null;
    this.lng = data.lng || null;
    this.loaiproject = data.loaiproject || 'btsmoi';
    this.ngaytao = data.ngaytao || null;
    this.ngaysua = data.ngaysua || null;
    // Quan hệ
    this.tinhthanh = data.tinhthanh || null;
  }

  /**
   * Lấy tất cả trạm
   */
  static async getAll(includeTinhThanh = false) {
    const [rows] = await pool.execute('SELECT * FROM tram ORDER BY matram ASC');
    
    const trams = rows.map(row => new TramModel(row));
    
    if (includeTinhThanh) {
      for (const tram of trams) {
        if (tram.tinhthanh_id) {
          tram.tinhthanh = await TinhThanhModel.getById(tram.tinhthanh_id);
        }
      }
    }
    
    return trams;
  }

  /**
   * Lấy trạm theo ID
   */
  static async getById(id, includeTinhThanh = false) {
    const [rows] = await pool.execute('SELECT * FROM tram WHERE id = ?', [id]);
    if (rows.length === 0) return null;
    
    const tram = new TramModel(rows[0]);
    if (includeTinhThanh && tram.tinhthanh_id) {
      tram.tinhthanh = await TinhThanhModel.getById(tram.tinhthanh_id);
    }
    
    return tram;
  }

  /**
   * Lấy trạm theo mã trạm
   */
  static async getByMaTram(matram) {
    const [rows] = await pool.execute('SELECT * FROM tram WHERE matram = ?', [matram]);
    if (rows.length === 0) return null;
    return new TramModel(rows[0]);
  }

  /**
   * Lấy trạm theo tỉnh thành
   */
  static async getByTinhThanh(tinhthanh_id) {
    const [rows] = await pool.execute(
      'SELECT * FROM tram WHERE tinhthanh_id = ? ORDER BY matram ASC',
      [tinhthanh_id]
    );
    return rows.map(row => new TramModel(row));
  }

  /**
   * Tạo trạm mới
   */
  async create() {
    const [result] = await pool.execute(
      'INSERT INTO tram (matram, tinhthanh_id, diachi, lat, lng, loaiproject) VALUES (?, ?, ?, ?, ?, ?)',
      [this.matram, this.tinhthanh_id, this.diachi, this.lat, this.lng, this.loaiproject]
    );
    this.id = result.insertId;
    return this;
  }

  /**
   * Cập nhật trạm
   */
  async update() {
    await pool.execute(
      'UPDATE tram SET matram = ?, tinhthanh_id = ?, diachi = ?, lat = ?, lng = ?, loaiproject = ? WHERE id = ?',
      [this.matram, this.tinhthanh_id, this.diachi, this.lat, this.lng, this.loaiproject, this.id]
    );
    return this;
  }

  /**
   * Xóa trạm
   */
  async delete() {
    await pool.execute('DELETE FROM tram WHERE id = ?', [this.id]);
    return true;
  }

  /**
   * Chuyển đổi thành object thuần
   */
  toJSON() {
    return {
      id: this.id,
      matram: this.matram,
      tinhthanh_id: this.tinhthanh_id,
      diachi: this.diachi,
      lat: this.lat,
      lng: this.lng,
      loaiproject: this.loaiproject,
      ngaytao: this.ngaytao,
      ngaysua: this.ngaysua,
      tinhthanh: this.tinhthanh ? this.tinhthanh.toJSON() : null
    };
  }
}

