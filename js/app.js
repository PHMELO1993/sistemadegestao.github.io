/*
=========================================================
    Sistema de Gestão
    Arquivo: app.js
=========================================================
*/

"use strict";

//======================================
// Inicialização
//======================================

document.addEventListener("DOMContentLoaded", iniciarSistema);

function iniciarSistema(){
    console.clear();
    console.log("================================");
    console.log(" SISTEMA DE GESTÃO INICIADO ");
    console.log("================================");

    destacarMenu();
    carregarDadosDashboard(); 
}

//======================================
// Destaca menu atual
//======================================

function destacarMenu(){
    const links = document.querySelectorAll(".sidebar a");
    const pagina = window.location.pathname.split("/").pop() || "index.html";

    links.forEach(link=>{
        link.classList.remove("ativo");
        const href = link.getAttribute("href");
        if(href === pagina){
            link.classList.add("ativo");
        }
    });
}

//======================================
// Carregar Dados da Nuvem para o Dashboard
//======================================

async function carregarDadosDashboard() {
    const spanAbertas = document.getElementById("osAbertas");
    
    if (!spanAbertas) return; 

    document.getElementById("osAbertas").innerText = "...";
    document.getElementById("osConcluidas").innerText = "...";
    
    const spanEstoque = document.getElementById("itensEstoque");
    if (spanEstoque) spanEstoque.innerText = "...";
    
    const spanUsuarios = document.getElementById("usuarios");
    if (spanUsuarios) spanUsuarios.innerText = "...";

    try {
        // 1. Busca todas as Ordens de Serviço na nuvem
        const ordens = await listarOS();
        
        if (ordens && !ordens.erro) {
            // Filtra e conta
            const abertas = ordens.filter(os => os.status === "Aberta" || os.status === "Em andamento" || os.status === "Pendente").length;
            const concluidas = ordens.filter(os => os.status === "Concluída").length;

            // Atualiza os contadores na tela
            document.getElementById("osAbertas").innerText = abertas;
            document.getElementById("osConcluidas").innerText = concluidas;

            // --- PREENCHE A TABELA DE ÚLTIMAS O.S AGORA QUE OS DADOS EXISTEM ---
            const tbodyUltimas = document.getElementById("ultimasOS");
            if (tbodyUltimas) {
                tbodyUltimas.innerHTML = ""; 
                
                const ultimas5 = ordens.slice(-5).reverse();
                
                if (ultimas5.length === 0) {
                    tbodyUltimas.innerHTML = `<tr><td colspan="5" style="text-align: center;">Nenhuma Ordem de Serviço cadastrada.</td></tr>`;
                } else {
                    ultimas5.forEach(os => {
                        let statusHTML = `<span class="status">${os.status}</span>`;
                        if (os.status === "Aberta") statusHTML = `<span class="status aberta">Aberta</span>`;
                        if (os.status === "Em andamento") statusHTML = `<span class="status andamento">Em andamento</span>`;
                        if (os.status === "Concluída") statusHTML = `<span class="status concluida">Concluída</span>`;

                        tbodyUltimas.innerHTML += `
                        <tr>
                            <td><strong>${os.numero}</strong></td>
                            <td>${formatarData(os.data)}</td>
                            <td>${os.solicitante}</td>
                            <td>${statusHTML}</td>
                            <td>${os.prioridade}</td>
                        </tr>`;
                    });
                }
            }
        } else {
            document.getElementById("osAbertas").innerText = "0";
            document.getElementById("osConcluidas").innerText = "0";
        }

        // 2. Busca o resumo do Dashboard (Estoque e Usuários)
        const resumo = await dashboard();

        if (resumo && !resumo.erro) {
            if (spanEstoque) spanEstoque.innerText = resumo.estoque;
            if (spanUsuarios) spanUsuarios.innerText = resumo.usuarios;
        } else {
            if (spanEstoque) spanEstoque.innerText = "0";
            if (spanUsuarios) spanUsuarios.innerText = "0";
        }

    } catch (erro) {
        console.error("Erro ao carregar dados do Dashboard:", erro);
        document.getElementById("osAbertas").innerText = "!";
        document.getElementById("osConcluidas").innerText = "!";
    }
}

//======================================
// Navegação (Botões de Ação Rápida)
//======================================

function abrirPagina(pagina){
    window.location.href = pagina;
}

//======================================
// Formatar Data e Moeda
//======================================

function moeda(valor){
    return Number(valor).toLocaleString("pt-BR",{
        style:"currency",
        currency:"BRL"
    });
}

function formatarData(data){
    if(!data) return "";
    return new Date(data).toLocaleDateString("pt-BR");
}