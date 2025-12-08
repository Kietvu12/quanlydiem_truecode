import pool from '../config/database.js';

/**
 * Model Khu Vực
 * Thuộc tính hóa đối tượng Khu Vực
 */
export class KhuVucModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.ma = data.ma || '';
    this.ten = data.ten || '';
    this.mota = data.mota || null;
    this.ngaytao = data.ngaytao || null;
    this.ngaysua = data.ngaysua || null;
  }

  /**
   * Lấy tất cả khu vực
   */
  static async getAll() {
    const [rows] = await pool.execute('SELECT * FROM khuvuc ORDER BY ten ASC');
    return rows.map(row => new KhuVucModel(row));
  }

  /**
   * Lấy khu vực theo ID
   */
  static async getById(id) {
    const [rows] = await pool.execute('SELECT * FROM khuvuc WHERE id = ?', [id]);
    if (rows.length === 0) return null;
    return new KhuVucModel(rows[0]);
  }

  /**
   * Lấy khu vực theo mã
   */
  static async getByMa(ma) {
    const [rows] = await pool.execute('SELECT * FROM khuvuc WHERE ma = ?', [ma]);
    if (rows.length === 0) return null;
    return new KhuVucModel(rows[0]);
  }

  /**
   * Tạo khu vực mới
   */
  async create() {
    const [result] = await pool.execute(
      'INSERT INTO khuvuc (ma, ten, mota) VALUES (?, ?, ?)',
      [this.ma, this.ten, this.mota]
    );
    this.id = result.insertId;
    return this;
  }

  /**
   * Cập nhật khu vực
   */
  async update() {
    await pool.execute(
      'UPDATE khuvuc SET ma = ?, ten = ?, mota = ? WHERE id = ?',
      [this.ma, this.ten, this.mota, this.id]
    );
    return this;
  }

  /**
   * Xóa khu vực
   */
  async delete() {
    await pool.execute('DELETE FROM khuvuc WHERE id = ?', [this.id]);
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
      mota: this.mota,
      ngaytao: this.ngaytao,
      ngaysua: this.ngaysua
    };
  }
}

