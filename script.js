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
      a.classList.toggle('active', isActive);
    });
  }

  if (sections.length && navAnchors.length) {
    window.addEventListener('scroll', debounce(updateActiveNav, 10), { passive: true });
  }

  /* ──────────────────────────────────────────────
     6. SMOOTH SCROLLING
  ────────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      const target = document.querySelector(targetId);
      
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        // Close mobile nav if open
        closeMobile();
      }
    });
  });

  /* ──────────────────────────────────────────────
     7. BACK TO TOP BUTTON
  ────────────────────────────────────────────── */
  let backToTopBtn = document.querySelector('.back-to-top');
  if (!backToTopBtn) {
    backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.innerHTML = '↑';
    backToTopBtn.setAttribute('aria-label', 'Retour en haut');
    backToTopBtn.setAttribute('title', 'Retour en haut de page');
    document.body.appendChild(backToTopBtn);
  }

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('scroll', debounce(() => {
    backToTopBtn.classList.toggle('visible', window.scrollY > 400);
  }, 10), { passive: true });

  // Debounce utility
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

  /* ──────────────────────────────────────────────
     5. CONTACT FORM HANDLER
  ────────────────────────────────────────────── */
  const submitBtn  = document.querySelector('.form-submit');
  const formWrap   = document.getElementById('contact-form-wrap');
  const formSuccess = document.getElementById('form-success');

  async function handleSubmit() {
    if (!formWrap || !formSuccess || !submitBtn) return;

    // Get all form fields
    const fname = document.getElementById('fname');
    const lname = document.getElementById('lname');
    const email = document.getElementById('email');
    const service = document.getElementById('service');
    const message = document.getElementById('message');

    if (!fname || !email || !message) return;

    const fnameVal = fname.value.trim();
    const lnameVal = lname ? lname.value.trim() : '';
    const emailVal = email.value.trim();
    const serviceVal = service ? service.value : '';
    const messageVal = message.value.trim();

    // Enhanced validation
    if (!fnameVal || !emailVal || !messageVal) {
      alert('Veuillez remplir les champs obligatoires: prénom, email et message.');
      return;
    }

  
    if (!emailVal.includes('@')) {
      alert('Veuillez entrer une adresse email valide.');
      return;
    }

    // Set loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Envoi... <span class="spinner"></span>';

    const accessKey = 'ef1d518a-732f-43cc-b7b3-8a5c2b207ad2';
    const subject = serviceVal ? `Nouveau message - ${serviceVal.charAt(0).toUpperCase() + serviceVal.slice(1)}` : 'Nouveau message depuis le portfolio';
    
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
        formWrap.style.display = 'none';
        formSuccess.style.display = 'block';
        // Reset form
        if (fname) fname.value = '';
        if (lname) lname.value = '';
        if (email) email.value = '';
        if (service) service.value = '';
        if (message) message.value = '';
      } else {
        throw new Error('Erreur serveur');
      }
    } catch (error) {
      alert('Erreur lors de l\'envoi. Veuillez réessayer ou me contacter par WhatsApp.');
      console.error('Form error:', error);
    } finally {
      // Reset button
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Envoyer le message\\n              <svg width=\\"16\\" height=\\"16\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2.5\\" aria-hidden=\\"true\\"><path d=\\"M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z\\"/></svg>';
    }
  }

  // Expose for the inline onclick on the button
  window.handleSubmit = handleSubmit;

  if (submitBtn) {
    submitBtn.addEventListener('click', handleSubmit);
  }

})();
