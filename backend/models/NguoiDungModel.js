import pool from '../config/database.js';

/**
 * Model Người Dùng
 * Thuộc tính hóa đối tượng Người Dùng
 */
export class NguoiDungModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.ten = data.ten || '';
    this.email = data.email || '';
    this.matkhau_hash = data.matkhau_hash || '';
    this.vaitro = data.vaitro || 'ktv';
    this.la_admin = data.la_admin || 0;
    this.ngaytao = data.ngaytao || null;
    this.ngaysua = data.ngaysua || null;
  }

  /**
   * Lấy tất cả người dùng
   */
  static async getAll() {
    const [rows] = await pool.execute('SELECT id, ten, email, vaitro, la_admin, ngaytao, ngaysua FROM nguoidung ORDER BY ten ASC');
    return rows.map(row => new NguoiDungModel(row));
  }

  /**
   * Lấy người dùng theo ID
   */
  static async getById(id) {
    const [rows] = await pool.execute(
      'SELECT id, ten, email, vaitro, la_admin, ngaytao, ngaysua FROM nguoidung WHERE id = ?',
      [id]
    );
    if (rows.length === 0) return null;
    return new NguoiDungModel(rows[0]);
  }

  /**
   * Lấy người dùng theo email
   */
  static async getByEmail(email) {
    const [rows] = await pool.execute('SELECT * FROM nguoidung WHERE email = ?', [email]);
    if (rows.length === 0) return null;
    return new NguoiDungModel(rows[0]);
  }

  /**
   * Tạo người dùng mới
   */
  async create() {
    const [result] = await pool.execute(
      'INSERT INTO nguoidung (ten, email, matkhau_hash, vaitro, la_admin) VALUES (?, ?, ?, ?, ?)',
      [this.ten, this.email, this.matkhau_hash, this.vaitro, this.la_admin || 0]
    );
    this.id = result.insertId;
    return this;
  }

  /**
   * Cập nhật người dùng
   */
  async update() {
    const updates = [];
    const values = [];
    
    if (this.ten) {
      updates.push('ten = ?');
      values.push(this.ten);
    }
    if (this.email) {
      updates.push('email = ?');
      values.push(this.email);
    }
    if (this.matkhau_hash) {
      updates.push('matkhau_hash = ?');
      values.push(this.matkhau_hash);
    }
    if (this.vaitro) {
      updates.push('vaitro = ?');
      values.push(this.vaitro);
    }
    if (this.la_admin !== undefined) {
      updates.push('la_admin = ?');
      values.push(this.la_admin);
    }
    
    if (updates.length === 0) return this;
    
    values.push(this.id);
    await pool.execute(
      `UPDATE nguoidung SET ${updates.join(', ')} WHERE id = ?`,
      values
    );
    return this;
  }

  /**
   * Xóa người dùng
   */
  async delete() {
    await pool.execute('DELETE FROM nguoidung WHERE id = ?', [this.id]);
    return true;
  }

  /**
   * Chuyển đổi thành object thuần (không bao gồm mật khẩu)
   */
  toJSON() {
    return {
      id: this.id,
      ten: this.ten,
      email: this.email,
      vaitro: this.vaitro,
      la_admin: this.la_admin || 0,
      ngaytao: this.ngaytao,
      ngaysua: this.ngaysua
    };
  }
}

