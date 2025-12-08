import express from 'express';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';
import * as tramThucTeCotController from '../controllers/tramThucTeCotController.js';

const router = express.Router();

router.get('/', authenticateToken, tramThucTeCotController.getAll);
router.get('/:id', authenticateToken, tramThucTeCotController.getById);
router.get('/hopdong/:hopdong_id', authenticateToken, tramThucTeCotController.getByHopDong);
router.get('/tram/:tram_id/hopdong/:hopdong_id', authenticateToken, tramThucTeCotController.getByTramAndHopDong);
router.post('/', authenticateToken, authorizeRoles('admin', 'qlda', 'ktv'), tramThucTeCotController.create);
router.put('/:id', authenticateToken, authorizeRoles('admin', 'qlda', 'ktv'), tramThucTeCotController.update);
router.delete('/:id', authenticateToken, authorizeRoles('admin', 'qlda'), tramThucTeCotController.remove);

export default router;

