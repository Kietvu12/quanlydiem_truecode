import pool from '../config/database.js';

export const logAction = async (userId, action, dataBefore = null, dataAfter = null) => {
  try {
    await pool.execute(
      'INSERT INTO lichsu (nguoidung_id, hanhdong, dulieu_truoc, dulieu_sau) VALUES (?, ?, ?, ?)',
      [
        userId,
        action,
        dataBefore ? JSON.stringify(dataBefore) : null,
        dataAfter ? JSON.stringify(dataAfter) : null
      ]
    );
  } catch (error) {
    console.error('Lỗi ghi log:', error);
  }
};

