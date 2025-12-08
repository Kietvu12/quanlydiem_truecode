import { TramModel } from '../models/TramModel.js';
import { logAction } from '../utils/logger.js';

/**
 * Controller Trạm
 */
export const getAll = async (req, res) => {
  try {
    const includeTinhThanh = req.query.include_tinhthanh === 'true';
    const trams = await TramModel.getAll(includeTinhThanh);
    res.json(trams.map(t => t.toJSON()));
  } catch (error) {
    console.error('Lỗi lấy danh sách trạm:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

export const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const includeTinhThanh = req.query.include_tinhthanh === 'true';
    const tram = await TramModel.getById(id, includeTinhThanh);
    
    if (!tram) {
      return res.status(404).json({ error: 'Không tìm thấy trạm' });
    }
    
    res.json(tram.toJSON());
  } catch (error) {
    console.error('Lỗi lấy trạm:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

export const getByTinhThanh = async (req, res) => {
  try {
    const { tinhthanh_id } = req.params;
    const trams = await TramModel.getByTinhThanh(tinhthanh_id);
    res.json(trams.map(t => t.toJSON()));
  } catch (error) {
    console.error('Lỗi lấy trạm theo tỉnh thành:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

export const create = async (req, res) => {
  try {
    const tram = new TramModel(req.body);
    await tram.create();
    
    await logAction(req.user?.id || null, `Tạo trạm mới: ${tram.matram}`, null, tram.toJSON());
    
    res.status(201).json(tram.toJSON());
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Mã trạm đã tồn tại' });
    }
    console.error('Lỗi tạo trạm:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const tram = await TramModel.getById(id);
    
    if (!tram) {
      return res.status(404).json({ error: 'Không tìm thấy trạm' });
    }
    
    const oldData = { ...tram.toJSON() };
    Object.assign(tram, req.body);
    await tram.update();
    
    await logAction(req.user?.id || null, `Cập nhật trạm ID: ${id}`, oldData, tram.toJSON());
    
    res.json(tram.toJSON());
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Mã trạm đã tồn tại' });
    }
    console.error('Lỗi cập nhật trạm:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

export const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const tram = await TramModel.getById(id);
    
    if (!tram) {
      return res.status(404).json({ error: 'Không tìm thấy trạm' });
    }
    
    await tram.delete();
    await logAction(req.user?.id || null, `Xóa trạm ID: ${id}`, tram.toJSON(), null);
    
    res.json({ message: 'Xóa trạm thành công' });
  } catch (error) {
    console.error('Lỗi xóa trạm:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

