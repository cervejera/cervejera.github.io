// revela.js - conteúdo sobe flutuando e ganha opacidade quando entra na tela
// cada bloco aparece na hora que chega na rolagem; os que entram juntos vêm em cascata

document.addEventListener('DOMContentLoaded', function () {
    const alvos = '.obra, .aprendizado, .lista-item, .itens > .item, .figura, .peca, .resumo > div, .aprendi-col, .devolutiva blockquote, .codigo, .post > p, .entregas li, .posts > .post-card';
    document.querySelectorAll(alvos).forEach(function (el) { el.classList.add('surge'); });
    const itens = Array.from(document.querySelectorAll('.surge'));

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
        itens.forEach(function (el) { el.classList.add('surgiu'); });
        return;
    }

    const vigia = new IntersectionObserver(function (entradas) {
        const novos = entradas.filter(function (e) { return e.isIntersecting; }).map(function (e) { return e.target; });
        // ordem de leitura: linha de cima primeiro, depois da esquerda pra direita
        novos.sort(function (a, b) {
            const ra = a.getBoundingClientRect();
            const rb = b.getBoundingClientRect();
            return Math.abs(ra.top - rb.top) < 40 ? ra.left - rb.left : ra.top - rb.top;
        });
        novos.forEach(function (el, i) {
            el.style.setProperty('--atraso', Math.min(i * 90, 450) + 'ms');
            el.classList.add('surgiu');
            vigia.unobserve(el);
        });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    itens.forEach(function (el) { vigia.observe(el); });
});
