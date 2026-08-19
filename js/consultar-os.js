/*
====================================================
    consultar-os.js
    Sistema de Gestão
====================================================
*/

"use strict";

let listaOrdensGlobais = [];

document.addEventListener("DOMContentLoaded", iniciarConsulta);

function iniciarConsulta() {
    carregarTodasOS();
    configurarEventosConsulta();
}

function configurarEventosConsulta() {
    document.getElementById("btnPesquisarOS").addEventListener("click", pesquisarOS);
    document.getElementById("btnRecarregar").addEventListener("click", carregarTodasOS);
}

async function carregarTodasOS() {
    const tbody = document.getElementById("listaConsultaOS");
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center;">Carregando ordens... <i class="fa-solid fa-spinner fa-spin"></i></td></tr>`;

    try {
        const resposta = await listarOS();
        if (resposta && resposta.length > 0) {
            listaOrdensGlobais = resposta;
            desenharTabela(resposta);
        } else {
            listaOrdensGlobais = [];
            tbody.innerHTML = `<tr><td colspan="6" style="text-align: center;">Nenhuma Ordem de Serviço encontrada.</td></tr>`;
        }
    } catch (erro) {
        console.error(erro);
        tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: red;">Erro ao carregar dados.</td></tr>`;
    }
}

async function pesquisarOS() {
    const termo = document.getElementById("pesquisaOS").value.trim().toUpperCase();
    if (termo === "") {
        alert("Digite um número de O.S para pesquisar.");
        return;
    }

    const tbody = document.getElementById("listaConsultaOS");
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center;">Buscando... <i class="fa-solid fa-spinner fa-spin"></i></td></tr>`;

    try {
        const resposta = await buscarOS(termo);
        if (resposta.sucesso && resposta.os) {
            listaOrdensGlobais = [resposta.os];
            desenharTabela([resposta.os]);
        } else {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align: center;">${resposta.mensagem || "O.S não encontrada."}</td></tr>`;
        }
    } catch (erro) {
        console.error(erro);
        tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: red;">Erro na busca.</td></tr>`;
    }
}

function formatarStatus(status) {
    if (status === "Aberta") return `<span class="status" style="background-color: #f39c12;">Aberta</span>`;
    if (status === "Em Andamento") return `<span class="status" style="background-color: #3498db;">Em andamento</span>`;
    if (status === "Concluída") return `<span class="status status-concluida">Concluída</span>`;
    return `<span class="status">${status}</span>`;
}

function formatarDataVisor(dataBruta) {
    if(!dataBruta) return "";
    try {
        const dataObj = new Date(dataBruta);
        return dataObj.toLocaleDateString("pt-BR", {timeZone: "UTC"});
    } catch(e) {
        return dataBruta;
    }
}

function desenharTabela(lista) {
    const tbody = document.getElementById("listaConsultaOS");
    tbody.innerHTML = "";
    const listaInvertida = [...lista].reverse();

    listaInvertida.forEach(os => {
        tbody.innerHTML += `
        <tr>
            <td><strong>${os.numero}</strong></td>
            <td>${formatarDataVisor(os.data)}</td>
            <td>${os.solicitante}</td>
            <td>${os.equipamento}</td>
            <td>${formatarStatus(os.status)}</td>
            <td>
                <button class="btn-tabela btn-visualizar" onclick="abrirModalOS('${os.numero}')">
                    <i class="fa-solid fa-eye"></i> Abrir
                </button>
            </td>
        </tr>`;
    });
}

function abrirModalOS(numero) {
    const os = listaOrdensGlobais.find(item => item.numero === numero);
    if(!os) return;

    document.getElementById("modalNumeroOS").innerText = os.numero;
    document.getElementById("modalNumero").value = os.numero;
    document.getElementById("modalSolicitante").innerText = os.solicitante;
    document.getElementById("modalSetor").innerText = os.setor;
    document.getElementById("modalEquipamento").innerText = os.equipamento;
    document.getElementById("modalProblema").innerText = os.problema;

    document.getElementById("modalStatus").value = os.status || "Aberta";
    document.getElementById("modalTecnico").value = os.tecnico || "";
    document.getElementById("modalComentario").value = os.comentario || "";

    // === REGRAS DE PERMISSÃO DO MODAL ===
    const perfil = localStorage.getItem("usuarioPerfil");
    const btnSalvar = document.getElementById("btnSalvarModal");
    const btnExcluir = document.getElementById("btnExcluirOS");

    btnSalvar.style.display = "inline-block";
    btnExcluir.style.display = "none";

    // Apenas Admin exclui
    if (perfil === "Administrador") {
        btnExcluir.style.display = "inline-block";
    }

    // Consulta apenas lê
    if (perfil === "Consulta") {
        btnSalvar.style.display = "none";
    }

    document.getElementById("modalOS").style.display = "block";
}

function fecharModal() {
    document.getElementById("modalOS").style.display = "none";
}

async function salvarEdicaoOS() {
    const dados = {
        numero: document.getElementById("modalNumero").value,
        status: document.getElementById("modalStatus").value,
        tecnico: document.getElementById("modalTecnico").value,
        comentario: document.getElementById("modalComentario").value
    };

    const btn = document.getElementById("btnSalvarModal");
    btn.innerHTML = "<i class='fa-solid fa-spinner fa-spin'></i> Salvando...";
    btn.disabled = true;

    try {
        const resposta = await atualizarOS(dados);
        if (resposta && resposta.sucesso) {
            alert("Ordem de Serviço atualizada com sucesso!");
            fecharModal();
            carregarTodasOS(); 
        } else {
            alert("Erro: " + (resposta.mensagem || "Não foi possível atualizar."));
        }
    } catch (erro) {
        console.error(erro);
        alert("Erro de conexão ao atualizar.");
    } finally {
        btn.innerHTML = "<i class='fa-solid fa-floppy-disk'></i> Atualizar O.S";
        btn.disabled = false;
    }
}

async function excluirOSConfirmado() {
    const numero = document.getElementById("modalNumero").value;
    if (!confirm(`Tem certeza absoluta que deseja excluir a O.S ${numero}? Esta ação não pode ser desfeita.`)) return;

    const btn = document.getElementById("btnExcluirOS");
    btn.innerHTML = "<i class='fa-solid fa-spinner fa-spin'></i> Apagando...";
    btn.disabled = true;

    try {
        const resposta = await excluirOS(numero);
        if (resposta && resposta.sucesso) {
            alert("Ordem de Serviço excluída com sucesso.");
            fecharModal();
            carregarTodasOS();
        } else {
            alert("Erro: " + (resposta.mensagem || "Não foi possível excluir."));
        }
    } catch (erro) {
        console.error(erro);
        alert("Erro de conexão ao excluir.");
    } finally {
        btn.innerHTML = "<i class='fa-solid fa-trash'></i> Excluir O.S";
        btn.disabled = false;
    }
}