(function () {
  'use strict';

  var VID_KEY = 'pf_visitor_id';
  var SESSION_KEY = 'pf_session';
  var ENDPOINT = '/.netlify/functions/track';

  // Skip when Do Not Track is on, and on localhost (add ?track=1 to test locally)
  var dnt = navigator.doNotTrack === '1' || window.doNotTrack === '1';
  var isLocal = ['localhost', '127.0.0.1'].indexOf(location.hostname) !== -1;
  if (dnt || (isLocal && !/[?&]track=1/.test(location.search))) return;

  function makeId() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return 'vid-' + Math.random().toString(36).slice(2, 10) + '-' + Date.now().toString(36);
  }

  function getVisitorId() {
    try {
      var id = localStorage.getItem(VID_KEY);
      if (!id) { id = makeId(); localStorage.setItem(VID_KEY, id); }
      return id;
    } catch (e) { return null; }
  }

  function run() {
    try { if (sessionStorage.getItem(SESSION_KEY)) return; sessionStorage.setItem(SESSION_KEY, '1'); } catch (e) {}

    var id = getVisitorId();
    if (!id) return;

    var q = new URLSearchParams(location.search);
    fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        visitorId: id,
        path: location.pathname,
        referrer: document.referrer || null,
        ref: q.get('ref') || q.get('utm_source') || null,
      }),
      keepalive: true,
    }).catch(function () {});
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
})();
