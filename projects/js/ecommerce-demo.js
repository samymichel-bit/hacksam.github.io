// Custom cursor
  const cursor = document.getElementById('cursor');
  const ring = document.getElementById('cursorRing');
  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  function animCursor() {
    cursor.style.left = mx + 'px'; cursor.style.top = my + 'px';
    rx += (mx - rx) * .12; ry += (my - ry) * .12;
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(animCursor);
  }
  animCursor();

  // Mobile nav toggle
  const hamburger = document.getElementById('navHamburger');
  const mobileNav = document.getElementById('mobileNav');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
      mobileNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          mobileNav.classList.remove('open');
          hamburger.classList.remove('open');
          hamburger.setAttribute('aria-expanded', 'false');
        });
      });
    });
  }

  // Cart counter
  let cartItems = 2;
  function addToCart() {
    cartItems++;
    const el = document.getElementById('cartCount');
    el.textContent = cartItems;
    el.style.transform = 'scale(1.5)';
    setTimeout(() => el.style.transform = 'scale(1)', 200);
    el.style.transition = 'transform .2s';
  }

  // Scroll reveal
  const reveals = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 60);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  reveals.forEach(r => io.observe(r));

  // Newsletter submit
  document.querySelector('.newsletter-btn').addEventListener('click', function() {
    const input = document.querySelector('.newsletter-input');
    if(input.value) {
      this.textContent = '✓ Merci !';
      this.style.background = '#7A6652';
      input.value = '';
      setTimeout(() => { this.textContent = "S'abonner"; this.style.background = ''; }, 3000);
    }
  });
