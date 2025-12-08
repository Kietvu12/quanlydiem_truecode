import express from 'express';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';
import * as tramTienDoController from '../controllers/tramTienDoController.js';

const router = express.Router();

router.get('/', authenticateToken, tramTienDoController.getAll);
router.get('/:id', authenticateToken, tramTienDoController.getById);
router.get('/hopdong/:hopdong_id', authenticateToken, tramTienDoController.getByHopDong);
router.get('/tram/:tram_id/hopdong/:hopdong_id', authenticateToken, tramTienDoController.getByTramAndHopDong);
router.post('/', authenticateToken, authorizeRoles('admin', 'qlda', 'ktv'), tramTienDoController.create);
router.put('/:id', authenticateToken, authorizeRoles('admin', 'qlda', 'ktv'), tramTienDoController.update);
router.delete('/:id', authenticateToken, authorizeRoles('admin', 'qlda'), tramTienDoController.remove);

export default router;

