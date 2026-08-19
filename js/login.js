/*
====================================================
    login.js
    Lógica da interface de autenticação
====================================================
*/

"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formLogin");
    if (form) {
        form.addEventListener("submit", processarLogin);
    }
});

async function processarLogin(evento) {
    evento.preventDefault(); 

    const loginDigitado = document.getElementById("usuario").value.trim();
    const senhaDigitada = document.getElementById("senha").value.trim();
    const btnEntrar = document.getElementById("btnEntrar");
    const divErro = document.getElementById("mensagemErro");

    divErro.style.display = "none";
    btnEntrar.innerHTML = "<i class='fa-solid fa-spinner fa-spin'></i> Autenticando...";
    btnEntrar.disabled = true;

    try {
        const resposta = await logarNoSistema(loginDigitado, senhaDigitada);

        if (resposta && resposta.sucesso) {
            // Cria a chave absoluta de permissão
            localStorage.setItem("sessaoAtiva", "true");
            
            // Salva os dados (se o nome estiver vazio, ele escreve "Usuário")
            localStorage.setItem("usuarioLogado", resposta.nome || "Usuário");
            localStorage.setItem("usuarioPerfil", resposta.perfil || "Padrão");

            // Redireciona para o Dashboard
            window.location.href = "index.html";
        } else {
            mostrarErro(resposta.mensagem || "Usuário ou senha incorretos.");
        }
    } catch (erro) {
        console.error("Erro:", erro);
        mostrarErro("Falha ao comunicar com o servidor.");
    } finally {
        btnEntrar.innerHTML = "Entrar no Sistema";
        btnEntrar.disabled = false;
    }
}

function mostrarErro(mensagem) {
    const divErro = document.getElementById("mensagemErro");
    divErro.innerText = mensagem;
    divErro.style.display = "block";
}