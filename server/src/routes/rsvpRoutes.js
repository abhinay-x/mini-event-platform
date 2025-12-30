import express from 'express';
import authMiddleware from '../middleware/auth.js';
import { joinEvent, leaveEvent } from '../controllers/rsvpController.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/:id/rsvp', joinEvent);
router.delete('/:id/rsvp', leaveEvent);

export default router;
