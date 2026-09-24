// ============================================
// scripts.js
// ============================================

// ----- HEADLINE (animação de palavras com clip) -----
(function () {
  var headline = document.querySelector('.cd-headline.clip');
  if (!headline) { console.log('headline: NAO achei .cd-headline.clip'); return; }

  var wrapper = headline.querySelector('.cd-words-wrapper');
  if (!wrapper) { console.log('headline: NAO achei .cd-words-wrapper'); return; }

  var palavras = wrapper.querySelectorAll('b');
  console.log('headline OK:', palavras.length, 'palavras');

  var indice = 0;
  var T_ANIM = 600;
  var PAUSA  = 1500;

  wrapper.style.transition = 'none';

  function animar(de, para, cb) {
    var ini = performance.now();
    function passo() {
      var p = Math.min((performance.now() - ini) / T_ANIM, 1);
      wrapper.style.width = (de + (para - de) * p) + 'px';
      if (p < 1) requestAnimationFrame(passo);
      else cb();
    }
    requestAnimationFrame(passo);
  }

  function ciclo() {
    var larguraAtual = wrapper.getBoundingClientRect().width;
    if (larguraAtual < 5) {
      setTimeout(ciclo, 400);
      return;
    }

    // 1) encolhe (linha vai da direita p/ esquerda, apagando)
    animar(larguraAtual, 2, function () {
      // 2) troca palavra
      palavras[indice].classList.remove('is-visible');
      indice = (indice + 1) % palavras.length;
      palavras[indice].classList.add('is-visible');
      void wrapper.offsetWidth;

      // 3) expande (linha vai da esquerda p/ direita, revelando)
      var novaLargura = palavras[indice].offsetWidth + 10;
      animar(2, novaLargura, function () {
        setTimeout(ciclo, PAUSA);
      });
    });
  }

  setTimeout(ciclo, PAUSA);
})();

// ----- SANFONA (troca de seções com animação) -----
var label = document.getElementsByClassName("label-secao");
var i, j;
var animando = false;

for (i = 0; i < label.length; i++) {
  label[i].addEventListener("click", function () {

    if (animando) return;
    if (this.classList.contains("sec-ativa")) return;

    var clicado = this;
    animando = true;

    // 1) Espera Xms antes de começar a deslizar
    setTimeout(function () {

      // 2) Título começa a sair (leva Xms)
      var tituloSaindo = clicado.querySelector('.ttl-b');
      if (tituloSaindo) tituloSaindo.classList.add('saindo');

      setTimeout(function () {
        // 3) Limpa a classe e troca a guia ativa
        if (tituloSaindo) tituloSaindo.classList.remove('saindo');

        for (j = 0; j < label.length; j++) {
          label[j].classList.remove('sec-ativa');
        }
        clicado.classList.add('sec-ativa');

        // 4) Libera cliques depois do conteúdo entrar (Xms)
        setTimeout(function () {
          animando = false;
        }, 600);

      }, 750);

    }, 200);
  });
}

// ----- PRECARREGAMENTO -----
function updateDots() {
  var dots = document.getElementById("dots");
  if (!dots) return;
  if (dots.textContent.length === 3) {
    dots.textContent = "";
  } else {
    dots.textContent += ".";
  }
}
setInterval(updateDots, 333);

function esconderSobreposicao() {
  var sobreposicao = document.querySelector("#precarregamento");
  if (!sobreposicao) return;
  var tempoMinimo = 1000;
  var tempoInicio = Date.now();
  window.addEventListener("load", function () {
    var tempoRestante = tempoMinimo - (Date.now() - tempoInicio);
    if (tempoRestante > 0) {
      setTimeout(function () { sobreposicao.style.display = "none"; }, tempoRestante);
    } else {
      sobreposicao.style.display = "none";
    }
  });
}
esconderSobreposicao();

// ----- COPY (ano no rodapé) -----
var anoAtualElement = document.getElementById("ano-atual");
if (anoAtualElement) {
  var anoAtual = new Date().getFullYear();
  anoAtualElement.innerHTML =
    '<a href="licenca-agplv3.html" title="Visualizar licença AGPLv3" target="_blank" rel="noopener noreferrer">' +
    '© ' + anoAtual + ' Bruno Moraes &nbsp;|&nbsp;AGPL-3.0 license</a>';
}