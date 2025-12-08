import express from 'express';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';
import * as hopDongController from '../controllers/hopDongController.js';

const router = express.Router();

router.get('/', authenticateToken, hopDongController.getAll);
router.get('/:id', authenticateToken, hopDongController.getById);
router.post('/', authenticateToken, authorizeRoles('admin', 'qlda'), hopDongController.create);
router.put('/:id', authenticateToken, authorizeRoles('admin', 'qlda'), hopDongController.update);
router.delete('/:id', authenticateToken, authorizeRoles('admin', 'qlda'), hopDongController.remove);
router.post('/:id/tram', authenticateToken, authorizeRoles('admin', 'qlda'), hopDongController.addTram);
router.delete('/:id/tram/:tram_id', authenticateToken, authorizeRoles('admin', 'qlda'), hopDongController.removeTram);

export default router;

