import express from 'express';
import TransactionController from '../controllers/transaction';

const router = express.Router();

router.post('/', TransactionController.registerTransaction);
router.get('/', TransactionController.getAllTransactions);

export default router;
