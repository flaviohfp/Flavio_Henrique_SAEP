// ============================================================
// exemplos/exemplo-crud-completo/livros.js
// ============================================================
// EXEMPLO COMPLETO E FUNCIONAL - não faz parte do sistema real.
// Mostra o fluxo inteiro do front-end: carregar lista, buscar,
// popular formulário para edição, salvar (inserir ou editar) e
// excluir. É exatamente o mesmo tipo de fluxo que falta em
// public/js/tutores.js e public/js/agendamentos.js.
// ============================================================

const corpoTabela = document.getElementById('corpo-tabela');
const inputBusca = document.getElementById('input-busca');
const btnBuscar = document.getElementById('btn-buscar');

const formLivro = document.getElementById('form-livro');
const livroIdInput = document.getElementById('livro-id');
const livroTituloInput = document.getElementById('livro-titulo');
const livroAutorInput = document.getElementById('livro-autor');
const selectCategoria = document.getElementById('livro-categoria');
const btnCancelar = document.getElementById('btn-cancelar');

inicializar();

async function inicializar() {
    await carregarCategorias();
    await carregarLivros();
}

// ------------------------------------------------------------
// Popula o <select> de categorias
// ------------------------------------------------------------
async function carregarCategorias() {
    try {
        const resposta = await fetch('/exemplo-livros-api/categorias');
        const categorias = await resposta.json();

        selectCategoria.innerHTML = '<option value="">Selecione...</option>';
        categorias.forEach((cat) => {
            const option = document.createElement('option');
            option.value = cat.id;
            option.textContent = cat.nome;
            selectCategoria.appendChild(option);
        });
    } catch (erro) {
        console.error('Erro ao carregar categorias:', erro);
    }
}

// ------------------------------------------------------------
// Lista os livros. Se "termo" for passado, faz a busca.
// Repare que a única diferença entre "listar tudo" e "buscar" é
// se a query string "?busca=" é incluída na URL ou não - o resto
// do fluxo (fetch, renderizar) é idêntico.
// ------------------------------------------------------------
async function carregarLivros(termo = '') {
    try {
        const url = termo
            ? `/exemplo-livros-api?busca=${encodeURIComponent(termo)}`
            : '/exemplo-livros-api';

        const resposta = await fetch(url);
        const livros = await resposta.json();

        renderizarLivros(livros);
    } catch (erro) {
        console.error('Erro ao carregar livros:', erro);
    }
}

function renderizarLivros(livros) {
    if (livros.length === 0) {
        corpoTabela.innerHTML = '<tr><td colspan="4">Nenhum livro encontrado.</td></tr>';
        return;
    }

    corpoTabela.innerHTML = '';

    livros.forEach((livro) => {
        const linha = document.createElement('tr');
        linha.innerHTML = `
            <td>${livro.titulo}</td>
            <td>${livro.autor || '-'}</td>
            <td>${livro.categoria}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary btn-editar" data-id="${livro.id}">Editar</button>
                <button class="btn btn-sm btn-outline-danger btn-excluir" data-id="${livro.id}">Excluir</button>
            </td>
        `;
        corpoTabela.appendChild(linha);
    });

    // Os botões só existem depois do innerHTML acima ser inserido,
    // por isso os addEventListener ficam aqui dentro, depois de
    // montar a tabela (e não lá em cima, no topo do arquivo).
    document.querySelectorAll('.btn-editar').forEach((botao) => {
        botao.addEventListener('click', () => {
            const livro = livros.find((l) => l.id == botao.dataset.id);
            preencherFormularioParaEdicao(livro);
        });
    });

    document.querySelectorAll('.btn-excluir').forEach((botao) => {
        botao.addEventListener('click', () => excluirLivro(botao.dataset.id));
    });
}

// ------------------------------------------------------------
// Busca
// ------------------------------------------------------------
btnBuscar.addEventListener('click', () => {
    carregarLivros(inputBusca.value.trim());
});

// ------------------------------------------------------------
// Preenche o formulário com os dados de um livro (para editar).
// Repare que aqui a categoria já vem como NOME (por causa do
// JOIN), mas o <select> precisa do ID - por isso, num caso real,
// pode ser mais simples a rota de listagem também devolver o
// categoria_id junto (não só o nome), para facilitar esse
// preenchimento. Ajuste conforme a necessidade do seu caso.
// ------------------------------------------------------------
function preencherFormularioParaEdicao(livro) {
    livroIdInput.value = livro.id;
    livroTituloInput.value = livro.titulo;
    livroAutorInput.value = livro.autor || '';
    btnCancelar.classList.remove('d-none');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

btnCancelar.addEventListener('click', () => {
    formLivro.reset();
    livroIdInput.value = '';
    btnCancelar.classList.add('d-none');
});

// ------------------------------------------------------------
// Salvar: decide entre POST (novo) ou PUT (edição) com base em
// se o campo escondido "livro-id" está preenchido ou não.
// ------------------------------------------------------------
formLivro.addEventListener('submit', async (evento) => {
    evento.preventDefault();

    const livro = {
        titulo: livroTituloInput.value.trim(),
        autor: livroAutorInput.value.trim(),
        categoria_id: selectCategoria.value
    };

    const id = livroIdInput.value;

    try {
        const resposta = id
            ? await fetch(`/exemplo-livros-api/${id}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(livro)
              })
            : await fetch('/exemplo-livros-api', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(livro)
              });

        if (!resposta.ok) {
            const dados = await resposta.json();
            alert(dados.erro || 'Erro ao salvar.');
            return;
        }

        formLivro.reset();
        livroIdInput.value = '';
        btnCancelar.classList.add('d-none');
        await carregarLivros();

    } catch (erro) {
        alert('Erro ao salvar livro.');
        console.error(erro);
    }
});

// ------------------------------------------------------------
// Excluir
// ------------------------------------------------------------
async function excluirLivro(id) {
    if (!confirm('Deseja realmente excluir?')) return;

    try {
        const resposta = await fetch(`/exemplo-livros-api/${id}`, { method: 'DELETE' });
        const dados = await resposta.json();

        if (!resposta.ok) {
            alert(dados.erro);
            return;
        }

        await carregarLivros();

    } catch (erro) {
        alert('Erro ao excluir livro.');
        console.error(erro);
    }
}
