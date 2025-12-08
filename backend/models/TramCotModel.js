import pool from '../config/database.js';
import { TramModel } from './TramModel.js';
import { ThuVienCotModel } from './ThuVienCotModel.js';

/**
 * Model Trạm Cột (Volume cột của trạm)
 * Thuộc tính hóa đối tượng Trạm Cột
 */
export class TramCotModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.tram_id = data.tram_id || null;
    this.cot_id = data.cot_id || null;
    this.soluong = data.soluong || 0;
    this.tongtien = data.tongtien || 0.00;
    this.ngaytao = data.ngaytao || null;
    this.ngaysua = data.ngaysua || null;
    // Quan hệ
    this.tram = data.tram || null;
    this.cot = data.cot || null;
  }

  /**
   * Lấy tất cả volume cột của trạm
   */
  static async getAll(includeRelations = false) {
    const [rows] = await pool.execute('SELECT * FROM tram_cot ORDER BY ngaytao DESC');
    
    const tramCots = rows.map(row => new TramCotModel(row));
    
    if (includeRelations) {
      for (const tc of tramCots) {
        if (tc.tram_id) tc.tram = await TramModel.getById(tc.tram_id);
        if (tc.cot_id) tc.cot = await ThuVienCotModel.getById(tc.cot_id);
      }
    }
    
    return tramCots;
  }

  /**
   * Lấy volume cột theo ID
   */
  static async getById(id, includeRelations = false) {
    const [rows] = await pool.execute('SELECT * FROM tram_cot WHERE id = ?', [id]);
    if (rows.length === 0) return null;
    
    const tramCot = new TramCotModel(rows[0]);
    
    if (includeRelations) {
      if (tramCot.tram_id) tramCot.tram = await TramModel.getById(tramCot.tram_id);
      if (tramCot.cot_id) tramCot.cot = await ThuVienCotModel.getById(tramCot.cot_id);
    }
    
    return tramCot;
  }

  /**
   * Lấy volume cột theo trạm
   */
  static async getByTram(tram_id) {
    const [rows] = await pool.execute(
      'SELECT * FROM tram_cot WHERE tram_id = ? ORDER BY ngaytao DESC',
      [tram_id]
    );
    return rows.map(row => new TramCotModel(row));
  }

  /**
   * Tạo volume cột mới
   */
  async create() {
    // Tính tổng tiền
    if (this.cot_id && this.soluong) {
      const cot = await ThuVienCotModel.getById(this.cot_id);
      if (cot) {
        this.tongtien = parseFloat(cot.giadonvi) * this.soluong;
      }
    }
    
    const [result] = await pool.execute(
      'INSERT INTO tram_cot (tram_id, cot_id, soluong, tongtien) VALUES (?, ?, ?, ?)',
      [this.tram_id, this.cot_id, this.soluong, this.tongtien]
    );
    this.id = result.insertId;
    return this;
  }

  /**
   * Cập nhật volume cột
   */
  async update() {
    // Tính lại tổng tiền
    if (this.cot_id && this.soluong) {
      const cot = await ThuVienCotModel.getById(this.cot_id);
      if (cot) {
        this.tongtien = parseFloat(cot.giadonvi) * this.soluong;
      }
    }
    
    await pool.execute(
      'UPDATE tram_cot SET tram_id = ?, cot_id = ?, soluong = ?, tongtien = ? WHERE id = ?',
      [this.tram_id, this.cot_id, this.soluong, this.tongtien, this.id]
    );
    return this;
  }

  /**
   * Xóa volume cột
   */
  async delete() {
    await pool.execute('DELETE FROM tram_cot WHERE id = ?', [this.id]);
    return true;
  }

  /**
   * Chuyển đổi thành object thuần
   */
  toJSON() {
    return {
      id: this.id,
      tram_id: this.tram_id,
      cot_id: this.cot_id,
      soluong: this.soluong,
      tongtien: parseFloat(this.tongtien),
      ngaytao: this.ngaytao,
      ngaysua: this.ngaysua,
      tram: this.tram ? this.tram.toJSON() : null,
      cot: this.cot ? this.cot.toJSON() : null
    };
  }
}

