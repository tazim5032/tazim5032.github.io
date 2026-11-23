// Shared page behaviour: theme toggle, header state, reveal animations,
// active nav link, latest posts, footer year and analytics events.
(function () {
  var root = document.documentElement;

  /* Theme */
  var btn = document.getElementById('theme');
  function isDark() {
    var t = root.getAttribute('data-theme');
    return t ? t === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  function paint() {
    if (btn) btn.innerHTML = '<svg class="i"><use href="#i-' + (isDark() ? 'sun' : 'moon') + '"/></svg>';
  }
  try { var saved = localStorage.getItem('theme'); if (saved) root.setAttribute('data-theme', saved); } catch (e) {}
  paint();
  if (btn) btn.addEventListener('click', function () {
    var next = isDark() ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
    paint();
  });

  /* Header shadow once scrolled */
  var top = document.querySelector('.top');
  function onScroll() { if (top) top.classList.toggle('scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Reveal on scroll */
  function observeReveals(scope) {
    var els = (scope || document).querySelectorAll('.reveal:not(.in)');
    if (!('IntersectionObserver' in window)) { [].forEach.call(els, function (el) { el.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    [].forEach.call(els, function (el, i) {
      // Small stagger for siblings in the same grid.
      var sibs = el.parentElement ? el.parentElement.querySelectorAll(':scope > .reveal') : [];
      var idx = [].indexOf.call(sibs, el);
      if (idx > 0) el.style.transitionDelay = Math.min(idx, 5) * 70 + 'ms';
      io.observe(el);
    });
  }
  observeReveals();
  window.__observeReveals = observeReveals;

  /* Projects: show the first 3 cards, reveal the rest on demand */
  var pGrid = document.getElementById('project-grid');
  var pToggle = document.getElementById('projects-toggle');
  var pWrap = document.getElementById('projects-more');
  if (pGrid && pToggle && pWrap) {
    var extra = pGrid.querySelectorAll(':scope > .proj:nth-child(n+4)').length;
    if (extra > 0) {
      var setToggle = function () {
        var open = !pGrid.classList.contains('collapsed');
        pToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        pToggle.textContent = open ? 'Show fewer' : 'See more projects (' + extra + ')';
      };
      pGrid.classList.add('collapsed');
      pWrap.hidden = false;
      setToggle();
      pToggle.addEventListener('click', function () {
        pGrid.classList.toggle('collapsed');
        setToggle();
        if (!pGrid.classList.contains('collapsed')) observeReveals(pGrid);
        else { var s = document.getElementById('projects'); if (s) s.scrollIntoView({ block: 'start' }); }
      });
    }
  }

  /* Active nav link for in-page sections */
  var navLinks = document.querySelectorAll('.nav a[href^="#"]');
  if (navLinks.length && 'IntersectionObserver' in window) {
    var map = {};
    [].forEach.call(navLinks, function (a) { var s = document.querySelector(a.getAttribute('href')); if (s) map[s.id] = a; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && map[en.target.id]) {
          [].forEach.call(navLinks, function (a) { a.classList.remove('active'); });
          map[en.target.id].classList.add('active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(map).forEach(function (id) { spy.observe(document.getElementById(id)); });
  }

  /* Post cards (used by the homepage "Latest writing" and the blog list) */
  function esc(s) { return String(s || '').replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function fmtDate(d) { var x = new Date(d + 'T00:00:00'); return isNaN(x) ? esc(d) : x.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }); }
  function postCard(p, heading) {
    var h = heading || 'h2';
    return '<a class="card post-card reveal" href="post.html?slug=' + encodeURIComponent(p.slug) + '">' +
      '<div class="meta"><span>' + fmtDate(p.date) + '</span>' + (p.readingTime ? '<span>· ' + esc(p.readingTime) + '</span>' : '') +
      (p.tags || []).map(function (t) { return '<span class="t">' + esc(t) + '</span>'; }).join('') + '</div>' +
      '<' + h + '>' + esc(p.title) + '</' + h + '><p>' + esc(p.summary) + '</p>' +
      '<span class="more">Read post <svg class="i"><use href="#i-arrow"/></svg></span></a>';
  }
  window.Site = { esc: esc, fmtDate: fmtDate, postCard: postCard, observeReveals: observeReveals };

  var latest = document.getElementById('latest');
  if (latest) {
    fetch('posts/posts.json', { cache: 'no-cache' }).then(function (r) { return r.json(); }).then(function (posts) {
      posts = posts.filter(function (p) { return !p.draft; }).sort(function (a, b) { return b.date.localeCompare(a.date); }).slice(0, 2);
      if (!posts.length) { var s = document.getElementById('writing'); if (s) s.hidden = true; return; }
      latest.innerHTML = posts.map(function (p) { return postCard(p, 'h3'); }).join('');
      observeReveals(latest);
    }).catch(function () { var s = document.getElementById('writing'); if (s) s.hidden = true; });
  }

  /* Contact form: posts to Formspree when an endpoint is set, else opens an email draft */
  var form = document.getElementById('contact-form');
  if (form) {
    var status = document.getElementById('cform-status');
    var setStatus = function (msg, cls) { status.textContent = msg; status.className = 'cform-status' + (cls ? ' ' + cls : ''); };
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var f = form.elements, bad = [];
      [f.name, f.email, f.message].forEach(function (el) { el.classList.remove('invalid'); if (!el.value.trim()) bad.push(el); });
      if (f.email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.value.trim())) bad.push(f.email);
      if (bad.length) { bad.forEach(function (el) { el.classList.add('invalid'); }); bad[0].focus(); setStatus('Please fill in your name, a valid email and a message.', 'err'); return; }
      if (f._gotcha.value) return; // bot

      var endpoint = form.getAttribute('data-endpoint');
      if (!endpoint) {
        var subject = f.subject.value.trim() || 'Message from your portfolio';
        var body = f.message.value.trim() + '\n\n' + f.name.value.trim() + '\n' + f.email.value.trim();
        location.href = 'mailto:mfittazim22@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
        setStatus('Your email app should open with the message ready to send.', 'ok');
        return;
      }
      var btnEl = form.querySelector('button[type="submit"]');
      btnEl.disabled = true; setStatus('Sending…');
      fetch(endpoint, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
        .then(function (r) {
          if (!r.ok) throw new Error('bad status');
          form.reset();
          setStatus('Thanks! Your message has been sent.', 'ok');
          if (typeof window.gtag === 'function') gtag('event', 'contact_form_submit');
        })
        .catch(function () { setStatus('Sorry, the message could not be sent. Please email me directly.', 'err'); })
        .then(function () { btnEl.disabled = false; });
    });
  }

  /* Footer year */
  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  /* Analytics events: resume downloads/views, emails, and outbound clicks */
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a || typeof window.gtag !== 'function') return;
    var href = a.getAttribute('href');
    if (/\.pdf$/i.test(href)) {
      gtag('event', a.hasAttribute('download') ? 'resume_download' : 'resume_view', { link_text: a.textContent.trim() });
    } else if (href.indexOf('mailto:') === 0) {
      gtag('event', 'email_click');
    } else if (/^https?:/.test(href) && a.host !== location.host) {
      gtag('event', 'outbound_click', { link_url: href });
    }
  });
})();
