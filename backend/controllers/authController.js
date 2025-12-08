import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NguoiDungModel } from '../models/NguoiDungModel.js';
import { logAction } from '../utils/logger.js';

/**
 * Controller xác thực
 */
export const login = async (req, res) => {
  try {
    const { email, matkhau } = req.body;

    if (!email || !matkhau) {
      return res.status(400).json({ error: 'Email và mật khẩu là bắt buộc' });
    }

    const user = await NguoiDungModel.getByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Email hoặc mật khẩu không đúng' });
    }

    const isValidPassword = await bcrypt.compare(matkhau, user.matkhau_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Email hoặc mật khẩu không đúng' });
    }

    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        vaitro: user.vaitro,
        la_admin: user.la_admin || 0
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    await logAction(user.id, `Đăng nhập hệ thống`, null, { email: user.email });

    res.json({
      token,
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Lỗi đăng nhập:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

