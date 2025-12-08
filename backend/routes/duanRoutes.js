import express from 'express';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';
import * as duanController from '../controllers/duanController.js';

const router = express.Router();

router.get('/', authenticateToken, duanController.getAll);
router.get('/:id', authenticateToken, duanController.getById);
router.post('/', authenticateToken, authorizeRoles('admin', 'qlda'), duanController.create);
router.put('/:id', authenticateToken, authorizeRoles('admin', 'qlda'), duanController.update);
router.delete('/:id', authenticateToken, authorizeRoles('admin', 'qlda'), duanController.remove);

export default router;

