import express from 'express';
import { criarCliente } from '../config/db.js';
import { descriptografarCPF } from '../utils/crypto-utils.js';
import { verificarSessao } from '../middleware/auth-middleware.js';
const router = express.Router();
router.use(verificarSessao);
router.get('/', async (req, res, next) => {
  const client = criarCliente();
  try {
    await client.connect();
    const { rows } = await client.query(`SELECT a.*, p.nome AS pet_nome, p.especie, p.tutor_id,
      t.nome AS tutor_nome, t.cpf AS tutor_cpf, t.telefone AS tutor_telefone
      FROM agendamentos a JOIN pets p ON p.id=a.pet_id JOIN tutores t ON t.id=p.tutor_id
      ORDER BY a.data_agendamento, a.id`);
    res.json(rows.map(a => ({ ...a, tutor_cpf: descriptografarCPF(a.tutor_cpf) })));
  } catch (erro) {
    next(erro);
  } finally {
    await client.end();
  }
});
router.put('/:id', async (req, res, next) => {
  const client = criarCliente();
  try {
    await client.connect();
    const { rows } = await client.query('UPDATE agendamentos SET data_agendamento=$1 WHERE id=$2 RETURNING *', [dataValida(req.body.data_agendamento), idValido(req.params.id)]);
    exigir(rows.length, 'Agendamento não encontrado.', 404);
    res.json(rows[0]);
  } catch (erro) {
    next(erro);
  } finally {
    await client.end();
  }
});
export default router;

function exigir(condicao, mensagem, status = 400) {
  if (!condicao) { const erro = new Error(mensagem); erro.status = status; throw erro; }
}
function idValido(valor) {
  exigir(/^[1-9]\d*$/.test(String(valor)) && Number.isSafeInteger(Number(valor)), 'Identificador inválido.');
  return Number(valor);
}
function dataValida(valor) {
  exigir(typeof valor === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(valor), 'Informe uma data válida.');
  const data = new Date(valor + 'T12:00:00Z');
  exigir(!isNaN(data) && data.toISOString().slice(0, 10) === valor && Number(valor.slice(0,4)) > 0, 'Informe uma data válida.');
  return valor;
}
