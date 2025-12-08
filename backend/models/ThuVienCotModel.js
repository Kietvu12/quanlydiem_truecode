import pool from '../config/database.js';

/**
 * Model Thư Viện Cột
 * Thuộc tính hóa đối tượng Thư Viện Cột
 */
export class ThuVienCotModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.macot = data.macot || '';
    this.tencot = data.tencot || '';
    this.vitri = data.vitri || null;
    this.cao = data.cao || null;
    this.giadonvi = data.giadonvi || 0.00;
    this.mota = data.mota || null;
    this.ngaytao = data.ngaytao || null;
  }

  /**
   * Lấy tất cả cột
   */
  static async getAll() {
    const [rows] = await pool.execute('SELECT * FROM thuviencot ORDER BY tencot ASC');
    return rows.map(row => new ThuVienCotModel(row));
  }

  /**
   * Lấy cột theo ID
   */
  static async getById(id) {
    const [rows] = await pool.execute('SELECT * FROM thuviencot WHERE id = ?', [id]);
    if (rows.length === 0) return null;
    return new ThuVienCotModel(rows[0]);
  }

  /**
   * Lấy cột theo mã
   */
  static async getByMaCot(macot) {
    const [rows] = await pool.execute('SELECT * FROM thuviencot WHERE macot = ?', [macot]);
    if (rows.length === 0) return null;
    return new ThuVienCotModel(rows[0]);
  }

  /**
   * Tạo cột mới
   */
  async create() {
    const [result] = await pool.execute(
      'INSERT INTO thuviencot (macot, tencot, vitri, cao, giadonvi, mota) VALUES (?, ?, ?, ?, ?, ?)',
      [this.macot, this.tencot, this.vitri, this.cao, this.giadonvi, this.mota]
    );
    this.id = result.insertId;
    return this;
  }

  /**
   * Cập nhật cột
   */
  async update() {
    await pool.execute(
      'UPDATE thuviencot SET macot = ?, tencot = ?, vitri = ?, cao = ?, giadonvi = ?, mota = ? WHERE id = ?',
      [this.macot, this.tencot, this.vitri, this.cao, this.giadonvi, this.mota, this.id]
    );
    return this;
  }

  /**
   * Xóa cột
   */
  async delete() {
    await pool.execute('DELETE FROM thuviencot WHERE id = ?', [this.id]);
    return true;
  }

  /**
   * Chuyển đổi thành object thuần
   */
  toJSON() {
    return {
      id: this.id,
      macot: this.macot,
      tencot: this.tencot,
      vitri: this.vitri,
      cao: this.cao,
      giadonvi: parseFloat(this.giadonvi),
      mota: this.mota,
      ngaytao: this.ngaytao
    };
  }
}

