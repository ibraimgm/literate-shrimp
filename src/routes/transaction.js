import express from 'express';
import TransactionController from '../controllers/transaction';

const router = express.Router();

router.post('/', TransactionController.registerTransaction);

export default router;
