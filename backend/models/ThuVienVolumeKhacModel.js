import pool from '../config/database.js';

/**
 * Model Thư Viện Volume Khác
 * Thuộc tính hóa đối tượng Thư Viện Volume Khác
 */
export class ThuVienVolumeKhacModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.mavolume = data.mavolume || '';
    this.tenvolume = data.tenvolume || '';
    this.mota = data.mota || null;
    this.giadonvi = data.giadonvi || 0.00;
    this.ngaytao = data.ngaytao || null;
  }

  /**
   * Lấy tất cả volume khác
   */
  static async getAll() {
    const [rows] = await pool.execute('SELECT * FROM thuvien_volume_khac ORDER BY tenvolume ASC');
    return rows.map(row => new ThuVienVolumeKhacModel(row));
  }

  /**
   * Lấy volume khác theo ID
   */
  static async getById(id) {
    const [rows] = await pool.execute('SELECT * FROM thuvien_volume_khac WHERE id = ?', [id]);
    if (rows.length === 0) return null;
    return new ThuVienVolumeKhacModel(rows[0]);
  }

  /**
   * Lấy volume khác theo mã
   */
  static async getByMaVolume(mavolume) {
    const [rows] = await pool.execute('SELECT * FROM thuvien_volume_khac WHERE mavolume = ?', [mavolume]);
    if (rows.length === 0) return null;
    return new ThuVienVolumeKhacModel(rows[0]);
  }

  /**
   * Tạo volume khác mới
   */
  async create() {
    const [result] = await pool.execute(
      'INSERT INTO thuvien_volume_khac (mavolume, tenvolume, mota, giadonvi) VALUES (?, ?, ?, ?)',
      [this.mavolume, this.tenvolume, this.mota, this.giadonvi]
    );
    this.id = result.insertId;
    return this;
  }

  /**
   * Cập nhật volume khác
   */
  async update() {
    await pool.execute(
      'UPDATE thuvien_volume_khac SET mavolume = ?, tenvolume = ?, mota = ?, giadonvi = ? WHERE id = ?',
      [this.mavolume, this.tenvolume, this.mota, this.giadonvi, this.id]
    );
    return this;
  }

  /**
   * Xóa volume khác
   */
  async delete() {
    await pool.execute('DELETE FROM thuvien_volume_khac WHERE id = ?', [this.id]);
    return true;
  }

  /**
   * Chuyển đổi thành object thuần
   */
  toJSON() {
    return {
      id: this.id,
      mavolume: this.mavolume,
      tenvolume: this.tenvolume,
      mota: this.mota,
      giadonvi: parseFloat(this.giadonvi),
      ngaytao: this.ngaytao
    };
  }
}

