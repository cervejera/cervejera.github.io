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

const DATA_ATUALIZACAO = new Date(2026, 10, 16); // 10 = novembro (mês começa em 0)

document.addEventListener('DOMContentLoaded', function () {
    const hoje = new Date();
    const umDia = 1000 * 60 * 60 * 24;
    const dias = Math.floor((hoje - DATA_ATUALIZACAO) / umDia);

    let texto = 'hoje';
    if (dias === 1) {
        texto = 'ontem';
    } else if (dias > 1) {
        texto = 'há ' + dias + ' dias';
    }
    document.getElementById('atualizado').innerHTML = 'atualizado ' + texto;
});
