// rodape.js - "atualizado há x dias" do rodapé

// toda página abre no começo (no app do claude o scroll da página anterior ficava)
if (!location.hash) {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.addEventListener('load', function () {
        document.documentElement.style.scrollBehavior = 'auto';
        window.scrollTo(0, 0);
        document.body.scrollIntoView({ block: 'start' });
        document.documentElement.style.scrollBehavior = '';
    });
}

const DATA_ATUALIZACAO = new Date(2026, 10, 18); // 10 = novembro (mês começa em 0)
const EN = document.documentElement.lang === 'en';

document.addEventListener('DOMContentLoaded', function () {
    const hoje = new Date();
    const umDia = 1000 * 60 * 60 * 24;
    const dias = Math.floor((hoje - DATA_ATUALIZACAO) / umDia);

    let texto = EN ? 'today' : 'hoje';
    if (dias === 1) {
        texto = EN ? 'yesterday' : 'ontem';
    } else if (dias > 1) {
        texto = EN ? dias + ' days ago' : 'há ' + dias + ' dias';
    }
    document.getElementById('atualizado').innerHTML = (EN ? 'updated ' : 'atualizado ') + texto;
});

// tema claro/escuro: botão ao lado de PT/EN, a escolha fica salva no navegador
document.addEventListener('DOMContentLoaded', function () {
    const nav = document.querySelector('.idioma');
    if (!nav) return;
    const raiz = document.documentElement;
    const botao = document.createElement('button');
    botao.type = 'button';
    botao.className = 'tema';
    botao.innerHTML = '<svg class="lua" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z"/></svg>' +
        '<svg class="sol" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
    function rotulo() {
        const claro = raiz.dataset.tema === 'claro';
        const t = claro ? (EN ? 'Switch to dark theme' : 'Mudar para o tema escuro') : (EN ? 'Switch to light theme' : 'Mudar para o tema claro');
        botao.setAttribute('aria-label', t);
        botao.title = t;
    }
    rotulo();
    botao.addEventListener('click', function () {
        if (raiz.dataset.tema === 'claro') delete raiz.dataset.tema; else raiz.dataset.tema = 'claro';
        try { localStorage.setItem('tema', raiz.dataset.tema || 'escuro'); } catch (e) {}
        rotulo();
    });
    nav.appendChild(botao);
});
