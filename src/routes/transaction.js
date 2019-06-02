import express from 'express';
import TransactionController from '../controllers/transaction';

const router = express.Router();

router.post('/', TransactionController.registerTransaction);
router.get('/', TransactionController.getAllTransactions);
router.get('/balance', TransactionController.getBalance);

export default router;
