// ============================================================
// routes/pets.js
// ============================================================
// ESTE ARQUIVO É COM VOCÊS (ALUNO DESENVOLVE).
//
// A estrutura da rota (o "molde" com try/catch/finally e a
// conexão com o banco) já está pronta. O que falta é a lógica
// específica (marcada com TODO).
//
// Lembrete importante:
//   - O cadastro de pet é obrigatoriamente vinculado a um tutor
//     (tutor_id não pode ser nulo)
//
// Veja o GUIA_DE_DESENVOLVIMENTO.md para um roteiro passo a passo.
// ============================================================

import express from 'express';
import { criarCliente } from '../config/db.js';
import { verificarSessao } from '../middleware/auth-middleware.js';

const router = express.Router();

// ─────────────────────────────────────────
// POST / -> inserir novo pet, associado a um tutor (RF-18)
// ─────────────────────────────────────────
router.post('/', verificarSessao, async (req, res) => {
    const client = criarCliente();
    try {
        await client.connect();

        const { nome, especie, tutor_id } = req.body;

        // TODO: validar que nome e tutor_id foram informados
        // (tutor_id não pode ser vazio - todo pet precisa de um tutor)
        if (typeof nome !== 'string' || !nome.trim() || nome.trim().length > 100 ||
            !/^[1-9]\d*$/.test(String(tutor_id)) ||
            (especie != null && (typeof especie !== 'string' || especie.length > 50))) {
            return res.status(400).json({ erro: 'Informe o nome do pet, uma espécie com até 50 caracteres e selecione um tutor.' });
        }

        // TODO: montar o INSERT usando client.query(...), com
        // RETURNING * para devolver o registro criado
        const resultado = await client.query(
            'INSERT INTO pets (nome, especie, tutor_id) VALUES ($1, $2, $3) RETURNING *',
            [nome.trim(), especie ? especie.trim() : '', tutor_id]
        );

        res.status(201).json(resultado.rows[0]); // TODO: substituir pelo registro criado
    } catch (erro) {
        if (erro.code === '23503') return res.status(400).json({ erro: 'Tutor não encontrado. Atualize a lista de tutores.' });
        res.status(500).json({ erro: erro.message });
    } finally {
        await client.end();
    }
});

export default router;
