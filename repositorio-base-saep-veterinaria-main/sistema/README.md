# Sistema de Gestão - Clínica Veterinária (SAEP 2026)

Sistema de cadastro e gerenciamento de tutores, pets e agendamentos,
com autenticação de usuários e controle seguro de dados.

## Tecnologias

- Front-end: HTML, CSS (Bootstrap 5), JavaScript
- Back-end: Node.js + Express
- Banco de dados: PostgreSQL

## Como rodar o projeto

1. **Criar o banco de dados no PostgreSQL:**

   Crie um banco chamado `saep_db` e rode o script `saep_db.sql`
   (está na raiz do projeto, fora da pasta `sistema/`) para criar
   as tabelas e os dados iniciais.

2. **Ajustar a conexão com o banco (se necessário):**

   O arquivo `config/db.js` já vem configurado para conectar em
   `localhost`, porta `5432`, usuário `postgres`. Se a configuração
   do seu computador for diferente, ajuste os valores nesse arquivo.

3. **Instalar as dependências:**

   Dentro da pasta `sistema/`, rode:

   ```
   npm install
   ```

4. **Rodar o servidor:**

   ```
   npm start
   ```

   O sistema vai rodar em: http://localhost:3000

5. **Acessar o sistema:**

   Abra http://localhost:3000/login.html no navegador.

   Usuários de teste (já cadastrados pelo script do banco):

   | Usuário | Senha  |
   |---------|--------|
   | admin   | 123456 |
   | joana   | 123456 |
   | carlos  | 123456 |

## Estrutura do projeto

```
sistema/
├── app.js                  - ponto de entrada do servidor
├── config/db.js            - conexão com o PostgreSQL
├── utils/crypto-utils.js   - funções de hash de senha e criptografia de CPF
├── middleware/              - proteção de rotas (sessão)
├── routes/                  - rotas da API (uma por funcionalidade)
├── public/                  - telas (HTML), estilos (CSS) e scripts (JS) do front-end
└── exemplos/                - trechos de código de referência (não fazem parte do sistema)
```

Para saber exatamente o que fazer em cada parte pendente do
sistema, veja o arquivo **GUIA_DE_DESENVOLVIMENTO.md**.
