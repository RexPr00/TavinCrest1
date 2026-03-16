(() => {
  const body = document.body;
  const focusable = 'a[href], button:not([disabled]), input:not([disabled])';
  let activeTrap = null;

  const lockScroll = (state) => {
    body.style.overflow = state ? 'hidden' : '';
  };

  const trapFocus = (container) => {
    const nodes = [...container.querySelectorAll(focusable)];
    if (!nodes.length) return () => {};
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    const onKey = (e) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    container.addEventListener('keydown', onKey);
    first.focus();
    return () => container.removeEventListener('keydown', onKey);
  };

  document.querySelectorAll('.lang-btn').forEach((btn) => {
    btn.addEventListener('click', () => btn.closest('.lang').classList.toggle('open'));
  });

  document.addEventListener('click', (e) => {
    document.querySelectorAll('.lang').forEach((wrap) => {
      if (!wrap.contains(e.target)) wrap.classList.remove('open');
    });
  });

  const drawer = document.getElementById('mobileDrawer');
  const overlay = document.getElementById('drawerOverlay');
  const openBtn = document.getElementById('burgerOpen');
  const closeBtn = document.getElementById('drawerClose');

  const closeDrawer = () => {
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    lockScroll(false);
    if (activeTrap) activeTrap();
    activeTrap = null;
    openBtn.focus();
  };

  openBtn?.addEventListener('click', () => {
    drawer.classList.add('open');
    overlay.classList.add('open');
    lockScroll(true);
    activeTrap = trapFocus(drawer);
  });
  closeBtn?.addEventListener('click', closeDrawer);
  overlay?.addEventListener('click', closeDrawer);

  const modal = document.getElementById('privacyModal');
  const modalOpeners = document.querySelectorAll('[data-open-privacy]');
  const modalCloser = document.getElementById('privacyClose');
  const modalX = document.getElementById('privacyCloseX');

  const closeModal = () => {
    modal.classList.remove('open');
    lockScroll(false);
    if (activeTrap) activeTrap();
    activeTrap = null;
  };

  modalOpeners.forEach((el) => el.addEventListener('click', (e) => {
    e.preventDefault();
    modal.classList.add('open');
    lockScroll(true);
    activeTrap = trapFocus(modal.querySelector('.modal'));
  }));

  modalCloser?.addEventListener('click', closeModal);
  modalX?.addEventListener('click', closeModal);
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (drawer?.classList.contains('open')) closeDrawer();
      if (modal?.classList.contains('open')) closeModal();
    }
  });

  document.querySelectorAll('.faq-item').forEach((item) => {
    item.querySelector('.faq-q').addEventListener('click', () => {
      document.querySelectorAll('.faq-item').forEach((el) => el.classList.remove('open'));
      item.classList.add('open');
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('seen');
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('[data-reveal]').forEach((el) => observer.observe(el));

  document.querySelectorAll('form').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const msg = form.querySelector('.form-confirm');
      msg.textContent = 'After you sign up, you get instant access to the next steps. We may send a short email to confirm your details.';
    });
  });
})();
