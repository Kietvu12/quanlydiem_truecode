import pool from '../config/database.js';
import { DuanModel } from './DuanModel.js';
import { TramModel } from './TramModel.js';

/**
 * Model Hợp Đồng
 * Thuộc tính hóa đối tượng Hợp Đồng
 */
export class HopDongModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.duan_id = data.duan_id || null;
    this.sohopdong = data.sohopdong || '';
    this.chudautu = data.chudautu || '';
    this.ngayky = data.ngayky || null;
    this.tonggiatri = data.tonggiatri || 0.00;
    this.trangthai = data.trangthai || 'dangxuly';
    this.daxoa = data.daxoa || 0;
    this.ngaytao = data.ngaytao || null;
    this.ngaysua = data.ngaysua || null;
    // Quan hệ
    this.duan = data.duan || null;
    this.trams = data.trams || [];
  }

  /**
   * Lấy tất cả hợp đồng
   */
  static async getAll(includeRelations = false) {
    const [rows] = await pool.execute(
      'SELECT * FROM hopdong WHERE daxoa = 0 ORDER BY ngayky DESC'
    );
    
    const hopDongs = rows.map(row => new HopDongModel(row));
    
    if (includeRelations) {
      for (const hd of hopDongs) {
        if (hd.duan_id) {
          hd.duan = await DuanModel.getById(hd.duan_id);
        }
        hd.trams = await this.getTramsByHopDong(hd.id);
      }
    }
    
    return hopDongs;
  }

  /**
   * Lấy hợp đồng theo ID
   */
  static async getById(id, includeRelations = false) {
    const [rows] = await pool.execute('SELECT * FROM hopdong WHERE id = ? AND daxoa = 0', [id]);
    if (rows.length === 0) return null;
    
    const hopDong = new HopDongModel(rows[0]);
    
    if (includeRelations) {
      if (hopDong.duan_id) {
        hopDong.duan = await DuanModel.getById(hopDong.duan_id);
      }
      hopDong.trams = await this.getTramsByHopDong(hopDong.id);
    }
    
    return hopDong;
  }

  /**
   * Lấy các trạm thuộc hợp đồng
   */
  static async getTramsByHopDong(hopdong_id) {
    const [rows] = await pool.execute(
      `SELECT t.* FROM tram t
       INNER JOIN hopdong_tram ht ON t.id = ht.tram_id
       WHERE ht.hopdong_id = ?`,
      [hopdong_id]
    );
    return rows.map(row => new TramModel(row));
  }

  /**
   * Tính tổng giá trị hợp đồng từ volume các trạm
   */
  static async calculateTongGiaTri(hopdong_id) {
    // Tính từ tram_cot
    const [cotResult] = await pool.execute(
      `SELECT SUM(tc.tongtien) as tong_cot
       FROM tram_cot tc
       INNER JOIN hopdong_tram ht ON tc.tram_id = ht.tram_id
       WHERE ht.hopdong_id = ?`,
      [hopdong_id]
    );
    
    // Tính từ tram_volume_khac
    const [volResult] = await pool.execute(
      `SELECT SUM(tv.tongtien) as tong_vol
       FROM tram_volume_khac tv
       INNER JOIN hopdong_tram ht ON tv.tram_id = ht.tram_id
       WHERE ht.hopdong_id = ?`,
      [hopdong_id]
    );
    
    const tongCot = parseFloat(cotResult[0]?.tong_cot || 0);
    const tongVol = parseFloat(volResult[0]?.tong_vol || 0);
    
    return tongCot + tongVol;
  }

  /**
   * Tạo hợp đồng mới
   */
  async create() {
    const [result] = await pool.execute(
      'INSERT INTO hopdong (duan_id, sohopdong, chudautu, ngayky, tonggiatri, trangthai) VALUES (?, ?, ?, ?, ?, ?)',
      [this.duan_id, this.sohopdong, this.chudautu, this.ngayky, this.tonggiatri, this.trangthai]
    );
    this.id = result.insertId;
    return this;
  }

  /**
   * Cập nhật hợp đồng
   */
  async update() {
    await pool.execute(
      'UPDATE hopdong SET duan_id = ?, sohopdong = ?, chudautu = ?, ngayky = ?, tonggiatri = ?, trangthai = ? WHERE id = ?',
      [this.duan_id, this.sohopdong, this.chudautu, this.ngayky, this.tonggiatri, this.trangthai, this.id]
    );
    return this;
  }

  /**
   * Xóa hợp đồng (soft delete)
   */
  async delete() {
    await pool.execute('UPDATE hopdong SET daxoa = 1 WHERE id = ?', [this.id]);
    return true;
  }

  /**
   * Thêm trạm vào hợp đồng
   */
  async addTram(tram_id) {
    await pool.execute(
      'INSERT INTO hopdong_tram (hopdong_id, tram_id) VALUES (?, ?)',
      [this.id, tram_id]
    );
    return true;
  }

  /**
   * Xóa trạm khỏi hợp đồng
   */
  async removeTram(tram_id) {
    await pool.execute(
      'DELETE FROM hopdong_tram WHERE hopdong_id = ? AND tram_id = ?',
      [this.id, tram_id]
    );
    return true;
  }

  /**
   * Chuyển đổi thành object thuần
   */
  toJSON() {
    return {
      id: this.id,
      duan_id: this.duan_id,
      sohopdong: this.sohopdong,
      chudautu: this.chudautu,
      ngayky: this.ngayky,
      tonggiatri: parseFloat(this.tonggiatri),
      trangthai: this.trangthai,
      daxoa: this.daxoa,
      ngaytao: this.ngaytao,
      ngaysua: this.ngaysua,
      duan: this.duan ? this.duan.toJSON() : null,
      trams: this.trams.map(t => t.toJSON())
    };
  }
}

