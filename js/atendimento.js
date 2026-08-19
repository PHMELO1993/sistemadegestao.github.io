/*
====================================================
    atendimento.js
    Sistema de Gestão
====================================================
*/

"use strict";

//==========================================
// Inicialização
//==========================================

document.addEventListener("DOMContentLoaded", iniciarAtendimento);

function iniciarAtendimento() {

    gerarNumeroOS();
    preencherDataAtual();
    configurarEventos();

}

//==========================================
// Eventos
//==========================================

function configurarEventos() {

    const btnSalvar = document.getElementById("btnSalvar");

    if (btnSalvar) {

        btnSalvar.addEventListener("click", salvarFormularioOS);

    }

}

//==========================================
// Gera número da Ordem de Serviço
//==========================================

function gerarNumeroOS() {

    let numero = localStorage.getItem("numeroOS");

    if (numero == null) {

        numero = 1;

    } else {

        numero = Number(numero) + 1;

    }

    localStorage.setItem("numeroOS", numero);

    document.getElementById("numeroOS").value =
        "OS" + numero.toString().padStart(4, "0");

}

//==========================================
// Data Atual
//==========================================

function preencherDataAtual() {

    const hoje = new Date();

    document.getElementById("data").value =
        hoje.toISOString().split("T")[0];

}

//==========================================
// Validação
//==========================================

function validarFormulario() {

    if (document.getElementById("solicitante").value.trim() == "") {

        alert("Informe o solicitante.");
        return false;

    }

    if (document.getElementById("equipamento").value.trim() == "") {

        alert("Informe o equipamento.");
        return false;

    }

    if (document.getElementById("problema").value.trim() == "") {

        alert("Informe o problema.");
        return false;

    }

    return true;

}

//==========================================
// Dados do Formulário
//==========================================

function obterDadosFormulario() {

    return {

        numero: document.getElementById("numeroOS").value,
        data: document.getElementById("data").value,
        status: document.getElementById("status").value,
        prioridade: document.getElementById("prioridade").value,
        solicitante: document.getElementById("solicitante").value,
        setor: document.getElementById("setor").value,
        equipamento: document.getElementById("equipamento").value,
        tecnico: document.getElementById("tecnico").value,
        problema: document.getElementById("problema").value,
        comentario: document.getElementById("comentario").value

    };

}

//==========================================
// Salvar Ordem de Serviço
//==========================================

async function salvarFormularioOS() {

    if (!validarFormulario()) {

        return;

    }

    const ordem = obterDadosFormulario();

    console.table(ordem);

    try {

        const resposta = await salvarOS(ordem);

        console.log(resposta);

        if (!resposta) {

            alert("Nenhuma resposta da API.");
            return;

        }

        if (resposta.erro) {

            alert(resposta.mensagem);
            return;

        }

        alert("Ordem de Serviço cadastrada com sucesso!");

        limparFormulario();

    } catch (erro) {

        console.error(erro);

        alert("Erro ao salvar a Ordem de Serviço.");

    }

}

//==========================================
// Limpar
//==========================================

function limparFormulario() {

    document.getElementById("formOS").reset();

    preencherDataAtual();

    gerarNumeroOS();

}

//==========================================
// Consultar Ordens
//==========================================

async function listarOrdens() {

    try {

        const resposta = await listarOS();

        console.table(resposta);

    } catch (erro) {

        console.error(erro);

    }

}

//==========================================
// Banco de Testes
//==========================================

function limparBancoTeste() {

    localStorage.removeItem("ordens");
    localStorage.removeItem("numeroOS");

}