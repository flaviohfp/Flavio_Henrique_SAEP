// ============================================================
// app.js
// ============================================================
// Este arquivo já está pronto (BASE FORNECIDA).
//
// Aqui é o "ponto de entrada" do sistema: configura o Express,
// a sessão (com tempo de expiração) e registra as rotas de cada
// funcionalidade.
//
// OBSERVAÇÃO SOBRE A ORGANIZAÇÃO EM ARQUIVOS SEPARADOS:
// Vocês estão acostumados a escrever tudo dentro de um único
// app.js (como no exemplo de "jogos"). Aqui, para não deixar um
// arquivo gigante com login + tutores + pets + agendamentos
// misturados, cada funcionalidade tem seu próprio arquivo dentro
// de routes/ (auth.js, tutores.js, pets.js, agendamentos.js).
//
// Cada um desses arquivos usa um "Router" do Express, que
// funciona como um mini app.js só daquela funcionalidade. Depois,
// aqui embaixo, a gente "pluga" cada um deles no sistema principal
// com app.use(...). Vocês NÃO precisam entender profundamente como
// o Router funciona por dentro - só precisam saber que, para
// desenvolver a funcionalidade de Tutor, por exemplo, é dentro de
// routes/tutores.js que vocês vão escrever o código (não aqui).
// ============================================================

import express from 'express';
import session from 'express-session';

import authRoutes from './routes/auth.js';
import tutoresRoutes from './routes/tutores.js';
import petsRoutes from './routes/pets.js';
import agendamentosRoutes from './routes/agendamentos.js';

const app = express();

// Permite que o Express entenda requisições com corpo em JSON
// (necessário para POST/PUT vindos do fetch do front-end)
app.use(express.json());

// Serve os arquivos estáticos (HTML, CSS, JS do front-end) que
// estão dentro da pasta public/
app.use(express.static('public'));

// ------------------------------------------------------------
// SESSÃO (RF-07: sessão com tempo de expiração)
// ------------------------------------------------------------
// maxAge está em milissegundos. Abaixo está configurado para
// 15 minutos (15 * 60 * 1000). Se quiserem ajustar o tempo de
// expiração para o dia da prova, mudem apenas esse valor.
//
// secret: é uma chave usada internamente pelo Express para
// assinar o identificador da sessão. Não precisa ser alterado.
// ------------------------------------------------------------
app.use(session({
    secret: 'saep2026-clinica-veterinaria-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 15 * 60 * 1000 // 15 minutos
    }
}));

// ------------------------------------------------------------
// REGISTRO DAS ROTAS
// Cada linha abaixo diz: "toda rota que começar com esse prefixo
// vai ser tratada pelo arquivo correspondente".
// Exemplo: uma requisição para /api/tutores vai cair dentro de
// routes/tutores.js
// ------------------------------------------------------------
app.use('/api/auth', authRoutes);
app.use('/api/tutores', tutoresRoutes);
app.use('/api/pets', petsRoutes);
app.use('/api/agendamentos', agendamentosRoutes);

const PORTA = 3000;
app.listen(PORTA, () => {
    console.log(`Servidor rodando em http://localhost:${PORTA}`);
});
