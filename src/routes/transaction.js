import express from 'express';

import auth from '../auth';
import TransactionController from '../controllers/transaction';

const router = express.Router();

/**
 * @swagger
 * securityDefinitions:
 *   basicAuth:
 *     type: basic
 *
 * definitions:
 *   mensagem:
 *     properties:
 *       message:
 *         type: string
 *         description: Mensagem com detalhes do ocorrido.
 *
 *   erro:
 *     allOf:
 *       - $ref: '#/definitions/mensagem'
 *       - properties:
 *           statusCode:
 *             type: number
 *             description: O código de status HTTP da requisição
 *
 *   transacao:
 *     properties:
 *       nsu:
 *         type: string
 *         required: true
 *         description:
 *           Número sequencial único, passado como string. Aceita apenas dígitos.
 *           Não pode ter conteúdo zerado (ex "00000").
 *       valor:
 *         type: number
 *         required: true
 *         description:
 *           Valor da transação. Não é admitido valor inferior a zero e nem valor com mais
 *           de duas casas decimais.
 *       bandeira:
 *         type: string
 *         required: true
 *         enum: ['VISA', 'MASTERCARD', 'ELO', 'AMEX']
 *         description:
 *           Bandeira do cartão que executou a operação.
 *       modalidade:
 *         type: string
 *         required: true
 *         enum: ['credito', 'debito']
 *         description:
 *           Modalidade da transação (crédito ou débito).
 *       horario:
 *         type: string
 *         required: true
 *         description:
 *           Horário em que ocorreu a transação. Deve ser informado como tipo 'string', mas dentro
 *           do formato YYYY-MM-DDThh:mm:ss.zzzTZ. A hora é opcional, e se não informada, será registrada
 *           como zero. Tanto os milissegundos quanto o timezone são opcionais, e o timezone pode ser
 *           especificado como um offset (ex. -03:00), independentemente dos milissegundos.
 *
 *   transacao_saida:
 *     allOf:
 *       - $ref: '#/definitions/transacao'
 *       - properties:
 *           liquido:
 *             type: number
 *             description: Valor líquido a receber, já descontadas as taxas.
 *           disponivel:
 *             type: string
 *             description: Data em que o saldo estará disponível. Utiliza o mesmo formato do campo 'horario'.
 *
 *   saldo:
 *     properties:
 *       disponivel:
 *         type: number
 *         description: Saldo disponível para saque na data de hoje
 *       receber:
 *         type: number
 *         description: Saldo ainda não disponível para saque.
 */

/**
 * @swagger
 * /transaction:
 *   post:
 *     tags:
 *       - transaction
 *     summary: registerTransaction
 *     description: Registra uma nova transação
 *     produces:
 *       - application/json
 *     security:
 *       - basicAuth: []
 *     parameters:
 *       - name: transacao
 *         description: Transação a ser incluída
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/transacao'
 *     responses:
 *       200:
 *         description: Transação criada com sucesso
 *         schema:
 *           $ref: '#/definitions/mensagem'
 *       400:
 *         description: Um ou mais campos contém um valor inválido ou não informado.
 *         schema:
 *           $ref: '#/definitions/erro'
 *       409:
 *         description: Já existe um registro de transação com o NSU informado.
 *         schema:
 *           $ref: '#/definitions/erro'
 */
router.post('/', auth.terminalOnly, TransactionController.registerTransaction);

/**
 * @swagger
 * /transaction:
 *   get:
 *     tags:
 *       - transaction
 *     summary: getAllTransactions
 *     description: Lista todas as transações armazenadas
 *     produces:
 *       - application/json
 *     security:
 *       - basicAuth: []
 *     responses:
 *       200:
 *         description: Lista de transações registradas
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/transacao_saida'
 */
router.get('/', auth.portalOnly, TransactionController.getAllTransactions);

/**
 * @swagger
 * /transaction/balance:
 *   get:
 *     tags:
 *       - transaction
 *     summary: getBalance
 *     description: Retorna o saldo disponível e a receber.
 *     produces:
 *       - application/json
 *     security:
 *       - basicAuth: []
 *     responses:
 *       200:
 *         description: Total dos valores disponíveis e a receber.
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/saldo'
 */
router.get('/balance', auth.portalOnly, TransactionController.getBalance);

export default router;
