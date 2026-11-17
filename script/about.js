// about.js - botão mostrar/esconder detalhes

document.addEventListener('DOMContentLoaded', function () {
    const botao = document.getElementById('botaoDetalhes');
    const detalhes = document.getElementById('detalhes');

    botao.addEventListener('click', function () {
        if (detalhes.style.display === 'block') {
            detalhes.style.display = 'none';
            botao.innerHTML = 'mostrar detalhes';
        } else {
            detalhes.style.display = 'block';
            botao.innerHTML = 'esconder detalhes';
        }
    });
});
