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

const formPet = document.getElementById('form-pet');
const selectTutor = document.getElementById('pet-tutor');
const mensagemPet = document.getElementById('mensagem-pet');
async function carregarTutores() {
  try {
    const tutores = await api('/api/tutores');
    selectTutor.replaceChildren(new Option(tutores.length ? 'Selecione um tutor...' : 'Cadastre um tutor primeiro', ''));
    tutores.forEach(tutor => selectTutor.add(new Option(tutor.nome, tutor.id)));
  } catch (erro) { mensagemPet.textContent = erro.message; }
}
formPet.addEventListener('submit', async evento => {
  evento.preventDefault();
  const botao = formPet.querySelector('[type=submit]');
  botao.disabled = true;
  try {
    await api('/api/pets', 'POST', {
      nome: document.getElementById('pet-nome').value.trim(),
      especie: document.getElementById('pet-especie').value.trim(),
      tutor_id: selectTutor.value
    });
    formPet.reset();
    mensagemPet.className = 'text-success mt-3';
    mensagemPet.textContent = 'Pet cadastrado com sucesso.';
  } catch (erro) {
    mensagemPet.className = 'text-danger mt-3';
    mensagemPet.textContent = erro.message;
  } finally { botao.disabled = false; }
});
carregarTutores();
