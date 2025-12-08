import pool from '../config/database.js';
import { NguoiDungModel } from './NguoiDungModel.js';

/**
 * Model Lịch Sử
 * Thuộc tính hóa đối tượng Lịch Sử
 */
export class LichSuModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.nguoidung_id = data.nguoidung_id || null;
    this.hanhdong = data.hanhdong || '';
    this.dulieu_truoc = data.dulieu_truoc || null;
    this.dulieu_sau = data.dulieu_sau || null;
    this.ngaytao = data.ngaytao || null;
    // Quan hệ
    this.nguoidung = data.nguoidung || null;
  }

  /**
   * Lấy tất cả lịch sử
   */
  static async getAll(includeRelations = false, limit = 100) {
    const [rows] = await pool.execute(
      'SELECT * FROM lichsu ORDER BY ngaytao DESC LIMIT ?',
      [limit]
    );
    
    const lichSus = rows.map(row => {
      const ls = new LichSuModel(row);
      if (ls.dulieu_truoc && typeof ls.dulieu_truoc === 'string') {
        try {
          ls.dulieu_truoc = JSON.parse(ls.dulieu_truoc);
        } catch (e) {
          // Giữ nguyên nếu không parse được
        }
      }
      if (ls.dulieu_sau && typeof ls.dulieu_sau === 'string') {
        try {
          ls.dulieu_sau = JSON.parse(ls.dulieu_sau);
        } catch (e) {
          // Giữ nguyên nếu không parse được
        }
      }
      return ls;
    });
    
    if (includeRelations) {
      for (const ls of lichSus) {
        if (ls.nguoidung_id) {
          ls.nguoidung = await NguoiDungModel.getById(ls.nguoidung_id);
        }
      }
    }
    
    return lichSus;
  }

  /**
   * Lấy lịch sử theo ID
   */
  static async getById(id, includeRelations = false) {
    const [rows] = await pool.execute('SELECT * FROM lichsu WHERE id = ?', [id]);
    if (rows.length === 0) return null;
    
    const lichSu = new LichSuModel(rows[0]);
    
    if (lichSu.dulieu_truoc && typeof lichSu.dulieu_truoc === 'string') {
      try {
        lichSu.dulieu_truoc = JSON.parse(lichSu.dulieu_truoc);
      } catch (e) {}
    }
    if (lichSu.dulieu_sau && typeof lichSu.dulieu_sau === 'string') {
      try {
        lichSu.dulieu_sau = JSON.parse(lichSu.dulieu_sau);
      } catch (e) {}
    }
    
    if (includeRelations && lichSu.nguoidung_id) {
      lichSu.nguoidung = await NguoiDungModel.getById(lichSu.nguoidung_id);
    }
    
    return lichSu;
  }

  /**
   * Lấy lịch sử theo người dùng
   */
  static async getByNguoiDung(nguoidung_id, limit = 50) {
    const [rows] = await pool.execute(
      'SELECT * FROM lichsu WHERE nguoidung_id = ? ORDER BY ngaytao DESC LIMIT ?',
      [nguoidung_id, limit]
    );
    return rows.map(row => {
      const ls = new LichSuModel(row);
      if (ls.dulieu_truoc && typeof ls.dulieu_truoc === 'string') {
        try { ls.dulieu_truoc = JSON.parse(ls.dulieu_truoc); } catch (e) {}
      }
      if (ls.dulieu_sau && typeof ls.dulieu_sau === 'string') {
        try { ls.dulieu_sau = JSON.parse(ls.dulieu_sau); } catch (e) {}
      }
      return ls;
    });
  }

  /**
   * Tạo lịch sử mới
   */
  async create() {
    const dulieu_truoc_json = this.dulieu_truoc ? JSON.stringify(this.dulieu_truoc) : null;
    const dulieu_sau_json = this.dulieu_sau ? JSON.stringify(this.dulieu_sau) : null;
    
    const [result] = await pool.execute(
      'INSERT INTO lichsu (nguoidung_id, hanhdong, dulieu_truoc, dulieu_sau) VALUES (?, ?, ?, ?)',
      [this.nguoidung_id, this.hanhdong, dulieu_truoc_json, dulieu_sau_json]
    );
    this.id = result.insertId;
    return this;
  }

  /**
   * Chuyển đổi thành object thuần
   */
  toJSON() {
    return {
      id: this.id,
      nguoidung_id: this.nguoidung_id,
      hanhdong: this.hanhdong,
      dulieu_truoc: this.dulieu_truoc,
      dulieu_sau: this.dulieu_sau,
      ngaytao: this.ngaytao,
      nguoidung: this.nguoidung ? this.nguoidung.toJSON() : null
    };
  }
}
