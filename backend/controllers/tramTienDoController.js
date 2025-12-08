import { TramTienDoModel } from '../models/TramTienDoModel.js';
import { logAction } from '../utils/logger.js';

/**
 * Controller Trạm Tiến Độ
 */
export const getAll = async (req, res) => {
  try {
    const includeRelations = req.query.include_relations === 'true';
    const tienDos = await TramTienDoModel.getAll(includeRelations);
    res.json(tienDos.map(td => td.toJSON()));
  } catch (error) {
    console.error('Lỗi lấy danh sách tiến độ trạm:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

export const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const includeRelations = req.query.include_relations === 'true';
    const tienDo = await TramTienDoModel.getById(id, includeRelations);
    
    if (!tienDo) {
      return res.status(404).json({ error: 'Không tìm thấy tiến độ trạm' });
    }
    
    res.json(tienDo.toJSON());
  } catch (error) {
    console.error('Lỗi lấy tiến độ trạm:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

export const getByTramAndHopDong = async (req, res) => {
  try {
    const { tram_id, hopdong_id } = req.params;
    const tienDo = await TramTienDoModel.getByTramAndHopDong(tram_id, hopdong_id);
    
    if (!tienDo) {
      return res.status(404).json({ error: 'Không tìm thấy tiến độ trạm' });
    }
    
    res.json(tienDo.toJSON());
  } catch (error) {
    console.error('Lỗi lấy tiến độ trạm:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

export const getByHopDong = async (req, res) => {
  try {
    const { hopdong_id } = req.params;
    const tienDos = await TramTienDoModel.getByHopDong(hopdong_id);
    res.json(tienDos.map(td => td.toJSON()));
  } catch (error) {
    console.error('Lỗi lấy tiến độ theo hợp đồng:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

export const create = async (req, res) => {
  try {
    const tienDo = new TramTienDoModel(req.body);
    await tienDo.create();
    
    await logAction(req.user?.id || null, `Tạo tiến độ trạm mới`, null, tienDo.toJSON());
    
    res.status(201).json(tienDo.toJSON());
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Tiến độ cho trạm và hợp đồng này đã tồn tại' });
    }
    console.error('Lỗi tạo tiến độ trạm:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const tienDo = await TramTienDoModel.getById(id);
    
    if (!tienDo) {
      return res.status(404).json({ error: 'Không tìm thấy tiến độ trạm' });
    }
    
    const oldData = { ...tienDo.toJSON() };
    Object.assign(tienDo, req.body);
    await tienDo.update();
    
    await logAction(req.user?.id || null, `Cập nhật tiến độ trạm ID: ${id}`, oldData, tienDo.toJSON());
    
    res.json(tienDo.toJSON());
  } catch (error) {
    console.error('Lỗi cập nhật tiến độ trạm:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

export const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const tienDo = await TramTienDoModel.getById(id);
    
    if (!tienDo) {
      return res.status(404).json({ error: 'Không tìm thấy tiến độ trạm' });
    }
    
    await tienDo.delete();
    await logAction(req.user?.id || null, `Xóa tiến độ trạm ID: ${id}`, tienDo.toJSON(), null);
    
    res.json({ message: 'Xóa tiến độ trạm thành công' });
  } catch (error) {
    console.error('Lỗi xóa tiến độ trạm:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

