/**
 * HackSam Digital Solutions — script.js
 * Fonctionnalités : Navbar scroll, Mobile nav, Scroll reveal,
 * Active nav link, Smooth scroll, Back to top, Contact form (Web3Forms)
 */
(function () {
  'use strict';

  /* ═══════════════ 1. NAVBAR SCROLL EFFECT ═══════════════ */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 30);
    }, { passive: true });
  }

  /* ═══════════════ 2. MOBILE NAV TOGGLE ═══════════════ */
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

    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMobile);
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
        closeMobile();
      }
    });
  }
  window.closeMobile = closeMobile;

  /* ═══════════════ 3. SCROLL REVEAL ═══════════════ */
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
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('visible'));
  }

  /* ═══════════════ 4. ACTIVE NAV LINK ON SCROLL ═══════════════ */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  function updateActiveNav() {
    let currentId = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 160) {
        currentId = sec.id;
      }
    });
    navAnchors.forEach(a => {
      const isActive = a.getAttribute('href') === '#' + currentId;
      a.classList.toggle('active', isActive);
    });
  }

  if (sections.length && navAnchors.length) {
    window.addEventListener('scroll', debounce(updateActiveNav, 15), { passive: true });
  }

  /* ═══════════════ 5. SMOOTH SCROLLING ═══════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        closeMobile();
      }
    });
  });

  /* ═══════════════ 6. BACK TO TOP ═══════════════ */
  let backToTopBtn = document.querySelector('.back-to-top');
  if (!backToTopBtn) {
    backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.innerHTML = '↑';
    backToTopBtn.setAttribute('aria-label', 'Retour en haut');
    document.body.appendChild(backToTopBtn);
  }
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  window.addEventListener('scroll', debounce(() => {
    backToTopBtn.classList.toggle('visible', window.scrollY > 500);
  }, 10), { passive: true });

  /* ═══════════════ 7. CONTACT FORM (Web3Forms) ═══════════════ */
  const submitBtn = document.querySelector('.form-submit');
  const formWrap = document.getElementById('contact-form-wrap');
  const formSuccess = document.getElementById('form-success');

  /* ── Inline form validation helpers ── */
  function setFieldError(field, message) {
    if (!field) return;
    const group = field.closest('.form-group');
    if (!group) return;
    field.classList.add('input-error');
    let errorEl = group.querySelector('.field-error');
    if (!errorEl) {
      errorEl = document.createElement('span');
      errorEl.className = 'field-error';
      group.appendChild(errorEl);
    }
    errorEl.textContent = message;
  }

  function clearFieldError(field) {
    if (!field) return;
    field.classList.remove('input-error');
    const group = field.closest('.form-group');
    if (group) {
      const errorEl = group.querySelector('.field-error');
      if (errorEl) errorEl.remove();
    }
  }

  function validateField(field, validator) {
    if (!field) return true;
    clearFieldError(field);
    const message = validator(field.value.trim());
    if (message) {
      setFieldError(field, message);
      return false;
    }
    return true;
  }

  async function handleSubmit() {
    if (!formWrap || !formSuccess || !submitBtn) return;

    const fname = document.getElementById('fname');
    const lname = document.getElementById('lname');
    const email = document.getElementById('email');
    const service = document.getElementById('service');
    const message = document.getElementById('message');

    if (!fname || !email || !message) return;

    let isValid = true;
    isValid = validateField(fname, v => {
      if (!v) return 'Veuillez saisir votre prénom.';
      if (v.length < 2) return 'Le prénom doit contenir au moins 2 caractères.';
      return '';
    }) && isValid;

    if (lname) {
      isValid = validateField(lname, v => {
        if (v && v.length < 2) return 'Le nom doit contenir au moins 2 caractères.';
        return '';
      }) && isValid;
    }

    isValid = validateField(email, v => {
      if (!v) return 'Veuillez saisir votre adresse email.';
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      if (!emailRegex.test(v)) return 'Veuillez entrer une adresse email valide.';
      return '';
    }) && isValid;

    isValid = validateField(message, v => {
      if (!v) return 'Veuillez décrire votre projet.';
      if (v.length < 10) return 'Votre message doit contenir au moins 10 caractères.';
      return '';
    }) && isValid;

    if (!isValid) {
      const firstError = formWrap.querySelector('.input-error');
      if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const fnameVal = fname.value.trim();
    const lnameVal = lname ? lname.value.trim() : '';
    const emailVal = email.value.trim();
    const serviceVal = service ? service.value : '';
    const messageVal = message.value.trim();

    // Real-time validation clear on input
    [fname, lname, email, message].forEach(field => {
      if (field) {
        field.addEventListener('input', () => clearFieldError(field), { once: true });
      }
    });

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span style="display:inline-block;width:16px;height:16px;border:2px solid rgba(255,255,255,0.3);border-top-color:#fff;border-radius:50%;animation:spin 0.6s linear infinite;"></span> Envoi en cours...';

    const accessKey = 'ef1d518a-732f-43cc-b7b3-8a5c2b207ad2';
    const subject = serviceVal
      ? `Nouveau projet HackSam : ${serviceVal}`
      : 'Nouveau message depuis le site HackSam';

    const formData = {
      access_key: accessKey,
      name: `${fnameVal} ${lnameVal}`.trim(),
      email: emailVal,
      service: serviceVal,
      message: messageVal,
      subject: subject
    };

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        formWrap.querySelector('.contact-form').style.display = 'none';
        formSuccess.style.display = 'block';
        if (fname) fname.value = '';
        if (lname) lname.value = '';
        if (email) email.value = '';
        if (service) service.value = '';
        if (message) message.value = '';
      } else {
        throw new Error('Erreur serveur');
      }
    } catch (error) {
      const formAlert = formWrap.querySelector('.form-alert');
      if (formAlert) {
        formAlert.style.display = 'block';
        setTimeout(() => { formAlert.style.display = 'none'; }, 5000);
      }
      console.error('Form error:', error);
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Envoyer le message <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>';
    }
  }

  window.handleSubmit = handleSubmit;
  if (submitBtn) {
    submitBtn.addEventListener('click', handleSubmit);
  }

  /* ═══════════════ UTILITY: DEBOUNCE ═══════════════ */
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

})();