# Exemplo completo - Sistema de Biblioteca (LIVROS)

Este é um exemplo completo e funcional (back-end + front-end), num
cenário DIFERENTE do sistema de vocês (uma biblioteca, com livros e
categorias, em vez de clínica veterinária). A ideia é que vocês
possam ler, testar e entender o padrão, e depois adaptar o
raciocínio para as entidades do sistema de vocês (Tutor, Pet,
Agendamento).

## Cenário

- Uma `categoria` tem: id, nome (ex: "Ficção", "Técnico")
- Um `livro` tem: id, titulo, autor, categoria_id (associado a uma categoria)

Ou seja, a relação `livro -> categoria` é exatamente do mesmo tipo
que `pet -> tutor` ou `agendamento -> pet` no sistema de vocês: uma
tabela que referencia outra através de uma chave estrangeira.

## O que este exemplo cobre (e por quê)

| Arquivo | O que mostra | Relacionado a |
|---|---|---|
| `livros-routes.js` | Rota GET com busca (`ILIKE`) e JOIN | RF-14 (busca) e RF-19 (join) |
| `livros-routes.js` | Rota PUT completa (edição) | RF-17, RF-20 (vocês só viram GET/POST/DELETE no exemplo de jogos - PUT é novo) |
| `livros.js` (front) | Buscar, listar, editar (preencher formulário), excluir | RF-12 a RF-17 |
| `livros.html` | Estrutura de tela com busca + formulário + tabela | Layout de referência |

## Como usar este exemplo

Você **não precisa rodar** este exemplo dentro do sistema de vocês -
ele é só para consulta/leitura. Se quiser testar de verdade, seria
necessário criar as tabelas `livros` e `categorias` (ver
`schema-exemplo.sql`) num banco à parte.

O importante é ler o código, entender o padrão, e aplicar o mesmo
raciocínio nos arquivos `routes/tutores.js`, `routes/agendamentos.js`
e `public/js/tutores.js`, `public/js/agendamentos.js`, trocando os
nomes das tabelas/campos pelos do sistema de vocês.
