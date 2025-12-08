import bcrypt from 'bcryptjs';
import { NguoiDungModel } from '../models/NguoiDungModel.js';
import { logAction } from '../utils/logger.js';

/**
 * Controller Người Dùng
 */
export const getAll = async (req, res) => {
  try {
    const users = await NguoiDungModel.getAll();
    res.json(users.map(u => u.toJSON()));
  } catch (error) {
    console.error('Lỗi lấy danh sách người dùng:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

export const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await NguoiDungModel.getById(id);
    
    if (!user) {
      return res.status(404).json({ error: 'Không tìm thấy người dùng' });
    }
    
    res.json(user.toJSON());
  } catch (error) {
    console.error('Lỗi lấy người dùng:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

export const create = async (req, res) => {
  try {
    const { ten, email, matkhau, vaitro, la_admin } = req.body;
    
    if (!ten || !email || !matkhau) {
      return res.status(400).json({ error: 'Tên, email và mật khẩu là bắt buộc' });
    }
    
    // Kiểm tra email đã tồn tại
    const existingUser = await NguoiDungModel.getByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email đã tồn tại' });
    }
    
    // Hash mật khẩu
    const matkhau_hash = await bcrypt.hash(matkhau, 10);
    
    const user = new NguoiDungModel({
      ten,
      email,
      matkhau_hash,
      vaitro: vaitro || 'ktv',
      la_admin: la_admin ? 1 : 0
    });
    await user.create();
    
    await logAction(req.user?.id || null, `Tạo người dùng mới: ${user.ten}`, null, user.toJSON());
    
    res.status(201).json(user.toJSON());
  } catch (error) {
    console.error('Lỗi tạo người dùng:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await NguoiDungModel.getById(id);
    
    if (!user) {
      return res.status(404).json({ error: 'Không tìm thấy người dùng' });
    }
    
    const oldData = { ...user.toJSON() };
    const { matkhau, ...updateData } = req.body;
    
    Object.assign(user, updateData);
    
    // Nếu có mật khẩu mới, hash lại
    if (matkhau) {
      user.matkhau_hash = await bcrypt.hash(matkhau, 10);
    }
    
    await user.update();
    
    await logAction(req.user?.id || null, `Cập nhật người dùng ID: ${id}`, oldData, user.toJSON());
    
    res.json(user.toJSON());
  } catch (error) {
    console.error('Lỗi cập nhật người dùng:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

export const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await NguoiDungModel.getById(id);
    
    if (!user) {
      return res.status(404).json({ error: 'Không tìm thấy người dùng' });
    }
    
    await user.delete();
    await logAction(req.user?.id || null, `Xóa người dùng ID: ${id}`, user.toJSON(), null);
    
    res.json({ message: 'Xóa người dùng thành công' });
  } catch (error) {
    console.error('Lỗi xóa người dùng:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

