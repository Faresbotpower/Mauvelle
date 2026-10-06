/* Mauvelle site prototype: hero intro + pinned scroll story (GSAP + ScrollTrigger). */
(function () {
  gsap.registerPlugin(ScrollTrigger);
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // nav border on scroll
  const nav = $('.nav');
  window.addEventListener('scroll', () => nav.classList.toggle('is-scrolled', window.scrollY > 100), { passive: true });

  // hero intro
  if (!reduce) {
    gsap.from('.hero .reveal', { y: 28, opacity: 0, duration: 1, stagger: 0.12, ease: 'power3.out', delay: 0.1 });
    gsap.from('.hero__art', { opacity: 0, scale: 0.94, duration: 1.4, ease: 'power2.out' });
    // hero art drifts and fades as you leave the hero
    gsap.to('.hero__art', { yPercent: 18, opacity: 0.2, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  }

  // fit the 560px scene to small screens
  const scene = $('.scene');
  function fitScene() {
    const wrap = $('.scene-wrap');
    const s = Math.min(1.15, wrap.clientWidth / 610, wrap.clientHeight / 520);
    gsap.set(scene, { scale: s });
  }
  fitScene();
  window.addEventListener('resize', fitScene);

  // ---------- story timeline ----------
  const box = $('.box'), lid = $('.box__lid');
  const faces = $$('.box__face:not(.box__lid)');
  const sachet = $('.s-sachet'), strip = $('.s-sachet__strip'), body = $('.s-sachet__body'), spatch = $('.s-patch');
  const layers = $('.layers'), back = $('.back'), liner = $('.back__liner');
  const glow = $('.glow--scene'), ring = $('.ring'), ringFill = $('.ring__fill'), ringLabel = $('.ring__label');
  const caps = $$('.cap');
  const callouts = $$('.callout');
  const L = (n) => $('.layer--' + n);
  const order = ['cover', 'core', 'film', 'adhesive', 'liner'];

  gsap.set(box, { rotationY: -30, rotationX: -14 });

  const tl = gsap.timeline({ defaults: { ease: 'power2.inOut', duration: 1 } });
  const cap = (i, at) => {
    tl.to(caps.filter((c, j) => j !== i), { autoAlpha: 0, y: -12, duration: 0.4 }, at);
    tl.fromTo(caps[i], { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.6 }, at + 0.3);
  };

  // 0. the box turns to show itself
  tl.to(box, { rotationY: 24, rotationX: -18, duration: 1.4 }, 0);
  // 1. lid opens, box turns back toward you
  tl.to(lid, { rotationX: 205, duration: 1.1, ease: 'power2.out' }, 1.4)
    .to(box, { rotationY: -12, rotationX: -22, duration: 1.1 }, 1.4);
  // 2. sachet rises out
  cap(1, 2.3);
  tl.to(sachet, { y: -235, duration: 1.2, ease: 'power3.out' }, 2.5);
  // 3. box falls away, sachet faces you, centred
  tl.to(faces.concat(lid), { opacity: 0, duration: 0.6 }, 3.5)
    .to(box, { rotationY: 0, rotationX: 0, duration: 1 }, 3.5)
    .to(sachet, { y: -10, scale: 1.15, duration: 1 }, 3.7);
  // 4. tear the strip
  tl.to(strip, { x: 150, y: -140, rotation: 38, opacity: 0, duration: 0.9, ease: 'power2.in' }, 4.8);
  // 5. the patch slides out, the sachet drops away
  cap(2, 5.4);
  tl.to(spatch, { y: -170, duration: 1, ease: 'power2.out' }, 5.6)
    .to(body, { y: 320, opacity: 0, duration: 1, ease: 'power2.in' }, 6.5)
    .to(spatch, { y: 0, scale: 1.13, duration: 1 }, 6.6)
    .to(sachet, { scale: 1.15, duration: 1 }, 6.6)
    .to(glow, { opacity: 1, duration: 1 }, 6.6);
  // 6. swap to the layered model and tilt into an isometric view
  tl.set(layers, { opacity: 1 }, 7.7)
    .set(spatch, { opacity: 0 }, 7.72)
    .to(layers, { '--rx': '58deg', '--rz': '-38deg', duration: 1 }, 7.8)
    .to(glow, { opacity: 0.45, duration: 1 }, 7.8);
  // 7. explode the layers and bring in callouts
  cap(3, 8.6);
  order.forEach((n, i) => {
    tl.to(L(n), { '--y': (-140 + i * 70) + 'px', '--ao': 1, duration: 1.1, ease: 'power3.out' }, 8.8);
  });
  tl.to(scene, { x: window.innerWidth < 760 ? -65 : -90, duration: 1.1 }, 8.8);
  callouts.forEach((c, i) => tl.to(c, { opacity: 1, duration: 0.5 }, 9.5 + i * 0.12));
  // hold
  tl.to({}, { duration: 1 }, 10.2);
  // 8. collapse, lie flat, flip to the back
  callouts.forEach((c) => tl.to(c, { opacity: 0, duration: 0.4 }, 11.2));
  order.forEach((n) => tl.to(L(n), { '--y': '0px', '--ao': 0, duration: 0.9 }, 11.3));
  tl.to(scene, { x: 0, duration: 0.9 }, 11.3)
    .to(layers, { '--rx': '0deg', '--rz': '0deg', duration: 0.9 }, 12.1);
  cap(4, 12.7);
  tl.to(layers, { scaleX: 0, duration: 0.35, ease: 'power2.in' }, 13)
    .set(layers, { opacity: 0 }, 13.35)
    .fromTo(back, { opacity: 1, scaleX: 0 }, { scaleX: 1, duration: 0.35, ease: 'power2.out' }, 13.35);
  // 9. the liner peels away
  tl.to(liner, { rotationY: -165, x: -30, duration: 1.1, ease: 'power2.inOut' }, 14)
    .to(liner, { opacity: 0, duration: 0.4 }, 14.45);
  // 10. flip to the front, glow, 8-hour ring
  cap(5, 15.4);
  tl.to(back, { scaleX: 0, duration: 0.35, ease: 'power2.in' }, 15.5)
    .set(back, { opacity: 0 }, 15.85)
    .set(layers, { opacity: 1 }, 15.85)
    .to(layers, { scaleX: 1, duration: 0.35, ease: 'power2.out' }, 15.85)
    .to(glow, { opacity: 1, scale: 1.1, duration: 1 }, 16)
    .to(ring, { opacity: 1, duration: 0.4 }, 16)
    .to(ringFill, { strokeDashoffset: 0, duration: 1.6, ease: 'none' }, 16.2)
    .to(ringLabel, { opacity: 1, duration: 0.5 }, 17.2)
    .to({}, { duration: 0.8 }, 17.8);

  // ---------- callout leader lines ----------
  const wrap = $('.scene-wrap');
  const svg = $('.leaders');
  function drawLeaders() {
    const vis = callouts.some((c) => +getComputedStyle(c).opacity > 0.01);
    if (!vis) { svg.innerHTML = ''; return; }
    const w = wrap.getBoundingClientRect();
    const pts = order.map((n) => {
      const r = $('.layer--' + n + ' .anchor').getBoundingClientRect();
      return { x: r.left + r.width / 2 - w.left, y: r.top + r.height / 2 - w.top };
    });
    const colX = Math.max(...pts.map((p) => p.x)) + (window.innerWidth > 900 ? 70 : 28);
    let lastBottom = -Infinity;
    let html = '';
    callouts.forEach((c, i) => {
      const p = pts[i];
      const y = Math.max(p.y - 12, lastBottom + 10);
      lastBottom = y + c.offsetHeight;
      c.style.transform = `translate(${colX}px, ${y}px)`;
      const o = +getComputedStyle(c).opacity;
      const ty = y + 12;
      html += `<g opacity="${o}"><path d="M${p.x} ${p.y} L${colX - 40} ${ty} L${colX - 10} ${ty}"/><circle cx="${p.x}" cy="${p.y}" r="4"/></g>`;
    });
    svg.innerHTML = html;
  }

  const st = ScrollTrigger.create({
    trigger: '.story',
    start: 'top top',
    end: () => '+=' + Math.round(window.innerHeight * 3.7),
    pin: '.story__stage',
    scrub: reduce ? false : 0.6,
    animation: tl,
    onUpdate: (self) => { gsap.set('.progress span', { scaleX: self.progress }); },
  });
  gsap.ticker.add(drawLeaders);

  if (reduce) { st.disable(); tl.pause(0); drawLeaders(); }


  const chapterTimes = [0.5, 4.5, 7.4, 10.7, 15, 18.1];
  const chapterStarts = [0, 2.6, 5.7, 8.9, 13, 15.7];
  const chapters = $$('.chapter');
  let activeChapter = -1;
  function updateChapter() {
    const time = tl.time();
    const index = chapterStarts.reduce((active, start, i) => time >= start ? i : active, 0);
    if (index === activeChapter) return;
    activeChapter = index;
    chapters.forEach((button, i) => {
      button.classList.toggle('is-active', i === index);
      button.setAttribute('aria-pressed', String(i === index));
    });
    caps.forEach((caption, i) => caption.setAttribute('aria-hidden', String(i !== index)));
  }
  tl.eventCallback('onUpdate', updateChapter);
  updateChapter();
  chapters.forEach((button, i) => button.addEventListener('click', () => {
    if (reduce) {
      tl.pause(chapterTimes[i]);
      gsap.set('.progress span', { scaleX: chapterTimes[i] / tl.duration() });
      drawLeaders();
    } else {
      const position = st.start + (chapterTimes[i] / tl.duration()) * (st.end - st.start);
      window.scrollTo({ top: position, behavior: 'smooth' });
    }
  }));

  const menuButton = $('.menu-toggle');
  function closeMenu() {
    nav.classList.remove('menu-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open menu');
  }
  menuButton.addEventListener('click', () => {
    const open = nav.classList.toggle('menu-open');
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  $$('.nav a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && nav.classList.contains('menu-open')) {
      closeMenu();
      menuButton.focus();
    }
  });
  document.addEventListener('click', event => { if (!nav.contains(event.target)) closeMenu(); });

  const ritualButtons = $$('.ritual-step');
  const ritualWords = ['open.', 'place.', 'ahh.'];
  const ritualLabels = ['01 / A moment begins', '02 / Close, over clothing', '03 / A moment for you'];
  ritualButtons.forEach((button, i) => button.addEventListener('click', () => {
    $('.ritual-demo').dataset.ritual = String(i);
    $('.ritual-word').textContent = ritualWords[i];
    $('.ritual-stage-label').textContent = ritualLabels[i];
    ritualButtons.forEach((step, j) => {
      step.classList.toggle('is-active', i === j);
      step.setAttribute('aria-pressed', String(i === j));
    });
  }));

  if (!reduce) {
    gsap.from('.philosophy__intro h2, .how__heading h2', {
      y: 30, opacity: 0, duration: 1, stagger: .15,
      scrollTrigger: { trigger: '.philosophy', start: 'top 85%', once: true }
    });
    gsap.fromTo('.editorial-image > img', { scale: 1.12, yPercent: -3 }, {
      scale: 1, yPercent: 0, ease: 'none',
      scrollTrigger: { trigger: '.editorial-grid', start: 'top bottom', end: 'bottom top', scrub: 1 }
    });
    gsap.fromTo('.manifesto__moon', { rotation: -18, y: 65 }, {
      rotation: 8, y: -35, ease: 'none',
      scrollTrigger: { trigger: '.manifesto', start: 'top bottom', end: 'bottom top', scrub: 1 }
    });
  }

  const form = $('.form');
  const status = $('.form__status');
  const submit = $('button', form);
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!form.reportValidity() || submit.disabled) return;
    submit.disabled = true;
    submit.textContent = 'Saving…';
    status.textContent = '';
    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: $('#email').value })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'We could not save your email. Please try again.');
      form.classList.add('is-sent');
      status.textContent = 'You’re on the local preview list. A little warmth to look forward to.';
    } catch (error) {
      status.textContent = error.message === 'Failed to fetch' ? 'We could not reach the local server. Please try again.' : error.message;
    } finally {
      submit.disabled = false;
      submit.innerHTML = 'Keep me close <span aria-hidden="true">↗</span>';
    }
  });
  document.fonts.ready.then(() => { fitScene(); ScrollTrigger.refresh(); });
})();
