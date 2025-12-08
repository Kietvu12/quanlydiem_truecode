import express from 'express';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';
import * as tramController from '../controllers/tramController.js';

const router = express.Router();

router.get('/', authenticateToken, tramController.getAll);
router.get('/:id', authenticateToken, tramController.getById);
router.get('/tinhthanh/:tinhthanh_id', authenticateToken, tramController.getByTinhThanh);
router.post('/', authenticateToken, authorizeRoles('admin', 'qlda'), tramController.create);
router.put('/:id', authenticateToken, authorizeRoles('admin', 'qlda'), tramController.update);
router.delete('/:id', authenticateToken, authorizeRoles('admin', 'qlda'), tramController.remove);

export default router;

