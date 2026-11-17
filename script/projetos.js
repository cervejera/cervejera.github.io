// projetos.js - entrada em cascata da grade (o filtro fica no filtro.js)

document.addEventListener('DOMContentLoaded', function () {
    const obras = document.querySelectorAll('#obras .obra');

    // cada card entra 80ms depois do anterior
    const vigia = new IntersectionObserver(function (entradas) {
        if (!entradas.some(function (e) { return e.isIntersecting; })) return;
        vigia.disconnect();
        for (let i = 0; i < obras.length; i++) {
            obras[i].style.setProperty('--atraso', (i * 80) + 'ms');
            obras[i].classList.add('surgiu');
        }
    }, { rootMargin: '-50px' });
    for (let i = 0; i < obras.length; i++) vigia.observe(obras[i]);
});
