// ============================================================
// exemplos/exemplo-exibir-dados-sessao.js
// ============================================================
// EXEMPLO - não faz parte do sistema real.
//
// Mostra o padrão para pegar um dado que está guardado na
// SESSÃO do servidor (ex: nome do usuário logado) e exibir no
// HTML. Isso é necessário porque o JavaScript do FRONT-END não
// tem acesso direto à sessão do back-end - por isso é preciso
// fazer uma requisição (fetch) numa rota que devolve esse dado.
//
// No sistema de vocês, essa "rota que devolve o dado da sessão"
// já existe pronta: GET /api/auth/sessao (ver routes/auth.js).
// Ela devolve algo como:
//   { usuario: { id: 1, nome: "Fulano", login: "fulano" } }
//
// O trecho abaixo é o padrão geral (poderia ser qualquer dado
// vindo de uma sessão, não só usuário):
// ------------------------------------------------------------

async function exibirDadoDaSessao() {
    try {
        const resposta = await fetch('/rota-que-devolve-dado-da-sessao');

        if (resposta.status === 401) {
            // sessão expirada ou usuário nunca logou
            window.location.href = '/login.html';
            return;
        }

        const dados = await resposta.json();

        // Suponha que "dados" seja { usuario: { nome: "Fulano" } }
        // Para exibir isso num elemento HTML (ex: <span id="nome-usuario">):

        document.getElementById('algum-elemento-na-tela').textContent = dados.usuario.nome;

    } catch (erro) {
        console.error('Erro ao buscar dado da sessão:', erro);
    }
}

// ------------------------------------------------------------
// No sistema de vocês, principal.js já tem o fetch pronto para
// /api/auth/sessao, dentro da função carregarUsuarioLogado().
// Falta só usar o dado retornado para preencher o elemento
// #nome-usuario, seguindo esse mesmo padrão acima (fetch -> pegar
// o campo do JSON -> textContent do elemento).
// ------------------------------------------------------------
