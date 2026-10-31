(function () {
  'use strict';
  var API = '/.netlify/functions/';
  var $ = function (s) { return document.querySelector(s); };
  var token = sessionStorage.getItem('admin_token');
  var charts = {};

  // Always escape stored data before putting it into the page
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function fmt(d) { return d ? new Date(d).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '-'; }

  async function api(path, opts) {
    opts = opts || {};
    var res = await fetch(API + path, Object.assign({}, opts, {
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
    }));
    if (res.status === 401) { logout(); throw new Error('Session expired. Please sign in again.'); }
    var data = await res.json().catch(function () { return {}; });
    if (!res.ok || data.ok === false) throw new Error(data.error || 'Request failed');
    return data;
  }

  function show(loggedIn) {
    $('#login').hidden = loggedIn;
    $('#app').hidden = !loggedIn;
  }

  function logout() {
    token = null;
    sessionStorage.removeItem('admin_token');
    show(false);
  }

  /* ---------- Login ---------- */
  $('#loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    $('#loginError').textContent = '';
    try {
      var res = await fetch(API + 'admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: $('#password').value }),
      });
      var data = await res.json().catch(function () { return {}; });
      if (!res.ok || !data.ok) throw new Error(data.error || 'Login failed');
      token = data.token;
      sessionStorage.setItem('admin_token', token);
      $('#password').value = '';
      show(true);
      loadAll();
    } catch (err) {
      $('#loginError').textContent = err.message;
    }
  });

  $('#logout').addEventListener('click', logout);
  $('#refresh').addEventListener('click', loadAll);
  $('#range').addEventListener('change', loadStats);
  $('#msgFilter').addEventListener('change', loadMessages);

  /* ---------- Stats ---------- */
  function list(el, rows) {
    $(el).innerHTML = rows.length
      ? rows.map(function (r) { return '<div class="rowline"><span>' + esc(r.name) + '</span><b>' + r.count + '</b></div>'; }).join('')
      : '<p class="muted">No data yet</p>';
  }

  function draw(id, config) {
    if (charts[id]) charts[id].destroy();
    charts[id] = new Chart($('#' + id), config);
  }

  async function loadStats() {
    $('#error').textContent = '';
    try {
      var d = await api('admin-stats?days=' + $('#range').value);
      var k = d.kpis;
      var cards = [
        ['Total visits', k.totalVisits], ['Unique visitors', k.uniqueVisitors],
        ['New visitors', k.newVisitors], ['Returning visits', k.returningVisits],
        ['Today', k.today], ['All-time visitors', k.allTimeVisitors],
        ['Visitors who came back', k.cameBackAllTime], ['Unread messages', k.messagesUnread + ' / ' + k.messagesTotal],
      ];
      $('#kpis').innerHTML = cards.map(function (c) { return '<div class="kpi"><b>' + esc(c[1]) + '</b><span>' + c[0] + '</span></div>'; }).join('');

      draw('lineChart', {
        type: 'line',
        data: {
          labels: d.daily.map(function (x) { return x.date; }),
          datasets: [
            { label: 'New visitors', data: d.daily.map(function (x) { return x.newVisitors; }), borderColor: '#8b8bff', backgroundColor: 'rgba(139,139,255,.2)', fill: true, tension: .3 },
            { label: 'Returning visits', data: d.daily.map(function (x) { return x.returning; }), borderColor: '#22c55e', backgroundColor: 'rgba(34,197,94,.15)', fill: true, tension: .3 },
          ],
        },
        options: { responsive: true, scales: { y: { beginAtZero: true, ticks: { precision: 0 } } }, plugins: { legend: { labels: { color: '#e8ebf6' } } } },
      });
      draw('donut', {
        type: 'doughnut',
        data: { labels: ['New', 'Returning'], datasets: [{ data: [k.newVisitors, k.returningVisits], backgroundColor: ['#8b8bff', '#22c55e'], borderWidth: 0 }] },
        options: { plugins: { legend: { labels: { color: '#e8ebf6' } } } },
      });

      list('#sources', d.sources); list('#devices', d.devices); list('#browsers', d.browsers); list('#countries', d.countries);

      $('#recent').innerHTML = d.recent.length
        ? '<table><tr><th>Visitor</th><th>Visits</th><th>First seen</th><th>Last seen</th><th>Device</th><th>Browser</th><th>Country</th><th>Source</th></tr>' +
          d.recent.map(function (v) {
            return '<tr><td>' + esc(v.visitorId) + '</td><td>' + v.visitCount + '</td><td>' + fmt(v.firstVisit) + '</td><td>' + fmt(v.lastVisit) +
              '</td><td>' + esc(v.device) + '</td><td>' + esc(v.browser) + '</td><td>' + esc(v.country || 'Unknown') + '</td><td>' + esc(v.lastSource) + '</td></tr>';
          }).join('') + '</table>'
        : '<p class="muted">No visitors yet</p>';
    } catch (err) {
      $('#error').textContent = err.message;
    }
  }

  /* ---------- Messages ---------- */
  async function loadMessages() {
    try {
      var d = await api('admin-messages?status=' + encodeURIComponent($('#msgFilter').value));
      var unread = d.items.filter(function (m) { return m.status === 'new'; }).length;
      $('#badge').textContent = unread ? unread + ' new' : '';
      $('#messages').innerHTML = d.items.length
        ? d.items.map(function (m) {
            return '<div class="msg ' + esc(m.status) + '"><div class="meta"><b>' + esc(m.name) + '</b> &middot; ' + esc(m.email) +
              ' &middot; ' + fmt(m.createdAt) + ' <span class="tag">' + esc(m.status) + '</span>' +
              (m.emailSent ? '' : ' <span class="tag">email not sent</span>') + '</div>' +
              (m.subject ? '<b>' + esc(m.subject) + '</b>' : '') + '<p>' + esc(m.message) + '</p>' +
              '<div class="actions">' +
              '<a class="btn small" href="mailto:' + encodeURIComponent(m.email) + '?subject=' + encodeURIComponent('Re: ' + (m.subject || 'your message')) + '">Reply</a>' +
              (m.status !== 'read' ? '<button class="btn small ghost" data-act="read" data-id="' + esc(m._id) + '">Mark read</button>' : '') +
              (m.status !== 'archived' ? '<button class="btn small ghost" data-act="archived" data-id="' + esc(m._id) + '">Archive</button>' : '') +
              '<button class="btn small ghost" data-act="delete" data-id="' + esc(m._id) + '">Delete</button></div></div>';
          }).join('')
        : '<p class="muted">No messages</p>';
    } catch (err) {
      $('#error').textContent = err.message;
    }
  }

  $('#messages').addEventListener('click', async function (e) {
    var b = e.target.closest('button[data-act]');
    if (!b) return;
    try {
      if (b.dataset.act === 'delete') {
        if (!confirm('Delete this message permanently?')) return;
        await api('admin-messages?id=' + encodeURIComponent(b.dataset.id), { method: 'DELETE' });
      } else {
        await api('admin-messages', { method: 'PATCH', body: JSON.stringify({ id: b.dataset.id, status: b.dataset.act }) });
      }
      loadMessages();
      loadStats();
    } catch (err) {
      $('#error').textContent = err.message;
    }
  });

  function loadAll() { loadStats(); loadMessages(); }

  if (token) { show(true); loadAll(); } else { show(false); }
})();
