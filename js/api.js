/*
====================================================
    api.js
    Conexão com Google Sheets e Segurança
====================================================
*/

"use strict";

const API = {
    // URL DO SEU GOOGLE APPS SCRIPT
    URL: "https://script.google.com/macros/s/AKfycbxtB2sNMdegDQcxpTjsU4y7odsgxLvtdrEWotdzkniJlOgEE2UxVd__exczQk6mJEHu-g/exec" 
};

// Função genérica para enviar os dados para o Google
async function enviarRequisicao(acao, dados = {}) {
    const requisicao = {
        method: "POST",
        body: JSON.stringify({ acao: acao, dados: dados })
    };
    try {
        const response = await fetch(API.URL, requisicao);
        return await response.json();
    } catch (erro) {
        console.error(`Erro na ação ${acao}:`, erro);
        return { erro: true, mensagem: "Falha de conexão com o servidor." };
    }
}

// ==========================================
// FUNÇÕES DE COMUNICAÇÃO COM A NUVEM
// ==========================================
async function listarOS() { return await enviarRequisicao("listarOS"); }
async function salvarOS(os) { return await enviarRequisicao("salvarOS", os); }
async function buscarOS(numero) { return await enviarRequisicao("buscarOS", { numero: numero }); }
async function dashboard() { return await enviarRequisicao("dashboard"); }

async function listarEstoque() { return await enviarRequisicao("listarEstoque"); }
async function salvarItem(item) { return await enviarRequisicao("salvarItem", item); }

async function listarUsuarios() { return await enviarRequisicao("listarUsuarios"); }
async function salvarUsuario(usuario) { return await enviarRequisicao("salvarUsuario", usuario); }

async function logarNoSistema(login, senha) { 
    return await enviarRequisicao("login", { login: login, senha: senha }); 
}

// Funções para Editar e Excluir O.S.
async function atualizarOS(dadosOS) { return await enviarRequisicao("atualizarOS", dadosOS); }
async function excluirOS(numeroOS) { return await enviarRequisicao("excluirOS", { numero: numeroOS }); }

// Funções para Editar e Excluir Estoque
async function atualizarItem(item) { return await enviarRequisicao("atualizarItem", item); }
async function excluirItem(codigo) { return await enviarRequisicao("excluirItem", { codigo: codigo }); }

// Funções para Editar e Excluir Usuários
async function atualizarUsuario(dados) { return await enviarRequisicao("atualizarUsuario", dados); }
async function excluirUsuario(login) { return await enviarRequisicao("excluirUsuario", { login: login }); }


// ==========================================
// CONTROLE DE SESSÃO E TRAVA DE SEGURANÇA
// ==========================================

function sairDoSistema() {
    localStorage.clear();
    window.location.href = "login.html";
}

// Trava automática blindada com Permissões
document.addEventListener("DOMContentLoaded", () => {
    const paginaAtual = window.location.pathname.split("/").pop();
    const sessaoAtiva = localStorage.getItem("sessaoAtiva");
    const perfil = localStorage.getItem("usuarioPerfil");

    if (sessaoAtiva !== "true" && paginaAtual !== "login.html") {
        window.location.href = "login.html";
        return;
    }

    if (sessaoAtiva === "true" && paginaAtual === "login.html") {
        window.location.href = "index.html";
        return;
    }

    // --- REGRAS DE ACESSO --- //

    // 1. Bloqueia acesso à tela de Nova O.S APENAS para Consulta
    if (perfil === "Consulta" && paginaAtual === "atendimento.html") {
        alert("Seu perfil não tem permissão para abrir novas Ordens de Serviço.");
        window.location.href = "index.html";
    }

    // 2. Oculta o menu "Atendimento" APENAS para Consulta
    if (perfil === "Consulta") {
        const linksMenu = document.querySelectorAll("aside.sidebar nav ul li a");
        linksMenu.forEach(link => {
            if(link.getAttribute("href") === "atendimento.html") {
                link.parentElement.style.display = "none";
            }
        });
        
        const cardsAcao = document.querySelectorAll(".cardAcao");
        cardsAcao.forEach(card => {
            if(card.getAttribute("onclick") && card.getAttribute("onclick").includes("atendimento.html")) {
                card.style.display = "none";
            }
        });
    }
});