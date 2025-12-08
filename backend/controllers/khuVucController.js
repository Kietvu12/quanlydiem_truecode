import { KhuVucModel } from '../models/KhuVucModel.js';
import { logAction } from '../utils/logger.js';

/**
 * Controller Khu Vực
 */
export const getAll = async (req, res) => {
  try {
    const khuVucs = await KhuVucModel.getAll();
    res.json(khuVucs.map(kv => kv.toJSON()));
  } catch (error) {
    console.error('Lỗi lấy danh sách khu vực:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

export const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const khuVuc = await KhuVucModel.getById(id);
    
    if (!khuVuc) {
      return res.status(404).json({ error: 'Không tìm thấy khu vực' });
    }
    
    res.json(khuVuc.toJSON());
  } catch (error) {
    console.error('Lỗi lấy khu vực:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

export const create = async (req, res) => {
  try {
    const khuVuc = new KhuVucModel(req.body);
    await khuVuc.create();
    
    await logAction(req.user?.id || null, `Tạo khu vực mới: ${khuVuc.ten}`, null, khuVuc.toJSON());
    
    res.status(201).json(khuVuc.toJSON());
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Mã khu vực đã tồn tại' });
    }
    console.error('Lỗi tạo khu vực:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const khuVuc = await KhuVucModel.getById(id);
    
    if (!khuVuc) {
      return res.status(404).json({ error: 'Không tìm thấy khu vực' });
    }
    
    const oldData = { ...khuVuc.toJSON() };
    Object.assign(khuVuc, req.body);
    await khuVuc.update();
    
    await logAction(req.user?.id || null, `Cập nhật khu vực ID: ${id}`, oldData, khuVuc.toJSON());
    
    res.json(khuVuc.toJSON());
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Mã khu vực đã tồn tại' });
    }
    console.error('Lỗi cập nhật khu vực:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

export const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const khuVuc = await KhuVucModel.getById(id);
    
    if (!khuVuc) {
      return res.status(404).json({ error: 'Không tìm thấy khu vực' });
    }
    
    await khuVuc.delete();
    await logAction(req.user?.id || null, `Xóa khu vực ID: ${id}`, khuVuc.toJSON(), null);
    
    res.json({ message: 'Xóa khu vực thành công' });
  } catch (error) {
    console.error('Lỗi xóa khu vực:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

