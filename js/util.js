/*
=========================================================
    util.js
    Sistema de Gestão
=========================================================
*/

"use strict";

/*==========================================
    DATA
==========================================*/

function dataAtual() {

    return new Date().toISOString().split("T")[0];

}

function horaAtual() {

    return new Date().toLocaleTimeString("pt-BR");

}

function dataHoraAtual() {

    return new Date().toLocaleString("pt-BR");

}

function formatarData(data) {

    if (!data) return "";

    return new Date(data).toLocaleDateString("pt-BR");

}

/*==========================================
    MOEDA
==========================================*/

function moeda(valor) {

    return Number(valor).toLocaleString("pt-BR", {

        style: "currency",

        currency: "BRL"

    });

}

/*==========================================
    NÚMEROS
==========================================*/

function somenteNumero(valor) {

    return valor.replace(/\D/g, "");

}

function gerarCodigo(prefixo, numero) {

    return prefixo + String(numero).padStart(4, "0");

}

/*==========================================
    ALERTAS
==========================================*/

function sucesso(texto) {

    alert("✅ " + texto);

}

function erro(texto) {

    alert("❌ " + texto);

}

function aviso(texto) {

    alert("⚠️ " + texto);

}

function confirmar(texto) {

    return confirm(texto);

}

/*==========================================
    CAMPOS
==========================================*/

function limparFormulario(idFormulario) {

    document.getElementById(idFormulario).reset();

}

function limparCampo(idCampo) {

    document.getElementById(idCampo).value = "";

}

function valorCampo(idCampo) {

    return document.getElementById(idCampo).value;

}

function definirValor(idCampo, valor) {

    document.getElementById(idCampo).value = valor;

}

/*==========================================
    LOCAL STORAGE
==========================================*/

function salvarLocal(chave, dados) {

    localStorage.setItem(

        chave,

        JSON.stringify(dados)

    );

}

function lerLocal(chave) {

    return JSON.parse(localStorage.getItem(chave));

}

function excluirLocal(chave) {

    localStorage.removeItem(chave);

}

/*==========================================
    JSON
==========================================*/

function copiar(objeto) {

    return JSON.parse(JSON.stringify(objeto));

}

/*==========================================
    TABELA
==========================================*/

function limparTabela(idTabela) {

    document.getElementById(idTabela).innerHTML = "";

}

/*==========================================
    VALIDAÇÃO
==========================================*/

function vazio(texto) {

    return texto.trim() === "";

}

function obrigatorio(idCampo, mensagem) {

    const campo = document.getElementById(idCampo);

    if (campo.value.trim() === "") {

        campo.focus();

        aviso(mensagem);

        return false;

    }

    return true;

}

/*==========================================
    CPF (futuro)
==========================================*/

function somenteCPF(valor) {

    return valor
        .replace(/\D/g, "")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");

}

/*==========================================
    TELEFONE
==========================================*/

function telefone(valor){

    return valor
        .replace(/\D/g,"")
        .replace(/^(\d{2})(\d)/g,"($1) $2")
        .replace(/(\d)(\d{4})$/,"$1-$2");

}

/*==========================================
    EMAIL
==========================================*/

function emailValido(email){

    return /\S+@\S+\.\S+/.test(email);

}

/*==========================================
    LOADING
==========================================*/

function loading(){

    console.log("Carregando...");

}

function fimLoading(){

    console.log("Concluído.");

}

/*==========================================
    LOG
==========================================*/

function log(texto){

    console.log(texto);

}

/*==========================================
    DEBUG
==========================================*/

function debug(objeto){

    console.table(objeto);

}