import { DuanModel } from '../models/DuanModel.js';
import { logAction } from '../utils/logger.js';

/**
 * Controller Dự Án
 */
export const getAll = async (req, res) => {
  try {
    const duans = await DuanModel.getAll();
    res.json(duans.map(d => d.toJSON()));
  } catch (error) {
    console.error('Lỗi lấy danh sách dự án:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

export const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const duan = await DuanModel.getById(id);
    
    if (!duan) {
      return res.status(404).json({ error: 'Không tìm thấy dự án' });
    }
    
    res.json(duan.toJSON());
  } catch (error) {
    console.error('Lỗi lấy dự án:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

export const create = async (req, res) => {
  try {
    const duan = new DuanModel(req.body);
    await duan.create();
    
    await logAction(req.user?.id || null, `Tạo dự án mới: ${duan.tenduan}`, null, duan.toJSON());
    
    res.status(201).json(duan.toJSON());
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Mã dự án đã tồn tại' });
    }
    console.error('Lỗi tạo dự án:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const duan = await DuanModel.getById(id);
    
    if (!duan) {
      return res.status(404).json({ error: 'Không tìm thấy dự án' });
    }
    
    const oldData = { ...duan.toJSON() };
    Object.assign(duan, req.body);
    await duan.update();
    
    await logAction(req.user?.id || null, `Cập nhật dự án ID: ${id}`, oldData, duan.toJSON());
    
    res.json(duan.toJSON());
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Mã dự án đã tồn tại' });
    }
    console.error('Lỗi cập nhật dự án:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

export const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const duan = await DuanModel.getById(id);
    
    if (!duan) {
      return res.status(404).json({ error: 'Không tìm thấy dự án' });
    }
    
    await duan.delete();
    await logAction(req.user?.id || null, `Xóa dự án ID: ${id}`, duan.toJSON(), null);
    
    res.json({ message: 'Xóa dự án thành công' });
  } catch (error) {
    console.error('Lỗi xóa dự án:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

