import { ThuVienVolumeKhacModel } from '../models/ThuVienVolumeKhacModel.js';
import { logAction } from '../utils/logger.js';

/**
 * Controller Thư Viện Volume Khác
 */
export const getAll = async (req, res) => {
  try {
    const volumes = await ThuVienVolumeKhacModel.getAll();
    res.json(volumes.map(v => v.toJSON()));
  } catch (error) {
    console.error('Lỗi lấy danh sách volume khác:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

export const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const volume = await ThuVienVolumeKhacModel.getById(id);
    
    if (!volume) {
      return res.status(404).json({ error: 'Không tìm thấy volume khác' });
    }
    
    res.json(volume.toJSON());
  } catch (error) {
    console.error('Lỗi lấy volume khác:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

export const create = async (req, res) => {
  try {
    const volume = new ThuVienVolumeKhacModel(req.body);
    await volume.create();
    
    await logAction(req.user?.id || null, `Tạo volume khác mới: ${volume.tenvolume}`, null, volume.toJSON());
    
    res.status(201).json(volume.toJSON());
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Mã volume đã tồn tại' });
    }
    console.error('Lỗi tạo volume khác:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const volume = await ThuVienVolumeKhacModel.getById(id);
    
    if (!volume) {
      return res.status(404).json({ error: 'Không tìm thấy volume khác' });
    }
    
    const oldData = { ...volume.toJSON() };
    Object.assign(volume, req.body);
    await volume.update();
    
    await logAction(req.user?.id || null, `Cập nhật volume khác ID: ${id}`, oldData, volume.toJSON());
    
    res.json(volume.toJSON());
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Mã volume đã tồn tại' });
    }
    console.error('Lỗi cập nhật volume khác:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

export const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const volume = await ThuVienVolumeKhacModel.getById(id);
    
    if (!volume) {
      return res.status(404).json({ error: 'Không tìm thấy volume khác' });
    }
    
    await volume.delete();
    await logAction(req.user?.id || null, `Xóa volume khác ID: ${id}`, volume.toJSON(), null);
    
    res.json({ message: 'Xóa volume khác thành công' });
  } catch (error) {
    console.error('Lỗi xóa volume khác:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

