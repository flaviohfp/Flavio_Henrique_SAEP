# SAEP — Sistema de Avaliação da Educação Profissional
## Avaliação Prática de Desempenho dos Estudantes
### Técnico em Desenvolvimento de Sistemas — Prova 01

| Campo | Preenchimento |
|---|---|
| Curso | |
| Versão do Itinerário Formativo | |
| Estudante | |
| CPF | |
| UF | |

---

## ORIENTAÇÕES GERAIS

Desligue e guarde o seu telefone celular.

Não é permitido o uso de internet durante a realização da prova.

Antes de iniciar à prova, leia atentamente as instruções contidas neste caderno e esclareça as dúvidas com o avaliador, caso necessário. Para isso você terá os 30 minutos iniciais de ambientação para ler a prova na íntegra e reconhecer o posto de trabalho.

Aguarde o avaliador sinalizar o fim da ambientação ou informe a ele que você quer iniciar a prova. A partir desse momento contará o tempo de 03 horas para que você realize as atividades.

Ao final da avaliação, este caderno e demais itens disponibilizados devem ser devolvidos ao Avaliador.

Para registrar o final da sua prova, você deverá assinar o canhoto da prova junto com o seu avaliador.

O avaliador está à disposição para dirimir qualquer dúvida, desde que não seja referente a resolução da prova.

Dê o seu melhor!

---

## CONTEXTUALIZAÇÃO

Uma clínica veterinária enfrenta dificuldades em sua rotina de atendimentos devido à ausência de um sistema informatizado. O controle manual dos agendamentos e dos registros de tutores e pets tem ocasionado perda de consultas, duplicidade de informações e falhas no armazenamento de dados. Além disso, a falta de segurança no armazenamento dos dados, como o CPF dos tutores, coloca a instituição em risco de descumprimento da Lei Geral de Proteção de Dados (LGPD).

Para resolver essa situação, o gestor da clínica contratou sua equipe para desenvolver uma solução de software que organize o processo de agendamento e gestão de informações. Durante a reunião inicial, o gestor destacou a importância da autenticação dos usuários com tempo de expiração, da segurança dos dados sensíveis e da documentação técnica do sistema, incluindo requisitos funcionais e geração do diagrama entidade relacionamento, a fim de garantir a manutenção futura do sistema.

Após a reunião com o gestor da clínica, foram definidos algumas regras de negócio:

- No script do banco de dados devem existir pelo menos três registros para todas as tabelas criadas, respeitando os tipos de dados, chaves primárias e estrangeiras.
- Na funcionalidade de login, fazer validação em caso de falha na autenticação.
- Os dados sensíveis devem ser criptografados no banco de dados.
- A funcionalidade principal do sistema deve exibir: nome do usuário logado e uma forma de acessar os demais recursos, assim como uma maneira de sair do sistema.
- A funcionalidade de tutor deve conter: um recurso de busca para que o usuário possa inserir o termo, o qual, após inserção e confirmação, deverá exibir para o usuário a atualização da listagem dos valores da tabela com os registros que correspondem.
- A funcionalidade de agendamento deve exibir: Listagem dos agendamentos cadastrados ordenado por dia de agendamento, trazendo todos dados do tutor e do pet.
- Ao cadastrar um novo pet, o usuário deve associá-lo a um tutor.

---

## DESAFIO

Você, como desenvolvedor deverá criar um sistema que permita o cadastro e gerenciamento de tutores, pets e agendamentos, com autenticação de usuários e controle seguro de dados.

---

## RESULTADOS E ENTREGAS ESPERADAS

Crie um diretório compactado na área de trabalho (formato .zip, .rar ou .7zip) nomeado com seu nome completo, contendo os seguintes arquivos:

| Nº | Entrega | Tipo de Entrega | Tempo Estimado (minutos) |
|---|---|---|---|
| 1 | Documentação de software (Anexo 1) | documentacao.pdf | 15 |
| 2 | Diagrama entidade relacionamento | arquivo de imagem ou .pdf | 5 |
| 3 | Script de criação e população do banco de dados | saep_db.sql | 20 |
| 4 | Código fonte da funcionalidade do login | Um diretório com o nome: "sistema", contendo os arquivos do código-fonte do sistema desenvolvido | 20 |
| 5 | Código fonte da funcionalidade principal do sistema | (diretório "sistema") | 20 |
| 6 | Código fonte da funcionalidade do gerenciamento Tutor | (diretório "sistema") | 30 |
| 7 | Código fonte da funcionalidade do gerenciamento Pet | (diretório "sistema") | 30 |
| 8 | Código fonte da funcionalidade do gerenciamento de Agendamentos | (diretório "sistema") | 40 |
