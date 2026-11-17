// form.js - validação do formulário de contato

// regex
const regexNome = /^[A-Za-záàâãéèêíóôõúçÁÀÂÃÉÈÊÍÓÔÕÚÇ]+(\s[A-Za-záàâãéèêíóôõúçÁÀÂÃÉÈÊÍÓÔÕÚÇ]+)+$/;
const regexEmail = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
const regexCelular = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;

// data de hoje no formato do input date (aaaa-mm-dd)
function dataDeHoje() {
    const hoje = new Date();
    let mes = hoje.getMonth() + 1; // janeiro é 0
    let dia = hoje.getDate();
    if (mes < 10) {
        mes = '0' + mes;
    }
    if (dia < 10) {
        dia = '0' + dia;
    }
    return hoje.getFullYear() + '-' + mes + '-' + dia;
}

// mostra o erro e pinta a borda
function marcarCampo(campo, idErro, mensagem) {
    const erro = document.getElementById(idErro);
    erro.innerHTML = mensagem;
    if (mensagem === '') {
        campo.style.borderColor = '#3ddc97'; // verde
        return true;
    }
    campo.style.borderColor = '#ff5470'; // vermelho
    return false;
}

// rádio e checkbox não têm borda, só mostra a mensagem
function marcarOpcao(idErro, mensagem) {
    document.getElementById(idErro).innerHTML = mensagem;
    return mensagem === '';
}

// uma função pra cada campo

function validarNome() {
    const campo = document.getElementById('nome');
    const valor = campo.value.trim();
    let mensagem = '';
    if (valor === '') {
        mensagem = 'Informe seu nome.';
    } else if (!regexNome.test(valor)) {
        mensagem = 'Digite nome e sobrenome, somente letras.';
    }
    return marcarCampo(campo, 'erroNome', mensagem);
}

function validarEmail() {
    const campo = document.getElementById('email');
    const valor = campo.value.trim();
    let mensagem = '';
    if (valor === '') {
        mensagem = 'Informe seu e-mail.';
    } else if (!regexEmail.test(valor)) {
        mensagem = 'E-mail inválido. Exemplo: nome@email.com';
    }
    return marcarCampo(campo, 'erroEmail', mensagem);
}

function validarCelular() {
    const campo = document.getElementById('celular');
    let mensagem = '';
    if (campo.value === '') {
        mensagem = 'Informe seu celular.';
    } else if (!regexCelular.test(campo.value)) {
        mensagem = 'Celular incompleto. Use (xx) xxxxx-xxxx.';
    }
    return marcarCampo(campo, 'erroCelular', mensagem);
}

function validarEmpresa() {
    const campo = document.getElementById('empresa');
    const valor = campo.value.trim();
    let mensagem = '';
    if (valor === '') {
        mensagem = 'Informe a empresa ou instituição.';
    } else if (valor.length < 2) {
        mensagem = 'Use pelo menos 2 caracteres.';
    }
    return marcarCampo(campo, 'erroEmpresa', mensagem);
}

function validarAssunto() {
    const campo = document.getElementById('assunto');
    let mensagem = '';
    if (campo.value === '') {
        mensagem = 'Escolha um assunto.';
    }
    return marcarCampo(campo, 'erroAssunto', mensagem);
}

function validarConversa() {
    const campo = document.getElementById('conversa');
    let mensagem = '';
    if (campo.value === '') {
        mensagem = 'Escolha uma data.';
    } else if (campo.value <= dataDeHoje()) {
        // nesse formato dá pra comparar como texto
        mensagem = 'Escolha uma data depois de hoje.';
    }
    return marcarCampo(campo, 'erroConversa', mensagem);
}

function validarContato() {
    // null = nenhum marcado
    const marcado = document.querySelector('input[name="contato"]:checked');
    let mensagem = '';
    if (marcado === null) {
        mensagem = 'Escolha como prefere receber a resposta.';
    }
    return marcarOpcao('erroContato', mensagem);
}

function validarTermos() {
    const caixa = document.getElementById('termos');
    let mensagem = '';
    if (!caixa.checked) {
        mensagem = 'É preciso concordar para enviar.';
    }
    return marcarOpcao('erroTermos', mensagem);
}

// roda as 8 e conta os erros
function validarTudo() {
    let erros = 0;
    if (!validarNome()) erros++;
    if (!validarEmail()) erros++;
    if (!validarCelular()) erros++;
    if (!validarEmpresa()) erros++;
    if (!validarAssunto()) erros++;
    if (!validarConversa()) erros++;
    if (!validarContato()) erros++;
    if (!validarTermos()) erros++;

    const aviso = document.getElementById('avisoForm');
    if (erros > 0) {
        aviso.innerHTML = 'Corrija o(s) ' + erros + ' campo(s) em vermelho antes de enviar.';
        aviso.style.display = 'block';
    } else {
        aviso.style.display = 'none';
    }
    return erros;
}

// máscara do celular (xx) xxxxx-xxxx
function mascaraCelular(event) {
    // tira tudo que não é número
    let numeros = event.target.value.replace(/\D/g, '');
    if (numeros.length > 11) {
        numeros = numeros.substring(0, 11);
    }

    let formatado = numeros;
    if (numeros.length > 10) {
        formatado = numeros.replace(/^(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (numeros.length > 6) {
        formatado = numeros.replace(/^(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    } else if (numeros.length > 2) {
        formatado = numeros.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
    } else if (numeros.length > 0) {
        formatado = '(' + numeros;
    }
    event.target.value = formatado;
}

// eventos
document.addEventListener('DOMContentLoaded', function () {

    // máscara enquanto digita
    document.getElementById('celular').addEventListener('keyup', mascaraCelular);

    // valida quando sai do campo
    document.getElementById('nome').addEventListener('blur', validarNome);
    document.getElementById('email').addEventListener('blur', validarEmail);
    document.getElementById('celular').addEventListener('blur', validarCelular);
    document.getElementById('empresa').addEventListener('blur', validarEmpresa);
    document.getElementById('assunto').addEventListener('change', validarAssunto);
    document.getElementById('conversa').addEventListener('change', validarConversa);
    document.getElementById('termos').addEventListener('change', validarTermos);
    const opcoes = document.querySelectorAll('input[name="contato"]');
    for (let i = 0; i < opcoes.length; i++) {
        opcoes[i].addEventListener('change', validarContato);
    }

    // no clique já mostra todos os erros (antes do aviso do navegador)
    document.getElementById('botaoEnviar').addEventListener('click', validarTudo);

    // se tiver erro não envia
    document.getElementById('formContato').addEventListener('submit', function (event) {
        if (validarTudo() > 0) {
            event.preventDefault();
        }
    });

    // limpar: tira as cores e as mensagens
    const campos = ['nome', 'email', 'celular', 'empresa', 'assunto', 'conversa'];
    const erros = ['erroNome', 'erroEmail', 'erroCelular', 'erroEmpresa', 'erroAssunto', 'erroConversa', 'erroContato', 'erroTermos'];
    document.getElementById('botaoLimpar').addEventListener('click', function () {
        for (let i = 0; i < campos.length; i++) {
            document.getElementById(campos[i]).style.borderColor = '';
        }
        for (let i = 0; i < erros.length; i++) {
            document.getElementById(erros[i]).innerHTML = '';
        }
        document.getElementById('avisoForm').style.display = 'none';
    });
});
