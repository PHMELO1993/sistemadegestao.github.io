/*
=========================================================
    dashboard.js
    Sistema de Gestão
=========================================================
*/

"use strict";

//=====================================================
// Inicialização
//=====================================================

document.addEventListener("DOMContentLoaded", iniciarDashboard);

function iniciarDashboard(){

    atualizarDashboard();

    carregarUltimasOS();

}

//=====================================================
// Atualizar Dashboard
//=====================================================

function atualizarDashboard(){

    atualizarOrdens();

    atualizarEstoque();

    atualizarUsuarios();

}

//=====================================================
// ORDENS
//=====================================================

function atualizarOrdens(){

    let ordens =
        JSON.parse(localStorage.getItem("ordens")) || [];

    let abertas =
        ordens.filter(os => os.status === "Aberta").length;

    let concluidas =
        ordens.filter(os => os.status === "Concluída").length;

    document.getElementById("osAbertas").textContent =
        abertas;

    document.getElementById("osConcluidas").textContent =
        concluidas;

}

//=====================================================
// ESTOQUE
//=====================================================

function atualizarEstoque(){

    let estoque =
        JSON.parse(localStorage.getItem("estoque")) || [];

    document.getElementById("estoque").textContent =
        estoque.length;

}

//=====================================================
// USUÁRIOS
//=====================================================

function atualizarUsuarios(){

    let usuarios =
        JSON.parse(localStorage.getItem("usuarios")) || [];

    document.getElementById("usuarios").textContent =
        usuarios.length;

}

//=====================================================
// ÚLTIMAS ORDENS
//=====================================================

function carregarUltimasOS(){

    let ordens =
        JSON.parse(localStorage.getItem("ordens")) || [];

    const tbody =
        document.getElementById("ultimasOS");

    if(!tbody){

        return;

    }

    tbody.innerHTML = "";

    if(ordens.length === 0){

        tbody.innerHTML = `

        <tr>

            <td colspan="5"
                style="text-align:center;padding:30px;">

                Nenhuma Ordem de Serviço cadastrada.

            </td>

        </tr>

        `;

        return;

    }

    const ultimas =
        ordens.slice(-5).reverse();

    ultimas.forEach(os=>{

        tbody.innerHTML += `

        <tr>

            <td>${os.numero}</td>

            <td>${formatarData(os.data)}</td>

            <td>${os.solicitante}</td>

            <td>

                ${badgeStatus(os.status)}

            </td>

            <td>${os.prioridade}</td>

        </tr>

        `;

    });

}

//=====================================================
// BADGE STATUS
//=====================================================

function badgeStatus(status){

    switch(status){

        case "Aberta":

            return `<span class="status aberta">Aberta</span>`;

        case "Em andamento":

            return `<span class="status andamento">Em andamento</span>`;

        case "Pendente":

            return `<span class="status andamento">Pendente</span>`;

        case "Concluída":

            return `<span class="status concluida">Concluída</span>`;

        default:

            return status;

    }

}

//=====================================================
// FORMATA DATA
//=====================================================

function formatarData(data){

    if(!data){

        return "";

    }

    return new Date(data).toLocaleDateString("pt-BR");

}

//=====================================================
// RECARREGAR DASHBOARD
//=====================================================

function atualizarTudo(){

    atualizarDashboard();

    carregarUltimasOS();

}

//=====================================================
// LIMPAR DADOS (TESTES)
//=====================================================

function limparDashboard(){

    if(confirm("Deseja apagar todos os dados locais?")){

        localStorage.removeItem("ordens");
        localStorage.removeItem("usuarios");
        localStorage.removeItem("estoque");
        localStorage.removeItem("numeroOS");

        atualizarTudo();

    }

}