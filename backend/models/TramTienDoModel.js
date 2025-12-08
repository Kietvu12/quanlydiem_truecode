import pool from '../config/database.js';
import { TramModel } from './TramModel.js';
import { HopDongModel } from './HopDongModel.js';
import { NguoiDungModel } from './NguoiDungModel.js';

/**
 * Model Trạm Tiến Độ
 * Thuộc tính hóa đối tượng Trạm Tiến Độ
 */
export class TramTienDoModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.tram_id = data.tram_id || null;
    this.hopdong_id = data.hopdong_id || null;
    // KCS
    this.ngay_kcs = data.ngay_kcs || null;
    this.trangthai_kcs = data.trangthai_kcs || 'chua_bat_dau';
    this.phantram_kcs = data.phantram_kcs || 0;
    // Dự toán
    this.ngay_du_toan = data.ngay_du_toan || null;
    this.trangthai_dutoan = data.trangthai_dutoan || 'chua_bat_dau';
    this.phantram_dutoan = data.phantram_dutoan || 0;
    // Khảo sát
    this.ngay_khao_sat = data.ngay_khao_sat || null;
    this.nguoi_ks_id = data.nguoi_ks_id || null;
    this.trangthai_ks = data.trangthai_ks || 'chua_bat_dau';
    this.phantram_ks = data.phantram_ks || 0;
    // Tình trạng và vướng mắc
    this.tinh_trang = data.tinh_trang || 'binh_thuong';
    this.vuong_mac = data.vuong_mac || null;
    this.ngaytao = data.ngaytao || null;
    this.ngaysua = data.ngaysua || null;
    // Quan hệ
    this.tram = data.tram || null;
    this.hopdong = data.hopdong || null;
    this.nguoi_ks = data.nguoi_ks || null;
  }

  /**
   * Lấy tất cả tiến độ trạm
   */
  static async getAll(includeRelations = false) {
    const [rows] = await pool.execute('SELECT * FROM tram_tiendo ORDER BY ngaytao DESC');
    
    const tienDos = rows.map(row => new TramTienDoModel(row));
    
    if (includeRelations) {
      for (const td of tienDos) {
        if (td.tram_id) td.tram = await TramModel.getById(td.tram_id);
        if (td.hopdong_id) td.hopdong = await HopDongModel.getById(td.hopdong_id);
        if (td.nguoi_ks_id) td.nguoi_ks = await NguoiDungModel.getById(td.nguoi_ks_id);
      }
    }
    
    return tienDos;
  }

  /**
   * Lấy tiến độ theo ID
   */
  static async getById(id, includeRelations = false) {
    const [rows] = await pool.execute('SELECT * FROM tram_tiendo WHERE id = ?', [id]);
    if (rows.length === 0) return null;
    
    const tienDo = new TramTienDoModel(rows[0]);
    
    if (includeRelations) {
      if (tienDo.tram_id) tienDo.tram = await TramModel.getById(tienDo.tram_id);
      if (tienDo.hopdong_id) tienDo.hopdong = await HopDongModel.getById(tienDo.hopdong_id);
      if (tienDo.nguoi_ks_id) tienDo.nguoi_ks = await NguoiDungModel.getById(tienDo.nguoi_ks_id);
    }
    
    return tienDo;
  }

  /**
   * Lấy tiến độ theo trạm và hợp đồng
   */
  static async getByTramAndHopDong(tram_id, hopdong_id) {
    const [rows] = await pool.execute(
      'SELECT * FROM tram_tiendo WHERE tram_id = ? AND hopdong_id = ?',
      [tram_id, hopdong_id]
    );
    if (rows.length === 0) return null;
    return new TramTienDoModel(rows[0]);
  }

  /**
   * Lấy tiến độ theo hợp đồng
   */
  static async getByHopDong(hopdong_id) {
    const [rows] = await pool.execute(
      'SELECT * FROM tram_tiendo WHERE hopdong_id = ? ORDER BY ngaytao DESC',
      [hopdong_id]
    );
    return rows.map(row => new TramTienDoModel(row));
  }

  /**
   * Tạo tiến độ mới
   */
  async create() {
    const [result] = await pool.execute(
      `INSERT INTO tram_tiendo 
       (tram_id, hopdong_id, ngay_kcs, trangthai_kcs, phantram_kcs, 
        ngay_du_toan, trangthai_dutoan, phantram_dutoan,
        ngay_khao_sat, nguoi_ks_id, trangthai_ks, phantram_ks,
        tinh_trang, vuong_mac) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        this.tram_id, this.hopdong_id,
        this.ngay_kcs, this.trangthai_kcs, this.phantram_kcs,
        this.ngay_du_toan, this.trangthai_dutoan, this.phantram_dutoan,
        this.ngay_khao_sat, this.nguoi_ks_id, this.trangthai_ks, this.phantram_ks,
        this.tinh_trang, this.vuong_mac
      ]
    );
    this.id = result.insertId;
    return this;
  }

  /**
   * Cập nhật tiến độ
   */
  async update() {
    await pool.execute(
      `UPDATE tram_tiendo SET
       ngay_kcs = ?, trangthai_kcs = ?, phantram_kcs = ?,
       ngay_du_toan = ?, trangthai_dutoan = ?, phantram_dutoan = ?,
       ngay_khao_sat = ?, nguoi_ks_id = ?, trangthai_ks = ?, phantram_ks = ?,
       tinh_trang = ?, vuong_mac = ?
       WHERE id = ?`,
      [
        this.ngay_kcs, this.trangthai_kcs, this.phantram_kcs,
        this.ngay_du_toan, this.trangthai_dutoan, this.phantram_dutoan,
        this.ngay_khao_sat, this.nguoi_ks_id, this.trangthai_ks, this.phantram_ks,
        this.tinh_trang, this.vuong_mac,
        this.id
      ]
    );
    return this;
  }

  /**
   * Xóa tiến độ
   */
  async delete() {
    await pool.execute('DELETE FROM tram_tiendo WHERE id = ?', [this.id]);
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
      ngay_kcs: this.ngay_kcs,
      trangthai_kcs: this.trangthai_kcs,
      phantram_kcs: parseFloat(this.phantram_kcs),
      ngay_du_toan: this.ngay_du_toan,
      trangthai_dutoan: this.trangthai_dutoan,
      phantram_dutoan: parseFloat(this.phantram_dutoan),
      ngay_khao_sat: this.ngay_khao_sat,
      nguoi_ks_id: this.nguoi_ks_id,
      trangthai_ks: this.trangthai_ks,
      phantram_ks: parseFloat(this.phantram_ks),
      tinh_trang: this.tinh_trang,
      vuong_mac: this.vuong_mac,
      ngaytao: this.ngaytao,
      ngaysua: this.ngaysua,
      tram: this.tram ? this.tram.toJSON() : null,
      hopdong: this.hopdong ? this.hopdong.toJSON() : null,
      nguoi_ks: this.nguoi_ks ? this.nguoi_ks.toJSON() : null
    };
  }
}

