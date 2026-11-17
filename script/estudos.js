// estudos.js - entrada em cascata (estudos e posts)

document.addEventListener('DOMContentLoaded', function () {
    // cada lista ou bloco de aprendizados entra junto, em ordem
    const grupos = document.querySelectorAll('.lista, .aprendizados, .rubrica');
    for (let g = 0; g < grupos.length; g++) {
        const itens = grupos[g].querySelectorAll('.surge');
        if (itens.length === 0) continue;
        const vigia = new IntersectionObserver(function (entradas) {
            if (!entradas.some(function (e) { return e.isIntersecting; })) return;
            vigia.disconnect();
            for (let i = 0; i < itens.length; i++) {
                itens[i].style.setProperty('--atraso', (i * 80) + 'ms');
                itens[i].classList.add('surgiu');
            }
        }, { rootMargin: '-50px' });
        for (let i = 0; i < itens.length; i++) vigia.observe(itens[i]);
    }
});
