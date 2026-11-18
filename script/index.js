// index.js - página única

document.addEventListener('DOMContentLoaded', function () {
    const EN = document.documentElement.lang === 'en';

    // cargos abrem e fecham
    const cargos = document.querySelectorAll('.xp-cargo');
    for (let i = 0; i < cargos.length; i++) {
        const topo = cargos[i].querySelector('.cargo-topo');
        topo.addEventListener('click', function () {
            const abrir = !cargos[i].classList.contains('aberto');
            nav.ancorar(topo, 380);
            cargos[i].classList.toggle('aberto', abrir);
            // depois de abrir, rola só o necessário pra ver o texto
            if (abrir) {
                setTimeout(function () {
                    nav.mostrar(cargos[i].querySelector('.descricao'), topo);
                }, 400);
            }
        });
    }
    // o primeiro já começa aberto
    if (cargos.length > 0) {
        cargos[0].classList.add('aberto');
    }

    // demais experiências: "ver mais" abre
    const xpExtra = document.getElementById('xpExtra');
    const botaoXp = document.getElementById('verXp');
    botaoXp.addEventListener('click', function () {
        const abrir = !xpExtra.classList.contains('aberto');
        botaoXp.setAttribute('aria-expanded', abrir);
        botaoXp.querySelector('.ver-mais-texto').textContent = abrir ? (EN ? 'see less' : 'ver menos') : (EN ? 'see more' : 'ver mais');
        if (abrir) {
            xpExtra.classList.add('aberto');
            nav.altura(xpExtra, xpExtra.scrollHeight, true);
        } else {
            // fecha segurando o botão no lugar
            nav.ancorar(botaoXp);
            xpExtra.classList.remove('aberto');
            nav.altura(xpExtra, 150, false);
        }
    });

    // cursos da unifael: abrem no clique
    const cursosFael = document.getElementById('cursosFael');
    const botaoFael = document.getElementById('verFael');
    cursosFael.inert = true;
    botaoFael.addEventListener('click', function () {
        const abrir = !cursosFael.classList.contains('aberto');
        cursosFael.classList.toggle('aberto', abrir);
        cursosFael.inert = !abrir;
        botaoFael.setAttribute('aria-expanded', abrir);
        botaoFael.querySelector('.ver-mais-texto').textContent = abrir ? (EN ? 'see less' : 'ver menos') : (EN ? 'see more' : 'ver mais');
        if (abrir) {
            nav.altura(cursosFael, cursosFael.scrollHeight, true, function () {
                nav.mostrar(botaoFael);
            });
        } else {
            nav.ancorar(botaoFael);
            nav.altura(cursosFael, 0, false);
        }
    });

    // diploma: abre na janela flutuante, fecha no x, no esc ou clicando fora
    const janela = document.getElementById('janelaDiploma');
    document.getElementById('abrirDiploma').addEventListener('click', function () {
        janela.showModal();
    });
    document.getElementById('fecharDiploma').addEventListener('click', function () {
        janela.close();
    });
    janela.addEventListener('click', function (e) {
        if (e.target === janela) janela.close();
    });

    // linha do tempo
    // uma "linha de leitura" fixa na tela (70% da altura - 100px).
    // onde ela cruza a linha tracejada aparece uma faixa de luz, mais forte quando se rola rápido.
    // a bolinha desce pela linha da empresa e corre pela curva de cada cargo.
    // os tracinhos andam devagar o tempo todo.
    const linhas = document.querySelectorAll('.xp-linha');
    const ligacoes = document.querySelectorAll('.xp-cargo');
    const secaoXp = document.querySelector('.xp');
    const menosMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let ultimoY = window.scrollY;
    let ultimoTempo = performance.now();
    let velocidade = 0;    // 0 a 1
    let deslocamento = 0;  // posição dos tracinhos
    let rodando = false;

    function leitura(fracao) {
        return window.innerHeight * fracao - 100;
    }

    function limitar(valor) {
        return Math.min(Math.max(valor, 0), 1);
    }

    // aparece rápido no começo e some no fim do trajeto
    function opacidadeDaPonta(p) {
        if (p <= 0 || p >= 1) return 0;
        if (p < 0.05) return p / 0.05;
        if (p > 0.9) return (1 - p) / 0.1;
        return 1;
    }

    function mascara(centro, largura) {
        return 'linear-gradient(to bottom, transparent ' + (centro - largura) + 'px, black ' + centro + 'px, transparent ' + (centro + largura) + 'px)';
    }

    function quadro(agora) {
        const tempo = agora - ultimoTempo;
        ultimoTempo = agora;

        // velocidade da rolagem, suavizada
        const y = window.scrollY;
        const pxPorSegundo = tempo > 0 ? Math.abs(y - ultimoY) / tempo * 1000 : 0;
        ultimoY = y;
        velocidade += (Math.min(pxPorSegundo / 1200, 1) - velocidade) * 0.08;

        // tracinhos andando: um pouco com o tempo, um pouco com a rolagem
        deslocamento = (y * 0.004 + agora * 0.004) % 8;

        const alvo = leitura(0.7);
        const largura = 72 + 24 * velocidade;
        const brilho = 0.4 + 0.6 * velocidade;

        for (let i = 0; i < linhas.length; i++) {
            const caixa = linhas[i].getBoundingClientRect();
            const luz = linhas[i].querySelector('.xp-luz');
            const bolinha = linhas[i].querySelector('.xp-bolinha');
            const p = limitar((alvo - caixa.top) / caixa.height);

            linhas[i].style.backgroundPositionY = deslocamento + 'px';
            luz.style.backgroundPositionY = deslocamento + 'px';
            luz.style.webkitMaskImage = luz.style.maskImage = mascara(alvo - caixa.top, largura);
            luz.style.opacity = brilho;
            bolinha.style.top = (p * 100) + '%';
            bolinha.style.opacity = opacidadeDaPonta(p);
        }

        for (let i = 0; i < ligacoes.length; i++) {
            const curva = ligacoes[i].querySelector('.ligacao');
            const luz = ligacoes[i].querySelector('.ligacao-luz');
            const pingo = curva.querySelector('.pingo');
            const caixa = curva.getBoundingClientRect();
            // a curva é curta, então o trajeto dela é esticado
            const p = limitar((alvo - caixa.top) / (caixa.height + alvo - leitura(0.6)));

            curva.querySelector('path').style.strokeDashoffset = -deslocamento;
            luz.querySelector('path').style.strokeDashoffset = -deslocamento;
            luz.style.webkitMaskImage = luz.style.maskImage = mascara(alvo - caixa.top, largura);
            luz.style.opacity = brilho;
            pingo.style.offsetDistance = (p * 100) + '%';
            pingo.style.opacity = opacidadeDaPonta(p);
        }

        if (rodando) {
            requestAnimationFrame(quadro);
        }
    }

    // só anima enquanto a experiência está na tela
    if (!menosMovimento && secaoXp) {
        const vigia = new IntersectionObserver(function (itens) {
            const visivel = itens[0].isIntersecting;
            if (visivel && !rodando) {
                rodando = true;
                ultimoTempo = performance.now();
                requestAnimationFrame(quadro);
            } else if (!visivel) {
                rodando = false;
            }
        });
        vigia.observe(secaoXp);
    }

    // a entrada dos cards fica no revela.js
});
