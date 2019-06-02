import express from 'express';
import adminController from '../controllers/admin';

const router = express.Router();

/**
 * @swagger
 * /admin/check:
 *   get:
 *     tags:
 *       - admin
 *     description: Verifica se o servidor está online
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Sucesso
 */
router.get('/check', adminController.check);

/**
 * @swagger
 * /admin/reset:
 *   get:
 *     tags:
 *       - admin
 *     description: Reseta o banco de dados, excluindo todas as transações.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Transações excluídas com sucesso.
 */
router.get('/reset', adminController.reset);

/**
 * @swagger
 * /admin/load:
 *   get:
 *     tags:
 *       - admin
 *     description: Limpa o banco de dados e insere transações de demonstração
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Transações atuais foram excluídas e as transações de demonstração adicionadas.
 */
router.get('/load', adminController.load);

export default router;
