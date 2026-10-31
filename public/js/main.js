/* Taranjot Singh portfolio: shell behaviour and the contact form.
   Every feature starts on its own inside try/catch, so one failure never stops navigation or the form. */

const root = document.documentElement;
const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
const phone = matchMedia('(max-width: 1023.98px)');

function start(name, init) {
  try {
    init();
  } catch (err) {
    console.warn(`[portfolio] ${name} failed to start:`, err);
  }
}

const markCurrent = (el, on) => (on ? el.setAttribute('aria-current', 'location') : el.removeAttribute('aria-current'));

/* ---------- Theme ---------- */
const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = () => matchMedia('(hover: hover) and (pointer: fine)').matches;
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

// Browser chrome colour follows the theme the visitor is actually looking at (the page background in each theme)
const THEME_COLORS = { light: '#f7fafe', dark: '#050d17' };
function syncThemeColor() {
  const color = THEME_COLORS[root.dataset.theme] || THEME_COLORS.light;
  $$('meta[name="theme-color"]').forEach((m) => { m.removeAttribute('media'); m.setAttribute('content', color); });
}

function initTheme() {
  const buttons = $$('[data-theme-toggle]');
  const sync = () => {
    const label = root.dataset.theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';
    buttons.forEach((b) => b.setAttribute('aria-label', label));
  };
  buttons.forEach((b) => b.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    const apply = () => {
      root.dataset.theme = next;
      try { localStorage.setItem('theme', next); } catch (e) { /* storage blocked: the choice lasts for this visit */ }
      sync();
      syncThemeColor();
    };
    // The new theme grows out of the button as a circle; browsers without View Transitions, or with reduced motion, switch instantly
    if (document.startViewTransition && !reducedMotion()) {
      const r = b.getBoundingClientRect();
      root.style.setProperty('--vt-x', Math.round(r.left + r.width / 2) + 'px');
      root.style.setProperty('--vt-y', Math.round(r.top + r.height / 2) + 'px');
      document.startViewTransition(apply);
    } else {
      apply();
    }
  }));
  sync();
  syncThemeColor();
}

/* ---------- Accent picker (a popover on desktop, a row inside the More sheet on phones) ---------- */
function initAccent() {
  const choices = $$('[data-accent-choice]');
  const accent = $('.accent');
  const button = $('#accentBtn');
  const pop = $('#accentPop');
  const current = () => root.dataset.accent || 'aurora';

  const mark = () => choices.forEach((c) => {
    const on = c.dataset.accentChoice === current();
    c.setAttribute('aria-checked', String(on));
    c.tabIndex = on ? 0 : -1; // roving tabindex: one stop per group
  });
  const choose = (name) => {
    root.dataset.accent = name;
    try { localStorage.setItem('accent', name); } catch (e) { /* storage blocked */ }
    mark();
  };

  choices.forEach((c) => c.addEventListener('click', () => choose(c.dataset.accentChoice)));
  $$('[data-accent-group]').forEach((group) => group.addEventListener('keydown', (e) => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!step) return;
    e.preventDefault();
    const own = $$('[data-accent-choice]', group);
    const next = own[(own.indexOf(document.activeElement) + step + own.length) % own.length];
    next.focus();
    choose(next.dataset.accentChoice);
  }));
  mark();

  if (!button || !pop || !accent) return;
  function open() {
    pop.hidden = false;
    requestAnimationFrame(() => pop.classList.add('is-open'));
    button.setAttribute('aria-expanded', 'true');
    const selected = $('[aria-checked="true"]', pop);
    if (selected) selected.focus();
  }
  function close(returnFocus) {
    if (pop.hidden) return;
    pop.classList.remove('is-open');
    pop.hidden = true;
    button.setAttribute('aria-expanded', 'false');
    if (returnFocus) button.focus();
  }
  button.addEventListener('click', () => (pop.hidden ? open() : close(true)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !pop.hidden) close(true); });
  document.addEventListener('pointerdown', (e) => { if (!pop.hidden && !e.target.closest('.accent')) close(false); });
  accent.addEventListener('focusout', (e) => { if (!accent.contains(e.relatedTarget)) close(false); });
}

/* ---------- Navigation: scroll-spy, sliding indicator, tab bar bubble ---------- */
function initNavigation() {
  const ids = ['home', 'about', 'experience', 'projects', 'skills', 'education', 'achievements', 'hobbies', 'contact'];
  const sections = ids.map((id) => document.getElementById(id)).filter(Boolean);
  const track = $('.pill-nav__track');
  const indicator = $('.pill-nav__indicator');
  const links = $$('.pill-nav__links a');
  const cta = $('.pill-nav__cta');
  const tabbar = $('#tabbar');
  const tabs = $$('.tab', tabbar || document);
  const tiles = $$('.sheet__tile');
  const inMore = ['skills', 'education', 'achievements', 'hobbies'];
  const tabSlots = ['home', 'about', 'experience', 'projects', 'contact'];
  let currentId = null;
  let placed = false;

  function placeIndicator() {
    if (!indicator) return;
    const active = links.find((a) => a.hasAttribute('aria-current'));
    if (!active) { indicator.classList.remove('is-on'); return; }
    if (!placed) { indicator.style.transition = 'none'; } // the first placement should not glide in from the left
    indicator.style.setProperty('--x', active.offsetLeft + 'px');
    indicator.style.setProperty('--w', active.offsetWidth + 'px');
    indicator.classList.add('is-on');
    if (!placed) {
      void indicator.offsetWidth;
      indicator.style.transition = '';
      placed = true;
    }
  }

  function setCurrent(id) {
    if (id === currentId) return;
    currentId = id;
    links.forEach((a) => markCurrent(a, a.getAttribute('href') === '#' + id));
    if (cta) markCurrent(cta, id === 'contact');
    tiles.forEach((a) => markCurrent(a, a.getAttribute('href') === '#' + id));
    const slot = inMore.includes(id) ? tabs.length - 1 : tabSlots.indexOf(id);
    tabs.forEach((t, i) => markCurrent(t, i === slot));
    if (tabbar && slot >= 0) {
      tabbar.style.setProperty('--i', slot);
      tabbar.classList.add('has-active');
    }
    placeIndicator();
  }

  if ('IntersectionObserver' in window) {
    const visible = new Set();
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((en) => (en.isIntersecting ? visible.add(en.target.id) : visible.delete(en.target.id)));
      const first = ids.find((id) => visible.has(id));
      if (first) setCurrent(first);
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((s) => spy.observe(s));
  }

  // The web font arrives after first paint (its stylesheet does not block rendering), so links can change width late: watch each link, not just the track
  if (track && 'ResizeObserver' in window) {
    const ro = new ResizeObserver(placeIndicator);
    ro.observe(track);
    links.forEach((a) => ro.observe(a));
  }
  if (document.fonts) document.fonts.addEventListener('loadingdone', placeIndicator);
}

/* ---------- Scroll effects: progress line and ring, nav tightening, back to top, scroll cue ---------- */
function initScrollEffects() {
  const header = $('.site-header');
  const bar = $('.scroll-progress');
  const toTop = $('.to-top');
  const ring = $('.to-top__fill');
  const cue = $('.scroll-cue');
  let queued = false;

  function update() {
    queued = false;
    const y = window.scrollY || root.scrollTop;
    const max = Math.max(1, root.scrollHeight - root.clientHeight);
    const progress = Math.min(1, Math.max(0, y / max)).toFixed(4);
    // Set on the two elements that use it, not on <html>, so scrolling never restyles the whole page
    if (bar) bar.style.setProperty('--scroll', progress);
    if (ring) ring.style.setProperty('--scroll', progress);
    if (header) header.classList.toggle('is-scrolled', y > 24);
    if (toTop) toTop.classList.toggle('is-visible', y > 560);
    if (cue) cue.classList.toggle('is-hidden', y > 80);
  }
  window.addEventListener('scroll', () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(update);
  }, { passive: true });
  window.addEventListener('resize', update);
  update();
}

/* ---------- More sheet (phones and tablets) ---------- */
function initSheet() {
  const sheet = $('#moreSheet');
  const backdrop = $('#sheetBackdrop');
  const trigger = $('#moreBtn');
  const closeButton = $('#sheetClose');
  if (!sheet || !backdrop || !trigger) return;

  const behind = $$('main, footer, .topbar, .tabbar, .pill-nav, .to-top');
  const canInert = 'inert' in HTMLElement.prototype;
  let isOpen = false;
  let suppressClick = false;
  let drag = null;

  // Without JavaScript the More tab is a plain link to Skills; with it, the tab becomes the sheet's button
  trigger.setAttribute('role', 'button');
  trigger.setAttribute('aria-haspopup', 'dialog');
  trigger.setAttribute('aria-expanded', 'false');
  trigger.setAttribute('aria-controls', 'moreSheet');

  const tabbable = () => $$('a[href], button:not([disabled])', sheet).filter((el) => el.tabIndex >= 0 && el.getClientRects().length);

  function open() {
    if (isOpen) return;
    isOpen = true;
    behind.forEach((el) => (canInert ? (el.inert = true) : el.setAttribute('aria-hidden', 'true')));
    root.classList.add('sheet-open');
    backdrop.classList.add('is-open');
    sheet.classList.add('is-open');
    trigger.setAttribute('aria-expanded', 'true');
    requestAnimationFrame(() => (tabbable()[0] || sheet).focus());
  }

  function close(returnFocus = true) {
    if (!isOpen) return;
    isOpen = false;
    sheet.classList.remove('is-open', 'is-dragging');
    sheet.style.removeProperty('--dy');
    backdrop.classList.remove('is-open');
    root.classList.remove('sheet-open');
    behind.forEach((el) => (canInert ? (el.inert = false) : el.removeAttribute('aria-hidden')));
    trigger.setAttribute('aria-expanded', 'false');
    if (returnFocus) trigger.focus({ preventScroll: true });
  }

  trigger.addEventListener('click', (e) => { e.preventDefault(); open(); });
  trigger.addEventListener('keydown', (e) => { if (e.key === ' ') { e.preventDefault(); open(); } });
  backdrop.addEventListener('click', () => close());
  if (closeButton) closeButton.addEventListener('click', () => close());
  window.addEventListener('resize', () => { if (!phone.matches) close(false); });

  document.addEventListener('keydown', (e) => {
    if (!isOpen) return;
    if (e.key === 'Escape') { e.preventDefault(); close(); return; }
    if (e.key !== 'Tab') return;
    const items = tabbable();
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (!sheet.contains(document.activeElement) || (e.shiftKey && document.activeElement === first)) {
      e.preventDefault();
      (e.shiftKey ? last : first).focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });

  // Swipe down to close: a downward pull starts a drag, a long or fast pull closes
  sheet.addEventListener('click', (e) => { if (suppressClick) { e.preventDefault(); e.stopPropagation(); } }, true);
  // Scroll here instead of letting the browser follow the #link: that would clear focus, and focus must return to the More tab
  sheet.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    e.preventDefault();
    close();
    const target = document.getElementById(link.getAttribute('href').slice(1));
    if (target) {
      target.scrollIntoView();
      history.replaceState(null, '', link.getAttribute('href'));
    }
  });
  sheet.addEventListener('pointerdown', (e) => {
    if (!isOpen || e.button > 0) return;
    drag = { id: e.pointerId, y0: e.clientY, t0: e.timeStamp, dy: 0, active: false };
  });
  sheet.addEventListener('pointermove', (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const dy = e.clientY - drag.y0;
    if (!drag.active) {
      if (dy < 8) return;
      drag.active = true;
      sheet.setPointerCapture(e.pointerId);
      sheet.classList.add('is-dragging');
    }
    drag.dy = Math.max(0, dy);
    sheet.style.setProperty('--dy', drag.dy + 'px');
  });
  const endDrag = (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const { active, dy, t0 } = drag;
    drag = null;
    if (!active) return;
    sheet.classList.remove('is-dragging');
    suppressClick = true;
    setTimeout(() => { suppressClick = false; }, 0);
    const fast = dy / Math.max(1, e.timeStamp - t0) > 0.5;
    if (dy > 90 || (fast && dy > 30)) close(); else sheet.style.removeProperty('--dy');
  };
  sheet.addEventListener('pointerup', endDrag);
  sheet.addEventListener('pointercancel', endDrag);
}

/* ---------- Hide the tab bar while a form field is focused on a phone, so the keyboard cannot push it over the form ---------- */
function initFormFocus() {
  const tabbar = $('#tabbar');
  if (!tabbar) return;
  const isField = (el) => !!el && el.matches && el.matches('input, textarea, select');
  document.addEventListener('focusin', (e) => { if (phone.matches && isField(e.target)) tabbar.classList.add('is-hidden'); });
  document.addEventListener('focusout', () => {
    setTimeout(() => { if (!isField(document.activeElement)) tabbar.classList.remove('is-hidden'); }, 120);
  });
}

/* ---------- Toast: any feature can announce a short message with window.dispatchEvent(new CustomEvent('pf:toast', { detail: 'Copied' })) ---------- */
function initToast() {
  const toast = $('#toast');
  if (!toast) return;
  let timer;
  window.addEventListener('pf:toast', (e) => {
    toast.textContent = e.detail;
    toast.classList.add('is-in');
    clearTimeout(timer);
    timer = setTimeout(() => toast.classList.remove('is-in'), 2200);
  });
}

function initYear() {
  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();
}

/* ---------- Reveal once, as chapters scroll into view ---------- */
function initReveal() {
  const items = $$('.reveal');
  if (!('IntersectionObserver' in window)) { items.forEach((el) => el.classList.add('is-in')); return; }
  // Cards inside the horizontal carousel reveal together with the carousel, so the next card can peek in from the edge
  const hostOf = (el) => el.closest('.carousel__viewport') || el;
  const io = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (!en.isIntersecting) return;
    const group = en.target.matches('.carousel__viewport') ? $$('.reveal', en.target) : [en.target];
    group.forEach((el) => {
      el.classList.add('is-in');
      // Once a project card has finished revealing it can tilt quickly under the pointer (CSS keys off is-settled)
      if (el.matches('.project')) setTimeout(() => el.classList.add('is-settled'), 1300);
    });
    io.unobserve(en.target);
  }), { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
  new Set(items.map(hostOf)).forEach((el) => io.observe(el));
}

/* ---------- Experience: the progress line draws as you scroll; the card nearest the centre glows and drives the journey panel ---------- */
function initTimeline() {
  const timeline = $('.timeline');
  if (!timeline) return;
  const items = $$('.timeline__item', timeline);
  const slides = $$('.journey__slide');
  const dots = $$('.journey__dots i');
  let queued = false;

  function update() {
    queued = false;
    const vh = window.innerHeight;
    const box = timeline.getBoundingClientRect();
    timeline.style.setProperty('--p', Math.min(1, Math.max(0, (vh * 0.6 - box.top) / box.height)).toFixed(3));
    const onScreen = box.top < vh && box.bottom > 0;
    let best = 0;
    let bestDistance = Infinity;
    items.forEach((item, i) => {
      const r = item.getBoundingClientRect();
      const distance = Math.abs(r.top + r.height / 2 - vh / 2);
      if (distance < bestDistance) { bestDistance = distance; best = i; }
    });
    items.forEach((item, i) => item.classList.toggle('is-active', onScreen && i === best));
    slides.forEach((s, i) => s.classList.toggle('is-current', i === best));
    dots.forEach((d, i) => d.classList.toggle('is-current', i === best));
  }
  window.addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(update); } }, { passive: true });
  window.addEventListener('resize', update);
  update();
}

/* ---------- Projects: dots and arrows for the scroll-snap carousel ---------- */
function initCarousel() {
  const viewport = $('.carousel__viewport');
  if (!viewport) return;
  const cards = $$('.project', viewport);
  const dots = $$('.carousel__dots button');
  const prev = $('[data-carousel="prev"]');
  const next = $('[data-carousel="next"]');
  const offsetOf = (i) => cards[i].offsetLeft - cards[0].offsetLeft;
  // The active card is the one nearest the left snap edge, or the last one once the track is scrolled to its end
  const update = () => {
    const atStart = viewport.scrollLeft <= 2;
    const atEnd = viewport.scrollLeft + viewport.clientWidth >= viewport.scrollWidth - 2;
    let index = 0;
    cards.forEach((c, i) => { if (Math.abs(offsetOf(i) - viewport.scrollLeft) < Math.abs(offsetOf(index) - viewport.scrollLeft)) index = i; });
    if (atEnd && !atStart) index = cards.length - 1;
    dots.forEach((d, n) => (n === index ? d.setAttribute('aria-current', 'true') : d.removeAttribute('aria-current')));
    if (prev) prev.disabled = atStart;
    if (next) next.disabled = atEnd;
  };
  const scrollTo = (left) => viewport.scrollTo({ left, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  dots.forEach((d, i) => d.addEventListener('click', () => scrollTo(offsetOf(i))));
  // The arrows move relative to where the track is now, so they still work when a short track cannot scroll to every card's own position
  const starts = () => cards.map((_, i) => offsetOf(i));
  if (prev) prev.addEventListener('click', () => { const here = viewport.scrollLeft; scrollTo(starts().filter((s) => s < here - 2).pop() || 0); });
  if (next) next.addEventListener('click', () => { const here = viewport.scrollLeft; const to = starts().find((s) => s > here + 2); if (to !== undefined) scrollTo(to); });
  let queued = false;
  viewport.addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(() => { queued = false; update(); }); } }, { passive: true });
  window.addEventListener('resize', update);
  update();
}

/* ---------- Skills: on phones the six groups become an accordion, one open at a time; elsewhere they stay open ---------- */
function initSkills() {
  const grid = $('.skills__grid');
  if (!grid) return;
  const cards = $$('.skill', grid);
  const small = matchMedia('(max-width: 639.98px)');

  const setOpen = (card, open) => {
    card.classList.toggle('is-open', open);
    const button = $('.skill__toggle', card);
    if (button) button.setAttribute('aria-expanded', String(open));
  };
  function enhance() {
    grid.classList.add('is-accordion');
    cards.forEach((card, i) => {
      const title = $('.skill__title', card);
      if (!$('.skill__toggle', title)) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'skill__toggle';
        button.setAttribute('aria-controls', $('.skill__body', card).id);
        while (title.firstChild) button.appendChild(title.firstChild);
        button.insertAdjacentHTML('beforeend', '<svg class="icon skill__chev" aria-hidden="true"><use href="#i-chevron-down"/></svg>');
        title.appendChild(button);
        button.addEventListener('click', () => {
          const open = !card.classList.contains('is-open');
          cards.forEach((c) => setOpen(c, c === card && open));
        });
      }
      setOpen(card, i === 0);
    });
  }
  function restore() {
    grid.classList.remove('is-accordion');
    cards.forEach((card) => {
      const title = $('.skill__title', card);
      const button = $('.skill__toggle', title);
      if (button) {
        $('.skill__chev', button).remove();
        while (button.firstChild) title.insertBefore(button.firstChild, button);
        button.remove();
      }
      card.classList.remove('is-open');
    });
  }
  const sync = () => (small.matches ? enhance() : restore());
  small.addEventListener('change', sync);
  sync();
}

/* ---------- Achievements: the three lists become an accessible tab set; without JavaScript they stay stacked ---------- */
function initTabs() {
  const wrap = $('.achievements');
  if (!wrap) return;
  const panels = $$('.ach-panel', wrap);
  const list = document.createElement('div');
  list.className = 'tabs';
  list.setAttribute('role', 'tablist');
  list.setAttribute('aria-label', 'Achievements');
  const underline = document.createElement('span');
  underline.className = 'tabs__underline';
  underline.setAttribute('aria-hidden', 'true');
  list.appendChild(underline);

  const tabs = panels.map((panel, i) => {
    const tab = document.createElement('button');
    tab.type = 'button';
    tab.className = 'tabs__tab';
    tab.id = 'tab-' + panel.id.replace('panel-', '');
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', panel.id);
    const label = document.createElement('span');
    label.textContent = $('.ach-panel__title', panel).textContent;
    const count = document.createElement('span');
    count.className = 'tabs__count';
    count.textContent = String($$('.ach', panel).length); // computed from the list itself
    tab.append(label, count);
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', tab.id);
    list.appendChild(tab);
    tab.addEventListener('click', () => select(i, true));
    return tab;
  });
  panels[0].before(list);

  function select(index, animate) {
    tabs.forEach((tab, i) => {
      const on = i === index;
      tab.setAttribute('aria-selected', String(on));
      tab.tabIndex = on ? 0 : -1;
      panels[i].hidden = !on;
      panels[i].classList.remove('is-entering');
    });
    if (animate) {
      void panels[index].offsetWidth;
      panels[index].classList.add('is-entering');
    }
    placeUnderline();
    if (animate) keepVisible(tabs[index]);
  }
  function placeUnderline() {
    const active = tabs.find((t) => t.getAttribute('aria-selected') === 'true');
    if (!active) return;
    underline.style.setProperty('--x', active.offsetLeft + 'px');
    underline.style.setProperty('--w', active.offsetWidth + 'px');
  }
  // On narrow screens the strip scrolls sideways; move only the strip, never the page (scrollIntoView would scroll both)
  function keepVisible(tab) {
    const left = tab.offsetLeft - 8;
    const right = tab.offsetLeft + tab.offsetWidth + 8;
    if (left < list.scrollLeft) list.scrollTo({ left, behavior: 'smooth' });
    else if (right > list.scrollLeft + list.clientWidth) list.scrollTo({ left: right - list.clientWidth, behavior: 'smooth' });
  }
  list.addEventListener('keydown', (e) => {
    const here = tabs.indexOf(document.activeElement);
    if (here < 0) return;
    const to = { ArrowRight: (here + 1) % tabs.length, ArrowLeft: (here - 1 + tabs.length) % tabs.length, Home: 0, End: tabs.length - 1 }[e.key];
    if (to === undefined) return;
    e.preventDefault();
    tabs[to].focus();
    select(to, true);
  });
  select(0, false);
  // Tabs change width when the web font arrives (late, by design), and the strip itself does not resize then: watch each tab as well
  if ('ResizeObserver' in window) {
    const ro = new ResizeObserver(placeUnderline);
    ro.observe(list);
    tabs.forEach((t) => ro.observe(t));
  }
  if (document.fonts) document.fonts.addEventListener('loadingdone', placeUnderline);
}

/* ---------- Hobbies: on touch screens each toy plays once when revealed, and again on every tap ---------- */
function initHobbies() {
  const tiles = $$('.hobby');
  if (!tiles.length) return;
  const play = (tile) => {
    tile.classList.remove('is-playing');
    void tile.offsetWidth;
    tile.classList.add('is-playing');
  };
  tiles.forEach((tile) => tile.addEventListener('click', () => play(tile)));
  if (matchMedia('(hover: none)').matches && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (!en.isIntersecting) return;
      play(en.target);
      io.unobserve(en.target);
    }), { threshold: 0.6 });
    tiles.forEach((tile) => io.observe(tile));
  }
}

/* ---------- Contact: copy, live validation, character counter, sending state, success panel ---------- */
async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    try { await navigator.clipboard.writeText(text); return true; } catch (e) { /* denied: fall through */ }
  }
  try {
    const box = document.createElement('textarea');
    box.value = text;
    box.setAttribute('readonly', '');
    box.style.position = 'fixed';
    box.style.opacity = '0';
    document.body.appendChild(box);
    box.select();
    const ok = document.execCommand('copy');
    box.remove();
    return ok;
  } catch (e) {
    return false;
  }
}

function initContact() {
  const form = $('#contactForm');
  const status = $('#formStatus');
  if (!form || !status) return;
  const control = (name) => form.elements.namedItem(name);
  const submitButton = form.querySelector('button[type="submit"]');
  const counter = $('#messageCount');
  const touched = new Set();
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  // The same rules and wording as the server, which stays the authority
  const rules = {
    name: [(v) => v.trim().length >= 2, 'Please enter your name.'],
    email: [(v) => EMAIL_RE.test(v.trim()), 'Please enter a valid email address.'],
    message: [(v) => v.trim().length >= 10, 'Please write a message of at least 10 characters.'],
  };

  function check(name) {
    const input = control(name);
    const error = $('#' + name + '-error');
    const valid = rules[name][0](input.value);
    const show = !valid && touched.has(name);
    input.closest('.field').classList.toggle('is-invalid', show);
    if (show) input.setAttribute('aria-invalid', 'true'); else input.removeAttribute('aria-invalid');
    error.hidden = !show;
    error.textContent = show ? rules[name][1] : '';
    return valid;
  }
  Object.keys(rules).forEach((name) => {
    control(name).addEventListener('blur', () => { touched.add(name); check(name); });
    control(name).addEventListener('input', () => { if (touched.has(name)) check(name); });
  });
  control('message').addEventListener('input', (e) => { counter.textContent = e.target.value.length + ' / 3000'; });

  const copyButton = $('#copyEmail');
  const mail = $('#contactMail');
  if (copyButton && mail) {
    copyButton.addEventListener('click', async () => {
      if (await copyText(copyButton.dataset.copy)) {
        window.dispatchEvent(new CustomEvent('pf:toast', { detail: 'Copied' }));
      } else {
        // Nothing could write to the clipboard: select the address so it can be copied by hand
        const range = document.createRange();
        range.selectNodeContents(mail);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
      }
    });
  }

  function shake() {
    form.classList.remove('is-shaking');
    void form.offsetWidth;
    form.classList.add('is-shaking');
    setTimeout(() => form.classList.remove('is-shaking'), 600);
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    Object.keys(rules).forEach((name) => touched.add(name));
    const invalid = Object.keys(rules).filter((name) => !check(name));
    if (invalid.length) { control(invalid[0]).focus(); return; }

    submitButton.disabled = true;
    form.classList.add('is-sending');
    status.className = 'status';
    status.textContent = 'Sending...';

    const data = Object.fromEntries(new FormData(form).entries());
    data.elapsed = Math.round(performance.now()); // ms since the page began loading; the server silently drops anything under 1500

    try {
      let res;
      try {
        res = await fetch('/.netlify/functions/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
      } catch (networkError) {
        throw new Error('Could not send. Please email me directly.');
      }
      const out = await res.json().catch(() => ({}));
      if (!res.ok || out.ok === false) throw new Error(out.error || 'Could not send. Please email me directly.');
      form.reset();
      touched.clear();
      Object.keys(rules).forEach(check);
      counter.textContent = '0 / 3000';
      status.className = 'status ok';
      status.textContent = 'Thanks! Your message has been sent.';
      form.classList.add('is-sent');
      $('#sendAnother').focus();
    } catch (err) {
      status.className = 'status err';
      status.textContent = err.message;
      shake();
    } finally {
      submitButton.disabled = false;
      form.classList.remove('is-sending');
    }
  });

  $('#sendAnother').addEventListener('click', () => {
    form.classList.remove('is-sent');
    status.className = 'status';
    status.textContent = '';
    control('name').focus();
  });
}

/* ---------- Count-up numbers: the final value is already in the HTML, so no-JS and reduced-motion visitors see the real figure ---------- */
function initCounters() {
  const counters = $$('.count');
  if (!counters.length || reducedMotion() || !('IntersectionObserver' in window)) return;
  const run = (el) => {
    const end = Number(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / 1200);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))) + suffix; // ease-out
      if (p < 1) requestAnimationFrame(tick);
    };
    el.textContent = '0' + suffix;
    requestAnimationFrame(tick);
  };
  const io = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (!en.isIntersecting) return;
    run(en.target);
    io.unobserve(en.target);
  }), { threshold: 0.6 });
  counters.forEach((el) => io.observe(el));
}

/* ---------- Role line: the static phrase stays for assistive tech; sighted visitors see the three words take turns ---------- */
function initRoleRotator() {
  const role = $('.hero__role');
  if (!role || reducedMotion()) return;
  const words = ['Data Analytics', 'Machine Learning', 'Business Insight'];
  const fixed = document.createElement('span');
  fixed.className = 'role__static';
  fixed.textContent = role.textContent;
  const rotor = document.createElement('span');
  rotor.className = 'role__rot';
  rotor.setAttribute('aria-hidden', 'true');
  const spans = words.map((w) => { const s = document.createElement('span'); s.textContent = w; rotor.appendChild(s); return s; });
  role.textContent = '';
  role.append(fixed, rotor);
  role.classList.add('is-rotating');

  let current = 0;
  let timer = null;
  let visible = true;
  const show = (next) => spans.forEach((s, i) => { s.classList.toggle('is-on', i === next); s.classList.toggle('is-off', i === current && i !== next); });
  const step = () => { const next = (current + 1) % spans.length; show(next); current = next; };
  const start = () => { if (!timer && visible && !document.hidden) timer = setInterval(step, 2600); };
  const stop = () => { clearInterval(timer); timer = null; };
  show(0);
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => { visible = entries[0].isIntersecting; if (visible) start(); else stop(); }).observe(role);
  } else {
    start();
  }
  start();
}

/* ---------- Pointer effects (mouse and trackpad only): cursor glow, portrait parallax, magnetic buttons, project spotlight and tilt ---------- */
function initPointerEffects() {
  if (!finePointer() || reducedMotion()) return;
  const glow = $('.atmosphere__glow');
  const hero = $('.hero');
  const stage = $('.stage');
  const magnets = $$('[data-magnetic]');
  const pointer = { x: 0, y: 0, seen: false };
  const glowAt = { x: 0, y: 0 };
  const depth = { x: 0, y: 0, tx: 0, ty: 0 };
  let activeCard = null;
  let raf = 0;

  function frame() {
    raf = 0;
    let busy = false;
    if (glow && pointer.seen) {
      glowAt.x += (pointer.x - glowAt.x) * 0.14;
      glowAt.y += (pointer.y - glowAt.y) * 0.14;
      glow.style.transform = 'translate3d(' + glowAt.x.toFixed(1) + 'px, ' + glowAt.y.toFixed(1) + 'px, 0)';
      if (Math.abs(pointer.x - glowAt.x) > 0.5 || Math.abs(pointer.y - glowAt.y) > 0.5) busy = true;
    }
    if (stage) {
      depth.x += (depth.tx - depth.x) * 0.09;
      depth.y += (depth.ty - depth.y) * 0.09;
      stage.style.setProperty('--px', depth.x.toFixed(3));
      stage.style.setProperty('--py', depth.y.toFixed(3));
      if (Math.abs(depth.tx - depth.x) > 0.002 || Math.abs(depth.ty - depth.y) > 0.002) busy = true;
    }
    if (busy) raf = requestAnimationFrame(frame);
  }
  const wake = () => { if (!raf) raf = requestAnimationFrame(frame); };

  function releaseCard() {
    if (!activeCard) return;
    activeCard.style.removeProperty('--rx');
    activeCard.style.removeProperty('--ry');
    activeCard = null;
  }

  window.addEventListener('pointermove', (e) => {
    if (e.pointerType === 'touch') return;
    pointer.x = e.clientX;
    pointer.y = e.clientY;
    if (!pointer.seen) { pointer.seen = true; glowAt.x = e.clientX; glowAt.y = e.clientY; }
    if (glow) glow.classList.add('is-on');

    if (hero && stage) {
      const r = hero.getBoundingClientRect();
      const inside = e.clientY >= r.top && e.clientY <= r.bottom;
      depth.tx = inside ? clamp((e.clientX - (r.left + r.width / 2)) / (r.width / 2), -1, 1) : 0;
      depth.ty = inside ? clamp((e.clientY - (r.top + r.height / 2)) / (r.height / 2), -1, 1) : 0;
    }

    magnets.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (!r.width) return;
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      if (Math.hypot(dx, dy) < 90) el.style.translate = clamp(dx * 0.28, -6, 6).toFixed(1) + 'px ' + clamp(dy * 0.28, -6, 6).toFixed(1) + 'px'; // 6px at most
      else if (el.style.translate) el.style.translate = '';
    });

    const card = e.target.closest ? e.target.closest('.project') : null;
    if (card !== activeCard) releaseCard();
    if (card) {
      activeCard = card;
      const r = card.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width;
      const ny = (e.clientY - r.top) / r.height;
      card.style.setProperty('--mx', Math.round(e.clientX - r.left) + 'px');
      card.style.setProperty('--my', Math.round(e.clientY - r.top) + 'px');
      card.style.setProperty('--ry', ((nx - 0.5) * 8).toFixed(2) + 'deg'); // 4 degrees at most
      card.style.setProperty('--rx', ((0.5 - ny) * 8).toFixed(2) + 'deg');
    }
    wake();
  }, { passive: true });

  document.documentElement.addEventListener('mouseleave', () => {
    if (glow) glow.classList.remove('is-on');
    depth.tx = 0;
    depth.ty = 0;
    magnets.forEach((el) => { el.style.translate = ''; });
    releaseCard();
    wake();
  });
}

/* ---------- Looping animations only run while visible: off-screen groups pause, and everything pauses in a hidden tab ---------- */
function initLoopPausing() {
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => entries.forEach((en) => en.target.classList.toggle('is-paused', !en.isIntersecting)));
    $$('.stage, .marquee, .flow').forEach((el) => io.observe(el));
  }
  document.addEventListener('visibilitychange', () => root.classList.toggle('is-paused', document.hidden));
}

start('reveal', initReveal);
start('theme', initTheme);
start('accent picker', initAccent);
start('navigation', initNavigation);
start('scroll effects', initScrollEffects);
start('more sheet', initSheet);
start('form focus', initFormFocus);
start('toast', initToast);
start('year', initYear);
start('experience timeline', initTimeline);
start('projects carousel', initCarousel);
start('skills accordion', initSkills);
start('achievement tabs', initTabs);
start('hobby toys', initHobbies);
start('contact form', initContact);
start('count-up numbers', initCounters);
start('role rotator', initRoleRotator);
start('pointer effects', initPointerEffects);
start('loop pausing', initLoopPausing);
