import express from 'express';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';
import * as tramCotController from '../controllers/tramCotController.js';

const router = express.Router();

router.get('/', authenticateToken, tramCotController.getAll);
router.get('/:id', authenticateToken, tramCotController.getById);
router.get('/tram/:tram_id', authenticateToken, tramCotController.getByTram);
router.post('/', authenticateToken, authorizeRoles('admin', 'qlda'), tramCotController.create);
router.put('/:id', authenticateToken, authorizeRoles('admin', 'qlda'), tramCotController.update);
router.delete('/:id', authenticateToken, authorizeRoles('admin', 'qlda'), tramCotController.remove);

export default router;

