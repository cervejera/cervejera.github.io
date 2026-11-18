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

const DATA_ATUALIZACAO = new Date(2026, 10, 17); // 10 = novembro (mês começa em 0)
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
