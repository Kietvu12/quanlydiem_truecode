import { TramThucTeCotModel } from '../models/TramThucTeCotModel.js';
import { logAction } from '../utils/logger.js';

/**
 * Controller Trạm Thực Tế Cột
 */
export const getAll = async (req, res) => {
  try {
    const includeRelations = req.query.include_relations === 'true';
    const thucTes = await TramThucTeCotModel.getAll(includeRelations);
    res.json(thucTes.map(tt => tt.toJSON()));
  } catch (error) {
    console.error('Lỗi lấy danh sách volume thực tế cột:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

export const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const includeRelations = req.query.include_relations === 'true';
    const thucTe = await TramThucTeCotModel.getById(id, includeRelations);
    
    if (!thucTe) {
      return res.status(404).json({ error: 'Không tìm thấy volume thực tế cột' });
    }
    
    res.json(thucTe.toJSON());
  } catch (error) {
    console.error('Lỗi lấy volume thực tế cột:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

export const getByTramAndHopDong = async (req, res) => {
  try {
    const { tram_id, hopdong_id } = req.params;
    const thucTes = await TramThucTeCotModel.getByTramAndHopDong(tram_id, hopdong_id);
    res.json(thucTes.map(tt => tt.toJSON()));
  } catch (error) {
    console.error('Lỗi lấy volume thực tế cột:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

export const getByHopDong = async (req, res) => {
  try {
    const { hopdong_id } = req.params;
    const thucTes = await TramThucTeCotModel.getByHopDong(hopdong_id);
    res.json(thucTes.map(tt => tt.toJSON()));
  } catch (error) {
    console.error('Lỗi lấy volume thực tế cột theo hợp đồng:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

export const create = async (req, res) => {
  try {
    const thucTe = new TramThucTeCotModel({
      ...req.body,
      nguoinhap_id: req.user?.id || req.body.nguoinhap_id
    });
    await thucTe.create();
    
    await logAction(req.user?.id || null, `Tạo volume thực tế cột mới`, null, thucTe.toJSON());
    
    res.status(201).json(thucTe.toJSON());
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Volume thực tế cột này đã tồn tại' });
    }
    console.error('Lỗi tạo volume thực tế cột:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const thucTe = await TramThucTeCotModel.getById(id);
    
    if (!thucTe) {
      return res.status(404).json({ error: 'Không tìm thấy volume thực tế cột' });
    }
    
    const oldData = { ...thucTe.toJSON() };
    Object.assign(thucTe, req.body);
    if (req.user?.id) {
      thucTe.nguoinhap_id = req.user.id;
    }
    await thucTe.update();
    
    await logAction(req.user?.id || null, `Cập nhật volume thực tế cột ID: ${id}`, oldData, thucTe.toJSON());
    
    res.json(thucTe.toJSON());
  } catch (error) {
    console.error('Lỗi cập nhật volume thực tế cột:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

export const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const thucTe = await TramThucTeCotModel.getById(id);
    
    if (!thucTe) {
      return res.status(404).json({ error: 'Không tìm thấy volume thực tế cột' });
    }
    
    await thucTe.delete();
    await logAction(req.user?.id || null, `Xóa volume thực tế cột ID: ${id}`, thucTe.toJSON(), null);
    
    res.json({ message: 'Xóa volume thực tế cột thành công' });
  } catch (error) {
    console.error('Lỗi xóa volume thực tế cột:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

