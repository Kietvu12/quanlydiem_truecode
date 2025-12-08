import express from 'express';
import { authenticateToken, authorizeRoles, allowFirstUserOrAdmin } from '../middleware/auth.js';
import * as userController from '../controllers/userController.js';

const router = express.Router();

router.get('/', authenticateToken, authorizeRoles('admin', 'qlda'), userController.getAll);
router.get('/:id', authenticateToken, userController.getById);
router.post('/', allowFirstUserOrAdmin, userController.create);
router.put('/:id', authenticateToken, authorizeRoles('admin', 'qlda'), userController.update);
router.delete('/:id', authenticateToken, authorizeRoles('admin', 'qlda'), userController.remove);

export default router;

