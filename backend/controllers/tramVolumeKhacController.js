import { TramVolumeKhacModel } from '../models/TramVolumeKhacModel.js';
import { logAction } from '../utils/logger.js';

/**
 * Controller Trạm Volume Khác (Volume khác của trạm)
 */
export const getAll = async (req, res) => {
  try {
    const includeRelations = req.query.include_relations === 'true';
    const tramVols = await TramVolumeKhacModel.getAll(includeRelations);
    res.json(tramVols.map(tv => tv.toJSON()));
  } catch (error) {
    console.error('Lỗi lấy danh sách volume khác trạm:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

export const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const includeRelations = req.query.include_relations === 'true';
    const tramVol = await TramVolumeKhacModel.getById(id, includeRelations);
    
    if (!tramVol) {
      return res.status(404).json({ error: 'Không tìm thấy volume khác trạm' });
    }
    
    res.json(tramVol.toJSON());
  } catch (error) {
    console.error('Lỗi lấy volume khác trạm:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

export const getByTram = async (req, res) => {
  try {
    const { tram_id } = req.params;
    const tramVols = await TramVolumeKhacModel.getByTram(tram_id);
    res.json(tramVols.map(tv => tv.toJSON()));
  } catch (error) {
    console.error('Lỗi lấy volume khác theo trạm:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

export const create = async (req, res) => {
  try {
    const tramVol = new TramVolumeKhacModel(req.body);
    await tramVol.create();
    
    await logAction(req.user?.id || null, `Tạo volume khác trạm mới`, null, tramVol.toJSON());
    
    res.status(201).json(tramVol.toJSON());
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Volume khác này đã tồn tại cho trạm này' });
    }
    console.error('Lỗi tạo volume khác trạm:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const tramVol = await TramVolumeKhacModel.getById(id);
    
    if (!tramVol) {
      return res.status(404).json({ error: 'Không tìm thấy volume khác trạm' });
    }
    
    const oldData = { ...tramVol.toJSON() };
    Object.assign(tramVol, req.body);
    await tramVol.update();
    
    await logAction(req.user?.id || null, `Cập nhật volume khác trạm ID: ${id}`, oldData, tramVol.toJSON());
    
    res.json(tramVol.toJSON());
  } catch (error) {
    console.error('Lỗi cập nhật volume khác trạm:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

export const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const tramVol = await TramVolumeKhacModel.getById(id);
    
    if (!tramVol) {
      return res.status(404).json({ error: 'Không tìm thấy volume khác trạm' });
    }
    
    await tramVol.delete();
    await logAction(req.user?.id || null, `Xóa volume khác trạm ID: ${id}`, tramVol.toJSON(), null);
    
    res.json({ message: 'Xóa volume khác trạm thành công' });
  } catch (error) {
    console.error('Lỗi xóa volume khác trạm:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

