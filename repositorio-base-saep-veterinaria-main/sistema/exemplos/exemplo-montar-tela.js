// ============================================================
// exemplos/exemplo-montar-tela.js
// ============================================================
// EXEMPLO DE REFERÊNCIA - cenário FICTÍCIO (livros).
// Use junto com exemplo-montar-tela.html (de lá vêm os ids) e
// com exemplo-fetch.js (explica cada tipo de fetch).
//
// Mostra como "montar a tela" com os dados que o back-end devolveu:
//
//   A) pegar os elementos da tela (document.getElementById)
//   B) preencher um <select> com dados do banco
//   C) desenhar a tabela (ou mostrar a mensagem de "vazio")
//   D) ligar os botões Editar e Excluir de cada linha
//   E) levar os dados da linha para o formulário (editar)
//   F) formatar uma data que vem do banco
//
// A ideia central: o JavaScript recebe um ARRAY de objetos, ex.:
//   [ { id: 1, titulo: 'Duna', categoria_nome: 'Ficção', ... }, ... ]
// transforma cada objeto numa linha de HTML (template string) e
// coloca tudo dentro do <tbody> com innerHTML.
// ============================================================


// ------------------------------------------------------------
// A) Elementos da tela (o texto entre aspas é o id do HTML)
// ------------------------------------------------------------
const inputBusca = document.getElementById('input-busca');
const btnBuscar = document.getElementById('btn-buscar');

const mensagemLivros = document.getElementById('mensagem-livros');
const tabela = document.getElementById('tabela-livros');
const corpoTabela = document.getElementById('corpo-tabela-livros');

const livroIdInput = document.getElementById('livro-id');
const livroTituloInput = document.getElementById('livro-titulo');
const livroAutorInput = document.getElementById('livro-autor');
const livroCategoriaSelect = document.getElementById('livro-categoria');
const livroPublicacaoInput = document.getElementById('livro-publicacao');

inicializar();

async function inicializar() {
    await carregarCategorias();
    await carregarLivros();
}


// ------------------------------------------------------------
// B) Preencher um <select> com dados do banco
// ------------------------------------------------------------
// Cada <option> precisa de:  value = o que será ENVIADO (o id)
//                            texto = o que o usuário VÊ (o nome)
async function carregarCategorias() {
    try {
        const resposta = await fetch('/api/categorias');
        const categorias = await resposta.json();

        livroCategoriaSelect.innerHTML =
            '<option value="">Selecione...</option>' +
            categorias.map(categoria => {
                return `<option value="${categoria.id}">${categoria.nome}</option>`;
            }).join('');

    } catch (erro) {
        console.error('Erro ao carregar categorias:', erro);
        livroCategoriaSelect.innerHTML = '<option value="">Erro ao carregar</option>';
    }
}


// ------------------------------------------------------------
// Buscar os livros no back-end (termo é opcional)
// ------------------------------------------------------------
async function carregarLivros(termoBusca = '') {
    try {
        const url = termoBusca
            ? `/api/livros?busca=${encodeURIComponent(termoBusca)}`
            : '/api/livros';

        const resposta = await fetch(url);

        if (resposta.status === 401) {
            window.location.href = '/login.html';
            return;
        }

        if (!resposta.ok) {
            throw new Error('Erro ao buscar livros.');
        }

        const livros = await resposta.json();
        renderizarLivros(livros);

    } catch (erro) {
        console.error(erro);
        mensagemLivros.textContent = 'Erro ao carregar livros.';
        mensagemLivros.classList.remove('d-none');
        tabela.classList.add('d-none');
    }
}

// botão de busca: pega o texto digitado e recarrega a lista
btnBuscar.addEventListener('click', () => {
    carregarLivros(inputBusca.value.trim());
});


// ------------------------------------------------------------
// C) Desenhar a tabela
// ------------------------------------------------------------
function renderizarLivros(livros) {

    // Lista vazia: mostra a mensagem, esconde a tabela e PARA.
    if (livros.length === 0) {
        mensagemLivros.textContent = 'Nenhum livro encontrado.';
        mensagemLivros.classList.remove('d-none');
        tabela.classList.add('d-none');
        corpoTabela.innerHTML = '';
        return;
    }

    // Tem dados: esconde a mensagem e mostra a tabela.
    mensagemLivros.classList.add('d-none');
    tabela.classList.remove('d-none');

    // .map() transforma CADA livro numa linha de HTML (texto);
    // .join('') junta todas as linhas num texto só;
    // innerHTML coloca esse texto dentro do <tbody>.
    corpoTabela.innerHTML = livros.map(livro => {
        return `
            <tr>
                <td>${livro.titulo}</td>
                <td>${livro.autor || '-'}</td>
                <td>${livro.categoria_nome}</td>
                <td>${formatarData(livro.data_publicacao)}</td>
                <td>
                    <button class="btn btn-warning btn-sm btn-editar" data-id="${livro.id}">
                        Editar
                    </button>
                    <button class="btn btn-danger btn-sm btn-excluir" data-id="${livro.id}">
                        Excluir
                    </button>
                </td>
            </tr>
        `;
    }).join('');

    // ----------------------------------------------------------
    // D) Ligar os botões de cada linha
    // ----------------------------------------------------------
    // ATENÇÃO: isto precisa vir DEPOIS do innerHTML acima. Os
    // botões só passam a existir quando o innerHTML é executado;
    // antes disso o querySelectorAll não encontra nada.
    //
    // data-id="${livro.id}" guardou o id dentro do botão, e
    // botao.dataset.id devolve esse valor (sempre como TEXTO).

    document.querySelectorAll('.btn-editar').forEach(botao => {
        botao.addEventListener('click', () => {
            const id = botao.dataset.id;

            // find procura, na lista que já temos, o livro desse id.
            // Usamos == (e não ===) porque dataset.id é texto e
            // livro.id é número.
            const livro = livros.find(item => item.id == id);

            if (!livro) {
                return;
            }

            preencherFormulario(livro);
        });
    });

    document.querySelectorAll('.btn-excluir').forEach(botao => {
        botao.addEventListener('click', () => {
            excluirLivro(botao.dataset.id);
        });
    });
}


// ------------------------------------------------------------
// E) Levar os dados da linha para o formulário (editar)
// ------------------------------------------------------------
function preencherFormulario(livro) {
    livroIdInput.value = livro.id;               // campo escondido: indica "é uma edição"
    livroTituloInput.value = livro.titulo;
    livroAutorInput.value = livro.autor || '';   // evita escrever "null" no campo
    livroCategoriaSelect.value = livro.categoria_id;       // seleciona a option com esse value
    livroPublicacaoInput.value = dataParaInput(livro.data_publicacao);
}

async function excluirLivro(id) {
    if (!confirm('Deseja realmente excluir este livro?')) return;

    try {
        const resposta = await fetch(`/api/livros/${id}`, { method: 'DELETE' });

        if (resposta.status === 401) {
            window.location.href = '/login.html';
            return;
        }

        if (!resposta.ok) {
            throw new Error('Erro ao excluir livro.');
        }

        await carregarLivros(); // redesenha a tabela já sem o item excluído

    } catch (erro) {
        console.error(erro);
        mensagemLivros.textContent = 'Erro ao excluir livro.';
        mensagemLivros.classList.remove('d-none');
    }
}


// ------------------------------------------------------------
// F) Datas que vêm do banco
// ------------------------------------------------------------
// Uma coluna DATE do PostgreSQL costuma chegar no JavaScript assim:
//     "2026-09-20T03:00:00.000Z"
// e isso não serve nem para mostrar na tela nem para um
// <input type="date"> (que exige "2026-09-20").
//
// Para o <input type="date">: ficar com os 10 primeiros caracteres.
function dataParaInput(valor) {
    if (!valor) return '';
    return valor.substring(0, 10);            // "2026-09-20"
}

// Para mostrar na tela no padrão brasileiro: "20/09/2026".
function formatarData(valor) {
    if (!valor) return '-';
    return dataParaInput(valor).split('-').reverse().join('/');
}

// Dica: se a data aparecer um dia diferente do cadastrado, dá para
// já entregá-la pronta na própria consulta SQL, por exemplo:
//     SELECT TO_CHAR(coluna_data, 'YYYY-MM-DD') AS coluna_data ...
