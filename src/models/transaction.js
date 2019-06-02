import mongoose from 'mongoose';

export const BANDEIRAS = ['VISA', 'MASTERCARD', 'ELO', 'AMEX'];

export const MOD_CREDITO = 'credito';
export const MOD_DEBITO = 'debito';

export const MODALIDADES = {
  [MOD_CREDITO]: {
    diasCorridos: 30,
    fatorLiquido: 0.97
  },

  [MOD_DEBITO]: {
    diasCorridos: 0,
    fatorLiquido: 0.98
  },

  enum: [MOD_CREDITO, MOD_DEBITO]
};
export const TAXAS = {
  [MOD_CREDITO]: 0.97,
  [MOD_DEBITO]: 0.98
};

const transactionSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  nsu: { type: String, required: true, index: true, unique: true },
  valor: { type: Number, required: true, min: 0 },
  liquido: { type: Number, required: true },
  bandeira: {
    type: String,
    required: true,
    enum: BANDEIRAS
  },
  modalidade: { type: String, required: true, enum: MODALIDADES.enum },
  horario: { type: Date, required: true },
  disponivel: { type: Date, required: true, index: true }
});

export default mongoose.model('Transaction', transactionSchema);
