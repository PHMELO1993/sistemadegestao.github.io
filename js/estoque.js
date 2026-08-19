/*
====================================================
    estoque.js
    Sistema de Gestão
====================================================
*/

"use strict";

let listaEstoqueGlobal = []; 

document.addEventListener("DOMContentLoaded", iniciarEstoque);

function iniciarEstoque() {
    const perfil = localStorage.getItem("usuarioPerfil");
    
    // Esconde o formulário de cadastro APENAS para o Operador
    if (perfil === "Operador") {
        const formSecao = document.getElementById("formEstoque").closest(".card");
        if(formSecao) formSecao.style.display = "none";
    }

    carregarEstoque();

    const btnSalvar = document.getElementById("btnSalvarItem");
    if (btnSalvar) {
        btnSalvar.addEventListener("click", salvarFormularioEstoque);
    }
}

async function carregarEstoque() {
    const tbody = document.getElementById("listaEstoque");
    const perfil = localStorage.getItem("usuarioPerfil");
    if (!tbody) return;

    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center;">Carregando estoque da nuvem...</td></tr>`;

    try {
        const resposta = await listarEstoque(); 

        if (resposta && Array.isArray(resposta) && resposta.length > 0) {
            listaEstoqueGlobal = resposta; 
            tbody.innerHTML = "";
            
            [...resposta].reverse().forEach(i => {

                // Regra de exibição do botão
                let btnAcoes = `<span style="color: #999; font-size: 12px; font-weight: 500;">Somente Leitura</span>`;
                if (perfil === "Administrador" || perfil === "Consulta" || perfil === "Técnico") {
                    btnAcoes = `
                    <button class="btn-tabela btn-visualizar" onclick="abrirModalEstoque('${i.codigo}')">
                        <i class="fa-solid fa-pen-to-square"></i> Editar
                    </button>`;
                }

                tbody.innerHTML += `
                <tr>
                    <td><strong>${i.codigo || ""}</strong></td>
                    <td>${i.descricao || ""}</td>
                    <td>${i.categoria || ""}</td>
                    <td>${i.quantidade || 0}</td>
                    <td>R$ ${Number(i.valor || 0).toFixed(2)}</td>
                    <td>${i.fornecedor || ""}</td>
                    <td>${btnAcoes}</td>
                </tr>`;
            });
        } else {
            listaEstoqueGlobal = [];
            tbody.innerHTML = `<tr><td colspan="7" style="text-align: center;">Nenhum item cadastrado no estoque.</td></tr>`;
        }
    } catch (erro) {
        console.error("Erro ao carregar estoque:", erro);
        tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: red;">Erro ao carregar dados.</td></tr>`;
    }
}

function validarEstoque() {
    if (document.getElementById("codigo").value.trim() === "") { alert("Informe o código."); return false; }
    if (document.getElementById("descricao").value.trim() === "") { alert("Informe a descrição."); return false; }
    if (document.getElementById("quantidade").value.trim() === "") { alert("Informe a quantidade."); return false; }
    return true;
}

async function salvarFormularioEstoque() {
    if (!validarEstoque()) return;

    const item = {
        codigo: document.getElementById("codigo").value,
        descricao: document.getElementById("descricao").value,
        categoria: document.getElementById("categoria").value,
        quantidade: document.getElementById("quantidade").value,
        valor: document.getElementById("valor").value,
        fornecedor: document.getElementById("fornecedor").value,
        observacao: document.getElementById("observacao").value
    };

    const btn = document.getElementById("btnSalvarItem");
    btn.innerHTML = "Salvando... <i class='fa-solid fa-spinner fa-spin'></i>";

    try {
        const resposta = await salvarItem(item);
        if (resposta && resposta.sucesso) {
            alert("Item cadastrado com sucesso!");
            document.getElementById("formEstoque").reset();
            carregarEstoque(); 
        } else {
            alert("Erro ao salvar item na planilha.");
        }
    } catch (erro) { console.error(erro); alert("Erro de conexão."); } 
    finally { btn.innerHTML = `<i class="fa-solid fa-floppy-disk"></i> Salvar`; }
}

function abrirModalEstoque(codigo) {
    const item = listaEstoqueGlobal.find(i => i.codigo === codigo);
    if(!item) return;

    document.getElementById("modalCodigoVisor").innerText = item.codigo;
    document.getElementById("modalCodigo").value = item.codigo;
    document.getElementById("modalDescricao").value = item.descricao || "";
    document.getElementById("modalCategoria").value = item.categoria || "Outros";
    document.getElementById("modalQuantidade").value = item.quantidade || 0;
    
    let valorCorrigido = item.valor || 0;
    if (typeof valorCorrigido === 'string') valorCorrigido = valorCorrigido.replace(',', '.');
    document.getElementById("modalValor").value = parseFloat(valorCorrigido).toFixed(2);
    
    document.getElementById("modalFornecedor").value = item.fornecedor || "";
    document.getElementById("modalObservacao").value = item.observacao || "";

    document.getElementById("modalEstoque").style.display = "block";
}

function fecharModal() {
    document.getElementById("modalEstoque").style.display = "none";
}

async function salvarEdicaoEstoque() {
    const dados = {
        codigo: document.getElementById("modalCodigo").value,
        descricao: document.getElementById("modalDescricao").value,
        categoria: document.getElementById("modalCategoria").value,
        quantidade: document.getElementById("modalQuantidade").value,
        valor: document.getElementById("modalValor").value,
        fornecedor: document.getElementById("modalFornecedor").value,
        observacao: document.getElementById("modalObservacao").value
    };

    const btn = document.getElementById("btnSalvarModal");
    btn.innerHTML = "<i class='fa-solid fa-spinner fa-spin'></i> Atualizando...";
    btn.disabled = true;

    try {
        const resposta = await atualizarItem(dados); 
        if (resposta && resposta.sucesso) {
            alert("Item do estoque atualizado com sucesso!");
            fecharModal();
            carregarEstoque(); 
        } else {
            alert("Erro: " + (resposta.mensagem || "Não foi possível atualizar."));
        }
    } catch (erro) {
        console.error(erro);
        alert("Erro de conexão ao atualizar.");
    } finally {
        btn.innerHTML = "<i class='fa-solid fa-floppy-disk'></i> Atualizar Item";
        btn.disabled = false;
    }
}