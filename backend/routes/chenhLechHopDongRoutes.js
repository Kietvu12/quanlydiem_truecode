import express from 'express';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';
import * as chenhLechHopDongController from '../controllers/chenhLechHopDongController.js';

const router = express.Router();

router.get('/', authenticateToken, chenhLechHopDongController.getAll);
router.get('/:id', authenticateToken, chenhLechHopDongController.getById);
router.get('/hopdong/:hopdong_id', authenticateToken, chenhLechHopDongController.getByHopDong);
router.get('/hopdong/:hopdong_id/calculate', authenticateToken, chenhLechHopDongController.calculate);
router.post('/', authenticateToken, authorizeRoles('admin', 'qlda', 'ktv'), chenhLechHopDongController.create);
router.put('/:id', authenticateToken, authorizeRoles('admin', 'qlda', 'ktv'), chenhLechHopDongController.update);
router.delete('/:id', authenticateToken, authorizeRoles('admin', 'qlda'), chenhLechHopDongController.remove);

export default router;

