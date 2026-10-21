import express from 'express';
import { criarCliente } from '../config/db.js';
import { criptografarCPF, descriptografarCPF } from '../utils/crypto-utils.js';
import { verificarSessao } from '../middleware/auth-middleware.js';
const router = express.Router();
router.use(verificarSessao);
const exibir = tutor => ({ ...tutor, cpf: descriptografarCPF(tutor.cpf) });
router.get('/', async (req, res, next) => {
  const client = criarCliente();
  try {
    await client.connect();
    const busca = texto(req.query.busca, 'Busca', 100, false);
    const { rows } = await client.query('SELECT * FROM tutores WHERE nome ILIKE $1 ORDER BY nome, id', ['%' + busca + '%']);
    res.json(rows.map(exibir));
  } catch (erro) {
    next(erro);
  } finally {
    await client.end();
  }
});
function dados(body) {
  const nome = texto(body.nome, 'Nome', 100);
  const cpf = texto(body.cpf, 'CPF', 14).replace(/[.\-\s]/g, '');
  exigir(/^\d{11}$/.test(cpf), 'CPF deve conter 11 dígitos.');
  return [nome, criptografarCPF(cpf), texto(body.telefone, 'Telefone', 20, false)];
}
router.post('/', async (req, res, next) => {
  const client = criarCliente();
  try {
    await client.connect();
    const { rows } = await client.query('INSERT INTO tutores (nome, cpf, telefone) VALUES ($1,$2,$3) RETURNING *', dados(req.body));
    res.status(201).json(exibir(rows[0]));
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
    const id = idValido(req.params.id);
    const { rows } = await client.query('UPDATE tutores SET nome=$1, cpf=$2, telefone=$3 WHERE id=$4 RETURNING *', [...dados(req.body), id]);
    exigir(rows.length, 'Tutor não encontrado.', 404);
    res.json(exibir(rows[0]));
  } catch (erro) {
    next(erro);
  } finally {
    await client.end();
  }
});
router.delete('/:id', async (req, res, next) => {
  const client = criarCliente();
  try {
    await client.connect();
    const { rowCount } = await client.query('DELETE FROM tutores WHERE id=$1', [idValido(req.params.id)]);
    exigir(rowCount, 'Tutor não encontrado.', 404);
    res.json({ mensagem: 'Tutor removido com sucesso.' });
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
function texto(valor, nome, tamanho, obrigatorio = true) {
  exigir(valor == null || typeof valor === 'string', nome + ' inválido.');
  const resultado = (valor || '').trim();
  exigir((!obrigatorio || resultado.length > 0) && resultado.length <= tamanho, nome + ': preencha até ' + tamanho + ' caracteres.');
  return resultado;
}
