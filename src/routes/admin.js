import express from 'express';
import adminController from '../controllers/admin';

const router = express.Router();

router.get('/check', adminController.check);

export default router;
