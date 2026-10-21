// ============================================================
// public/js/agendamentos.js
// ============================================================
// ESTE ARQUIVO É COM VOCÊ (ALUNO DESENVOLVE).
//
// Requisitos envolvidos: RF-19 (listar ordenado, com dados de
// tutor e pet) e RF-20 (atualizar data de um agendamento).
//
// Sugestão de estrutura por linha da tabela: cada linha mostra
// os dados do agendamento, e na coluna "Ações" um campo de data
// (input type="date", já preenchido com a data atual do
// agendamento) mais um botão "Salvar" - ao clicar, atualiza
// aquele agendamento. Isso evita precisar de modal/popup.
//
// EXEMPLOS DE APOIO (pasta exemplos/):
//   - exemplo-montar-tela.js : desenhar a tabela e formatar datas
//   - exemplo-fetch.js       : GET, PUT e os demais tipos de fetch
// ============================================================

const corpoTabela = document.getElementById('corpo-tabela-agendamentos');
const tabela = document.getElementById('tabela-agendamentos');
const mensagemAgendamentos = document.getElementById('mensagem-agendamentos');

inicializar();

async function inicializar() {
    await carregarAgendamentos();
}

// ------------------------------------------------------------
// RF-19: listar agendamentos ordenados por data, com dados de
// pet e tutor (join)
// ------------------------------------------------------------
async function carregarAgendamentos() {
    try {
        // TODO: fetch GET /api/agendamentos
        // Trate resposta.status === 401 (redirecionar para /login.html)
        // Pegue o JSON e chame renderizarAgendamentos(agendamentos)
        const resposta = await fetch('/api/agendamentos');
        if (resposta.status === 401) {
            window.location.href = '/login.html';
            return;
        }
        const agendamentos = await resposta.json();
        if (!resposta.ok) throw new Error(agendamentos.erro || 'Erro ao carregar agendamentos.');
        renderizarAgendamentos(agendamentos);

    } catch (erro) {
        mensagemAgendamentos.textContent = 'Erro ao carregar agendamentos.';
        console.error(erro);
    }
}

function renderizarAgendamentos(agendamentos) {
    // TODO: se a lista estiver vazia, mantenha a mensagem visível
    // e a tabela escondida (classe d-none)

    // TODO: caso contrário, esconda a mensagem, mostre a tabela, e
    // monte uma linha <tr> para cada agendamento dentro de
    // corpoTabela.innerHTML, com as colunas: data, nome do pet,
    // espécie, nome do tutor, telefone do tutor, observação, e uma
    // célula de ação contendo:
    //   <input type="date" value="DATA NO FORMATO AAAA-MM-DD" data-id="${agendamento.id}">
    // ATENÇÃO: a data chega do banco como "2026-09-20T03:00:00.000Z", e o
    // <input type="date"> só aceita "2026-09-20". Veja o item F de
    // exemplos/exemplo-montar-tela.js antes de preencher o value.
    //   <button data-id="${agendamento.id}">Salvar</button>
    //
    // Depois de montar o innerHTML, adicione os addEventListener
    // nos botões "Salvar" recém-criados (eles não existem até esse
    // innerHTML ser inserido).
    corpoTabela.replaceChildren();
      tabela.classList.toggle('d-none', agendamentos.length === 0);
      mensagemAgendamentos.classList.toggle('d-none', agendamentos.length > 0);
      mensagemAgendamentos.textContent = 'Nenhum agendamento encontrado.';
      agendamentos.forEach(agendamento => {
        const linha = document.createElement('tr');
        const data = agendamento.data_agendamento.slice(0, 10);
        [data.split('-').reverse().join('/'), agendamento.pet_nome, agendamento.especie,
         agendamento.tutor_nome, agendamento.tutor_telefone, agendamento.observacao]
          .forEach(valor => adicionarCelula(linha, valor));
        const acoes = adicionarCelula(linha, '');
        const input = document.createElement('input');
        input.type = 'date';
        input.value = data;
        input.className = 'form-control mb-2';
        input.setAttribute('aria-label', 'Nova data para ' + agendamento.pet_nome);
        const botao = criarBotao('Salvar', 'btn btn-sm btn-primary', async () => {
          if (!input.value || !input.checkValidity()) throw new Error('Informe uma data válida.');
          await atualizarDataAgendamento(agendamento.id, input.value);
        });
        acoes.replaceChildren(input, botao);
        corpoTabela.appendChild(linha);
      });
}

// ------------------------------------------------------------
// RF-20: atualizar a data de um agendamento
// Chamada pelos botões "Salvar" criados em renderizarAgendamentos()
// ------------------------------------------------------------
async function atualizarDataAgendamento(id, novaData) {
    try {
        // TODO: fetch PUT /api/agendamentos/{id}, enviando
        // { data_agendamento: novaData } como JSON no body.
        // Confira resposta.ok e avise o usuário (alert ou mensagem)
        // se deu certo ou não.
        const resposta = await fetch('/api/agendamentos/' + id, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data_agendamento: novaData })
        });
        if (resposta.status === 401) {
            window.location.href = '/login.html';
            return;
        }
        const dados = await resposta.json();
        if (!resposta.ok) {
            alert(dados.erro || 'Erro ao atualizar data.');
            return;
        }
        await carregarAgendamentos();

    } catch (erro) {
        alert('Erro ao atualizar data do agendamento.');
        console.error(erro);
    }
}

function adicionarCelula(linha, valor) {
  const celula = document.createElement('td');
  celula.textContent = valor || '—';
  linha.appendChild(celula);
  return celula;
}
function criarBotao(texto, classe, acao) {
  const botao = document.createElement('button');
  botao.type = 'button';
  botao.className = classe;
  botao.textContent = texto;
  botao.addEventListener('click', async () => {
    botao.disabled = true;
    try { await acao(); } catch (erro) { alert(erro.message); }
    finally { botao.disabled = false; }
  });
  return botao;
}
