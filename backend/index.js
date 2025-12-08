import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './config/database.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import khuVucRoutes from './routes/khuVucRoutes.js';
import tinhThanhRoutes from './routes/tinhThanhRoutes.js';
import tramRoutes from './routes/tramRoutes.js';
import duanRoutes from './routes/duanRoutes.js';
import hopDongRoutes from './routes/hopDongRoutes.js';
import thuVienCotRoutes from './routes/thuVienCotRoutes.js';
import thuVienVolumeKhacRoutes from './routes/thuVienVolumeKhacRoutes.js';
import tramCotRoutes from './routes/tramCotRoutes.js';
import tramVolumeKhacRoutes from './routes/tramVolumeKhacRoutes.js';
import tramTienDoRoutes from './routes/tramTienDoRoutes.js';
import tramThucTeCotRoutes from './routes/tramThucTeCotRoutes.js';
import tramThucTeVolumeKhacRoutes from './routes/tramThucTeVolumeKhacRoutes.js';
import chenhLechHopDongRoutes from './routes/chenhLechHopDongRoutes.js';
import lichSuRoutes from './routes/lichSuRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test database connection
pool.getConnection()
  .then(connection => {
    console.log('Kết nối database thành công');
    connection.release();
  })
  .catch(error => {
    console.error('Lỗi kết nối database:', error);
  });

// Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/khuvuc', khuVucRoutes);
app.use('/tinhthanh', tinhThanhRoutes);
app.use('/tram', tramRoutes);
app.use('/duan', duanRoutes);
app.use('/hopdong', hopDongRoutes);
app.use('/thuviencot', thuVienCotRoutes);
app.use('/thuvienvolume', thuVienVolumeKhacRoutes);
app.use('/tramcot', tramCotRoutes);
app.use('/tramvolume', tramVolumeKhacRoutes);
app.use('/tramtiendo', tramTienDoRoutes);
app.use('/tramthuctecot', tramThucTeCotRoutes);
app.use('/tramthuctevolume', tramThucTeVolumeKhacRoutes);
app.use('/chenhlech', chenhLechHopDongRoutes);
app.use('/lichsu', lichSuRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server đang chạy' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Lỗi:', err);
  res.status(500).json({ error: 'Lỗi server', message: err.message });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Không tìm thấy endpoint' });
});

app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});

