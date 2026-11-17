// navegacao.js - abre e fecha sem a tela pular

window.nav = (function () {
    const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)');
    const curva = 'cubic-bezier(.2, .7, .2, 1)';
    let ancoraAtual = 0;

    function duracao() {
        return reduzido.matches ? 0 : 420;
    }

    // segura o elemento no mesmo ponto da tela enquanto o layout muda
    function ancorar(el, ms) {
        const html = document.documentElement;
        const topo = el.getBoundingClientRect().top;
        const fim = performance.now() + (ms || duracao()) + 60;
        const id = ++ancoraAtual;
        html.style.scrollBehavior = 'auto';
        function passo(agora) {
            if (id !== ancoraAtual) return;
            const dif = el.getBoundingClientRect().top - topo;
            if (Math.abs(dif) > 0.5) window.scrollBy(0, dif);
            if (agora < fim) {
                requestAnimationFrame(passo);
            } else {
                html.style.scrollBehavior = '';
            }
        }
        requestAnimationFrame(passo);
    }

    // anima a altura até "para" (px); abrir = solta a altura no fim
    function altura(el, para, abrir, fim) {
        const ms = duracao();
        clearTimeout(el._navTempo);
        el.style.transition = 'none';
        el.style.maxHeight = el.getBoundingClientRect().height + 'px';
        el.offsetHeight; // força o layout antes de animar
        el.style.transition = 'max-height ' + ms + 'ms ' + curva;
        el.style.maxHeight = para + 'px';
        el._navTempo = setTimeout(function () {
            el.style.transition = '';
            if (abrir) el.style.maxHeight = 'none';
            if (fim) fim();
            window.dispatchEvent(new Event('scroll'));
        }, ms + 30);
    }

    // rola suave só se o elemento ficou pra fora da tela
    function mostrar(el, topoDe) {
        const r = el.getBoundingClientRect();
        const alto = window.innerHeight;
        const folga = 32;
        const limite = (topoDe || el).getBoundingClientRect().top - 80;
        let dif = 0;
        if (r.bottom > alto - folga) dif = Math.min(r.bottom - alto + folga, limite);
        if (dif > 0) window.scrollBy({ top: dif, behavior: reduzido.matches ? 'auto' : 'smooth' });
    }

    return { ancorar: ancorar, altura: altura, mostrar: mostrar, duracao: duracao };
})();
