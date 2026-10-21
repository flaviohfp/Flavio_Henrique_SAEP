// ============================================================
// routes/auth.js
// ============================================================
// Este arquivo já está pronto (BASE FORNECIDA).
//
// Aqui está toda a lógica de login: recebe usuário e senha,
// confere no banco, e cria a sessão do usuário autenticado.
//
// Vocês não precisam alterar esta rota para o sistema funcionar.
// O que vocês vão desenvolver, usando o que está pronto aqui, é:
//   - exibir o nome do usuário logado na tela Principal (RF-09)
//   - implementar o logout (RF-10)
//   (ambos em public/js/principal.js)
// ============================================================

import express from 'express';
import { criarCliente } from '../config/db.js';
import { compararSenha } from '../utils/crypto-utils.js';

const router = express.Router();

// ─────────────────────────────────────────
// POST /api/auth/login
// ─────────────────────────────────────────
router.post('/login', async (req, res) => {
    const { login, senha } = req.body;

    if (!login || !senha) {
        return res.status(400).json({ erro: 'Informe usuário e senha.' });
    }

    const client = criarCliente();
    try {
        await client.connect();

        const resultado = await client.query(
            'SELECT * FROM usuarios WHERE login = $1',
            [login]
        );

        // ------------------------------------------------------
        // RF-08: validação de falha de autenticação.
        // Abaixo já existe uma validação básica (usuário não
        // encontrado / senha incorreta), que já é suficiente para
        // atender ao requisito. Se quiserem, podem personalizar a
        // mensagem de erro ou a forma como ela é exibida no
        // front-end (public/js/login.js) - não é obrigatório, mas
        // fica como sugestão de melhoria.
        // ------------------------------------------------------
        if (resultado.rows.length === 0) {
            return res.status(401).json({ erro: 'Usuário ou senha inválidos.' });
        }

        const usuario = resultado.rows[0];
        const senhaConfere = await compararSenha(senha, usuario.senha);

        if (!senhaConfere) {
            return res.status(401).json({ erro: 'Usuário ou senha inválidos.' });
        }

        // Login OK - cria a sessão do usuário autenticado.
        // É esse objeto (req.session.usuario) que fica disponível
        // em outras rotas protegidas pelo middleware verificarSessao,
        // e é dele que vocês vão ler o nome do usuário em RF-09.
        req.session.usuario = {
            id: usuario.id,
            nome: usuario.nome,
            login: usuario.login
        };

        res.json({ mensagem: 'Login realizado com sucesso.', nome: usuario.nome });

    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    } finally {
        await client.end();
    }
});

// ─────────────────────────────────────────
// GET /api/auth/sessao
// Usada pela tela Principal para descobrir quem está logado
// (o front-end não tem acesso direto à sessão do servidor,
// por isso existe essa rota).
// ─────────────────────────────────────────
router.get('/sessao', (req, res) => {
    if (req.session && req.session.usuario) {
        return res.json({ usuario: req.session.usuario });
    }
    return res.status(401).json({ erro: 'Sessão expirada ou usuário não autenticado.' });
});

// ─────────────────────────────────────────
// POST /api/auth/logout
// ─────────────────────────────────────────
// TODO (RF-10): implemente aqui a destruição da sessão.
// Dica: veja como a sessão foi CRIADA lá em cima (req.session.usuario = ...).
// Destruir a sessão segue uma lógica parecida, só que ao contrário -
// existe um método pronto do express-session para isso.
// Se tiver dúvida de qual método usar, dê uma olhada em:
// exemplos/exemplo-logout.js
// ─────────────────────────────────────────
router.post('/logout', (req, res) => {
    // implemente aqui
});

export default router;
