/**
 * Ahmad Abdul Mujahid — Personal Portfolio Main Script
 * Handle: Navigasi, Mode Gelap, Form Kontak, Toast, Animasi Teks, & Filter
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Tahun Otomatis di Footer
  const yrEl = document.getElementById('yr');
  if (yrEl) yrEl.textContent = new Date().getFullYear();

  // 2. Efek Drop Huruf pada Nama di Header
  const nameEl = document.getElementById('name');
  if (nameEl) {
    nameEl.innerHTML = [...nameEl.textContent]
      .map((ch, i) => `<span style="--i:${i}">${ch}</span>`)
      .join('');
  }

  // 3. Efek Teks Mengetik (Typewriter)
  const roles = [
    'mahasiswa Ilmu Komputer.',
    'calon software engineer.',
    'pembelajar logika & algoritma.',
    'pembuat proyek web nyata.'
  ];
  const typedEl = document.getElementById('typed');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (typedEl) {
    if (reduceMotion) {
      typedEl.textContent = roles[0];
    } else {
      let r = 0, c = 0, deleting = false;
      function type() {
        const word = roles[r];
        typedEl.textContent = word.slice(0, c);
        let delay = deleting ? 35 : 75;

        if (!deleting && c === word.length) {
          deleting = true;
          delay = 1400;
        } else if (deleting && c === 0) {
          deleting = false;
          r = (r + 1) % roles.length;
          delay = 400;
        } else {
          c += deleting ? -1 : 1;
        }
        setTimeout(type, delay);
      }
      type();
    }
  }

  // 4. Scroll Reveal (Elemen Muncul saat di-Scroll)
  const targets = document.querySelectorAll(
    'section h2, .section-sub, .about p, .facts li, .skills > div, .project, .cert-card, .timeline, .contact p, .contact-quick, .cform, .photo, .filter, .note'
  );
  targets.forEach((el) => {
    el.classList.add('reveal');
    const sibs = [...el.parentElement.children].filter((e) => e.classList.contains('reveal'));
    el.style.setProperty('--d', Math.min(sibs.indexOf(el), 4) * 0.1 + 's');
  });

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('show');
          revealObserver.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  targets.forEach((el) => revealObserver.observe(el));

  // 5. Scroll Progress Bar
  const progBar = document.getElementById('progress');
  if (progBar) {
    function updateProgress() {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progBar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
    }
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  // 6. Active Navigation Spy (Termasuk #top / Beranda)
  const navLinks = document.querySelectorAll('.nav-menu a');
  const heroEl = document.querySelector('.hero');
  const sections = document.querySelectorAll('main section[id]');
  const spyTargets = heroEl ? [heroEl, ...sections] : [...sections];

  if (navLinks.length && spyTargets.length) {
    const setActiveNav = (id) => {
      navLinks.forEach((a) => {
        a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
      });
    };
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const targetId = e.target === heroEl ? 'top' : e.target.id;
            setActiveNav(targetId);
          }
        });
      },
      { rootMargin: '-35% 0px -55% 0px' }
    );
    spyTargets.forEach((s) => spy.observe(s));
    if (window.scrollY < 100) setActiveNav('top');
  }

  // 7. Navigasi Mobile (Hamburger Toggle)
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const expanded = navMenu.classList.contains('open');
      navToggle.setAttribute('aria-expanded', expanded);
    });

    // Tutup menu saat link diklik
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 8. Dark Mode Toggle (Ikon SVG Konsisten)
  const root = document.documentElement;
  const themeBtn = document.getElementById('theme');
  const SUN_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>';
  const MOON_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>';

  const updateThemeIcon = () => {
    if (!themeBtn) return;
    const isDark = root.dataset.theme === 'dark';
    themeBtn.innerHTML = isDark ? SUN_SVG : MOON_SVG;
    themeBtn.setAttribute('title', isDark ? 'Beralih ke mode terang' : 'Beralih ke mode gelap');
    themeBtn.setAttribute('aria-label', isDark ? 'Beralih ke mode terang' : 'Beralih ke mode gelap');
  };

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
      root.dataset.theme = nextTheme;
      try {
        localStorage.setItem('theme', nextTheme);
      } catch (e) {}
      updateThemeIcon();
    });
    updateThemeIcon();
  }

  // 9. Foto Profil Fallback
  const profileImg = document.querySelector('.photo img');
  if (profileImg) {
    const fallback = () => {
      profileImg.replaceWith(
        Object.assign(document.createElement('div'), {
          className: 'ph',
          textContent: 'AM'
        })
      );
    };
    profileImg.addEventListener('error', fallback);
    if (profileImg.complete && !profileImg.naturalWidth) fallback();
  }

  // 10. Filter Kategori Proyek
  const filterBtns = document.querySelectorAll('.filter button');
  const projects = document.querySelectorAll('#plist .project');
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.setAttribute('aria-pressed', b === btn));
      const category = btn.dataset.f;
      projects.forEach((p) => {
        p.hidden = category !== 'all' && p.dataset.cat !== category;
      });
    });
  });

  // 11. Statistik GitHub Publik (dengan cache sessionStorage 15 menit)
  const ghEl = document.getElementById('gh');
  if (ghEl) {
    const renderGhStats = (d) => {
      ghEl.textContent = `Di GitHub: ${d.public_repos} repositori publik${d.followers ? ' • ' + d.followers + ' pengikut' : ''}`;
      ghEl.hidden = false;
    };
    const CACHE_KEY = 'gh_stats_am1049128';
    const CACHE_TTL = 15 * 60 * 1000;
    let cached = null;
    try {
      const raw = sessionStorage.getItem(CACHE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Date.now() - parsed.ts < CACHE_TTL) cached = parsed;
      }
    } catch (e) {}

    if (cached) {
      renderGhStats(cached);
    } else {
      fetch('https://api.github.com/users/am1049128-lab')
        .then((r) => (r.ok ? r.json() : Promise.reject()))
        .then((d) => {
          const payload = { ts: Date.now(), public_repos: d.public_repos, followers: d.followers };
          try { sessionStorage.setItem(CACHE_KEY, JSON.stringify(payload)); } catch (e) {}
          renderGhStats(payload);
        })
        .catch(() => {});
    }
  }

  // 12. Toast Notification & Salin Kontak
  const toast = document.getElementById('toast');
  let toastTimer;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2400);
  }

  document.querySelectorAll('[data-copy]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const text = btn.getAttribute('data-copy');
      const label = btn.getAttribute('data-label') || 'Teks';
      if (!text) return;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text)
          .then(() => showToast(`✓ ${label} berhasil disalin!`))
          .catch(() => showToast(`Gagal menyalin ${label}.`));
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast(`✓ ${label} berhasil disalin!`);
      }
    });
  });

  // 13. Form Kontak (WhatsApp & Mailto)
  const cform = document.getElementById('cform');
  if (cform) {
    const buildMessage = () => {
      const nama = cform.nama.value.trim() || 'Pengunjung portofolio';
      const pesan = cform.pesan.value.trim();
      return `Halo Ahmad, saya ${nama}.\n\n${pesan}`;
    };

    cform.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!cform.reportValidity()) return;
      const url = `https://wa.me/6281226818063?text=${encodeURIComponent(buildMessage())}`;
      window.open(url, '_blank', 'noopener');
    });

    const mailBtn = document.getElementById('mailbtn');
    if (mailBtn) {
      mailBtn.addEventListener('click', () => {
        if (!cform.reportValidity()) return;
        const mailUrl = `mailto:am1049128@gmail.com?subject=${encodeURIComponent('Pesan dari Portofolio')}&body=${encodeURIComponent(buildMessage())}`;
        window.location.href = mailUrl;
      });
    }
  }
});

