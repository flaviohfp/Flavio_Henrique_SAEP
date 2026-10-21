-- ============================================================
-- exemplos/exemplo-join-multiplas-tabelas.sql
-- ============================================================
-- Este é só um EXEMPLO de referência (não faz parte do banco
-- real do sistema, e não usa as tabelas de tutores/pets/
-- agendamentos - é só para mostrar o padrão de um JOIN com mais
-- de uma tabela).
--
-- Cenário do exemplo: uma escola com ALUNOS matriculados em
-- TURMAS, e cada TURMA pertence a um PROFESSOR.
--
--   alunos.turma_id      -> turmas.id
--   turmas.professor_id  -> professores.id
--
-- Ou seja, para trazer, numa mesma listagem, o nome do aluno,
-- o nome da turma E o nome do professor, é preciso "atravessar"
-- duas tabelas a partir de alunos - exatamente como no requisito
-- de Agendamentos do sistema de vocês, em que para trazer os
-- dados do TUTOR é preciso passar por PETS primeiro.
-- ============================================================

-- Estrutura de exemplo (não precisa criar isso no banco de
-- verdade, é só ilustrativo):
--
-- CREATE TABLE professores (id SERIAL PRIMARY KEY, nome VARCHAR(100));
-- CREATE TABLE turmas (id SERIAL PRIMARY KEY, nome VARCHAR(50), professor_id INTEGER REFERENCES professores(id));
-- CREATE TABLE alunos (id SERIAL PRIMARY KEY, nome VARCHAR(100), turma_id INTEGER REFERENCES turmas(id));

-- ------------------------------------------------------------
-- O JOIN em si: repare que cada INNER JOIN "soma" mais uma
-- tabela, e cada um usa um alias curto (a, t, p) para facilitar
-- a leitura e evitar repetir o nome completo da tabela toda hora.
-- ------------------------------------------------------------
SELECT
    a.id,
    a.nome        AS nome_aluno,
    t.nome        AS nome_turma,
    p.nome        AS nome_professor
FROM alunos a
INNER JOIN turmas t       ON a.turma_id = t.id
INNER JOIN professores p ON t.professor_id = p.id
ORDER BY a.nome;

-- ------------------------------------------------------------
-- Como isso se aplica ao sistema de vocês: pensem em qual
-- tabela precisa "passar por outra" para chegar ao dado que
-- falta. No exemplo acima, alunos -> turmas -> professores.
-- Pensem no mesmo raciocínio para os requisitos do sistema de
-- vocês que também pedem dados vindos de mais de uma tabela
-- relacionada.
-- ------------------------------------------------------------
