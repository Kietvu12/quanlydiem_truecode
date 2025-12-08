import pool from '../config/database.js';
import { HopDongModel } from './HopDongModel.js';
import { NguoiDungModel } from './NguoiDungModel.js';

/**
 * Model Chênh Lệch Hợp Đồng
 * Thuộc tính hóa đối tượng Chênh Lệch Hợp Đồng
 */
export class ChenhLechHopDongModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.hopdong_id = data.hopdong_id || null;
    this.ngay = data.ngay || null;
    // Chênh lệch cột
    this.chenhlech_cot = data.chenhlech_cot || 0;
    this.phantram_chenhlech_cot = data.phantram_chenhlech_cot || 0;
    // Chênh lệch volume khác
    this.chenhlech_volume_khac = data.chenhlech_volume_khac || 0;
    this.phantram_chenhlech_vol = data.phantram_chenhlech_vol || 0;
    // Chênh lệch tổng giá trị
    this.chenhlech_tongtien = data.chenhlech_tongtien || 0.00;
    this.phantram_chenhlech_tien = data.phantram_chenhlech_tien || 0;
    this.nguoinhap_id = data.nguoinhap_id || null;
    this.ghi_chu = data.ghi_chu || null;
    this.ngaytao = data.ngaytao || null;
    // Quan hệ
    this.hopdong = data.hopdong || null;
    this.nguoinhap = data.nguoinhap || null;
  }

  /**
   * Lấy tất cả chênh lệch hợp đồng
   */
  static async getAll(includeRelations = false) {
    const [rows] = await pool.execute('SELECT * FROM chenhlech_hopdong ORDER BY ngay DESC, ngaytao DESC');
    
    const chenhLechs = rows.map(row => new ChenhLechHopDongModel(row));
    
    if (includeRelations) {
      for (const cl of chenhLechs) {
        if (cl.hopdong_id) cl.hopdong = await HopDongModel.getById(cl.hopdong_id);
        if (cl.nguoinhap_id) cl.nguoinhap = await NguoiDungModel.getById(cl.nguoinhap_id);
      }
    }
    
    return chenhLechs;
  }

  /**
   * Lấy chênh lệch theo ID
   */
  static async getById(id, includeRelations = false) {
    const [rows] = await pool.execute('SELECT * FROM chenhlech_hopdong WHERE id = ?', [id]);
    if (rows.length === 0) return null;
    
    const chenhLech = new ChenhLechHopDongModel(rows[0]);
    
    if (includeRelations) {
      if (chenhLech.hopdong_id) chenhLech.hopdong = await HopDongModel.getById(chenhLech.hopdong_id);
      if (chenhLech.nguoinhap_id) chenhLech.nguoinhap = await NguoiDungModel.getById(chenhLech.nguoinhap_id);
    }
    
    return chenhLech;
  }

  /**
   * Lấy chênh lệch theo hợp đồng
   */
  static async getByHopDong(hopdong_id) {
    const [rows] = await pool.execute(
      'SELECT * FROM chenhlech_hopdong WHERE hopdong_id = ? ORDER BY ngay DESC, ngaytao DESC',
      [hopdong_id]
    );
    return rows.map(row => new ChenhLechHopDongModel(row));
  }

  /**
   * Lấy chênh lệch theo hợp đồng và ngày
   */
  static async getByHopDongAndNgay(hopdong_id, ngay) {
    const [rows] = await pool.execute(
      'SELECT * FROM chenhlech_hopdong WHERE hopdong_id = ? AND ngay = ?',
      [hopdong_id, ngay]
    );
    if (rows.length === 0) return null;
    return new ChenhLechHopDongModel(rows[0]);
  }

  /**
   * Tính toán chênh lệch từ volume dự toán và thực tế
   */
  static async calculateChenhLech(hopdong_id) {
    // Lấy volume dự toán từ tram_cot và tram_volume_khac
    const [cotDuToan] = await pool.execute(
      `SELECT SUM(tc.soluong) as tong_sl, SUM(tc.tongtien) as tong_tien
       FROM tram_cot tc
       INNER JOIN hopdong_tram ht ON tc.tram_id = ht.tram_id
       WHERE ht.hopdong_id = ?`,
      [hopdong_id]
    );
    
    const [volDuToan] = await pool.execute(
      `SELECT SUM(tv.soluong) as tong_sl, SUM(tv.tongtien) as tong_tien
       FROM tram_volume_khac tv
       INNER JOIN hopdong_tram ht ON tv.tram_id = ht.tram_id
       WHERE ht.hopdong_id = ?`,
      [hopdong_id]
    );
    
    // Lấy volume thực tế từ tram_thucte_cot và tram_thucte_volume_khac
    const [cotThucTe] = await pool.execute(
      `SELECT SUM(ttc.soluong_thucte) as tong_sl
       FROM tram_thucte_cot ttc
       WHERE ttc.hopdong_id = ?`,
      [hopdong_id]
    );
    
    const [volThucTe] = await pool.execute(
      `SELECT SUM(ttv.soluong_thucte) as tong_sl
       FROM tram_thucte_volume_khac ttv
       WHERE ttv.hopdong_id = ?`,
      [hopdong_id]
    );
    
    const slCotDuToan = parseInt(cotDuToan[0]?.tong_sl || 0);
    const slCotThucTe = parseInt(cotThucTe[0]?.tong_sl || 0);
    const slVolDuToan = parseInt(volDuToan[0]?.tong_sl || 0);
    const slVolThucTe = parseInt(volThucTe[0]?.tong_sl || 0);
    const tienDuToan = parseFloat(cotDuToan[0]?.tong_tien || 0) + parseFloat(volDuToan[0]?.tong_tien || 0);
    
    // Tính chênh lệch
    const chenhlech_cot = slCotThucTe - slCotDuToan;
    const chenhlech_vol = slVolThucTe - slVolDuToan;
    
    // Tính phần trăm
    const phantram_cot = slCotDuToan > 0 ? (chenhlech_cot / slCotDuToan) * 100 : 0;
    const phantram_vol = slVolDuToan > 0 ? (chenhlech_vol / slVolDuToan) * 100 : 0;
    
    // Tính chênh lệch tiền (cần tính từ giá đơn vị thực tế)
    // Tạm thời để 0, có thể tính sau
    const chenhlech_tongtien = 0;
    const phantram_tien = tienDuToan > 0 ? (chenhlech_tongtien / tienDuToan) * 100 : 0;
    
    return {
      chenhlech_cot,
      phantram_chenhlech_cot: phantram_cot,
      chenhlech_volume_khac: chenhlech_vol,
      phantram_chenhlech_vol: phantram_vol,
      chenhlech_tongtien,
      phantram_chenhlech_tien: phantram_tien
    };
  }

  /**
   * Tạo chênh lệch mới
   */
  async create() {
    const [result] = await pool.execute(
      `INSERT INTO chenhlech_hopdong 
       (hopdong_id, ngay, chenhlech_cot, phantram_chenhlech_cot,
        chenhlech_volume_khac, phantram_chenhlech_vol,
        chenhlech_tongtien, phantram_chenhlech_tien, nguoinhap_id, ghi_chu)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        this.hopdong_id, this.ngay,
        this.chenhlech_cot, this.phantram_chenhlech_cot,
        this.chenhlech_volume_khac, this.phantram_chenhlech_vol,
        this.chenhlech_tongtien, this.phantram_chenhlech_tien,
        this.nguoinhap_id, this.ghi_chu
      ]
    );
    this.id = result.insertId;
    return this;
  }

  /**
   * Cập nhật chênh lệch
   */
  async update() {
    await pool.execute(
      `UPDATE chenhlech_hopdong SET
       chenhlech_cot = ?, phantram_chenhlech_cot = ?,
       chenhlech_volume_khac = ?, phantram_chenhlech_vol = ?,
       chenhlech_tongtien = ?, phantram_chenhlech_tien = ?,
       nguoinhap_id = ?, ghi_chu = ?
       WHERE id = ?`,
      [
        this.chenhlech_cot, this.phantram_chenhlech_cot,
        this.chenhlech_volume_khac, this.phantram_chenhlech_vol,
        this.chenhlech_tongtien, this.phantram_chenhlech_tien,
        this.nguoinhap_id, this.ghi_chu,
        this.id
      ]
    );
    return this;
  }

  /**
   * Xóa chênh lệch
   */
  async delete() {
    await pool.execute('DELETE FROM chenhlech_hopdong WHERE id = ?', [this.id]);
    return true;
  }

  /**
   * Chuyển đổi thành object thuần
   */
  toJSON() {
    return {
      id: this.id,
      hopdong_id: this.hopdong_id,
      ngay: this.ngay,
      chenhlech_cot: this.chenhlech_cot,
      phantram_chenhlech_cot: parseFloat(this.phantram_chenhlech_cot),
      chenhlech_volume_khac: this.chenhlech_volume_khac,
      phantram_chenhlech_vol: parseFloat(this.phantram_chenhlech_vol),
      chenhlech_tongtien: parseFloat(this.chenhlech_tongtien),
      phantram_chenhlech_tien: parseFloat(this.phantram_chenhlech_tien),
      nguoinhap_id: this.nguoinhap_id,
      ghi_chu: this.ghi_chu,
      ngaytao: this.ngaytao,
      hopdong: this.hopdong ? this.hopdong.toJSON() : null,
      nguoinhap: this.nguoinhap ? this.nguoinhap.toJSON() : null
    };
  }
}

