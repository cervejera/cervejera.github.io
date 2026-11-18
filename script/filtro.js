// filtro.js - filtra os cards de projeto pela ferramenta (data-tags)

document.addEventListener('DOMContentLoaded', function () {
    const EN = document.documentElement.lang === 'en';
    const barras = document.querySelectorAll('.filtros[data-alvo]');
    for (let b = 0; b < barras.length; b++) {
        const grade = document.getElementById(barras[b].getAttribute('data-alvo'));
        const botoes = barras[b].querySelectorAll('.filtro');
        const obras = grade.querySelectorAll('.obra');
        const limite = Number(grade.getAttribute('data-limite')) || 0;

        function aplicar(tag) {
            // a linha do meio da grade segue os cards visíveis, não a ordem no html
            let visiveis = 0;
            for (let o = 0; o < obras.length; o++) {
                const tags = (obras[o].getAttribute('data-tags') || '').split(' ');
                let mostra = tag === 'todos' || tags.indexOf(tag) !== -1;
                // na página inicial, "todos" mostra só os destaques
                if (tag === 'todos' && limite && o >= limite) mostra = false;
                obras[o].hidden = !mostra;
                obras[o].classList.toggle('coluna-esq', mostra && visiveis % 2 === 0);
                if (mostra) visiveis++;
            }
            grade.classList.add('filtrado');
            recolher();
        }

        // no celular, a grade da página inicial mostra 2 cards e o resto some num degradê
        const botaoMais = document.querySelector('[aria-controls="' + grade.id + '"]');
        const celular = window.matchMedia('(max-width: 600px)');
        function alturaRecolhida(visiveis) {
            const segundo = visiveis[1];
            return segundo.offsetTop - grade.offsetTop + segundo.offsetHeight + 120;
        }
        function recolher() {
            if (!botaoMais) return;
            const visiveis = Array.from(obras).filter(function (o) { return !o.hidden; });
            const aberto = botaoMais.getAttribute('aria-expanded') === 'true';
            const corta = celular.matches && !aberto && visiveis.length > 2;
            grade.style.maxHeight = corta ? alturaRecolhida(visiveis) + 'px' : '';
            grade.classList.toggle('recolhida', corta);
            botaoMais.hidden = !(celular.matches && visiveis.length > 2);
        }
        if (botaoMais) {
            botaoMais.addEventListener('click', function () {
                const abrir = botaoMais.getAttribute('aria-expanded') !== 'true';
                botaoMais.setAttribute('aria-expanded', abrir);
                botaoMais.querySelector('.ver-mais-texto').textContent = abrir ? (EN ? 'see less' : 'ver menos') : (EN ? 'see more' : 'ver mais');
                const visiveis = Array.from(obras).filter(function (o) { return !o.hidden; });
                if (abrir) {
                    grade.classList.remove('recolhida');
                    nav.altura(grade, grade.scrollHeight, true, recolher);
                } else {
                    // fecha segurando o botão no lugar
                    nav.ancorar(botaoMais);
                    grade.classList.add('recolhida');
                    nav.altura(grade, alturaRecolhida(visiveis), false, recolher);
                }
            });
            celular.addEventListener('change', recolher);
            window.addEventListener('resize', recolher);
        }

        for (let i = 0; i < botoes.length; i++) {
            botoes[i].addEventListener('click', function () {
                for (let k = 0; k < botoes.length; k++) botoes[k].classList.toggle('ativo', k === i);
                // a barra de filtros não sai do lugar quando a grade muda de tamanho
                if (window.nav) nav.ancorar(barras[b], 200);
                aplicar(botoes[i].getAttribute('data-filtro'));
            });
        }
        aplicar('todos');
    }
});
