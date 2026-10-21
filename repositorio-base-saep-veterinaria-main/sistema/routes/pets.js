import express from 'express';
import { criarCliente } from '../config/db.js';
import { verificarSessao } from '../middleware/auth-middleware.js';
const router = express.Router();
router.use(verificarSessao);
router.post('/', async (req, res, next) => {
  const client = criarCliente();
  try {
    await client.connect();
    const dados = [texto(req.body.nome, 'Nome', 100), texto(req.body.especie, 'Espécie', 50, false), idValido(req.body.tutor_id)];
    const { rows } = await client.query('INSERT INTO pets (nome, especie, tutor_id) VALUES ($1,$2,$3) RETURNING *', dados);
    res.status(201).json(rows[0]);
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
