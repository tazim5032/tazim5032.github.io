// Google Analytics 4 loader, shared by every page.
// 1. Create a GA4 property at https://analytics.google.com
// 2. Admin > Data streams > Web > copy the Measurement ID (looks like G-ABC123XYZ)
// 3. Paste it below. Leave it empty to turn analytics off.
var GA_MEASUREMENT_ID = '';

(function () {
  var host = location.hostname;
  var isLocal = host === 'localhost' || host === '127.0.0.1' || host === '';
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { dataLayer.push(arguments); };
  // Don't count your own local previews.
  if (!GA_MEASUREMENT_ID || isLocal) return;
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA_MEASUREMENT_ID);
  document.head.appendChild(s);
  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID);
})();
