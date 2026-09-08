// Portable pageview beacon: any static site (this one, or a future one) can
// track visits into this same backend by adding, with no other setup,
//   <script defer data-site="site-id" src="https://api.vakpon-tours.com/api/analytics.js"></script>
//
// Tracks a sessionStorage-scoped session id (cleared when the tab closes —
// not a persistent tracking cookie) so visits group into sessions, and a
// best-effort time-on-page sent on pagehide. To track a conversion goal from
// the same site, call: window.vakponAnalytics.track('conversion')
export const ANALYTICS_SNIPPET = `(function () {
  var script = document.currentScript;
  var site = (script && script.getAttribute('data-site')) || 'default';
  var endpoint = (script && script.src || '').replace(/analytics\\.js.*$/, '');
  if (!endpoint) return;

  var sessionId;
  try {
    sessionId = sessionStorage.getItem('__vza_sid');
    if (!sessionId) {
      sessionId = (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(16).slice(2));
      sessionStorage.setItem('__vza_sid', sessionId);
    }
  } catch (e) { sessionId = undefined; }

  function track(eventType) {
    var params = new URLSearchParams(location.search);
    var payload = JSON.stringify({
      site: site,
      path: location.pathname,
      eventType: eventType || 'pageview',
      referrer: document.referrer || '',
      sessionId: sessionId,
      utmSource: params.get('utm_source') || undefined,
      utmMedium: params.get('utm_medium') || undefined,
      utmCampaign: params.get('utm_campaign') || undefined,
    });
    return fetch(endpoint + 'analytics/collect', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: payload, keepalive: true,
    }).then(function (r) { return r.json(); }).catch(function () { return null; });
  }

  var startedAt = Date.now();
  track('pageview').then(function (result) {
    if (!result || !result.id) return;
    var sent = false;
    var sendDuration = function () {
      if (sent) return;
      sent = true;
      var payload = JSON.stringify({ id: result.id, durationMs: Date.now() - startedAt });
      navigator.sendBeacon && navigator.sendBeacon(endpoint + 'analytics/duration', new Blob([payload], { type: 'application/json' }));
    };
    document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden') sendDuration(); });
    addEventListener('pagehide', sendDuration);
  });

  window.vakponAnalytics = { track: track };
})();
`;
