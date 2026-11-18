// imagens.js - clicar numa imagem abre ela grande
// imagem alta (infográfico) ocupa a tela toda com rolagem

document.addEventListener('DOMContentLoaded', function () {
    const imagens = Array.from(document.querySelectorAll('.figura img, .peca-img img, .capa-grande img'));
    if (!imagens.length) return;

    const visor = document.createElement('dialog');
    visor.className = 'visor';
    const EN = document.documentElement.lang === 'en';
    visor.setAttribute('aria-label', EN ? 'enlarged image' : 'imagem ampliada');
    visor.innerHTML =
        '<div class="visor-palco"><img alt=""><p class="visor-legenda mono"></p></div>' +
        '<button class="visor-fechar" type="button" aria-label="' + (EN ? 'Close' : 'Fechar') + '">&times;</button>' +
        '<button class="visor-seta visor-ant" type="button" aria-label="' + (EN ? 'Previous image' : 'Imagem anterior') + '">&lsaquo;</button>' +
        '<button class="visor-seta visor-prox" type="button" aria-label="' + (EN ? 'Next image' : 'Próxima imagem') + '">&rsaquo;</button>';
    document.body.appendChild(visor);

    const palco = visor.querySelector('.visor-palco');
    const foto = palco.querySelector('img');
    const legenda = palco.querySelector('.visor-legenda');
    let atual = 0;

    if (imagens.length < 2) visor.classList.add('sozinha');

    function legendaDe(img) {
        const caixa = img.closest('figure, .peca');
        const texto = caixa && caixa.querySelector('figcaption, p');
        return (texto ? texto.textContent : img.alt).trim();
    }

    // alta = mais de 1,3x mais alta que larga
    foto.addEventListener('load', function () {
        visor.classList.toggle('alta', foto.naturalHeight > foto.naturalWidth * 1.3);
        palco.scrollTop = 0;
    });

    function mostrar(n) {
        atual = (n + imagens.length) % imagens.length;
        const img = imagens[atual];
        foto.src = img.currentSrc || img.src;
        foto.alt = img.alt;
        legenda.textContent = legendaDe(img);
    }

    function abrir(n) {
        mostrar(n);
        document.documentElement.classList.add('visor-aberto');
        visor.showModal();
    }

    imagens.forEach(function (img, n) {
        const alvo = img.closest('a') || img;
        img.classList.add('ampliavel');
        alvo.addEventListener('click', function (e) {
            e.preventDefault();
            abrir(n);
        });
    });

    visor.querySelector('.visor-fechar').addEventListener('click', function () { visor.close(); });
    visor.querySelector('.visor-ant').addEventListener('click', function () { mostrar(atual - 1); });
    visor.querySelector('.visor-prox').addEventListener('click', function () { mostrar(atual + 1); });
    visor.addEventListener('close', function () {
        document.documentElement.classList.remove('visor-aberto');
    });

    // clicar fora da imagem fecha
    visor.addEventListener('click', function (e) {
        if (e.target === visor || e.target === palco) visor.close();
    });

    visor.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft') mostrar(atual - 1);
        if (e.key === 'ArrowRight') mostrar(atual + 1);
    });

    // no celular, arrastar pro lado troca de imagem
    let inicioX = null;
    let inicioY = null;
    palco.addEventListener('touchstart', function (e) {
        inicioX = e.touches[0].clientX;
        inicioY = e.touches[0].clientY;
    }, { passive: true });
    palco.addEventListener('touchend', function (e) {
        if (inicioX === null) return;
        const dx = e.changedTouches[0].clientX - inicioX;
        const dy = e.changedTouches[0].clientY - inicioY;
        if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) mostrar(atual + (dx < 0 ? 1 : -1));
        inicioX = null;
    });
});
