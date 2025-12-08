import { ThuVienCotModel } from '../models/ThuVienCotModel.js';
import { logAction } from '../utils/logger.js';

/**
 * Controller Thư Viện Cột
 */
export const getAll = async (req, res) => {
  try {
    const cots = await ThuVienCotModel.getAll();
    res.json(cots.map(c => c.toJSON()));
  } catch (error) {
    console.error('Lỗi lấy danh sách cột:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

export const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const cot = await ThuVienCotModel.getById(id);
    
    if (!cot) {
      return res.status(404).json({ error: 'Không tìm thấy cột' });
    }
    
    res.json(cot.toJSON());
  } catch (error) {
    console.error('Lỗi lấy cột:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

export const create = async (req, res) => {
  try {
    const cot = new ThuVienCotModel(req.body);
    await cot.create();
    
    await logAction(req.user?.id || null, `Tạo cột mới: ${cot.tencot}`, null, cot.toJSON());
    
    res.status(201).json(cot.toJSON());
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Mã cột đã tồn tại' });
    }
    console.error('Lỗi tạo cột:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const cot = await ThuVienCotModel.getById(id);
    
    if (!cot) {
      return res.status(404).json({ error: 'Không tìm thấy cột' });
    }
    
    const oldData = { ...cot.toJSON() };
    Object.assign(cot, req.body);
    await cot.update();
    
    await logAction(req.user?.id || null, `Cập nhật cột ID: ${id}`, oldData, cot.toJSON());
    
    res.json(cot.toJSON());
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Mã cột đã tồn tại' });
    }
    console.error('Lỗi cập nhật cột:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

export const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const cot = await ThuVienCotModel.getById(id);
    
    if (!cot) {
      return res.status(404).json({ error: 'Không tìm thấy cột' });
    }
    
    await cot.delete();
    await logAction(req.user?.id || null, `Xóa cột ID: ${id}`, cot.toJSON(), null);
    
    res.json({ message: 'Xóa cột thành công' });
  } catch (error) {
    console.error('Lỗi xóa cột:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

