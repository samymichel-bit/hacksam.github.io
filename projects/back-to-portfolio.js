/**
 * back-to-portfolio.js — Composant partagé "Retour au portfolio"
 * Injecte automatiquement un lien flottant vers la page principale du portfolio.
 * Utilisation : <script src="back-to-portfolio.js"></script>
 */
(function () {
  'use strict';
  var link = document.createElement('a');
  link.href = '../index.html';
  link.setAttribute('aria-label', 'Retour au portfolio');
  link.title = 'Retour au portfolio';
  link.style.cssText =
    'position:fixed;' +
    'bottom:24px;left:24px;z-index:9999;' +
    'display:inline-flex;align-items:center;gap:8px;' +
    'padding:0.6rem 1.2rem;border-radius:100px;' +
    'background:rgba(0,0,0,0.8);backdrop-filter:blur(12px);' +
    '-webkit-backdrop-filter:blur(12px);' +
    'border:1px solid rgba(255,255,255,0.15);' +
    'color:#fff;font-size:0.82rem;font-weight:600;' +
    'text-decoration:none;box-shadow:0 4px 16px rgba(0,0,0,0.25);' +
    'transition:background .25s ease, border-color .25s ease;';
  link.innerHTML = '&#8592; Portfolio';
  link.addEventListener('mouseenter', function () {
    link.style.background = 'rgba(0,0,0,0.95)';
    link.style.borderColor = 'rgba(255,255,255,0.3)';
  });
  link.addEventListener('mouseleave', function () {
    link.style.background = 'rgba(0,0,0,0.8)';
    link.style.borderColor = 'rgba(255,255,255,0.15)';
  });
  document.body.appendChild(link);
})();
