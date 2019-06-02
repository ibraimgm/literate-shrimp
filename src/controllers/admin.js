import mongoose from 'mongoose';

import Transaction from '../models/transaction';
import { handleErrors } from '../util';

const check = (_, res) => res.status(200).json({ message: 'It works!' });

const reset = (_, res, next) => {
  Transaction.deleteMany({})
    .then(() => res.status(200).json({ message: 'Reset ok' }))
    .catch(e => handleErrors(e, res, next));
};

const load = (_, res, next) => {
  const DEMO_DATA = [
    {
      _id: new mongoose.Types.ObjectId(),
      nsu: '0459356',
      valor: 50,
      bandeira: 'VISA',
      modalidade: 'credito',
      horario: '2019-01-02T09:02:01.000Z',
      disponivel: '2019-02-04T02:00:00.000Z',
      liquido: 48.5
    },
    {
      _id: new mongoose.Types.ObjectId(),
      nsu: '0451456',
      valor: 79.99,
      bandeira: 'MASTERCARD',
      modalidade: 'debito',
      horario: '2019-01-04T15:43:20.000Z',
      disponivel: '2019-01-07T02:00:00.000Z',
      liquido: 78.39
    },
    {
      _id: new mongoose.Types.ObjectId(),
      nsu: '99765',
      valor: 90.25,
      bandeira: 'AMEX',
      modalidade: 'credito',
      horario: '2019-04-30T22:31:12.000Z',
      disponivel: '2019-05-31T03:00:00.000Z',
      liquido: 87.54
    },
    {
      _id: new mongoose.Types.ObjectId(),
      nsu: '99766',
      valor: 165.4,
      bandeira: 'AMEX',
      modalidade: 'credito',
      horario: '2019-05-05T20:27:56.000Z',
      disponivel: '2019-06-05T03:00:00.000Z',
      liquido: 160.44
    },
    {
      _id: new mongoose.Types.ObjectId(),
      nsu: '80011',
      valor: 16.9,
      bandeira: 'ELO',
      modalidade: 'debito',
      horario: '2019-05-30T14:33:25.000Z',
      disponivel: '2019-05-31T03:00:00.000Z',
      liquido: 16.56
    },
    {
      _id: new mongoose.Types.ObjectId(),
      nsu: '80012',
      valor: 16.9,
      bandeira: 'ELO',
      modalidade: 'debito',
      horario: '2019-05-31T14:44:51.000Z',
      disponivel: '2019-06-03T03:00:00.000Z',
      liquido: 16.56
    },
    {
      _id: new mongoose.Types.ObjectId(),
      nsu: '997732',
      valor: 35,
      bandeira: 'VISA',
      modalidade: 'credito',
      horario: '2019-05-31T21:22:33.000Z',
      disponivel: '2019-07-01T03:00:00.000Z',
      liquido: 33.95
    }
  ];
  Transaction.deleteMany({})
    .then(() => Transaction.insertMany(DEMO_DATA))
    .then(() => res.status(200).json({ message: 'Load ok' }))
    .catch(e => handleErrors(e, res, next));
};

export default {
  check,
  reset,
  load
};
