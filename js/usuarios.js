/*
====================================================
    usuarios.js
    Sistema de Gestão
====================================================
*/

"use strict";

let listaUsuariosGlobais = [];

document.addEventListener("DOMContentLoaded", iniciarUsuarios);

function iniciarUsuarios() {
    const perfil = localStorage.getItem("usuarioPerfil");
    
    // Esconde o formulário se NÃO for Administrador
    if (perfil !== "Administrador") {
        const formSecao = document.getElementById("formUsuario").closest(".card");
        if(formSecao) formSecao.style.display = "none";
    }

    carregarUsuarios();

    const btnSalvar = document.getElementById("btnSalvarUsuario");
    if (btnSalvar) {
        btnSalvar.addEventListener("click", salvarFormularioUsuario);
    }
}

async function carregarUsuarios() {
    const tbody = document.getElementById("listaUsuarios");
    const perfil = localStorage.getItem("usuarioPerfil"); 
    if (!tbody) return;

    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center;">Carregando usuários da nuvem...</td></tr>`;

    try {
        const resposta = await listarUsuarios();

        if (resposta && Array.isArray(resposta) && resposta.length > 0) {
            listaUsuariosGlobais = resposta;
            tbody.innerHTML = "";
            resposta.forEach(u => {
                
                let btnAcoes = `<span style="color: #999; font-size: 12px; font-weight: 500;">Somente Leitura</span>`;
                // Admin e Técnico podem ver o botão Editar
                if (perfil === "Administrador" || perfil === "Técnico") {
                    btnAcoes = `
                    <button class="btn-tabela btn-visualizar" onclick="abrirModalUsuario('${u.login}')">
                        <i class="fa-solid fa-pen-to-square"></i> Editar
                    </button>`;
                }

                tbody.innerHTML += `
                <tr>
                    <td>${u.nome || ""}</td>
                    <td>${u.login || ""}</td>
                    <td>${u.perfil || ""}</td>
                    <td>${u.email || ""}</td>
                    <td><span class="status ativa" style="color: green; font-weight: bold;">Ativo</span></td>
                    <td>${btnAcoes}</td>
                </tr>`;
            });
        } else {
            listaUsuariosGlobais = [];
            tbody.innerHTML = `<tr><td colspan="6" style="text-align: center;">Nenhum usuário encontrado.</td></tr>`;
        }
    } catch (erro) {
        console.error("Erro:", erro);
        tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: red;">Erro ao carregar dados.</td></tr>`;
    }
}

function validarUsuario() {
    if (document.getElementById("nome").value.trim() === "") { alert("Informe o nome completo."); return false; }
    if (document.getElementById("login").value.trim() === "") { alert("Informe o login."); return false; }
    if (document.getElementById("senha").value.trim() === "") { alert("Informe a senha."); return false; }
    return true;
}

async function salvarFormularioUsuario() {
    if (!validarUsuario()) return;
    const usuario = {
        nome: document.getElementById("nome").value,
        login: document.getElementById("login").value,
        senha: document.getElementById("senha").value,
        perfil: document.getElementById("perfil").value,
        email: document.getElementById("email").value,
        telefone: document.getElementById("telefone").value
    };
    const btn = document.getElementById("btnSalvarUsuario");
    btn.innerHTML = "Salvando... <i class='fa-solid fa-spinner fa-spin'></i>";
    try {
        const resposta = await salvarUsuario(usuario);
        if (resposta && resposta.sucesso) {
            alert("Usuário cadastrado com sucesso!");
            document.getElementById("formUsuario").reset();
            carregarUsuarios();
        } else {
            alert("Erro ao salvar usuário.");
        }
    } catch (erro) { console.error(erro); alert("Erro de conexão."); }
    finally { btn.innerHTML = `<i class="fa-solid fa-floppy-disk"></i> Salvar`; }
}

function abrirModalUsuario(login) {
    const usuario = listaUsuariosGlobais.find(u => u.login === login);
    if(!usuario) return;

    document.getElementById("modalLoginOriginal").value = usuario.login;
    document.getElementById("modalNome").value = usuario.nome;
    document.getElementById("modalLogin").value = usuario.login;
    document.getElementById("modalPerfil").value = usuario.perfil;
    document.getElementById("modalEmail").value = usuario.email;
    document.getElementById("modalTelefone").value = usuario.telefone;
    
    document.getElementById("modalSenha").value = ""; 

    // TRAVA: Apenas Administrador pode ver o botão de Excluir Usuário no Modal
    const perfil = localStorage.getItem("usuarioPerfil");
    if (perfil === "Administrador") {
        document.getElementById("btnExcluirUsuario").style.display = "inline-block";
    } else {
        document.getElementById("btnExcluirUsuario").style.display = "none";
    }

    document.getElementById("modalUsuario").style.display = "block";
}

function fecharModal() {
    document.getElementById("modalUsuario").style.display = "none";
}

async function salvarEdicaoUsuario() {
    const dados = {
        loginOriginal: document.getElementById("modalLoginOriginal").value,
        nome: document.getElementById("modalNome").value,
        login: document.getElementById("modalLogin").value,
        senha: document.getElementById("modalSenha").value,
        perfil: document.getElementById("modalPerfil").value,
        email: document.getElementById("modalEmail").value,
        telefone: document.getElementById("modalTelefone").value
    };

    if(dados.senha.trim() === "") {
        alert("Por favor, digite a senha atual ou defina uma nova senha para confirmar a edição.");
        return;
    }

    const btn = document.getElementById("btnSalvarModal");
    btn.innerHTML = "<i class='fa-solid fa-spinner fa-spin'></i> Salvando...";
    btn.disabled = true;

    try {
        const resposta = await atualizarUsuario(dados);
        if (resposta && resposta.sucesso) {
            alert("Usuário atualizado com sucesso!");
            fecharModal();
            carregarUsuarios();
        } else {
            alert("Erro: " + (resposta.mensagem || "Falha ao atualizar."));
        }
    } catch (erro) { alert("Erro de conexão."); } 
    finally {
        btn.innerHTML = "<i class='fa-solid fa-floppy-disk'></i> Atualizar Usuário";
        btn.disabled = false;
    }
}

async function excluirUsuarioConfirmado() {
    const login = document.getElementById("modalLoginOriginal").value;
    
    if (login === "admin") {
        alert("O usuário 'admin' principal não pode ser excluído.");
        return;
    }

    if (!confirm(`Tem certeza que deseja excluir o usuário ${login}?`)) return;

    const btn = document.getElementById("btnExcluirUsuario");
    btn.innerHTML = "<i class='fa-solid fa-spinner fa-spin'></i> Apagando...";
    btn.disabled = true;

    try {
        const resposta = await excluirUsuario(login);
        if (resposta && resposta.sucesso) {
            alert("Usuário excluído!");
            fecharModal();
            carregarUsuarios();
        } else {
            alert("Erro ao excluir.");
        }
    } catch (erro) { alert("Erro de conexão."); } 
    finally {
        btn.innerHTML = "<i class='fa-solid fa-trash'></i> Excluir Usuário";
        btn.disabled = false;
    }
}