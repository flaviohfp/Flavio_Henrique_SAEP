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

const nomeUsuarioEl = document.getElementById('nome-usuario');
const btnSair = document.getElementById('btn-sair');
async function carregarUsuarioLogado() {
  try {
    const dados = await api('/api/auth/sessao');
    nomeUsuarioEl.textContent = dados.usuario.nome;
  } catch (erro) { nomeUsuarioEl.textContent = 'Não foi possível carregar'; }
}
btnSair.addEventListener('click', async () => {
  try {
    await api('/api/auth/logout', 'POST');
    window.location.href = '/login.html';
  } catch (erro) { alert(erro.message); }
});
carregarUsuarioLogado();
