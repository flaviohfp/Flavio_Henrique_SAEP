# Guia de Desenvolvimento

Este guia é um roteiro de apoio. Ele não te dá o código pronto -
te ajuda a organizar o raciocínio e saber por onde começar em cada
parte pendente do sistema.

## O que já está pronto para você

- Conexão com o banco de dados (`config/db.js`)
- Login completo, com sessão e tempo de expiração (`routes/auth.js`, `public/login.html`, `public/js/login.js`)
- Middleware que protege as rotas usando a sessão (`middleware/auth-middleware.js`)
- Funções de criptografia de senha e CPF (`utils/crypto-utils.js`)
- Estrutura das telas (HTML) com os campos e botões necessários
- Banco de dados já criado e populado (`saep_db.sql`)

## Exemplos disponíveis (pasta `exemplos/`)

Todos usam cenários diferentes do sistema de vocês (livros, escola...).
Leiam, copiem o padrão e troquem os nomes pelos do sistema de vocês.

| Preciso de... | Olhe este arquivo |
|---|---|
| Usar o `fetch` (listar, buscar, POST, PUT, DELETE) | `exemplo-fetch.js` |
| Desenhar a tabela, botões Editar/Excluir, preencher formulário e `<select>`, formatar data | `exemplo-montar-tela.js` (+ `exemplo-montar-tela.html` com os ids) |
| Um CRUD completo (rota + tela), com busca `ILIKE` e `PUT` | `exemplo-crud-completo/` |
| JOIN com mais de duas tabelas | `exemplo-join-multiplas-tabelas.sql` |
| Mostrar o nome do usuário logado | `exemplo-exibir-dados-sessao.js` |
| Logout | `exemplo-logout.js` |

## Ordem recomendada de implementação

A funcionalidade de **Tutor** é a mais completa (tem todos os
tipos de operação: listar, buscar, inserir, editar, excluir). Por
isso, recomendamos começar por ela - depois de resolvê-la, Pet e
Agendamento ficam mais rápidos, porque seguem a mesma lógica.

1. Funcionalidade Principal (nome do usuário + logout)
2. Tutor (listar → inserir → excluir → editar → buscar)
3. Pet (inserir)
4. Agendamento (listar com join → atualizar data)

## 1. Funcionalidade Principal

**Exibir nome do usuário (RF-09):**
1. `public/js/principal.js` já faz uma chamada para `/api/auth/sessao`.
2. Essa rota devolve um JSON parecido com `{ usuario: { nome: "..." } }`.
3. Você precisa pegar esse nome e colocar dentro do elemento
   `#nome-usuario` (ver `document.getElementById`).

**Logout (RF-10):**
1. Veja como a sessão é destruída em `exemplos/exemplo-logout.js`.
2. Crie, dentro de `routes/auth.js`, a lógica da rota de logout
   (ela já existe vazia, só falta o conteúdo).
3. No botão `#btn-sair` (em `principal.js`), chame essa rota via
   fetch, e depois redirecione para `/login.html`.

## 2. Tutor

**Listar (RF-12):**
1. Crie uma rota `GET /` em `routes/tutores.js` que busca todos os
   tutores no banco.
2. Lembre-se: o CPF está salvo criptografado - use
   `descriptografarCPF()` (de `utils/crypto-utils.js`) antes de
   devolver o CPF na resposta, senão vai aparecer ilegível na tela.
3. No front (`public/js/tutores.js`), a função `carregarTutores()`
   deve chamar essa rota e passar o resultado para
   `renderizarTutores()`.

**Inserir (RF-15):**
1. Crie uma rota `POST /` em `routes/tutores.js`.
2. Antes de salvar, use `criptografarCPF()` no CPF recebido.
3. No front, o formulário `#form-tutor` já dispara o evento de
   submit - falta só fazer o fetch.

**Excluir (RF-13):**
1. Crie uma rota `DELETE /:id`.
2. No front, cada botão "Excluir" (criado dentro de
   `renderizarTutores()`) precisa chamar a função `excluirTutor(id)`.

**Editar (RF-17):**
1. Crie uma rota `PUT /:id`.
2. No front, o botão "Editar" deve preencher o formulário com os
   dados daquele tutor (função `preencherFormularioParaEdicao`) e,
   ao salvar, o formulário deve identificar que é uma edição (veja
   o campo escondido `#tutor-id`) e chamar PUT em vez de POST.

**Busca (RF-14) - atenção, este é o ponto mais novo para a turma:**
1. Você pode resolver de duas formas:
   - **Opção simples:** a busca é feita no próprio JavaScript,
     filtrando a lista que já foi carregada (sem nova chamada ao
     banco). Funciona bem para poucos registros.
   - **Opção com banco:** a rota `GET /` aceita um parâmetro (ex:
     `?busca=termo`), e faz a busca direto no SQL usando `ILIKE`
     (ex: `WHERE nome ILIKE '%' || $1 || '%'`).
2. Qualquer uma das duas formas atende ao requisito. Escolha a que
   for mais rápida para vocês implementarem com segurança no tempo
   de prova.
3. No front, o botão `#btn-buscar` deve capturar o termo digitado
   em `#input-busca` e re-exibir a listagem filtrada.

## 3. Pet

**Inserir associado a um tutor (RF-18):**
1. A tela já carrega a lista de tutores no `<select>` automaticamente
   (isso já está pronto em `pets.js`).
2. Crie uma rota `POST /` em `routes/pets.js` que recebe `nome`,
   `especie` e `tutor_id`, e insere no banco.
3. Verifique que `tutor_id` não está vazio antes de inserir (o
   pet precisa estar sempre vinculado a um tutor).

## 4. Agendamento

**Listar ordenado, com dados do pet e do tutor (RF-19):**
1. Veja o exemplo de JOIN com múltiplas tabelas em
   `exemplos/exemplo-join-multiplas-tabelas.sql` antes de começar.
2. Lembre-se do caminho: `agendamentos` está ligado a `pets`
   (via `pet_id`), e `pets` está ligado a `tutores` (via
   `tutor_id`). Para trazer o nome do tutor numa consulta de
   agendamentos, você precisa passar pelas duas tabelas.
3. Não esqueça do `ORDER BY` pela data do agendamento.

**Atualizar data (RF-20):**
1. Crie uma rota `PUT /:id` que atualiza só o campo
   `data_agendamento`.
2. No front, cada linha da tabela tem um campo de data e um botão
   "Salvar" - ao clicar, chame `atualizarDataAgendamento(id, novaData)`.
3. Cuidado com o formato da data: ela chega do banco como
   `"2026-09-20T03:00:00.000Z"` e o campo `<input type="date">` só
   aceita `"2026-09-20"`. O item F de `exemplos/exemplo-montar-tela.js`
   mostra como resolver.

## Pontos de atenção (não esqueça)

- Todas as rotas (exceto login) devem usar o middleware
  `verificarSessao` - sem isso, o sistema fica acessível mesmo sem
  login, o que não atende ao requisito de segurança.
- CPF: sempre **criptografar antes de salvar**, sempre
  **descriptografar antes de exibir**.
- Senha: nunca é descriptografada - login sempre usa
  `compararSenha()` (já está pronto em `routes/auth.js`).
- Teste o fluxo completo (login → funcionalidade → logout) pelo
  menos uma vez antes de considerar algo finalizado.
