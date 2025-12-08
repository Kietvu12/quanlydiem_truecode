import pool from '../config/database.js';
import { TramModel } from './TramModel.js';
import { ThuVienVolumeKhacModel } from './ThuVienVolumeKhacModel.js';

/**
 * Model Trạm Volume Khác (Volume khác của trạm)
 * Thuộc tính hóa đối tượng Trạm Volume Khác
 */
export class TramVolumeKhacModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.tram_id = data.tram_id || null;
    this.volume_id = data.volume_id || null;
    this.soluong = data.soluong || 0;
    this.tongtien = data.tongtien || 0.00;
    this.ngaytao = data.ngaytao || null;
    this.ngaysua = data.ngaysua || null;
    // Quan hệ
    this.tram = data.tram || null;
    this.volume = data.volume || null;
  }

  /**
   * Lấy tất cả volume khác của trạm
   */
  static async getAll(includeRelations = false) {
    const [rows] = await pool.execute('SELECT * FROM tram_volume_khac ORDER BY ngaytao DESC');
    
    const tramVols = rows.map(row => new TramVolumeKhacModel(row));
    
    if (includeRelations) {
      for (const tv of tramVols) {
        if (tv.tram_id) tv.tram = await TramModel.getById(tv.tram_id);
        if (tv.volume_id) tv.volume = await ThuVienVolumeKhacModel.getById(tv.volume_id);
      }
    }
    
    return tramVols;
  }

  /**
   * Lấy volume khác theo ID
   */
  static async getById(id, includeRelations = false) {
    const [rows] = await pool.execute('SELECT * FROM tram_volume_khac WHERE id = ?', [id]);
    if (rows.length === 0) return null;
    
    const tramVol = new TramVolumeKhacModel(rows[0]);
    
    if (includeRelations) {
      if (tramVol.tram_id) tramVol.tram = await TramModel.getById(tramVol.tram_id);
      if (tramVol.volume_id) tramVol.volume = await ThuVienVolumeKhacModel.getById(tramVol.volume_id);
    }
    
    return tramVol;
  }

  /**
   * Lấy volume khác theo trạm
   */
  static async getByTram(tram_id) {
    const [rows] = await pool.execute(
      'SELECT * FROM tram_volume_khac WHERE tram_id = ? ORDER BY ngaytao DESC',
      [tram_id]
    );
    return rows.map(row => new TramVolumeKhacModel(row));
  }

  /**
   * Tạo volume khác mới
   */
  async create() {
    // Tính tổng tiền
    if (this.volume_id && this.soluong) {
      const volume = await ThuVienVolumeKhacModel.getById(this.volume_id);
      if (volume) {
        this.tongtien = parseFloat(volume.giadonvi) * this.soluong;
      }
    }
    
    const [result] = await pool.execute(
      'INSERT INTO tram_volume_khac (tram_id, volume_id, soluong, tongtien) VALUES (?, ?, ?, ?)',
      [this.tram_id, this.volume_id, this.soluong, this.tongtien]
    );
    this.id = result.insertId;
    return this;
  }

  /**
   * Cập nhật volume khác
   */
  async update() {
    // Tính lại tổng tiền
    if (this.volume_id && this.soluong) {
      const volume = await ThuVienVolumeKhacModel.getById(this.volume_id);
      if (volume) {
        this.tongtien = parseFloat(volume.giadonvi) * this.soluong;
      }
    }
    
    await pool.execute(
      'UPDATE tram_volume_khac SET tram_id = ?, volume_id = ?, soluong = ?, tongtien = ? WHERE id = ?',
      [this.tram_id, this.volume_id, this.soluong, this.tongtien, this.id]
    );
    return this;
  }

  /**
   * Xóa volume khác
   */
  async delete() {
    await pool.execute('DELETE FROM tram_volume_khac WHERE id = ?', [this.id]);
    return true;
  }

  /**
   * Chuyển đổi thành object thuần
   */
  toJSON() {
    return {
      id: this.id,
      tram_id: this.tram_id,
      volume_id: this.volume_id,
      soluong: this.soluong,
      tongtien: parseFloat(this.tongtien),
      ngaytao: this.ngaytao,
      ngaysua: this.ngaysua,
      tram: this.tram ? this.tram.toJSON() : null,
      volume: this.volume ? this.volume.toJSON() : null
    };
  }
}

