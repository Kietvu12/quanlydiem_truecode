import { LichSuModel } from '../models/LichSuModel.js';

/**
 * Controller Lịch Sử
 */
export const getAll = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const includeRelations = req.query.include_relations === 'true';
    const lichSus = await LichSuModel.getAll(includeRelations, limit);
    res.json(lichSus.map(ls => ls.toJSON()));
  } catch (error) {
    console.error('Lỗi lấy danh sách lịch sử:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

export const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const includeRelations = req.query.include_relations === 'true';
    const lichSu = await LichSuModel.getById(id, includeRelations);
    
    if (!lichSu) {
      return res.status(404).json({ error: 'Không tìm thấy lịch sử' });
    }
    
    res.json(lichSu.toJSON());
  } catch (error) {
    console.error('Lỗi lấy lịch sử:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

export const getByNguoiDung = async (req, res) => {
  try {
    const { nguoidung_id } = req.params;
    const limit = parseInt(req.query.limit) || 50;
    const lichSus = await LichSuModel.getByNguoiDung(nguoidung_id, limit);
    res.json(lichSus.map(ls => ls.toJSON()));
  } catch (error) {
    console.error('Lỗi lấy lịch sử theo người dùng:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

