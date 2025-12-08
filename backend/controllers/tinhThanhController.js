import { TinhThanhModel } from '../models/TinhThanhModel.js';
import { logAction } from '../utils/logger.js';

/**
 * Controller Tỉnh Thành
 */
export const getAll = async (req, res) => {
  try {
    const includeKhuVuc = req.query.include_khuvuc === 'true';
    const tinhThanhs = await TinhThanhModel.getAll(includeKhuVuc);
    res.json(tinhThanhs.map(tt => tt.toJSON()));
  } catch (error) {
    console.error('Lỗi lấy danh sách tỉnh thành:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

export const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const includeKhuVuc = req.query.include_khuvuc === 'true';
    const tinhThanh = await TinhThanhModel.getById(id, includeKhuVuc);
    
    if (!tinhThanh) {
      return res.status(404).json({ error: 'Không tìm thấy tỉnh thành' });
    }
    
    res.json(tinhThanh.toJSON());
  } catch (error) {
    console.error('Lỗi lấy tỉnh thành:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

export const getByKhuVuc = async (req, res) => {
  try {
    const { khuvuc_id } = req.params;
    const tinhThanhs = await TinhThanhModel.getByKhuVuc(khuvuc_id);
    res.json(tinhThanhs.map(tt => tt.toJSON()));
  } catch (error) {
    console.error('Lỗi lấy tỉnh thành theo khu vực:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

export const create = async (req, res) => {
  try {
    const tinhThanh = new TinhThanhModel(req.body);
    await tinhThanh.create();
    
    await logAction(req.user?.id || null, `Tạo tỉnh thành mới: ${tinhThanh.ten}`, null, tinhThanh.toJSON());
    
    res.status(201).json(tinhThanh.toJSON());
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Mã tỉnh thành đã tồn tại' });
    }
    console.error('Lỗi tạo tỉnh thành:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const tinhThanh = await TinhThanhModel.getById(id);
    
    if (!tinhThanh) {
      return res.status(404).json({ error: 'Không tìm thấy tỉnh thành' });
    }
    
    const oldData = { ...tinhThanh.toJSON() };
    Object.assign(tinhThanh, req.body);
    await tinhThanh.update();
    
    await logAction(req.user?.id || null, `Cập nhật tỉnh thành ID: ${id}`, oldData, tinhThanh.toJSON());
    
    res.json(tinhThanh.toJSON());
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Mã tỉnh thành đã tồn tại' });
    }
    console.error('Lỗi cập nhật tỉnh thành:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

export const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const tinhThanh = await TinhThanhModel.getById(id);
    
    if (!tinhThanh) {
      return res.status(404).json({ error: 'Không tìm thấy tỉnh thành' });
    }
    
    await tinhThanh.delete();
    await logAction(req.user?.id || null, `Xóa tỉnh thành ID: ${id}`, tinhThanh.toJSON(), null);
    
    res.json({ message: 'Xóa tỉnh thành thành công' });
  } catch (error) {
    console.error('Lỗi xóa tỉnh thành:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

