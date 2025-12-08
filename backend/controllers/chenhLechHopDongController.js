import { ChenhLechHopDongModel } from '../models/ChenhLechHopDongModel.js';
import { logAction } from '../utils/logger.js';

/**
 * Controller Chênh Lệch Hợp Đồng
 */
export const getAll = async (req, res) => {
  try {
    const includeRelations = req.query.include_relations === 'true';
    const chenhLechs = await ChenhLechHopDongModel.getAll(includeRelations);
    res.json(chenhLechs.map(cl => cl.toJSON()));
  } catch (error) {
    console.error('Lỗi lấy danh sách chênh lệch hợp đồng:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

export const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const includeRelations = req.query.include_relations === 'true';
    const chenhLech = await ChenhLechHopDongModel.getById(id, includeRelations);
    
    if (!chenhLech) {
      return res.status(404).json({ error: 'Không tìm thấy chênh lệch hợp đồng' });
    }
    
    res.json(chenhLech.toJSON());
  } catch (error) {
    console.error('Lỗi lấy chênh lệch hợp đồng:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

export const getByHopDong = async (req, res) => {
  try {
    const { hopdong_id } = req.params;
    const chenhLechs = await ChenhLechHopDongModel.getByHopDong(hopdong_id);
    res.json(chenhLechs.map(cl => cl.toJSON()));
  } catch (error) {
    console.error('Lỗi lấy chênh lệch theo hợp đồng:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

export const calculate = async (req, res) => {
  try {
    const { hopdong_id } = req.params;
    const chenhLech = await ChenhLechHopDongModel.calculateChenhLech(hopdong_id);
    res.json(chenhLech);
  } catch (error) {
    console.error('Lỗi tính toán chênh lệch:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

export const create = async (req, res) => {
  try {
    const chenhLech = new ChenhLechHopDongModel({
      ...req.body,
      nguoinhap_id: req.user?.id || req.body.nguoinhap_id
    });
    await chenhLech.create();
    
    await logAction(req.user?.id || null, `Tạo chênh lệch hợp đồng mới`, null, chenhLech.toJSON());
    
    res.status(201).json(chenhLech.toJSON());
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Chênh lệch cho hợp đồng và ngày này đã tồn tại' });
    }
    console.error('Lỗi tạo chênh lệch hợp đồng:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const chenhLech = await ChenhLechHopDongModel.getById(id);
    
    if (!chenhLech) {
      return res.status(404).json({ error: 'Không tìm thấy chênh lệch hợp đồng' });
    }
    
    const oldData = { ...chenhLech.toJSON() };
    Object.assign(chenhLech, req.body);
    if (req.user?.id) {
      chenhLech.nguoinhap_id = req.user.id;
    }
    await chenhLech.update();
    
    await logAction(req.user?.id || null, `Cập nhật chênh lệch hợp đồng ID: ${id}`, oldData, chenhLech.toJSON());
    
    res.json(chenhLech.toJSON());
  } catch (error) {
    console.error('Lỗi cập nhật chênh lệch hợp đồng:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

export const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const chenhLech = await ChenhLechHopDongModel.getById(id);
    
    if (!chenhLech) {
      return res.status(404).json({ error: 'Không tìm thấy chênh lệch hợp đồng' });
    }
    
    await chenhLech.delete();
    await logAction(req.user?.id || null, `Xóa chênh lệch hợp đồng ID: ${id}`, chenhLech.toJSON(), null);
    
    res.json({ message: 'Xóa chênh lệch hợp đồng thành công' });
  } catch (error) {
    console.error('Lỗi xóa chênh lệch hợp đồng:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

