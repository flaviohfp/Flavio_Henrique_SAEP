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

const corpoTabela = document.getElementById('corpo-tabela-tutores');
const tabela = document.getElementById('tabela-tutores');
const mensagemTutores = document.getElementById('mensagem-tutores');
const inputBusca = document.getElementById('input-busca');
const formTutor = document.getElementById('form-tutor');
const tutorIdInput = document.getElementById('tutor-id');
const tutorNomeInput = document.getElementById('tutor-nome');
const tutorCpfInput = document.getElementById('tutor-cpf');
const tutorTelefoneInput = document.getElementById('tutor-telefone');
const btnCancelarEdicao = document.getElementById('btn-cancelar-edicao');
const tituloFormulario = formTutor.previousElementSibling;
async function carregarTutores() {
  try {
    const tutores = await api('/api/tutores?busca=' + encodeURIComponent(inputBusca.value.trim()));
    renderizarTutores(tutores);
  } catch (erro) {
    tabela.classList.add('d-none');
    mensagemTutores.classList.remove('d-none');
    mensagemTutores.textContent = erro.message;
  }
}
function limparFormulario() {
  formTutor.reset();
  tutorIdInput.value = '';
  btnCancelarEdicao.classList.add('d-none');
  tituloFormulario.textContent = 'Novo Tutor';
}
function preencherFormularioParaEdicao(tutor) {
  tutorIdInput.value = tutor.id;
  tutorNomeInput.value = tutor.nome;
  tutorCpfInput.value = tutor.cpf;
  tutorTelefoneInput.value = tutor.telefone || '';
  btnCancelarEdicao.classList.remove('d-none');
  tituloFormulario.textContent = 'Editar Tutor';
  tutorNomeInput.focus();
}
document.getElementById('btn-buscar').addEventListener('click', carregarTutores);
inputBusca.addEventListener('keydown', evento => {
  if (evento.key === 'Enter') { evento.preventDefault(); carregarTutores(); }
});
btnCancelarEdicao.addEventListener('click', limparFormulario);
formTutor.addEventListener('submit', async evento => {
  evento.preventDefault();
  const botao = formTutor.querySelector('[type=submit]');
  botao.disabled = true;
  try {
    const id = tutorIdInput.value;
    await api('/api/tutores' + (id ? '/' + id : ''), id ? 'PUT' : 'POST', {
      nome: tutorNomeInput.value.trim(), cpf: tutorCpfInput.value.trim(), telefone: tutorTelefoneInput.value.trim()
    });
    limparFormulario();
    await carregarTutores();
  } catch (erro) { alert(erro.message); }
  finally { botao.disabled = false; }
});
async function excluirTutor(id) {
  if (!confirm('Deseja realmente excluir este tutor?')) return;
  await api('/api/tutores/' + id, 'DELETE');
  if (tutorIdInput.value === String(id)) limparFormulario();
  await carregarTutores();
}
carregarTutores();

function renderizarTutores(tutores) {
  corpoTabela.replaceChildren();
  tabela.classList.toggle('d-none', tutores.length === 0);
  mensagemTutores.classList.toggle('d-none', tutores.length > 0);
  mensagemTutores.textContent = 'Nenhum tutor encontrado.';
  tutores.forEach(tutor => {
    const linha = document.createElement('tr');
    adicionarCelula(linha, tutor.nome);
    adicionarCelula(linha, tutor.cpf);
    adicionarCelula(linha, tutor.telefone);
    const acoes = adicionarCelula(linha, '');
    acoes.replaceChildren(
      criarBotao('Editar', 'btn btn-sm btn-outline-primary me-2', () => preencherFormularioParaEdicao(tutor)),
      criarBotao('Excluir', 'btn btn-sm btn-outline-danger', () => excluirTutor(tutor.id))
    );
    corpoTabela.appendChild(linha);
  });
}
