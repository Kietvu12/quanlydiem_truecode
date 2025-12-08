import { HopDongModel } from '../models/HopDongModel.js';
import { logAction } from '../utils/logger.js';

/**
 * Controller Hợp Đồng
 */
export const getAll = async (req, res) => {
  try {
    const includeRelations = req.query.include_relations === 'true';
    const hopDongs = await HopDongModel.getAll(includeRelations);
    res.json(hopDongs.map(hd => hd.toJSON()));
  } catch (error) {
    console.error('Lỗi lấy danh sách hợp đồng:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

export const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const includeRelations = req.query.include_relations === 'true';
    const hopDong = await HopDongModel.getById(id, includeRelations);
    
    if (!hopDong) {
      return res.status(404).json({ error: 'Không tìm thấy hợp đồng' });
    }
    
    res.json(hopDong.toJSON());
  } catch (error) {
    console.error('Lỗi lấy hợp đồng:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

export const create = async (req, res) => {
  try {
    const hopDong = new HopDongModel(req.body);
    await hopDong.create();
    
    // Thêm các trạm vào hợp đồng nếu có
    if (req.body.tram_ids && Array.isArray(req.body.tram_ids)) {
      for (const tram_id of req.body.tram_ids) {
        await hopDong.addTram(tram_id);
      }
    }
    
    // Tính lại tổng giá trị từ volume các trạm
    const tongGiaTri = await HopDongModel.calculateTongGiaTri(hopDong.id);
    hopDong.tonggiatri = tongGiaTri;
    await hopDong.update();
    
    await logAction(req.user?.id || null, `Tạo hợp đồng mới: ${hopDong.sohopdong}`, null, hopDong.toJSON());
    
    res.status(201).json(hopDong.toJSON());
  } catch (error) {
    console.error('Lỗi tạo hợp đồng:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const hopDong = await HopDongModel.getById(id);
    
    if (!hopDong) {
      return res.status(404).json({ error: 'Không tìm thấy hợp đồng' });
    }
    
    const oldData = { ...hopDong.toJSON() };
    Object.assign(hopDong, req.body);
    await hopDong.update();
    
    // Cập nhật danh sách trạm nếu có
    if (req.body.tram_ids && Array.isArray(req.body.tram_ids)) {
      // Xóa tất cả trạm cũ
      const currentTrams = await HopDongModel.getTramsByHopDong(id);
      for (const tram of currentTrams) {
        await hopDong.removeTram(tram.id);
      }
      // Thêm trạm mới
      for (const tram_id of req.body.tram_ids) {
        await hopDong.addTram(tram_id);
      }
    }
    
    // Tính lại tổng giá trị
    const tongGiaTri = await HopDongModel.calculateTongGiaTri(id);
    hopDong.tonggiatri = tongGiaTri;
    await hopDong.update();
    
    await logAction(req.user?.id || null, `Cập nhật hợp đồng ID: ${id}`, oldData, hopDong.toJSON());
    
    res.json(hopDong.toJSON());
  } catch (error) {
    console.error('Lỗi cập nhật hợp đồng:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

export const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const hopDong = await HopDongModel.getById(id);
    
    if (!hopDong) {
      return res.status(404).json({ error: 'Không tìm thấy hợp đồng' });
    }
    
    await hopDong.delete();
    await logAction(req.user?.id || null, `Xóa hợp đồng ID: ${id}`, hopDong.toJSON(), null);
    
    res.json({ message: 'Xóa hợp đồng thành công' });
  } catch (error) {
    console.error('Lỗi xóa hợp đồng:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

export const addTram = async (req, res) => {
  try {
    const { id } = req.params;
    const { tram_id } = req.body;
    
    const hopDong = await HopDongModel.getById(id);
    if (!hopDong) {
      return res.status(404).json({ error: 'Không tìm thấy hợp đồng' });
    }
    
    await hopDong.addTram(tram_id);
    
    // Tính lại tổng giá trị
    const tongGiaTri = await HopDongModel.calculateTongGiaTri(id);
    hopDong.tonggiatri = tongGiaTri;
    await hopDong.update();
    
    await logAction(req.user?.id || null, `Thêm trạm vào hợp đồng ID: ${id}`, null, { tram_id });
    
    res.json({ message: 'Thêm trạm vào hợp đồng thành công' });
  } catch (error) {
    console.error('Lỗi thêm trạm vào hợp đồng:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

export const removeTram = async (req, res) => {
  try {
    const { id, tram_id } = req.params;
    
    const hopDong = await HopDongModel.getById(id);
    if (!hopDong) {
      return res.status(404).json({ error: 'Không tìm thấy hợp đồng' });
    }
    
    await hopDong.removeTram(tram_id);
    
    // Tính lại tổng giá trị
    const tongGiaTri = await HopDongModel.calculateTongGiaTri(id);
    hopDong.tonggiatri = tongGiaTri;
    await hopDong.update();
    
    await logAction(req.user?.id || null, `Xóa trạm khỏi hợp đồng ID: ${id}`, null, { tram_id });
    
    res.json({ message: 'Xóa trạm khỏi hợp đồng thành công' });
  } catch (error) {
    console.error('Lỗi xóa trạm khỏi hợp đồng:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

