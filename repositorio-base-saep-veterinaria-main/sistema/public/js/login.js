// ============================================================
// public/js/login.js
// ============================================================
// Este arquivo já está pronto (BASE FORNECIDA).
// Segue o mesmo padrão de fetch/async-await usado nos outros
// arquivos do sistema.
// ============================================================

const formLogin = document.getElementById('form-login');
const mensagemErro = document.getElementById('mensagem-erro');

formLogin.addEventListener('submit', async (evento) => {
    evento.preventDefault();

    const login = document.getElementById('login').value.trim();
    const senha = document.getElementById('senha').value;

    mensagemErro.classList.add('d-none');

    try {
        const resposta = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ login, senha })
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            // RF-08: validação de falha de autenticação
            mensagemErro.textContent = dados.erro || 'Não foi possível entrar.';
            mensagemErro.classList.remove('d-none');
            return;
        }

        // Login OK - redireciona para a tela principal
        window.location.href = '/principal.html';

    } catch (erro) {
        mensagemErro.textContent = 'Erro ao conectar com o servidor.';
        mensagemErro.classList.remove('d-none');
        console.error(erro);
    }
});
