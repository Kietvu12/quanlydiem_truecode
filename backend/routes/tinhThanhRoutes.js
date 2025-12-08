import express from 'express';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';
import * as tinhThanhController from '../controllers/tinhThanhController.js';

const router = express.Router();

router.get('/', authenticateToken, tinhThanhController.getAll);
router.get('/:id', authenticateToken, tinhThanhController.getById);
router.get('/khuvuc/:khuvuc_id', authenticateToken, tinhThanhController.getByKhuVuc);
router.post('/', authenticateToken, authorizeRoles('admin', 'qlda'), tinhThanhController.create);
router.put('/:id', authenticateToken, authorizeRoles('admin', 'qlda'), tinhThanhController.update);
router.delete('/:id', authenticateToken, authorizeRoles('admin', 'qlda'), tinhThanhController.remove);

export default router;

