import pool from '../config/database.js';
import { TramModel } from './TramModel.js';
import { HopDongModel } from './HopDongModel.js';
import { ThuVienVolumeKhacModel } from './ThuVienVolumeKhacModel.js';
import { NguoiDungModel } from './NguoiDungModel.js';

/**
 * Model Trạm Thực Tế Volume Khác (Volume thực tế khác của trạm sau khảo sát)
 * Thuộc tính hóa đối tượng Trạm Thực Tế Volume Khác
 */
export class TramThucTeVolumeKhacModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.tram_id = data.tram_id || null;
    this.hopdong_id = data.hopdong_id || null;
    this.volume_id = data.volume_id || null;
    this.soluong_thucte = data.soluong_thucte || 0;
    this.nguoinhap_id = data.nguoinhap_id || null;
    this.ngaytao = data.ngaytao || null;
    this.ngaysua = data.ngaysua || null;
    // Quan hệ
    this.tram = data.tram || null;
    this.hopdong = data.hopdong || null;
    this.volume = data.volume || null;
    this.nguoinhap = data.nguoinhap || null;
  }

  /**
   * Lấy tất cả volume thực tế khác
   */
  static async getAll(includeRelations = false) {
    const [rows] = await pool.execute('SELECT * FROM tram_thucte_volume_khac ORDER BY ngaytao DESC');
    
    const thucTes = rows.map(row => new TramThucTeVolumeKhacModel(row));
    
    if (includeRelations) {
      for (const tt of thucTes) {
        if (tt.tram_id) tt.tram = await TramModel.getById(tt.tram_id);
        if (tt.hopdong_id) tt.hopdong = await HopDongModel.getById(tt.hopdong_id);
        if (tt.volume_id) tt.volume = await ThuVienVolumeKhacModel.getById(tt.volume_id);
        if (tt.nguoinhap_id) tt.nguoinhap = await NguoiDungModel.getById(tt.nguoinhap_id);
      }
    }
    
    return thucTes;
  }

  /**
   * Lấy volume thực tế khác theo ID
   */
  static async getById(id, includeRelations = false) {
    const [rows] = await pool.execute('SELECT * FROM tram_thucte_volume_khac WHERE id = ?', [id]);
    if (rows.length === 0) return null;
    
    const thucTe = new TramThucTeVolumeKhacModel(rows[0]);
    
    if (includeRelations) {
      if (thucTe.tram_id) thucTe.tram = await TramModel.getById(thucTe.tram_id);
      if (thucTe.hopdong_id) thucTe.hopdong = await HopDongModel.getById(thucTe.hopdong_id);
      if (thucTe.volume_id) thucTe.volume = await ThuVienVolumeKhacModel.getById(thucTe.volume_id);
      if (thucTe.nguoinhap_id) thucTe.nguoinhap = await NguoiDungModel.getById(thucTe.nguoinhap_id);
    }
    
    return thucTe;
  }

  /**
   * Lấy volume thực tế khác theo trạm và hợp đồng
   */
  static async getByTramAndHopDong(tram_id, hopdong_id) {
    const [rows] = await pool.execute(
      'SELECT * FROM tram_thucte_volume_khac WHERE tram_id = ? AND hopdong_id = ? ORDER BY ngaytao DESC',
      [tram_id, hopdong_id]
    );
    return rows.map(row => new TramThucTeVolumeKhacModel(row));
  }

  /**
   * Lấy volume thực tế khác theo hợp đồng
   */
  static async getByHopDong(hopdong_id) {
    const [rows] = await pool.execute(
      'SELECT * FROM tram_thucte_volume_khac WHERE hopdong_id = ? ORDER BY ngaytao DESC',
      [hopdong_id]
    );
    return rows.map(row => new TramThucTeVolumeKhacModel(row));
  }

  /**
   * Tạo volume thực tế khác mới
   */
  async create() {
    const [result] = await pool.execute(
      'INSERT INTO tram_thucte_volume_khac (tram_id, hopdong_id, volume_id, soluong_thucte, nguoinhap_id) VALUES (?, ?, ?, ?, ?)',
      [this.tram_id, this.hopdong_id, this.volume_id, this.soluong_thucte, this.nguoinhap_id]
    );
    this.id = result.insertId;
    return this;
  }

  /**
   * Cập nhật volume thực tế khác
   */
  async update() {
    await pool.execute(
      'UPDATE tram_thucte_volume_khac SET tram_id = ?, hopdong_id = ?, volume_id = ?, soluong_thucte = ?, nguoinhap_id = ? WHERE id = ?',
      [this.tram_id, this.hopdong_id, this.volume_id, this.soluong_thucte, this.nguoinhap_id, this.id]
    );
    return this;
  }

  /**
   * Xóa volume thực tế khác
   */
  async delete() {
    await pool.execute('DELETE FROM tram_thucte_volume_khac WHERE id = ?', [this.id]);
    return true;
  }

  /**
   * Chuyển đổi thành object thuần
   */
  toJSON() {
    return {
      id: this.id,
      tram_id: this.tram_id,
      hopdong_id: this.hopdong_id,
      volume_id: this.volume_id,
      soluong_thucte: this.soluong_thucte,
      nguoinhap_id: this.nguoinhap_id,
      ngaytao: this.ngaytao,
      ngaysua: this.ngaysua,
      tram: this.tram ? this.tram.toJSON() : null,
      hopdong: this.hopdong ? this.hopdong.toJSON() : null,
      volume: this.volume ? this.volume.toJSON() : null,
      nguoinhap: this.nguoinhap ? this.nguoinhap.toJSON() : null
    };
  }
}

