import express from 'express';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';
import * as thuVienVolumeKhacController from '../controllers/thuVienVolumeKhacController.js';

const router = express.Router();

router.get('/', authenticateToken, thuVienVolumeKhacController.getAll);
router.get('/:id', authenticateToken, thuVienVolumeKhacController.getById);
router.post('/', authenticateToken, authorizeRoles('admin', 'qlda'), thuVienVolumeKhacController.create);
router.put('/:id', authenticateToken, authorizeRoles('admin', 'qlda'), thuVienVolumeKhacController.update);
router.delete('/:id', authenticateToken, authorizeRoles('admin', 'qlda'), thuVienVolumeKhacController.remove);

export default router;

