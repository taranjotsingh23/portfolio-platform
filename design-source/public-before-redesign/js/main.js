(function () {
  'use strict';
  var root = document.documentElement;

  /* Theme */
  var saved = null;
  try { saved = localStorage.getItem('theme'); } catch (e) {}
  root.dataset.theme = saved || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.getElementById('themeBtn').addEventListener('click', function () {
    var next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) {}
  });

  /* Mobile menu */
  var nav = document.getElementById('nav');
  document.getElementById('menuBtn').addEventListener('click', function () { nav.classList.toggle('open'); });
  nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { nav.classList.remove('open'); }); });

  /* Active link while scrolling */
  var links = {};
  nav.querySelectorAll('a[href^="#"]').forEach(function (a) { links[a.getAttribute('href').slice(1)] = a; });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting && links[en.target.id]) {
        Object.keys(links).forEach(function (k) { links[k].classList.remove('active'); });
        links[en.target.id].classList.add('active');
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  document.querySelectorAll('main section[id]').forEach(function (s) { io.observe(s); });

  document.getElementById('year').textContent = new Date().getFullYear();

  /* Contact form */
  var form = document.getElementById('contactForm');
  var statusEl = document.getElementById('formStatus');
  var started = Date.now();

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    var btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    statusEl.className = 'status';
    statusEl.textContent = 'Sending...';

    var data = Object.fromEntries(new FormData(form).entries());
    data.elapsed = Date.now() - started;

    try {
      var res = await fetch('/.netlify/functions/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      var out = await res.json().catch(function () { return {}; });
      if (!res.ok || out.ok === false) throw new Error(out.error || 'Could not send. Please email me directly.');
      form.reset();
      statusEl.className = 'status ok';
      statusEl.textContent = 'Thanks! Your message has been sent.';
    } catch (err) {
      statusEl.className = 'status err';
      statusEl.textContent = err.message;
    } finally {
      btn.disabled = false;
    }
  });
})();
