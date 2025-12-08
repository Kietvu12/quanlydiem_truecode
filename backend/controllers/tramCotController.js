import { TramCotModel } from '../models/TramCotModel.js';
import { logAction } from '../utils/logger.js';

/**
 * Controller Trạm Cột (Volume cột của trạm)
 */
export const getAll = async (req, res) => {
  try {
    const includeRelations = req.query.include_relations === 'true';
    const tramCots = await TramCotModel.getAll(includeRelations);
    res.json(tramCots.map(tc => tc.toJSON()));
  } catch (error) {
    console.error('Lỗi lấy danh sách volume cột trạm:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

export const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const includeRelations = req.query.include_relations === 'true';
    const tramCot = await TramCotModel.getById(id, includeRelations);
    
    if (!tramCot) {
      return res.status(404).json({ error: 'Không tìm thấy volume cột trạm' });
    }
    
    res.json(tramCot.toJSON());
  } catch (error) {
    console.error('Lỗi lấy volume cột trạm:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

export const getByTram = async (req, res) => {
  try {
    const { tram_id } = req.params;
    const tramCots = await TramCotModel.getByTram(tram_id);
    res.json(tramCots.map(tc => tc.toJSON()));
  } catch (error) {
    console.error('Lỗi lấy volume cột theo trạm:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

export const create = async (req, res) => {
  try {
    const tramCot = new TramCotModel(req.body);
    await tramCot.create();
    
    await logAction(req.user?.id || null, `Tạo volume cột trạm mới`, null, tramCot.toJSON());
    
    res.status(201).json(tramCot.toJSON());
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Volume cột này đã tồn tại cho trạm này' });
    }
    console.error('Lỗi tạo volume cột trạm:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const tramCot = await TramCotModel.getById(id);
    
    if (!tramCot) {
      return res.status(404).json({ error: 'Không tìm thấy volume cột trạm' });
    }
    
    const oldData = { ...tramCot.toJSON() };
    Object.assign(tramCot, req.body);
    await tramCot.update();
    
    await logAction(req.user?.id || null, `Cập nhật volume cột trạm ID: ${id}`, oldData, tramCot.toJSON());
    
    res.json(tramCot.toJSON());
  } catch (error) {
    console.error('Lỗi cập nhật volume cột trạm:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

export const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const tramCot = await TramCotModel.getById(id);
    
    if (!tramCot) {
      return res.status(404).json({ error: 'Không tìm thấy volume cột trạm' });
    }
    
    await tramCot.delete();
    await logAction(req.user?.id || null, `Xóa volume cột trạm ID: ${id}`, tramCot.toJSON(), null);
    
    res.json({ message: 'Xóa volume cột trạm thành công' });
  } catch (error) {
    console.error('Lỗi xóa volume cột trạm:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

