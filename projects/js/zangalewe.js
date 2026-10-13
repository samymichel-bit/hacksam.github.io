// ── NAV SCROLL ──
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  // ── BURGER MENU ──
  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobileMenu');
  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });
  function closeMobile() {
    burger.classList.remove('open');
    mobileMenu.classList.remove('open');
  }

  // ── MENU TABS ──
  function switchTab(tab) {
    document.querySelectorAll('.menu-panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.menu-tab').forEach(t => t.classList.remove('active'));
    document.getElementById(tab).classList.add('active');
    event.target.classList.add('active');
  }

  // ── SCROLL ANIMATIONS ──
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.fade-in, .fade-in-left').forEach(el => observer.observe(el));

  // ── RESERVATION FORM ──
  function handleReservation(e) {
    e.preventDefault();
    const form = document.getElementById('reservationForm');
    const success = document.getElementById('formSuccess');
    // WhatsApp redirect
    const nom = document.getElementById('nom').value;
    const tel = document.getElementById('tel').value;
    const date = document.getElementById('date').value;
    const heure = document.getElementById('heure').value;
    const couverts = document.getElementById('couverts').value;
    const occasion = document.getElementById('occasion').value;
    const msg = document.getElementById('message').value;

    const whatsappMsg = encodeURIComponent(
      `🍽️ *Demande de Réservation - Zangalewe*\n\n` +
      `👤 Nom: ${nom}\n📞 Tél: ${tel}\n📅 Date: ${date}\n⏰ Heure: ${heure}\n` +
      `👥 Personnes: ${couverts}${occasion ? '\n🎉 Occasion: '+occasion : ''}${msg ? '\n📝 Notes: '+msg : ''}`
    );

    success.style.display = 'block';
    form.querySelectorAll('input, select').forEach(el => el.value = '');

    setTimeout(() => {
      window.open(`https://wa.me/237657150570?text=${whatsappMsg}`, '_blank');
    }, 1500);
  }

  // ── SET MIN DATE ──
  const dateInput = document.getElementById('date');
  if (dateInput) {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    dateInput.min = tomorrow.toISOString().split('T')[0];
  }

  // ── SMOOTH ANCHOR ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
