// ============================================================
// exemplos/exemplo-logout.js
// ============================================================
// Este é só um EXEMPLO de referência - uma rota Express isolada,
// fora do sistema real, mostrando como destruir uma sessão
// criada com express-session.
//
// Não faz parte do projeto (não precisa importar nem rodar isso).
// É só para consulta de como o "destroy" funciona, já que vocês
// viram como CRIAR uma sessão (em routes/auth.js), mas talvez
// não tenham praticado como encerrar uma.
// ============================================================

import express from 'express';
import session from 'express-session';

const app = express();
app.use(session({ secret: 'exemplo', resave: false, saveUninitialized: false }));

// Rota fictícia de "login" só para ilustrar a criação da sessão
// (isso já está pronto de verdade em routes/auth.js do sistema)
app.post('/exemplo-login', (req, res) => {
    req.session.usuario = { nome: 'Fulano' };
    res.send('Sessão criada.');
});

// ------------------------------------------------------------
// Isto é o que importa: destruir a sessão.
// req.session.destroy() remove os dados da sessão do lado do
// servidor. O callback avisa quando a operação terminou.
// ------------------------------------------------------------
app.post('/exemplo-logout', (req, res) => {
    req.session.destroy((erro) => {
        if (erro) {
            return res.status(500).send('Erro ao encerrar a sessão.');
        }
        res.send('Sessão encerrada com sucesso.');
    });
});

// No lado do front-end (JS), depois de chamar essa rota, o
// padrão é redirecionar o usuário para a tela de login:
//
//   await fetch('/exemplo-logout', { method: 'POST' });
//   window.location.href = '/login.html';
