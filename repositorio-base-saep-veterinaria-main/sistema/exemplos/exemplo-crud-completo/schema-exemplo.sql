-- ============================================================
-- exemplos/exemplo-crud-completo/schema-exemplo.sql
-- ============================================================
-- Apenas para referência/estudo - não faz parte do banco real
-- do sistema (saep_db.sql). Se quiser testar o exemplo de
-- verdade, crie essas tabelas num banco separado.
-- ============================================================

CREATE TABLE categorias (
    id    SERIAL PRIMARY KEY,
    nome  VARCHAR(50) NOT NULL
);

CREATE TABLE livros (
    id            SERIAL PRIMARY KEY,
    titulo        VARCHAR(150) NOT NULL,
    autor         VARCHAR(100),
    categoria_id  INTEGER NOT NULL,
    CONSTRAINT fk_livros_categoria FOREIGN KEY (categoria_id) REFERENCES categorias(id)
);

INSERT INTO categorias (nome) VALUES ('Ficção'), ('Técnico'), ('Biografia');

INSERT INTO livros (titulo, autor, categoria_id) VALUES
('Duna', 'Frank Herbert', 1),
('Clean Code', 'Robert C. Martin', 2),
('Steve Jobs', 'Walter Isaacson', 3);
