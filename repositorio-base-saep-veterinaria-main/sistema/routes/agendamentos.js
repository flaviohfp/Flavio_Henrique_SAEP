// ============================================================
// routes/agendamentos.js
// ============================================================
// ESTE ARQUIVO É COM VOCÊS (ALUNO DESENVOLVE).
//
// A estrutura de cada rota (o "molde" com try/catch/finally e a
// conexão com o banco) já está pronta. O que falta em cada uma é
// a lógica específica (marcada com TODO).
//
// Lembrete importante sobre o JOIN (RF-19):
//   O tutor não está diretamente ligado ao agendamento - o
//   caminho é agendamentos -> pets -> tutores. Ou seja, vocês vão
//   precisar de um JOIN passando por DUAS tabelas (pets e tutores)
//   para trazer "todos os dados do tutor e do pet" como pede o
//   requisito.
//   Veja um exemplo de JOIN com múltiplas tabelas em:
//   exemplos/exemplo-join-multiplas-tabelas.sql
//
// Veja o GUIA_DE_DESENVOLVIMENTO.md para um roteiro passo a passo.
// ============================================================

import express from 'express';
import { criarCliente } from '../config/db.js';
import { verificarSessao } from '../middleware/auth-middleware.js';

const router = express.Router();

// ─────────────────────────────────────────
// GET / -> listar agendamentos ordenados por data, com dados
// do pet e do tutor (RF-19)
// ─────────────────────────────────────────
router.get('/', verificarSessao, async (req, res) => {
    const client = criarCliente();
    try {
        await client.connect();

        // TODO: montar a query com JOIN (agendamentos -> pets ->
        // tutores) e ORDER BY pela data do agendamento

        const resultado = await client.query('SELECT * FROM agendamentos'); // TODO: ajustar

        res.json(resultado.rows);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    } finally {
        await client.end();
    }
});

// ─────────────────────────────────────────
// PUT /:id -> atualizar a data de um agendamento (RF-20)
// ─────────────────────────────────────────
router.put('/:id', verificarSessao, async (req, res) => {
    const client = criarCliente();
    try {
        await client.connect();

        const { id } = req.params;
        const { data_agendamento } = req.body;

        // TODO: montar o UPDATE usando client.query(...), atualizando
        // só a coluna data_agendamento, filtrando por WHERE id = $...

        res.json({}); // TODO: substituir pela confirmação/registro atualizado
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    } finally {
        await client.end();
    }
});

export default router;
