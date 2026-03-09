/* ════════════════════════════════════════════════
   main.js — NFC Business Card Site
   Architect & Interior Designer
════════════════════════════════════════════════ */

'use strict';

/* ────────────────────────────────────────────────
   1. VCARD DATA — Fill in real details here
──────────────────────────────────────────────── */
const VCARD = {
  firstName:    'Sugi',
  lastName:     'M',
  fullName:     'Plan Spacez',
  title:        'Architect & Interior Designer',
  company:      'Plan Spacez',
  phone:        '+91 90431 66777',
  email:        'sugi@planspacez.com',
  website:      'https://planspacez.com',
  address:      'No 27, Little Mount, Saidapet, Chennai - 600015',
  linkedin:     'https://www.linkedin.com/in/sugi-m-894677b',
  instagram:    'https://instagram.com/planspacez',
  whatsapp:     '919043166777',
};

/* ────────────────────────────────────────────────
   2. DOM READY
──────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initSplash();
  initTheme();
  initCursor();
  initNav();
  initScrollAnimations();
  initPortfolioModal();
  initVcard();
  initSkillBars();
  setYear();
});

/* ────────────────────────────────────────────────
   2a. SPLASH SCREEN — curtain sweeps up on load
──────────────────────────────────────────────── */
function initSplash() {
  const splash = document.getElementById('splash');
  if (!splash) return;

  if (typeof gsap === 'undefined') {
    splash.remove();
    return;
  }

  document.body.style.overflow = 'hidden';

  const tl = gsap.timeline({ onComplete: () => splash.remove() });

  // Gold progress bar fills across the bottom
  tl.fromTo('.splash__bar',
    { scaleX: 0, transformOrigin: 'left' },
    { scaleX: 1, duration: 1.2, ease: 'power1.inOut' }
  )
  // Logo blooms in while bar is loading
  .fromTo('.splash__logo',
    { opacity: 0, scale: 0.88, y: 20 },
    { opacity: 1, scale: 1, y: 0, duration: 0.7, ease: 'back.out(1.4)' },
    '-=0.95'
  )
  // Logo fades out — brief pause via delay
  .to('.splash__logo',
    { opacity: 0, y: -14, scale: 0.95, duration: 0.4, ease: 'power2.in', delay: 0.35 }
  )
  // Curtain sweeps up — hero entrance fires as it moves
  .to('#splash', {
    yPercent: -100,
    duration: 1.1,
    ease: 'power4.inOut',
    onStart: () => {
      document.body.style.overflow = '';
      triggerHeroEntrance();
    },
  });
}

function triggerHeroEntrance() {
  if (typeof gsap === 'undefined') return;
  gsap.fromTo('.hero .reveal-up',
    { y: 40, opacity: 0 },
    { y: 0, opacity: 1, duration: 1.05, ease: 'power3.out', stagger: 0.18, delay: 0.15 }
  );
}

/* ────────────────────────────────────────────────
   2b. THEME TOGGLE
──────────────────────────────────────────────── */
function initTheme() {
  const btns  = document.querySelectorAll('.theme-toggle');
  const saved = localStorage.getItem('theme');

  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    btns.forEach(btn => {
      const icon = btn.querySelector('i');
      if (icon) icon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
    });
    localStorage.setItem('theme', theme);
  };

  applyTheme(saved === 'dark' ? 'dark' : 'light');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  });
}

/* ────────────────────────────────────────────────
   3. CUSTOM CURSOR
──────────────────────────────────────────────── */
function initCursor() {
  const cursor   = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');

  if (!cursor || !follower) return;
  if (window.matchMedia('(hover: none)').matches) return; // skip touch devices

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  // Smooth follower via requestAnimationFrame
  (function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top  = followerY + 'px';
    requestAnimationFrame(animateFollower);
  })();

  // Grow on interactive elements
  const interactives = 'a, button, .portfolio-card, .service-card, .contact-card';
  document.querySelectorAll(interactives).forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(2.5)';
      cursor.style.opacity = '0.5';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1)';
      cursor.style.opacity = '1';
    });
  });
}

/* ────────────────────────────────────────────────
   4. NAVIGATION
──────────────────────────────────────────────── */
function initNav() {
  const nav       = document.getElementById('mainNav');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  if (!nav) return;

  // Scroll: add .scrolled class
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  // Hamburger toggle
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const open = hamburger.classList.toggle('open');
      navLinks.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });

    // Close on nav link click (mobile)
    navLinks.querySelectorAll('.nav__link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }
}

/* ────────────────────────────────────────────────
   5. SCROLL ANIMATIONS (GSAP + ScrollTrigger)
──────────────────────────────────────────────── */
function initScrollAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    // Fallback: just show everything if GSAP not loaded (e.g. offline)
    document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right')
      .forEach(el => { el.style.opacity = '1'; });
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // Hero entrance is handled by initSplash → triggerHeroEntrance()

  // Generic reveal-up (all sections)
  document.querySelectorAll('.reveal-up:not(.hero .reveal-up)').forEach(el => {
    const delay = parseFloat(el.dataset.delay || '0') * 0.12;
    gsap.fromTo(el, { y: 50, opacity: 0 }, {
      y: 0, opacity: 1,
      duration: 0.9,
      ease: 'power3.out',
      delay,
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        once: true,
      },
    });
  });

  // reveal-left
  document.querySelectorAll('.reveal-left').forEach(el => {
    gsap.fromTo(el, { x: -60, opacity: 0 }, {
      x: 0, opacity: 1,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        once: true,
      },
    });
  });

  // reveal-right
  document.querySelectorAll('.reveal-right').forEach(el => {
    gsap.fromTo(el, { x: 60, opacity: 0 }, {
      x: 0, opacity: 1,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        once: true,
      },
    });
  });
}

/* ────────────────────────────────────────────────
   6. SKILL BARS — animate width on scroll
──────────────────────────────────────────────── */
function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar');
  if (!bars.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar   = entry.target;
        const fill  = bar.querySelector('.skill-bar__fill');
        const pct   = bar.dataset.percent || '0';
        if (fill) {
          // Small delay so CSS transition kicks in after paint
          setTimeout(() => { fill.style.width = pct + '%'; }, 120);
        }
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(bar => observer.observe(bar));
}

/* ────────────────────────────────────────────────
   7. PORTFOLIO MODAL
──────────────────────────────────────────────── */
function initPortfolioModal() {
  const modal    = document.getElementById('portfolioModal');
  const backdrop = document.getElementById('modalBackdrop');
  const closeBtn = document.getElementById('modalClose');
  if (!modal) return;

  const modalImg   = document.getElementById('modalImg');
  const modalCat   = document.getElementById('modalCat');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc  = document.getElementById('modalDesc');

  // Open on card click
  document.querySelectorAll('.portfolio-card').forEach(card => {
    card.addEventListener('click', () => {
      modalImg.src         = card.dataset.img   || '';
      modalImg.alt         = card.dataset.title || '';
      modalCat.textContent  = card.dataset.category || '';
      modalTitle.textContent = card.dataset.title  || '';
      modalDesc.textContent  = card.dataset.desc   || '';
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  // Close functions
  const closeModal = () => {
    modal.classList.remove('open');
    document.body.style.overflow = '';
    // Clear src after transition
    setTimeout(() => { modalImg.src = ''; }, 300);
  };

  if (closeBtn)  closeBtn.addEventListener('click', closeModal);
  if (backdrop)  backdrop.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });
}

/* ────────────────────────────────────────────────
   8. VCARD DOWNLOAD
──────────────────────────────────────────────── */
function downloadVcard() {
  const vcardString = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${VCARD.fullName}`,
    `N:${VCARD.lastName};${VCARD.firstName};;;`,
    `TITLE:${VCARD.title}`,
    `ORG:${VCARD.company}`,
    `TEL;TYPE=CELL:${VCARD.phone}`,
    `EMAIL:${VCARD.email}`,
    `URL:${VCARD.website}`,
    `ADR;TYPE=WORK:;;${VCARD.address};;;;`,
    `X-SOCIALPROFILE;TYPE=linkedin:${VCARD.linkedin}`,
    `X-SOCIALPROFILE;TYPE=instagram:${VCARD.instagram}`,
    'END:VCARD',
  ].join('\r\n');

  const blob = new Blob([vcardString], { type: 'text/vcard;charset=utf-8' });
  const url  = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href     = url;
  link.download = `${VCARD.firstName}_${VCARD.lastName}_Contact.vcf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function initVcard() {
  // All vcard trigger buttons
  ['heroVcard', 'vcardBtn', 'fabVcard'].forEach(id => {
    const btn = document.getElementById(id);
    if (btn) btn.addEventListener('click', downloadVcard);
  });
}

/* ────────────────────────────────────────────────
   9. FOOTER YEAR
──────────────────────────────────────────────── */
function setYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}
