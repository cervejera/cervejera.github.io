// action.js - lê os dados que o formulário mandou pela url (GET)

// 2026-12-20 -> 20/12/2026
function formatarData(data) {
    const partes = data.split('-');
    return partes[2] + '/' + partes[1] + '/' + partes[0];
}

document.addEventListener('DOMContentLoaded', function () {

    // tudo que vem depois do ? na url
    const textoUrl = window.location.search;

    // abriu a página sem enviar nada
    if (textoUrl === '') {
        document.getElementById('semDados').style.display = 'block';
        document.getElementById('tabelaDados').style.display = 'none';
        document.getElementById('urlRecebida').style.display = 'none';
        return;
    }

    document.getElementById('urlRecebida').textContent = 'Dados recebidos na URL: ' + textoUrl;

    // separa os campos (nome=valor)
    const dados = new URLSearchParams(textoUrl);

    // textContent pra não rodar html que venha na url
    document.getElementById('resNome').textContent = dados.get('nome');
    document.getElementById('resEmail').textContent = dados.get('email');
    document.getElementById('resCelular').textContent = dados.get('celular');
    document.getElementById('resEmpresa').textContent = dados.get('empresa');
    document.getElementById('resAssunto').textContent = dados.get('assunto');
    document.getElementById('resConversa').textContent = formatarData(dados.get('conversa'));
    document.getElementById('resContato').textContent = dados.get('contato');

    if (dados.get('termos') === 'Aceito') {
        document.getElementById('resTermos').textContent = 'Aceitos';
    } else {
        document.getElementById('resTermos').textContent = 'Não aceitos';
    }

    // só o primeiro nome
    const primeiroNome = dados.get('nome').split(' ')[0];
    document.getElementById('saudacao').textContent = 'Obrigado, ' + primeiroNome + '! Sua mensagem foi recebida. Confira os dados:';
});
