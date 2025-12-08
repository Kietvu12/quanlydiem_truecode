import pool from '../config/database.js';
import { TramModel } from './TramModel.js';
import { HopDongModel } from './HopDongModel.js';
import { ThuVienCotModel } from './ThuVienCotModel.js';
import { NguoiDungModel } from './NguoiDungModel.js';

/**
 * Model Trạm Thực Tế Cột (Volume thực tế cột của trạm sau khảo sát)
 * Thuộc tính hóa đối tượng Trạm Thực Tế Cột
 */
export class TramThucTeCotModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.tram_id = data.tram_id || null;
    this.hopdong_id = data.hopdong_id || null;
    this.cot_id = data.cot_id || null;
    this.soluong_thucte = data.soluong_thucte || 0;
    this.nguoinhap_id = data.nguoinhap_id || null;
    this.ngaytao = data.ngaytao || null;
    this.ngaysua = data.ngaysua || null;
    // Quan hệ
    this.tram = data.tram || null;
    this.hopdong = data.hopdong || null;
    this.cot = data.cot || null;
    this.nguoinhap = data.nguoinhap || null;
  }

  /**
   * Lấy tất cả volume thực tế cột
   */
  static async getAll(includeRelations = false) {
    const [rows] = await pool.execute('SELECT * FROM tram_thucte_cot ORDER BY ngaytao DESC');
    
    const thucTes = rows.map(row => new TramThucTeCotModel(row));
    
    if (includeRelations) {
      for (const tt of thucTes) {
        if (tt.tram_id) tt.tram = await TramModel.getById(tt.tram_id);
        if (tt.hopdong_id) tt.hopdong = await HopDongModel.getById(tt.hopdong_id);
        if (tt.cot_id) tt.cot = await ThuVienCotModel.getById(tt.cot_id);
        if (tt.nguoinhap_id) tt.nguoinhap = await NguoiDungModel.getById(tt.nguoinhap_id);
      }
    }
    
    return thucTes;
  }

  /**
   * Lấy volume thực tế cột theo ID
   */
  static async getById(id, includeRelations = false) {
    const [rows] = await pool.execute('SELECT * FROM tram_thucte_cot WHERE id = ?', [id]);
    if (rows.length === 0) return null;
    
    const thucTe = new TramThucTeCotModel(rows[0]);
    
    if (includeRelations) {
      if (thucTe.tram_id) thucTe.tram = await TramModel.getById(thucTe.tram_id);
      if (thucTe.hopdong_id) thucTe.hopdong = await HopDongModel.getById(thucTe.hopdong_id);
      if (thucTe.cot_id) thucTe.cot = await ThuVienCotModel.getById(thucTe.cot_id);
      if (thucTe.nguoinhap_id) thucTe.nguoinhap = await NguoiDungModel.getById(thucTe.nguoinhap_id);
    }
    
    return thucTe;
  }

  /**
   * Lấy volume thực tế cột theo trạm và hợp đồng
   */
  static async getByTramAndHopDong(tram_id, hopdong_id) {
    const [rows] = await pool.execute(
      'SELECT * FROM tram_thucte_cot WHERE tram_id = ? AND hopdong_id = ? ORDER BY ngaytao DESC',
      [tram_id, hopdong_id]
    );
    return rows.map(row => new TramThucTeCotModel(row));
  }

  /**
   * Lấy volume thực tế cột theo hợp đồng
   */
  static async getByHopDong(hopdong_id) {
    const [rows] = await pool.execute(
      'SELECT * FROM tram_thucte_cot WHERE hopdong_id = ? ORDER BY ngaytao DESC',
      [hopdong_id]
    );
    return rows.map(row => new TramThucTeCotModel(row));
  }

  /**
   * Tạo volume thực tế cột mới
   */
  async create() {
    const [result] = await pool.execute(
      'INSERT INTO tram_thucte_cot (tram_id, hopdong_id, cot_id, soluong_thucte, nguoinhap_id) VALUES (?, ?, ?, ?, ?)',
      [this.tram_id, this.hopdong_id, this.cot_id, this.soluong_thucte, this.nguoinhap_id]
    );
    this.id = result.insertId;
    return this;
  }

  /**
   * Cập nhật volume thực tế cột
   */
  async update() {
    await pool.execute(
      'UPDATE tram_thucte_cot SET tram_id = ?, hopdong_id = ?, cot_id = ?, soluong_thucte = ?, nguoinhap_id = ? WHERE id = ?',
      [this.tram_id, this.hopdong_id, this.cot_id, this.soluong_thucte, this.nguoinhap_id, this.id]
    );
    return this;
  }

  /**
   * Xóa volume thực tế cột
   */
  async delete() {
    await pool.execute('DELETE FROM tram_thucte_cot WHERE id = ?', [this.id]);
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
      cot_id: this.cot_id,
      soluong_thucte: this.soluong_thucte,
      nguoinhap_id: this.nguoinhap_id,
      ngaytao: this.ngaytao,
      ngaysua: this.ngaysua,
      tram: this.tram ? this.tram.toJSON() : null,
      hopdong: this.hopdong ? this.hopdong.toJSON() : null,
      cot: this.cot ? this.cot.toJSON() : null,
      nguoinhap: this.nguoinhap ? this.nguoinhap.toJSON() : null
    };
  }
}

