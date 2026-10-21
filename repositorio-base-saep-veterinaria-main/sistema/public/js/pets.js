// ============================================================
// public/js/pets.js
// ============================================================
// A função carregarTutores() abaixo já está pronta (BASE FORNECIDA)
// - ela só serve para preencher o <select> de tutores, e não faz
// parte do requisito avaliado.
//
// O QUE VOCÊ DESENVOLVE (RF-18): o envio do formulário de cadastro
// do pet, associando-o ao tutor selecionado.
// Exemplo de apoio: exemplos/exemplo-fetch.js (item 4, POST).
// ============================================================

const formPet = document.getElementById('form-pet');
const petNomeInput = document.getElementById('pet-nome');
const petEspecieInput = document.getElementById('pet-especie');
const selectTutor = document.getElementById('pet-tutor');
const mensagemPet = document.getElementById('mensagem-pet');

inicializar();

async function inicializar() {
    await carregarTutores();
}

// ------------------------------------------------------------
// BASE FORNECIDA - popula o <select> de tutores
// ------------------------------------------------------------
async function carregarTutores() {
    try {
        const resposta = await fetch('/api/tutores');

        if (resposta.status === 401) {
            window.location.href = '/login.html';
            return;
        }

        const tutores = await resposta.json();

        selectTutor.innerHTML = '<option value="">Selecione um tutor...</option>';
        tutores.forEach((tutor) => {
            const option = document.createElement('option');
            option.value = tutor.id;
            option.textContent = tutor.nome;
            selectTutor.appendChild(option);
        });

    } catch (erro) {
        console.error('Erro ao carregar tutores:', erro);
        selectTutor.innerHTML = '<option value="">Erro ao carregar tutores</option>';
    }
}

// ------------------------------------------------------------
// RF-18: cadastrar pet associado a um tutor
// ------------------------------------------------------------
formPet.addEventListener('submit', async (evento) => {
    evento.preventDefault();

    const pet = {
        nome: petNomeInput.value.trim(),
        especie: petEspecieInput.value.trim(),
        tutor_id: selectTutor.value
    };

    try {
        // TODO: faça o fetch POST /api/pets, enviando "pet" como
        // JSON no body. Confira resposta.ok e mostre uma mensagem
        // de sucesso ou erro em mensagemPet.textContent. Se der
        // certo, limpe o formulário (formPet.reset()).

    } catch (erro) {
        mensagemPet.textContent = 'Erro ao cadastrar pet.';
        mensagemPet.className = 'text-danger mt-3';
        console.error(erro);
    }
});
