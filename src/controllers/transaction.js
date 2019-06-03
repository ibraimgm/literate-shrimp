import mongoose from 'mongoose';
import moment from 'moment';
import currency from 'currency.js';

import Transaction, { BANDEIRAS, MODALIDADES } from '../models/transaction';
import { ok, bad, conflict } from '../validation';
import {
  isValidDateFormat,
  enumToStr,
  proximoDiaUtil,
  zerarHora,
  handleErrors
} from '../util';

const VALOR_MINIMO = 0; /*0.01*/

const validarNsu = t => {
  if (!t.nsu) {
    return bad(`O campo 'nsu' deve ser preenchido.`);
  }

  if (typeof t.nsu !== 'string') {
    return bad(`O campo 'nsu' deve ser do tipo 'string'.`);
  }

  if (!t.nsu.match(/^\d+$/)) {
    return bad(`O campo 'nsu' deve ser composto apenas por números.`);
  }

  if (+t.nsu === 0) {
    return bad(`O campo 'nsu' não pode ser composto apenas de zeros.`);
  }

  return Transaction.findOne({ nsu: t.nsu }).then(doc => {
    if (doc) {
      return conflict(`Já existe uma transação com o 'nsu' informado.`);
    }

    return ok(t);
  });
};

const validarValor = t => {
  if (t.valor == null) {
    return bad(`O campo 'valor' deve ser preenchido.`);
  }

  if (typeof t.valor !== 'number') {
    return bad(`O campo 'valor' deve ser do tipo 'number'.`);
  }

  if (t.valor < VALOR_MINIMO) {
    return bad(`O campo 'valor' deve ser maior ou igual a ${VALOR_MINIMO}.`);
  }

  if (!('' + t.valor).match(/^\d+(\.\d\d?)?$/)) {
    return bad(`O campo 'valor' deve possuir no máximo duas casas decimais.`);
  }

  return ok(t);
};

const validarBandeira = t => {
  if (BANDEIRAS.indexOf(t.bandeira) < 0) {
    return bad(
      `Valor inválido para 'bandeira'. Valores válidos: ${enumToStr(BANDEIRAS)}`
    );
  }

  return ok(t);
};

const validarModalidade = t => {
  if (MODALIDADES.enum.indexOf(t.modalidade) < 0) {
    return bad(
      `Valor inválido para 'modalidade'. Valores válidos: ${enumToStr(
        MODALIDADES.enum
      )}`
    );
  }

  return ok(t);
};

const validarHorario = t => {
  if (!t.horario) {
    return bad(`O campo 'horario' deve ser informado.`);
  }

  if (typeof t.horario !== 'string') {
    return bad(`O campo 'horario' deve ser do tipo 'string'.`);
  }

  if (!isValidDateFormat(t.horario)) {
    const now = moment().toISOString(true);
    return bad(
      `O campo 'horario' deve ser informado no formato ISO. Ex: ${now}.`
    );
  }

  const h = moment(t.horario);

  if (!h.isValid()) {
    return bad(
      `O valor informado no campo 'horario' não representa uma data válida.`
    );
  }

  if (h.isAfter(moment())) {
    return bad(
      `O valor informado no campo 'horario' não pode ser superior à data e hora atuais.`
    );
  }

  return ok(t);
};

const criarTransacao = t => {
  const modalidade = MODALIDADES[t.modalidade];

  // calcula a data disponivel
  const disponivel = moment(t.horario);
  zerarHora(disponivel);
  disponivel.add(modalidade.diasCorridos, 'd');
  proximoDiaUtil(disponivel);

  // calcula o valor liquidoconsolelog
  const liquido = currency(t.valor).multiply(modalidade.fatorLiquido).value;

  return ok(
    new Transaction({
      ...t,
      _id: new mongoose.Types.ObjectId(),
      disponivel: disponivel.toDate(),
      liquido
    })
  );
};

/*
  Cria uma nova transação. Observe que a data disponível é calculada com referência ao mesmo
  timezone do horário informado.
 */
const registerTransaction = (req, res, next) => {
  validarNsu({
    nsu: req.body.nsu,
    valor: req.body.valor,
    bandeira: req.body.bandeira,
    modalidade: req.body.modalidade,
    horario: req.body.horario
  })
    .then(validarValor)
    .then(validarBandeira)
    .then(validarModalidade)
    .then(validarHorario)
    .then(criarTransacao)
    .then(t => t.save())
    .then(saved => {
      res
        .status(201)
        .json({ message: `Registrada transação com nsu '${saved.nsu}'.` });
    })
    .catch(e => handleErrors(e, res, next));
};

/*
  Lista todas as transações.
  Observe que apenas os campos 'que interessam' são exibidos, e que a data é reformatada
  para manter a consistência no retorno.
*/
const getAllTransactions = (_, res, next) => {
  Transaction.find({})
    .then(docs =>
      res.status(200).json(
        docs
          .map(
            ({
              nsu,
              valor,
              bandeira,
              modalidade,
              horario,
              disponivel,
              liquido
            }) => ({
              nsu,
              valor,
              bandeira,
              modalidade,
              horario,
              disponivel,
              liquido
            })
          )
          .map(d => {
            d.horario = moment(d.horario).toISOString(true);
            d.disponivel = moment(d.disponivel).toISOString(true);
            return d;
          })
      )
    )
    .catch(e => handleErrors(e, res, next));
};

const getBalance = (_, res, next) => {
  const limit = moment();
  zerarHora(limit);
  limit.add(1, 'day');

  Transaction.aggregate([
    {
      $group: {
        _id: null,
        disponivel: {
          $sum: {
            $cond: [{ $lt: ['$disponivel', limit.toDate()] }, '$liquido', 0]
          }
        },
        receber: {
          $sum: {
            $cond: [{ $gte: ['$disponivel', limit.toDate()] }, '$liquido', 0]
          }
        }
      }
    },
    { $project: { _id: 0, disponivel: 1, receber: 1 } }
  ])
    .then(balance =>
      res
        .status(200)
        .json(balance.length > 0 ? balance[0] : { disponivel: 0, receber: 0 })
    )
    .catch(e => handleErrors(e, res, next));
};

export default {
  registerTransaction,
  getAllTransactions,
  getBalance
};
