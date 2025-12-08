import express from 'express';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';
import * as tramVolumeKhacController from '../controllers/tramVolumeKhacController.js';

const router = express.Router();

router.get('/', authenticateToken, tramVolumeKhacController.getAll);
router.get('/:id', authenticateToken, tramVolumeKhacController.getById);
router.get('/tram/:tram_id', authenticateToken, tramVolumeKhacController.getByTram);
router.post('/', authenticateToken, authorizeRoles('admin', 'qlda'), tramVolumeKhacController.create);
router.put('/:id', authenticateToken, authorizeRoles('admin', 'qlda'), tramVolumeKhacController.update);
router.delete('/:id', authenticateToken, authorizeRoles('admin', 'qlda'), tramVolumeKhacController.remove);

export default router;

