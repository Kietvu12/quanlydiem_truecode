import express from 'express';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';
import * as tramThucTeVolumeKhacController from '../controllers/tramThucTeVolumeKhacController.js';

const router = express.Router();

router.get('/', authenticateToken, tramThucTeVolumeKhacController.getAll);
router.get('/:id', authenticateToken, tramThucTeVolumeKhacController.getById);
router.get('/hopdong/:hopdong_id', authenticateToken, tramThucTeVolumeKhacController.getByHopDong);
router.get('/tram/:tram_id/hopdong/:hopdong_id', authenticateToken, tramThucTeVolumeKhacController.getByTramAndHopDong);
router.post('/', authenticateToken, authorizeRoles('admin', 'qlda', 'ktv'), tramThucTeVolumeKhacController.create);
router.put('/:id', authenticateToken, authorizeRoles('admin', 'qlda', 'ktv'), tramThucTeVolumeKhacController.update);
router.delete('/:id', authenticateToken, authorizeRoles('admin', 'qlda'), tramThucTeVolumeKhacController.remove);

export default router;

