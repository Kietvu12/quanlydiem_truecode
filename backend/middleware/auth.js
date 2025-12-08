import jwt from 'jsonwebtoken';
import pool from '../config/database.js';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Token không được cung cấp' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token không hợp lệ' });
    }
    req.user = user;
    next();
  });
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Chưa xác thực' });
    }

    // Hỗ trợ cả vaitro (cũ) và la_admin (mới)
    // Nếu có la_admin = 1, coi như có quyền admin
    const userRole = req.user.la_admin === 1 ? 'admin' : (req.user.vaitro || 'ktv');
    
    if (!roles.includes(userRole)) {
      return res.status(403).json({ error: 'Không có quyền truy cập' });
    }

    next();
  };
};

// Middleware kiểm tra quyền admin dựa trên la_admin
export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Chưa xác thực' });
  }

  if (!req.user.la_admin || req.user.la_admin !== 1) {
    return res.status(403).json({ error: 'Chỉ admin mới có quyền thực hiện thao tác này' });
  }

  next();
};

// Middleware cho phép tạo user đầu tiên mà không cần authentication
// Nếu đã có user trong database, yêu cầu authentication và quyền admin
export const allowFirstUserOrAdmin = async (req, res, next) => {
  try {
    // Kiểm tra số lượng user trong database
    const [users] = await pool.execute('SELECT COUNT(*) as count FROM nguoidung');
    const userCount = users[0].count;

    // Nếu chưa có user nào, cho phép tạo user đầu tiên mà không cần auth
    if (userCount === 0) {
      return next();
    }

    // Nếu đã có user, yêu cầu authentication và quyền admin
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Token không được cung cấp' });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
      if (err) {
        return res.status(403).json({ error: 'Token không hợp lệ' });
      }

      // Kiểm tra quyền admin dựa trên la_admin (1 = admin, 0 = không phải admin)
      // Hỗ trợ cả kiểu boolean và number
      const isAdmin = user.la_admin === 1 || user.la_admin === true;
      if (!isAdmin) {
        return res.status(403).json({ error: 'Chỉ admin mới có quyền tạo người dùng' });
      }

      req.user = user;
      next();
    });
  } catch (error) {
    console.error('Lỗi kiểm tra quyền:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

