async function api(url, metodo = 'GET', dados) {
  const resposta = await fetch(url, {
    method: metodo,
    headers: dados ? { 'Content-Type': 'application/json' } : {},
    body: dados ? JSON.stringify(dados) : undefined
  });
  if (resposta.status === 401) {
    window.location.href = '/login.html';
    throw new Error('Sessão expirada. Entre novamente.');
  }
  const resultado = await resposta.json();
  if (!resposta.ok) throw new Error(resultado.erro || 'Não foi possível concluir a operação.');
  return resultado;
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

const corpoTabela = document.getElementById('corpo-tabela-agendamentos');
const tabela = document.getElementById('tabela-agendamentos');
const mensagem = document.getElementById('mensagem-agendamentos');
async function carregarAgendamentos() {
  try {
    const agendamentos = await api('/api/agendamentos');
    renderizarAgendamentos(agendamentos);
  } catch (erro) {
    tabela.classList.add('d-none');
    mensagem.classList.remove('d-none');
    mensagem.textContent = erro.message;
  }
}
carregarAgendamentos();

function renderizarAgendamentos(agendamentos) {
  corpoTabela.replaceChildren();
  tabela.classList.toggle('d-none', agendamentos.length === 0);
  mensagem.classList.toggle('d-none', agendamentos.length > 0);
  mensagem.textContent = 'Nenhum agendamento encontrado.';
  agendamentos.forEach(agendamento => {
    const linha = document.createElement('tr');
    const data = agendamento.data_agendamento.slice(0, 10);
    [data.split('-').reverse().join('/'), agendamento.pet_nome, agendamento.especie,
     agendamento.tutor_nome, agendamento.tutor_cpf, agendamento.tutor_telefone, agendamento.observacao]
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

async function atualizarDataAgendamento(id, novaData) {
  await api('/api/agendamentos/' + id, 'PUT', { data_agendamento: novaData });
  await carregarAgendamentos();
}
