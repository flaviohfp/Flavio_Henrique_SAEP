-- ============================================================
-- SAEP 2026 - Técnico em Desenvolvimento de Sistemas
-- Sistema de Gestão - Clínica Veterinária
-- Script de criação e população do banco de dados
-- ============================================================
-- Este script já está pronto (BASE FORNECIDA).
-- Você não precisa alterar esta estrutura, apenas utilizá-la
-- corretamente nas suas rotas (queries de SELECT, INSERT,
-- UPDATE e DELETE).
-- ============================================================

-- Caso já exista, remove as tabelas na ordem correta (respeitando FKs)
DROP TABLE IF EXISTS agendamentos;
DROP TABLE IF EXISTS pets;
DROP TABLE IF EXISTS tutores;
DROP TABLE IF EXISTS usuarios;

-- ============================================================
-- TABELA: usuarios
-- Usuários do sistema (funcionários da clínica) que fazem login
-- ============================================================
CREATE TABLE usuarios (
    id     SERIAL PRIMARY KEY,
    nome   VARCHAR(100) NOT NULL,
    login  VARCHAR(50) UNIQUE NOT NULL,
    senha  VARCHAR(255) NOT NULL -- armazenado como HASH (bcrypt), nunca em texto puro
);

-- ============================================================
-- TABELA: tutores
-- Donos dos pets
-- ============================================================
CREATE TABLE tutores (
    id        SERIAL PRIMARY KEY,
    nome      VARCHAR(100) NOT NULL,
    cpf       VARCHAR(255) NOT NULL, -- armazenado CRIPTOGRAFADO (reversível), dado sensível (LGPD)
    telefone  VARCHAR(20)
);

-- ============================================================
-- TABELA: pets
-- Cada pet pertence a um único tutor
-- ============================================================
CREATE TABLE pets (
    id        SERIAL PRIMARY KEY,
    nome      VARCHAR(100) NOT NULL,
    especie   VARCHAR(50),
    tutor_id  INTEGER NOT NULL,
    CONSTRAINT fk_pets_tutor
        FOREIGN KEY (tutor_id) REFERENCES tutores(id)
);

-- ============================================================
-- TABELA: agendamentos
-- Cada agendamento é vinculado a um pet
-- (o tutor é obtido via JOIN: agendamentos -> pets -> tutores)
-- ============================================================
CREATE TABLE agendamentos (
    id                 SERIAL PRIMARY KEY,
    pet_id             INTEGER NOT NULL,
    data_agendamento   DATE NOT NULL,
    observacao         VARCHAR(255),
    CONSTRAINT fk_agendamentos_pet
        FOREIGN KEY (pet_id) REFERENCES pets(id)
);

-- ============================================================
-- POPULAÇÃO - USUARIOS
-- Login de exemplo: usuario = "admin", senha = "123456"
-- Login de exemplo: usuario = "joana", senha = "123456"
-- Login de exemplo: usuario = "carlos", senha = "123456"
-- O hash abaixo foi gerado de verdade com bcrypt (10 rounds,
-- via utils/crypto-utils.js) para a senha "123456". Os três
-- usuários usam o mesmo hash só porque têm a mesma senha de
-- teste - em uso real, cada um teria seu próprio hash.
-- ============================================================
INSERT INTO usuarios (nome, login, senha) VALUES
('Administrador', 'admin', '$2b$10$KwxQbwyaa1psc0E4DVRrv.zPS2/zMvaF76jHRf/r2dZFDVLQhrCbi'),
('Joana Rezende', 'joana', '$2b$10$KwxQbwyaa1psc0E4DVRrv.zPS2/zMvaF76jHRf/r2dZFDVLQhrCbi'),
('Carlos Menezes', 'carlos', '$2b$10$KwxQbwyaa1psc0E4DVRrv.zPS2/zMvaF76jHRf/r2dZFDVLQhrCbi');

-- ============================================================
-- POPULAÇÃO - TUTORES
-- Os CPFs abaixo já estão CRIPTOGRAFADOS (gerados de verdade com
-- utils/crypto-utils.js -> criptografarCPF()). Os CPFs originais,
-- em texto puro, eram:
--   Maria Oliveira -> 111.111.111-11
--   João Pereira   -> 222.222.222-22
--   Ana Souza      -> 333.333.333-33
-- Ao listar/editar um tutor na sua aplicação, use
-- descriptografarCPF() para exibir o valor de volta em texto puro.
-- ============================================================
INSERT INTO tutores (nome, cpf, telefone) VALUES
('Maria Oliveira', 'c99d0bfcd2f3f6eca6ad7d1d4b42b9b1', '(49) 99999-0001'),
('João Pereira',   'a0796255498814bd801b4f1c86e56c19', '(49) 99999-0002'),
('Ana Souza',      '4d0a4eb4c7a07cb03acb3019a5870f13', '(49) 99999-0003');

-- ============================================================
-- POPULAÇÃO - PETS
-- ============================================================
INSERT INTO pets (nome, especie, tutor_id) VALUES
('Rex',     'Cachorro', 1),
('Miau',    'Gato',     2),
('Piu Piu', 'Pássaro',  3);

-- ============================================================
-- POPULAÇÃO - AGENDAMENTOS
-- ============================================================
INSERT INTO agendamentos (pet_id, data_agendamento, observacao) VALUES
(1, '2026-09-20', 'Consulta de rotina'),
(2, '2026-09-18', 'Vacinação'),
(3, '2026-09-22', 'Avaliação veterinária inicial');
