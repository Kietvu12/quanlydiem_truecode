import express from 'express';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';
import * as khuVucController from '../controllers/khuVucController.js';

const router = express.Router();

router.get('/', authenticateToken, khuVucController.getAll);
router.get('/:id', authenticateToken, khuVucController.getById);
router.post('/', authenticateToken, authorizeRoles('admin', 'qlda'), khuVucController.create);
router.put('/:id', authenticateToken, authorizeRoles('admin', 'qlda'), khuVucController.update);
router.delete('/:id', authenticateToken, authorizeRoles('admin', 'qlda'), khuVucController.remove);

export default router;

