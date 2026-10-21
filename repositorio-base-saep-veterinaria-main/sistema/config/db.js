// ============================================================
// config/db.js
// ============================================================
// Este arquivo já está pronto (BASE FORNECIDA).
//
// Aqui está a função que cria a conexão com o PostgreSQL, no
// mesmo padrão que vocês já usaram em outros projetos: um
// Client novo, que se conecta no início de cada rota e se
// desconecta no final (connect() / end()).
//
// COMO USAR dentro de um arquivo de rota (routes/tutores.js, etc.):
//
//   import express from 'express';
//   import { criarCliente } from '../config/db.js';
//
//   const router = express.Router();
//
//   // repare: é "router.get", não "app.get" - dentro dos arquivos
//   // de routes/ vocês sempre usam "router", porque cada arquivo
//   // é um "mini app" só daquela funcionalidade (ver app.js para
//   // entender como o router é conectado ao sistema principal)
//   router.get('/', async (req, res) => {
//       const client = criarCliente();
//       try {
//           await client.connect();
//           const resultado = await client.query('SELECT * FROM tutores');
//           res.json(resultado.rows);
//       } catch (erro) {
//           res.status(500).json({ erro: erro.message });
//       } finally {
//           await client.end();
//       }
//   });
//
//   export default router;
//
// Note também que o caminho é só '/' (não '/api/tutores') - o
// prefixo /api/tutores já é adicionado automaticamente pelo
// app.js, no momento em que ele registra esse router (veja
// app.use('/api/tutores', tutoresRoutes) em app.js). Ou seja,
// dentro de routes/tutores.js, uma rota '/' vira, na prática,
// '/api/tutores', e uma rota '/:id' vira '/api/tutores/:id'.
//
// Não é necessário alterar nada aqui. Se os dados de acesso ao
// banco forem diferentes na máquina onde a prova for realizada,
// ajuste apenas os valores abaixo.
// ============================================================

import pkg from 'pg';
const { Client } = pkg;

export function criarCliente() {
    return new Client({
        host:     'localhost',
        port:     5432,
        user:     'postgres',
        password: 'root',
        database: 'saep_db'
    });
}
