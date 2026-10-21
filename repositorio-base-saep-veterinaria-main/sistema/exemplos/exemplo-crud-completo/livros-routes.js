// ============================================================
// exemplos/exemplo-crud-completo/livros-routes.js
// ============================================================
// EXEMPLO COMPLETO E FUNCIONAL - não faz parte do sistema real,
// é só para consulta. Mostra o CRUD inteiro (listar com busca e
// join, inserir, editar, excluir) num cenário diferente
// (biblioteca), usando exatamente o mesmo padrão (Router,
// criarCliente, try/catch/finally) do sistema de vocês.
//
// Preste atenção especial nas rotas GET (busca + join) e PUT
// (edição) - são os pontos que mais se parecem com o que vocês
// ainda precisam resolver no sistema real.
// ============================================================

import express from 'express';
import { criarCliente } from '../../config/db.js';

const router = express.Router();

// ─────────────────────────────────────────
// GET / -> listar livros, com o nome da categoria (JOIN) e
// busca opcional por título (?busca=termo)
// ─────────────────────────────────────────
router.get('/', async (req, res) => {
    const client = criarCliente();
    try {
        await client.connect();

        const termoBusca = req.query.busca;

        let resultado;

        if (termoBusca) {
            // Busca: usamos ILIKE para não diferenciar maiúsculas
            // de minúsculas, e "%" antes e depois do termo para
            // encontrar a palavra em qualquer parte do título.
            // O "$1" evita SQL Injection (nunca concatene o texto
            // digitado direto dentro da string da query).
            resultado = await client.query(`
                SELECT
                    l.id,
                    l.titulo,
                    l.autor,
                    c.nome AS categoria
                FROM livros l
                INNER JOIN categorias c ON l.categoria_id = c.id
                WHERE l.titulo ILIKE '%' || $1 || '%'
                ORDER BY l.titulo
            `, [termoBusca]);
        } else {
            resultado = await client.query(`
                SELECT
                    l.id,
                    l.titulo,
                    l.autor,
                    c.nome AS categoria
                FROM livros l
                INNER JOIN categorias c ON l.categoria_id = c.id
                ORDER BY l.titulo
            `);
        }

        res.json(resultado.rows);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    } finally {
        await client.end();
    }
});

// ─────────────────────────────────────────
// GET /categorias -> lista de categorias, para popular um
// <select> no formulário de cadastro/edição
// ─────────────────────────────────────────
router.get('/categorias', async (req, res) => {
    const client = criarCliente();
    try {
        await client.connect();
        const resultado = await client.query('SELECT * FROM categorias ORDER BY nome');
        res.json(resultado.rows);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    } finally {
        await client.end();
    }
});

// ─────────────────────────────────────────
// POST / -> inserir novo livro
// ─────────────────────────────────────────
router.post('/', async (req, res) => {
    const client = criarCliente();
    try {
        await client.connect();

        const { titulo, autor, categoria_id } = req.body;

        if (!titulo || !categoria_id) {
            return res.status(400).json({ erro: 'Título e categoria são obrigatórios.' });
        }

        const resultado = await client.query(`
            INSERT INTO livros (titulo, autor, categoria_id)
            VALUES ($1, $2, $3)
            RETURNING *
        `, [titulo, autor, categoria_id]);

        res.status(201).json(resultado.rows[0]);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    } finally {
        await client.end();
    }
});

// ─────────────────────────────────────────
// PUT /:id -> editar um livro existente
// (esta é a parte que costuma ser nova - reparem que é bem
// parecida com o INSERT, só muda para UPDATE ... SET ... WHERE)
// ─────────────────────────────────────────
router.put('/:id', async (req, res) => {
    const client = criarCliente();
    try {
        await client.connect();

        const { id } = req.params;
        const { titulo, autor, categoria_id } = req.body;

        const resultado = await client.query(`
            UPDATE livros
            SET titulo = $1, autor = $2, categoria_id = $3
            WHERE id = $4
            RETURNING *
        `, [titulo, autor, categoria_id, id]);

        if (resultado.rows.length === 0) {
            return res.status(404).json({ erro: 'Livro não encontrado.' });
        }

        res.json(resultado.rows[0]);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    } finally {
        await client.end();
    }
});

// ─────────────────────────────────────────
// DELETE /:id -> excluir um livro
// ─────────────────────────────────────────
router.delete('/:id', async (req, res) => {
    const client = criarCliente();
    try {
        await client.connect();

        const { id } = req.params;
        const resultado = await client.query(
            'DELETE FROM livros WHERE id = $1 RETURNING titulo',
            [id]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({ erro: 'Livro não encontrado.' });
        }

        res.json({ mensagem: `"${resultado.rows[0].titulo}" removido com sucesso.` });
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    } finally {
        await client.end();
    }
});

export default router;
