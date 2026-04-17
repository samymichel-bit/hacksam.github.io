/**
 * HackSam Portfolio — script.js
 * Auteur : Samy Michel
 *
 * Sections :
 *   1. Navbar scroll effect
 *   2. Mobile nav toggle
 *   3. Scroll reveal (IntersectionObserver)
 *   4. Active nav link on scroll
 *   5. Contact form handler
 */

(function () {
  'use strict';

  /* ──────────────────────────────────────────────
     1. NAVBAR SCROLL EFFECT
  ────────────────────────────────────────────── */
  const navbar = document.getElementById('navbar');

  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 30);
    }, { passive: true });
  }

  /* ──────────────────────────────────────────────
     2. MOBILE NAV TOGGLE
  ────────────────────────────────────────────── */
  const navToggle = document.getElementById('navToggle');
  const mobileNav = document.getElementById('mobileNav');

  function closeMobile() {
    if (!navToggle || !mobileNav) return;
    navToggle.classList.remove('open');
    mobileNav.classList.remove('open');
    document.body.style.overflow = '';
    navToggle.setAttribute('aria-expanded', 'false');
  }

  if (navToggle && mobileNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close mobile nav when a link is tapped
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMobile);
    });

    // Close on Escape key
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
        closeMobile();
      }
    });
  }

  // Expose for inline onclick fallback (legacy support)
  window.closeMobile = closeMobile;

  /* ──────────────────────────────────────────────
     3. SCROLL REVEAL (IntersectionObserver)
  ────────────────────────────────────────────── */
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback for older browsers
    revealElements.forEach(el => el.classList.add('visible'));
  }

  /* ──────────────────────────────────────────────
     4. ACTIVE NAV LINK ON SCROLL
  ────────────────────────────────────────────── */
  const sections   = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  function updateActiveNav() {
    let currentId = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 140) {
        currentId = sec.id;
      }
    });

    navAnchors.forEach(a => {
      const isActive = a.getAttribute('href') === '#' + currentId;
      a.style.color = isActive ? 'var(--text)' : '';
    });
  }

  if (sections.length && navAnchors.length) {
    window.addEventListener('scroll', updateActiveNav, { passive: true });
  }

  /* ──────────────────────────────────────────────
     5. CONTACT FORM HANDLER
  ────────────────────────────────────────────── */
  const submitBtn  = document.querySelector('.form-submit');
  const formWrap   = document.getElementById('contact-form-wrap');
  const formSuccess = document.getElementById('form-success');

  function handleSubmit() {
    if (!formWrap || !formSuccess) return;

    const fname   = document.getElementById('fname');
    const email   = document.getElementById('email');
    const message = document.getElementById('message');

    if (!fname || !email || !message) return;

    const fnameVal   = fname.value.trim();
    const emailVal   = email.value.trim();
    const messageVal = message.value.trim();

    // Basic validation
    if (!fnameVal || !emailVal || !messageVal) {
      alert('Veuillez remplir au moins votre prénom, email et message.');
      return;
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailVal)) {
      alert('Veuillez entrer une adresse email valide.');
      return;
    }

    // NOTE: Pour la production, remplacez cette section par un appel
    // vers un service comme Formspree (https://formspree.io) ou EmailJS.
    // Exemple Formspree :
    //   fetch('https://formspree.io/f/YOUR_FORM_ID', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ name: fnameVal, email: emailVal, message: messageVal })
    //   });

    formWrap.style.display = 'none';
    formSuccess.style.display = 'block';
  }

  // Expose for the inline onclick on the button
  window.handleSubmit = handleSubmit;

  if (submitBtn) {
    submitBtn.addEventListener('click', handleSubmit);
  }

})();
