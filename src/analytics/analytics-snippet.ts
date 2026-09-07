// Portable pageview beacon: any static site (this one, or a future one) can
// track visits into this same backend by adding, with no other setup,
//   <script defer data-site="site-id" src="https://api.vakpon-tours.com/api/analytics.js"></script>
export const ANALYTICS_SNIPPET = `(function () {
  var script = document.currentScript;
  var site = (script && script.getAttribute('data-site')) || 'default';
  var endpoint = (script && script.src || '').replace(/analytics\\.js.*$/, 'analytics/collect');
  if (!endpoint) return;
  var params = new URLSearchParams(location.search);
  var payload = JSON.stringify({
    site: site,
    path: location.pathname,
    referrer: document.referrer || '',
    utmSource: params.get('utm_source') || undefined,
    utmMedium: params.get('utm_medium') || undefined,
    utmCampaign: params.get('utm_campaign') || undefined,
  });
  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon(endpoint, new Blob([payload], { type: 'application/json' }));
    } else {
      fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: payload, keepalive: true });
    }
  } catch (e) {}
})();
`;
