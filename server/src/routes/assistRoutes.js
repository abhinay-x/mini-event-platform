import express from 'express';
import authMiddleware from '../middleware/auth.js';
import { generateDescription } from '../controllers/assistController.js';

const router = express.Router();

router.use(authMiddleware);
router.post('/describe', generateDescription);

export default router;
