// stack.js - mosaico do stack: o brilho das caixas corre em onda diagonal com a rolagem

document.addEventListener('DOMContentLoaded', function () {
    const stack = document.querySelector('.stack');
    if (!stack || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const caixas = Array.from(stack.querySelectorAll('.ferramenta'));
    stack.classList.add('mosaico');

    let posicoes = [];
    // linha e coluna de cada caixa (4 colunas no computador, 2 no celular)
    function medir() {
        posicoes = caixas.map(function (c) {
            return { linha: Math.round(c.offsetTop / c.offsetHeight), coluna: Math.round(c.offsetLeft / c.offsetWidth) };
        });
    }

    let pedido = false;
    function pintar() {
        pedido = false;
        const r = stack.getBoundingClientRect();
        const alto = window.innerHeight;
        if (r.bottom < 0 || r.top > alto) return;
        // 0 quando o stack entra por baixo, 1 quando sai por cima
        const p = (alto - r.top) / (alto + r.height);
        caixas.forEach(function (c, i) {
            const fase = (posicoes[i].linha + posicoes[i].coluna) * 0.22;
            const onda = 0.5 + 0.5 * Math.sin((p * 1.6 - fase) * Math.PI * 2);
            c.style.setProperty('--brilho', onda.toFixed(3));
        });
    }
    function agendar() {
        if (!pedido) {
            pedido = true;
            requestAnimationFrame(pintar);
        }
    }

    medir();
    pintar();
    window.addEventListener('scroll', agendar, { passive: true });
    window.addEventListener('resize', function () { medir(); agendar(); });
});
