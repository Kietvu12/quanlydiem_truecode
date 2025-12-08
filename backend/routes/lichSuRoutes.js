import express from 'express';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';
import * as lichSuController from '../controllers/lichSuController.js';

const router = express.Router();

router.get('/', authenticateToken, authorizeRoles('admin', 'qlda'), lichSuController.getAll);
router.get('/:id', authenticateToken, authorizeRoles('admin', 'qlda'), lichSuController.getById);
router.get('/nguoidung/:nguoidung_id', authenticateToken, authorizeRoles('admin', 'qlda'), lichSuController.getByNguoiDung);

export default router;

