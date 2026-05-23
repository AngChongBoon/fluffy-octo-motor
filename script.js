/* ===================================
   LUXE INTERIORS — script.js
   =================================== */

'use strict';

/* ===== 1. DARK MODE ===== */
(function initTheme() {
  const saved = localStorage.getItem('luxe-theme');
  if (saved === 'dark') document.documentElement.classList.add('dark');
})();

document.getElementById('themeToggle').addEventListener('click', () => {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('luxe-theme', isDark ? 'dark' : 'light');
});

/* ===== 2. NAVBAR SCROLL & HAMBURGER ===== */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 80);
  document.getElementById('backToTop').classList.toggle('visible', window.scrollY > 300);
}, { passive: true });

hamburger.addEventListener('click', () => {
  const open = hamburger.classList.toggle('open');
  navLinks.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', open);
});

navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

/* ===== 3. SMOOTH SCROLL ===== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = document.getElementById('navbar').offsetHeight;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ===== 4. BACK TO TOP ===== */
document.getElementById('backToTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ===== 5. SCROLL ANIMATIONS ===== */
const fadeObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el));

/* ===== 6. PORTFOLIO FILTER ===== */
const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioCards = document.querySelectorAll('.portfolio-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.getAttribute('data-filter');

    portfolioCards.forEach(card => {
      const match = filter === 'all' || card.getAttribute('data-category') === filter;
      if (match) {
        card.classList.remove('hidden');
        requestAnimationFrame(() => card.classList.remove('filtering'));
      } else {
        card.classList.add('filtering');
        setTimeout(() => card.classList.add('hidden'), 280);
      }
    });
  });
});

/* ===== 7. LIGHTBOX ===== */
const lightbox        = document.getElementById('lightbox');
const lightboxImg     = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose   = document.getElementById('lightboxClose');

function openLightbox(src, alt, caption) {
  lightboxImg.src = src;
  lightboxImg.alt = alt;
  lightboxCaption.textContent = caption || '';
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
  lightboxClose.focus();
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
  lightboxImg.src = '';
}

portfolioCards.forEach(card => {
  card.addEventListener('click', () => {
    const img     = card.querySelector('img');
    const caption = card.querySelector('.portfolio-overlay h3')?.textContent || '';
    openLightbox(img.src, img.alt, caption);
  });
});

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

/* ===== 8. TESTIMONIAL CAROUSEL ===== */
(function initCarousel() {
  const track       = document.getElementById('testimonialTrack');
  const dotsWrap    = document.getElementById('carouselDots');
  const prevBtn     = document.getElementById('carouselPrev');
  const nextBtn     = document.getElementById('carouselNext');
  const cards       = track.querySelectorAll('.testimonial-card');
  const total       = cards.length;
  let   current     = 0;
  let   autoTimer   = null;
  let   touchStartX = 0;

  function getVisible() {
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 768)  return 2;
    return 1;
  }

  function buildDots() {
    dotsWrap.innerHTML = '';
    const pages = Math.ceil(total / getVisible());
    for (let i = 0; i < pages; i++) {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Slide ${i + 1}`);
      dot.addEventListener('click', () => goTo(i * getVisible()));
      dotsWrap.appendChild(dot);
    }
  }

  function goTo(index) {
    const visible = getVisible();
    const maxIndex = Math.max(0, total - visible);
    current = Math.max(0, Math.min(index, maxIndex));

    const cardWidth = track.parentElement.offsetWidth;
    const gap = 24;
    const offset = current * ((cardWidth + gap) / visible);
    track.style.transform = `translateX(-${offset}px)`;

    dotsWrap.querySelectorAll('.carousel-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === Math.floor(current / visible));
    });
  }

  function next() { goTo(current + getVisible()); if (current >= total - getVisible()) goTo(0); }
  function prev() { if (current === 0) goTo(total - getVisible()); else goTo(current - getVisible()); }

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(next, 5000);
  }
  function stopAuto() { clearInterval(autoTimer); }

  prevBtn.addEventListener('click', () => { prev(); startAuto(); });
  nextBtn.addEventListener('click', () => { next(); startAuto(); });

  track.addEventListener('mouseenter', stopAuto);
  track.addEventListener('mouseleave', startAuto);

  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { diff > 0 ? next() : prev(); startAuto(); }
  });

  window.addEventListener('resize', () => { buildDots(); goTo(current); });

  buildDots();
  startAuto();
})();

/* ===== 9. STATS COUNTER ===== */
(function initStats() {
  const statNumbers = document.querySelectorAll('.stat-number');
  let animated = false;

  const statsObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !animated) {
      animated = true;
      statNumbers.forEach(el => {
        const target = +el.getAttribute('data-target');
        const duration = 2000;
        const start = performance.now();
        function update(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(eased * target);
          if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
      });
      statsObserver.disconnect();
    }
  }, { threshold: 0.4 });

  const statsSection = document.querySelector('.stats-section');
  if (statsSection) statsObserver.observe(statsSection);
})();

/* ===== 10. CONTACT FORM ===== */
(function initForm() {
  const form          = document.getElementById('contactForm');
  const submitBtn     = document.getElementById('submitBtn');
  const notification  = document.getElementById('formNotification');

  const fields = {
    name:    { el: document.getElementById('name'),    err: document.getElementById('nameError') },
    email:   { el: document.getElementById('email'),   err: document.getElementById('emailError') },
    phone:   { el: document.getElementById('phone'),   err: document.getElementById('phoneError') },
    message: { el: document.getElementById('message'), err: document.getElementById('messageError') },
  };

  function showError(field, msg) {
    field.el.classList.add('error');
    field.err.textContent = msg;
  }
  function clearError(field) {
    field.el.classList.remove('error');
    field.err.textContent = '';
  }

  function validate() {
    let valid = true;
    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRx = /^[\d\s\+\-\(\)]{7,20}$/;

    if (!fields.name.el.value.trim()) {
      showError(fields.name, 'Please enter your full name.');
      valid = false;
    } else clearError(fields.name);

    if (!emailRx.test(fields.email.el.value.trim())) {
      showError(fields.email, 'Please enter a valid email address.');
      valid = false;
    } else clearError(fields.email);

    const phone = fields.phone.el.value.trim();
    if (phone && !phoneRx.test(phone)) {
      showError(fields.phone, 'Please enter a valid phone number.');
      valid = false;
    } else clearError(fields.phone);

    if (!fields.message.el.value.trim()) {
      showError(fields.message, 'Please tell us about your project.');
      valid = false;
    } else clearError(fields.message);

    return valid;
  }

  Object.values(fields).forEach(f => {
    f.el.addEventListener('input', () => clearError(f));
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();
    notification.className = 'form-notification';
    notification.style.display = 'none';

    if (!validate()) return;

    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    const payload = {
      name:    fields.name.el.value.trim(),
      email:   fields.email.el.value.trim(),
      phone:   fields.phone.el.value.trim() || 'Not provided',
      message: fields.message.el.value.trim(),
    };

    try {
      const res = await fetch('https://formsubmit.co/ajax/ang.chongboon@yahoo.com.sg', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body:    JSON.stringify(payload),
      });

      if (res.ok) {
        notification.textContent = '✓ Thank you! Your enquiry has been sent. We\'ll be in touch within 24 hours.';
        notification.className = 'form-notification success';
        form.reset();
        Object.values(fields).forEach(f => clearError(f));
        showClapAlert();
      } else {
        throw new Error('Server error');
      }
    } catch {
      notification.textContent = '✕ Something went wrong. Please try again or email us directly at hello@luxeinteriors.com';
      notification.className = 'form-notification error';
    } finally {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
      notification.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  function showClapAlert() {
    const toast = document.createElement('div');
    toast.className = 'clap-toast';
    toast.innerHTML = '👏 Your form has been submitted!';
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('clap-toast--visible'));
    setTimeout(() => {
      toast.classList.remove('clap-toast--visible');
      toast.addEventListener('transitionend', () => toast.remove(), { once: true });
    }, 3500);
  }
})();
