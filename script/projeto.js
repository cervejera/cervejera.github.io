// projeto.js - página de cada projeto: gráfico de atividade e entrada em cascata

document.addEventListener('DOMContentLoaded', function () {
    const svgNs = 'http://www.w3.org/2000/svg';
    const LARGURA = 100;
    const ALTURA = 32;

    // 52 semanas, média com os vizinhos e raiz quadrada (os picos não esmagam o resto)
    function suavizar(valores) {
        return valores.map(function (v, n) {
            const vizinhos = valores.slice(Math.max(0, n - 1), n + 2);
            return vizinhos.reduce(function (s, x) { return s + x; }, 0) / vizinhos.length;
        });
    }

    const graficos = document.querySelectorAll('.grafico');
    for (let i = 0; i < graficos.length; i++) {
        const svg = graficos[i];
        const valores = suavizar(svg.getAttribute('data-pontos').split(',').map(Number)).map(Math.sqrt);
        const maior = Math.max.apply(null, valores.concat(1));
        const passo = LARGURA / (valores.length - 1);
        const pontos = valores.map(function (v, n) {
            return { x: n * passo, y: ALTURA - v / maior * 30 - 1 };
        });
        svg.pontos = pontos;

        let caminho = '';
        for (let n = 0; n < pontos.length; n++) {
            const p = pontos[n];
            if (n === 0) {
                caminho = 'M' + p.x + ' ' + p.y.toFixed(2);
            } else {
                const antes = pontos[n - 1];
                const meio = ((antes.x + p.x) / 2).toFixed(2);
                caminho += ' C' + meio + ' ' + antes.y.toFixed(2) + ' ' + meio + ' ' + p.y.toFixed(2) + ' ' + p.x.toFixed(2) + ' ' + p.y.toFixed(2);
            }
        }

        const id = 'g' + i;
        svg.innerHTML = '<defs>' +
            '<linearGradient id="' + id + 'a" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="#3ecf8e" stop-opacity=".22"/><stop offset="100%" stop-color="#3ecf8e" stop-opacity="0"/></linearGradient>' +
            '<linearGradient id="' + id + 'l" gradientUnits="userSpaceOnUse" x1="0" x2="' + LARGURA + '" y1="0" y2="0"><stop offset="0%" stop-color="#3ecf8e" stop-opacity=".15"/><stop offset="100%" stop-color="#3ecf8e" stop-opacity=".9"/></linearGradient>' +
            '</defs>';

        const area = document.createElementNS(svgNs, 'path');
        area.setAttribute('d', caminho + ' L' + LARGURA + ' ' + ALTURA + ' L0 ' + ALTURA + ' Z');
        area.setAttribute('fill', 'url(#' + id + 'a)');
        svg.appendChild(area);

        const traco = document.createElementNS(svgNs, 'path');
        traco.setAttribute('class', 'traco');
        traco.setAttribute('d', caminho);
        traco.setAttribute('stroke', 'url(#' + id + 'l)');
        svg.appendChild(traco);

        // cursor: encaixa na semana mais próxima
        const caixaGrafico = svg.closest('.atividade');
        const linha = document.createElement('span');
        const ponto = document.createElement('span');
        linha.className = 'cursor-grafico';
        ponto.className = 'ponto-grafico';
        caixaGrafico.appendChild(linha);
        caixaGrafico.appendChild(ponto);

        caixaGrafico.addEventListener('pointermove', function (evento) {
            const caixa = svg.getBoundingClientRect();
            const fracao = Math.min(Math.max((evento.clientX - caixa.left) / caixa.width, 0), 1);
            const p = svg.pontos[Math.round(fracao * (svg.pontos.length - 1))];
            const x = p.x / LARGURA * caixa.width;
            linha.style.left = x + 'px';
            ponto.style.left = x + 'px';
            ponto.style.top = (p.y / ALTURA * caixa.height) + 'px';
            caixaGrafico.classList.add('mirando');
        });
        caixaGrafico.addEventListener('pointerleave', function () {
            caixaGrafico.classList.remove('mirando');
        });

        // desenha quando aparece (observa a caixa, porque o svg começa recortado)
        const vigiaGrafico = new IntersectionObserver(function (entradas) {
            if (!entradas[0].isIntersecting) return;
            svg.classList.add('visivel');
            vigiaGrafico.disconnect();
        }, { threshold: 0.6 });
        vigiaGrafico.observe(caixaGrafico);
    }

    // entrada em cascata: cada grupo entra junto, 80ms entre os itens
    const grupos = document.querySelectorAll('.lista, .aprendizados');
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
