// about.js - botão mostrar/esconder detalhes

document.addEventListener('DOMContentLoaded', function () {
    const EN = document.documentElement.lang === 'en';
    const botao = document.getElementById('botaoDetalhes');
    const detalhes = document.getElementById('detalhes');

    botao.addEventListener('click', function () {
        if (detalhes.style.display === 'block') {
            detalhes.style.display = 'none';
            botao.innerHTML = EN ? 'show details' : 'mostrar detalhes';
        } else {
            detalhes.style.display = 'block';
            botao.innerHTML = EN ? 'hide details' : 'esconder detalhes';
        }
    });
});
