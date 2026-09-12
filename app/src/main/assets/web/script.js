// EcoTrack — Global JavaScript

// Mobile nav toggle
function toggleMenu() {
  const menu = document.getElementById('mobileMenu');
  menu.classList.toggle('open');
}

// ── Navbar Login / Logout ──
function updateNavAuth() {
  const btn = document.getElementById('navLoginBtn');
  if (!btn) return;
  const sess = JSON.parse(sessionStorage.getItem('ecotrack_session') || 'null');
  if (sess) {
    btn.textContent = 'Logout';
    btn.href = '#';
    btn.onclick = function(e) {
      e.preventDefault();
      sessionStorage.removeItem('ecotrack_session');
      window.location.href = 'index.html';
    };
    btn.style.background = '';
  } else {
    btn.textContent = 'Login';
    btn.href = 'login.html';
    btn.onclick = null;
    btn.style.background = '';
  }
}

// Close menu when link clicked
document.addEventListener('DOMContentLoaded', () => {
  updateNavAuth();
  const mobileLinks = document.querySelectorAll('.mobile-menu a');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      document.getElementById('mobileMenu').classList.remove('open');
    });
  });

  // Scroll-based navbar shadow
  window.addEventListener('scroll', () => {
    const nav = document.querySelector('.navbar');
    if (window.scrollY > 20) {
      nav.style.boxShadow = '0 4px 24px rgba(0,0,0,0.08)';
    } else {
      nav.style.boxShadow = 'none';
    }
  });

  // Animate elements on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.12 });

  const animTargets = document.querySelectorAll(
    '.step-card, .feature-card, .team-card, .pstat-card, .waste-cat, .reward-card, .dash-kpi, .tc-card, .pickup-item, .contact-item'
  );
  animTargets.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity 0.5s ${i * 0.06}s ease, transform 0.5s ${i * 0.06}s ease`;
    observer.observe(el);
  });

  // Live clock for dashboard
  const updateEl = document.getElementById('lastUpdate');
  if (updateEl) {
    setInterval(() => {
      const now = new Date();
      updateEl.textContent = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }, 1000);
  }

  // Animate stat numbers on index page
  const statNums = document.querySelectorAll('.stat-num, .kpi-value, .pstat-n');
  statNums.forEach(el => {
    const target = parseFloat(el.textContent.replace(/[^0-9.]/g, ''));
    if (isNaN(target) || target === 0) return;
    const suffix = el.textContent.replace(/[0-9.]/g, '');
    let current = 0;
    const step = target / 60;
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = (Number.isInteger(target) ? Math.round(current) : current.toFixed(1)) + suffix;
      if (current >= target) clearInterval(timer);
    }, 16);
  });
});

// Utility: show toast-style notification
function showToast(msg, type = 'success') {
  const toast = document.createElement('div');
  toast.textContent = msg;
  toast.style.cssText = `
    position: fixed; bottom: 28px; right: 28px; z-index: 9999;
    background: ${type === 'success' ? '#16a34a' : '#ef4444'};
    color: white; padding: 14px 24px; border-radius: 12px;
    font-family: 'DM Sans', sans-serif; font-size: 0.9rem; font-weight: 600;
    box-shadow: 0 8px 32px rgba(0,0,0,0.2);
    transform: translateY(20px); opacity: 0;
    transition: all 0.35s ease;
  `;
  document.body.appendChild(toast);
  requestAnimationFrame(() => {
    toast.style.transform = 'translateY(0)';
    toast.style.opacity = '1';
  });
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    setTimeout(() => toast.remove(), 350);
  }, 3000);
}
