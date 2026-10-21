// ============================================================
// utils/crypto-utils.js
// ============================================================
// Este arquivo já está pronto (BASE FORNECIDA).
// Aqui estão as funções que vocês vão USAR (não precisam
// reescrever) para atender ao requisito de segurança de dados
// sensíveis (senha e CPF).
//
// IMPORTANTE - por que existem DOIS tipos de "criptografia" aqui:
//
// 1) SENHA -> usa HASH (bcrypt). Hash é uma "via de mão única":
//    não existe função para "descriptografar" um hash. Por isso,
//    para conferir login, a gente não descriptografa a senha
//    salva - a gente pega a senha digitada, gera o hash dela de
//    novo, e compara os dois hashes (ver compararSenha()).
//
// 2) CPF -> usa criptografia SIMÉTRICA (AES-256-CBC). Diferente
//    da senha, o CPF PRECISA aparecer de novo na tela (listagem,
//    edição de tutor). Por isso ele tem que ser reversível:
//    dá pra criptografar E descriptografar de volta.
//
// Onde usar cada função (rotas que vocês vão desenvolver):
//   - Cadastro de tutor (POST)  -> criptografarCPF(cpf) antes de salvar
//   - Listagem/edição de tutor  -> descriptografarCPF(cpfSalvo) antes de exibir
//   - Login (já pronto em routes/auth.js) -> compararSenha(...)
// ============================================================

import bcrypt from 'bcrypt';
import crypto from 'crypto';

// ------------------------------------------------------------
// SENHA (hash irreversível - bcrypt)
// ------------------------------------------------------------

const SALT_ROUNDS = 10;

/**
 * Gera o hash de uma senha em texto puro.
 * Use ao CADASTRAR um usuário (senha nova).
 * @param {string} senhaTextoPuro
 * @returns {Promise<string>} hash para salvar no banco
 */
export async function hashSenha(senhaTextoPuro) {
    return bcrypt.hash(senhaTextoPuro, SALT_ROUNDS);
}

/**
 * Compara uma senha digitada (texto puro) com o hash salvo no banco.
 * Use no LOGIN.
 * @param {string} senhaTextoPuro - o que o usuário digitou
 * @param {string} hashSalvo - o que está salvo na coluna "senha" do banco
 * @returns {Promise<boolean>} true se a senha confere
 */
export async function compararSenha(senhaTextoPuro, hashSalvo) {
    return bcrypt.compare(senhaTextoPuro, hashSalvo);
}

// ------------------------------------------------------------
// CPF (criptografia reversível - AES-256-CBC)
// ------------------------------------------------------------
// A chave e o IV (vetor de inicialização) ficam fixos aqui só
// para simplificar o uso na prova. Em um sistema real, a chave
// ficaria fora do código-fonte (variável de ambiente / .env).

const ALGORITMO = 'aes-256-cbc';

// Chave de 32 bytes (256 bits) e IV de 16 bytes (128 bits).
// Usamos uma frase fixa "esticada" com scryptSync para garantir o
// tamanho exato em bytes (mais seguro do que contar caracteres na mão).
const SENHA_MESTRA = 'saep2026-clinica-veterinaria-chave-secreta';
const CHAVE = crypto.scryptSync(SENHA_MESTRA, 'salt-saep-cpf', 32);
const IV = Buffer.from('saep2026vetiv16b', 'utf-8'); // exatamente 16 caracteres

/**
 * Criptografa um CPF (texto puro) antes de salvar no banco.
 * Use ao CADASTRAR ou EDITAR um tutor.
 * @param {string} cpfTextoPuro - ex: "111.111.111-11"
 * @returns {string} CPF criptografado (para salvar na coluna "cpf")
 */
export function criptografarCPF(cpfTextoPuro) {
    const cipher = crypto.createCipheriv(ALGORITMO, CHAVE, IV);
    let criptografado = cipher.update(cpfTextoPuro, 'utf-8', 'hex');
    criptografado += cipher.final('hex');
    return criptografado;
}

/**
 * Descriptografa um CPF salvo no banco, para exibir na tela.
 * Use ao LISTAR ou EDITAR um tutor.
 * @param {string} cpfCriptografado - valor que veio do banco
 * @returns {string} CPF em texto puro, ex: "111.111.111-11"
 */
export function descriptografarCPF(cpfCriptografado) {
    const decipher = crypto.createDecipheriv(ALGORITMO, CHAVE, IV);
    let textoPuro = decipher.update(cpfCriptografado, 'hex', 'utf-8');
    textoPuro += decipher.final('utf-8');
    return textoPuro;
}
