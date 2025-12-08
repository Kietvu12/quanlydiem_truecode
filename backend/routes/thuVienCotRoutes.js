import express from 'express';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';
import * as thuVienCotController from '../controllers/thuVienCotController.js';

const router = express.Router();

router.get('/', authenticateToken, thuVienCotController.getAll);
router.get('/:id', authenticateToken, thuVienCotController.getById);
router.post('/', authenticateToken, authorizeRoles('admin', 'qlda'), thuVienCotController.create);
router.put('/:id', authenticateToken, authorizeRoles('admin', 'qlda'), thuVienCotController.update);
router.delete('/:id', authenticateToken, authorizeRoles('admin', 'qlda'), thuVienCotController.remove);

export default router;

