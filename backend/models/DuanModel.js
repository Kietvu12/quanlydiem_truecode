import pool from '../config/database.js';

/**
 * Model Dự Án
 * Thuộc tính hóa đối tượng Dự Án
 */
export class DuanModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.maduan = data.maduan || '';
    this.tenduan = data.tenduan || '';
    this.mota = data.mota || null;
    this.ngaytao = data.ngaytao || null;
    this.ngaysua = data.ngaysua || null;
  }

  /**
   * Lấy tất cả dự án
   */
  static async getAll() {
    const [rows] = await pool.execute('SELECT * FROM duan ORDER BY tenduan ASC');
    return rows.map(row => new DuanModel(row));
  }

  /**
   * Lấy dự án theo ID
   */
  static async getById(id) {
    const [rows] = await pool.execute('SELECT * FROM duan WHERE id = ?', [id]);
    if (rows.length === 0) return null;
    return new DuanModel(rows[0]);
  }

  /**
   * Lấy dự án theo mã
   */
  static async getByMaDuan(maduan) {
    const [rows] = await pool.execute('SELECT * FROM duan WHERE maduan = ?', [maduan]);
    if (rows.length === 0) return null;
    return new DuanModel(rows[0]);
  }

  /**
   * Tạo dự án mới
   */
  async create() {
    const [result] = await pool.execute(
      'INSERT INTO duan (maduan, tenduan, mota) VALUES (?, ?, ?)',
      [this.maduan, this.tenduan, this.mota]
    );
    this.id = result.insertId;
    return this;
  }

  /**
   * Cập nhật dự án
   */
  async update() {
    await pool.execute(
      'UPDATE duan SET maduan = ?, tenduan = ?, mota = ? WHERE id = ?',
      [this.maduan, this.tenduan, this.mota, this.id]
    );
    return this;
  }

  /**
   * Xóa dự án
   */
  async delete() {
    await pool.execute('DELETE FROM duan WHERE id = ?', [this.id]);
    return true;
  }

  /**
   * Chuyển đổi thành object thuần
   */
  toJSON() {
    return {
      id: this.id,
      maduan: this.maduan,
      tenduan: this.tenduan,
      mota: this.mota,
      ngaytao: this.ngaytao,
      ngaysua: this.ngaysua
    };
  }
}

