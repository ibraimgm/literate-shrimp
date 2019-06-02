import express from 'express';
import adminController from '../controllers/admin';

const router = express.Router();

router.get('/check', adminController.check);
router.get('/reset', adminController.reset);
router.get('/load', adminController.load);

export default router;
