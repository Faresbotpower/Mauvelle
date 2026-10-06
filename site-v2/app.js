/* Mauvelle site v2: intro, smooth scroll, hero parallax, scroll stories (GSAP + ScrollTrigger + Lenis). */
(function () {
  gsap.registerPlugin(ScrollTrigger);
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  const mobile = () => window.innerWidth <= 900;

  // ---------- smooth scroll ----------
  let lenis = null;
  if (!reduce && window.Lenis) {
    lenis = new Lenis({ duration: 1.15, smoothWheel: true, easing: (t) => 1 - Math.pow(1 - t, 3.2) });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
  }
  $$('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    const el = id.length > 1 && $(id);
    if (!el) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(el, { offset: 0, duration: 1.6 });
    else el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  }));

  // ---------- intro ----------
  function heroIn() {
    document.body.classList.remove('is-loading');
    if (lenis) lenis.start();
    if (reduce) return;
    const t = gsap.timeline({ defaults: { ease: 'expo.out' } });
    t.from('.hero__photo', { clipPath: 'inset(100% 0% 0% 0% round 28px)', duration: 1.6, ease: 'expo.inOut' }, 0)
      .from('.hero__img img', { scale: 1.4, duration: 2.4 }, 0.2)
      .from('.line__in', { yPercent: 110, duration: 1.6, stagger: 0.18 }, 0.5)
      .from('.sticker', { scale: 0, rotate: -90, duration: 1.4 }, 1.1)
      .from('.hero__meta > *, .hero__side > *, .hero__cap', { y: 30, opacity: 0, duration: 1.2, stagger: 0.08 }, 0.9)
      .from('.nav__pill', { y: -40, opacity: 0, duration: 1.2 }, 0.3);
  }
  const loader = $('.loader');
  if (reduce || !loader) { if (loader) loader.remove(); heroIn(); }
  else {
    gsap.timeline({ onComplete: () => loader.remove() })
      .to('.loader__mark', { clipPath: 'inset(0% 0 0 0)', duration: 0.9, ease: 'power3.inOut' })
      .to('.loader__word', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 0.35)
      .to('.loader__bar i', { scaleX: 1, duration: 1, ease: 'power2.inOut' }, 0.2)
      .to('.loader__veil', { yPercent: -100, duration: 0.9, ease: 'expo.inOut' }, 1.25)
      .to('.loader__inner', { y: -40, opacity: 0, duration: 0.6, ease: 'power2.in' }, 1.2)
      .add(() => loader.classList.add('is-done'), 1.7)
      .to(loader, { yPercent: -100, duration: 1, ease: 'expo.inOut' }, 1.75)
      .add(heroIn, 1.95);
  }

  // ---------- chrome: progress bar, nav hide, nav ink ----------
  const nav = $('.nav');
  let lastY = 0;
  ScrollTrigger.create({
    start: 0, end: 'max',
    onUpdate: (self) => {
      gsap.set('.scrollbar span', { scaleX: self.progress });
      const y = self.scroll();
      if (y > 300 && y > lastY + 2) nav.classList.add('is-hidden');
      else if (y < lastY - 2 || y < 300) nav.classList.remove('is-hidden');
      lastY = y;
    },
  });
  const ink = $('.nav__ink');
  const links = $$('.nav__links a');
  function moveInk(a) {
    if (!a) { ink.style.opacity = 0; return; }
    ink.style.opacity = 1;
    ink.style.width = a.offsetWidth + 'px';
    ink.style.transform = `translateX(${a.offsetLeft}px)`;
  }
  let activeLink = null;
  links.forEach((a) => {
    a.addEventListener('mouseenter', () => moveInk(a));
    const sec = $(a.getAttribute('href'));
    if (sec) ScrollTrigger.create({ trigger: sec, start: 'top 50%', end: 'bottom 50%', onToggle: (s) => { if (s.isActive) { activeLink = a; moveInk(a); } else if (activeLink === a) { activeLink = null; moveInk(null); } } });
  });
  $('.nav__links').addEventListener('mouseleave', () => moveInk(activeLink));

  // ---------- cursor + magnetic ----------
  if (finePointer && !reduce) {
    const cur = $('.cursor');
    const rx = gsap.quickTo('.cursor__ring', 'x', { duration: 0.5, ease: 'power3' });
    const ry = gsap.quickTo('.cursor__ring', 'y', { duration: 0.5, ease: 'power3' });
    const dx = gsap.quickTo('.cursor__dot', 'x', { duration: 0.08 });
    const dy = gsap.quickTo('.cursor__dot', 'y', { duration: 0.08 });
    window.addEventListener('pointermove', (e) => { rx(e.clientX); ry(e.clientY); dx(e.clientX); dy(e.clientY); });
    document.addEventListener('pointerover', (e) => {
      cur.classList.toggle('is-hover', !!e.target.closest('a, button, .panel, .q, input'));
      cur.classList.toggle('is-light', !!e.target.closest('.waitlist, .foot, .tile--plum'));
    });
    $$('.magnetic').forEach((el) => {
      const mx = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'elastic.out(1, .5)' });
      const my = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'elastic.out(1, .5)' });
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        mx((e.clientX - r.left - r.width / 2) * 0.25);
        my((e.clientY - r.top - r.height / 2) * 0.35);
      });
      el.addEventListener('pointerleave', () => { mx(0); my(0); });
    });
  }

  // ---------- hero ----------
  if (!reduce) {
    const hero = $('.hero');
    if (finePointer) {
      const ix = gsap.quickTo('.hero__img img', 'x', { duration: 1.6, ease: 'power3' });
      const iy = gsap.quickTo('.hero__img img', 'y', { duration: 1.6, ease: 'power3' });
      hero.addEventListener('pointermove', (e) => {
        const nx = e.clientX / window.innerWidth - 0.5, ny = e.clientY / window.innerHeight - 0.5;
        ix(nx * -24); iy(ny * -16);
      });
    }
    gsap.timeline({ scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } })
      .to('.line--a .line__in', { xPercent: -14, ease: 'none' }, 0)
      .to('.line--b .line__in', { xPercent: 10, ease: 'none' }, 0)
      .to('.hero__img img', { scale: 1.0, yPercent: 8, ease: 'none' }, 0)
      .to('.sticker', { rotate: 120, y: -80, ease: 'none' }, 0);
  }

  // ---------- product cards ----------
  if (!reduce) gsap.from('.pcard', { y: 100, opacity: 0, duration: 1.4, stagger: 0.1, ease: 'expo.out', scrollTrigger: { trigger: '.products__grid', start: 'top 85%' } });

  // ---------- marquee ----------
  const marquees = $$('.marquee__row').map((row) => {
    const track = $('.marquee__track', row);
    track.innerHTML += track.innerHTML;
    const dir = +row.dataset.dir || -1;
    const tw = gsap.fromTo(track, { xPercent: dir < 0 ? 0 : -50 }, { xPercent: dir < 0 ? -50 : 0, duration: 38, ease: 'none', repeat: -1 });
    if (reduce) tw.pause();
    return tw;
  });
  if (!reduce) {
    let settle = null;
    ScrollTrigger.create({
      trigger: '.marquee', start: 'top bottom', end: 'bottom top',
      onUpdate: (s) => {
        const v = Math.min(Math.abs(s.getVelocity()) / 400, 5);
        marquees.forEach((m) => gsap.to(m, { timeScale: 1 + v, duration: 0.3, overwrite: true }));
        if (settle) settle.kill();
        settle = gsap.delayedCall(0.3, () => marquees.forEach((m) => gsap.to(m, { timeScale: 1, duration: 1.2, overwrite: true })));
      },
    });
  }

  // ---------- manifesto: words fill in ----------
  const mt = $('.manifesto__text');
  const words = [];
  Array.from(mt.childNodes).forEach((node) => {
    if (node.nodeType !== 3) return;
    const frag = document.createDocumentFragment();
    node.textContent.split(/(\s+)/).forEach((part) => {
      if (!part) return;
      if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
      const s = document.createElement('span'); s.className = 'w'; s.textContent = part; words.push(s); frag.appendChild(s);
    });
    mt.replaceChild(frag, node);
  });
  if (reduce) words.forEach((w) => w.classList.add('on'));
  else {
    ScrollTrigger.create({
      trigger: mt, start: 'top 80%', end: 'bottom 45%', scrub: true,
      onUpdate: (s) => { const n = Math.round(s.progress * words.length); words.forEach((w, i) => w.classList.toggle('on', i < n)); },
    });
    gsap.fromTo('.manifesto__photo img', { yPercent: -12 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: '.manifesto', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.from('.manifesto__photo', { clipPath: 'inset(30% 10% 30% 10% round 28px)', duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: '.manifesto', start: 'top 60%' } });
    gsap.fromTo('.band__img img', { yPercent: -16 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: '.band', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.from('.band__title > *', { yPercent: 80, opacity: 0, duration: 1.6, stagger: 0.15, ease: 'expo.out', scrollTrigger: { trigger: '.band', start: 'top 45%' } });
  }
  function countUp(el) {
    const end = +el.dataset.count;
    if (reduce || el.hasAttribute('data-fixed')) { el.textContent = end; return; }
    const o = { v: 0 };
    gsap.to(o, { v: end, duration: 1.8, ease: 'power3.out', onUpdate: () => { el.textContent = Math.round(o.v); } });
  }
  $$('.manifesto__stats b').forEach((b) => ScrollTrigger.create({ trigger: b, start: 'top 90%', once: true, onEnter: () => countUp(b) }));

  // ---------- story (pinned) ----------
  const scene = $('.scene');
  function fitScene() {
    const wrap = $('.scene-wrap');
    const s = Math.min(1.12, wrap.clientWidth / 600, wrap.clientHeight / 580);
    gsap.set(scene, { scale: s });
  }
  fitScene();
  window.addEventListener('resize', fitScene);

  const box = $('.box'), lid = $('.box__lid');
  const faces = $$('.box__face:not(.box__lid)');
  const sachet = $('.s-sachet'), strip = $('.s-sachet__strip'), body = $('.s-sachet__body'), spatch = $('.s-patch');
  const layers = $('.layers'), back = $('.back'), liner = $('.back__liner');
  const glow = $('.glow--scene'), ring = $('.ring'), ringFill = $('.ring__fill'), ringLabel = $('.ring__label');
  const caps = $$('.cap');
  const callouts = $$('.callout');
  const L = (n) => $('.layer--' + n);
  const order = ['cover', 'core', 'film', 'adhesive', 'liner'];
  const stepAt = [0, 2.3, 5.4, 8.6, 12.7, 15.4];

  gsap.set(box, { rotationY: -30, rotationX: -14 });

  const tl = gsap.timeline({ defaults: { ease: 'power2.inOut', duration: 1 } });
  const cap = (i, at) => {
    tl.to(caps.filter((c, j) => j !== i), { opacity: 0, y: -12, duration: 0.4 }, at);
    tl.fromTo(caps[i], { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6 }, at + 0.3);
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
  // 6. swap to the layered model, tilt, stage warms to lilac
  tl.set(layers, { opacity: 1 }, 7.7)
    .set(spatch, { opacity: 0 }, 7.72)
    .to(layers, { '--rx': '58deg', '--rz': '-38deg', duration: 1 }, 7.8)
    .to(glow, { opacity: 0.45, duration: 1 }, 7.8)
    .to('.story__bg', { backgroundColor: '#e6ddf2', duration: 1.2 }, 7.8);
  // 7. explode the layers and bring in callouts
  cap(3, 8.6);
  order.forEach((n, i) => {
    tl.to(L(n), { '--y': (-140 + i * 70) + 'px', '--ao': 1, duration: 1.1, ease: 'power3.out' }, 8.8);
  });
  tl.to(scene, { x: () => (mobile() ? -60 : -110), duration: 1.1 }, 8.8);
  callouts.forEach((c, i) => tl.to(c, { opacity: 1, duration: 0.5 }, 9.5 + i * 0.12));
  tl.to({}, { duration: 1 }, 10.2);
  // 8. collapse, lie flat, flip to the back
  callouts.forEach((c) => tl.to(c, { opacity: 0, duration: 0.4 }, 11.2));
  order.forEach((n) => tl.to(L(n), { '--y': '0px', '--ao': 0, duration: 0.9 }, 11.3));
  tl.to(scene, { x: 0, duration: 0.9 }, 11.3)
    .to(layers, { '--rx': '0deg', '--rz': '0deg', duration: 0.9 }, 12.1)
    .to('.story__bg', { backgroundColor: '#f7f1ea', duration: 1 }, 12.1);
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
    .to('.story__bg i', { scale: 1.25, duration: 1.6 }, 16)
    .to(ring, { opacity: 1, duration: 0.4 }, 16)
    .to(ringFill, { strokeDashoffset: 0, duration: 1.6, ease: 'none' }, 16.2)
    .to(ringLabel, { opacity: 1, duration: 0.5 }, 17.2)
    .to({}, { duration: 0.8 }, 17.8);

  // step numeral + index follow the playhead
  const num = $('.story__num span');
  const idx = $$('.story__index li');
  let curStep = 0;
  function syncStep() {
    const t = tl.time();
    let s = 0;
    stepAt.forEach((at, i) => { if (t >= at + 0.3) s = i; });
    if (s === curStep) return;
    const dir = s > curStep ? 1 : -1;
    curStep = s;
    idx.forEach((li, i) => li.classList.toggle('is-on', i === s));
    if (reduce) { num.textContent = '0' + (s + 1); return; }
    gsap.timeline()
      .to(num, { yPercent: -40 * dir, opacity: 0, duration: 0.25, ease: 'power2.in', overwrite: true })
      .add(() => { num.textContent = '0' + (curStep + 1); })
      .fromTo(num, { yPercent: 40 * dir, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.5, ease: 'power3.out' });
  }

  // callout leader lines, redrawn every tick from each layer's anchor
  const wrap = $('.scene-wrap');
  const svg = $('.leaders');
  function drawLeaders() {
    const vis = callouts.some((c) => +getComputedStyle(c).opacity > 0.01);
    if (!vis) { if (svg.innerHTML) svg.innerHTML = ''; return; }
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
    end: () => '+=' + Math.round(window.innerHeight * 7),
    pin: '.story__stage',
    scrub: reduce ? false : 0.8,
    animation: tl,
    onUpdate: (self) => { gsap.set('.progress span', { scaleX: self.progress }); syncStep(); },
  });
  tl.eventCallback('onUpdate', syncStep);
  gsap.ticker.add(drawLeaders);
  if (reduce) { st.disable(); tl.progress(0.56).pause(); syncStep(); drawLeaders(); }

  // ---------- the day (horizontal) ----------
  const dayPin = $('.day__pin'), track = $('.day__track');
  const wavePath = $('.day__wave-fg'), waveSvg = $('.day__wave'), spark = $('.day__spark');
  const waveLen = wavePath.getTotalLength();
  gsap.set(wavePath, { strokeDasharray: waveLen, strokeDashoffset: waveLen });
  function placeSpark(p) {
    const pt = wavePath.getPointAtLength(p * waveLen);
    spark.style.transform = `translate(${(pt.x / 1000) * waveSvg.clientWidth}px, ${waveSvg.offsetTop + (pt.y / 100) * waveSvg.clientHeight}px)`;
  }
  const dist = () => Math.max(0, track.scrollWidth - (dayPin.clientWidth - track.offsetLeft));
  if (reduce) { gsap.set(wavePath, { strokeDashoffset: 0 }); placeSpark(1); }
  else {
    const slide = gsap.to(track, { x: () => -dist(), ease: 'none' });
    const dayTl = gsap.timeline({ defaults: { ease: 'none' } })
      .add(slide, 0)
      .to(wavePath, { strokeDashoffset: 0, onUpdate: function () { placeSpark(this.progress()); } }, 0);
    ScrollTrigger.create({
      trigger: '.day', start: 'top top', end: () => '+=' + dist(), pin: dayPin, scrub: 0.8,
      animation: dayTl, invalidateOnRefresh: true,
    });
    placeSpark(0);
    $$('.moment').forEach((m) => {
      const moon = $('.moon', m);
      const lit = parseFloat(moon.style.getPropertyValue('--lit')) || 1;
      gsap.to($('.moment__photo img', m), { scale: 1, ease: 'none', scrollTrigger: { trigger: m, containerAnimation: slide, start: 'left right', end: 'right left', scrub: true } });
      gsap.fromTo(moon, { '--lit': 0 }, { '--lit': lit, ease: 'none', scrollTrigger: { trigger: m, containerAnimation: slide, start: 'left 95%', end: 'left 45%', scrub: true } });
      gsap.from($$('.moment__time, h3, p:last-child', m), { y: 40, opacity: 0, stagger: 0.08, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: m, containerAnimation: slide, start: 'left 85%' } });
    });
  }

  // ---------- details bento ----------
  const cells = $('.cells');
  if (cells) for (let i = 0; i < 36; i++) { const c = document.createElement('i'); c.style.setProperty('--d', (i % 6) + Math.floor(i / 6)); cells.appendChild(c); }
  $$('.tile').forEach((t) => {
    t.addEventListener('pointermove', (e) => {
      const r = t.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      t.style.setProperty('--mx', x + 'px'); t.style.setProperty('--my', y + 'px');
      if (!reduce && finePointer) t.style.transform = `perspective(900px) rotateX(${(0.5 - y / r.height) * 4}deg) rotateY(${(x / r.width - 0.5) * 4}deg)`;
    });
    t.addEventListener('pointerleave', () => { t.style.transform = ''; });
  });
  const hoursB = $('.tile--hours b'), hoursRing = $('.tile__ring .fill');
  if (reduce) { hoursB.textContent = hoursB.dataset.count; gsap.set(hoursRing, { strokeDashoffset: 0 }); }
  else ScrollTrigger.create({ trigger: '.tile--hours', start: 'top 75%', once: true, onEnter: () => {
    countUp(hoursB);
    gsap.to(hoursRing, { strokeDashoffset: 0, duration: 2.2, ease: 'power2.inOut' });
  } });
  if (!reduce) {
    gsap.from('.tile', { y: 80, opacity: 0, scale: 0.94, duration: 1.2, ease: 'expo.out', stagger: 0.07, scrollTrigger: { trigger: '.bento', start: 'top 80%' } });
    gsap.to('.flexline path', { attr: { d: 'M5 30 Q 55 55 100 30 T 195 30' }, duration: 2.2, ease: 'sine.inOut', yoyo: true, repeat: -1 });
  }

  // ---------- headings rise ----------
  if (!reduce) {
    $$('.h1.big, .day__title, .waitlist__title, .arabic__logo').forEach((h) => {
      gsap.from(h, { y: 70, opacity: 0, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: h, start: 'top 88%' } });
    });
  }

  // ---------- how to wear panels ----------
  const panels = $$('.panel');
  let pIdx = 0, auto = null;
  function setPanel(i) {
    pIdx = i;
    panels.forEach((p, j) => p.classList.toggle('is-active', j === i));
  }
  function startAuto() { if (reduce || auto) return; auto = setInterval(() => setPanel((pIdx + 1) % panels.length), 3800); }
  function stopAuto() { clearInterval(auto); auto = null; }
  panels.forEach((p, i) => {
    const pick = () => { setPanel(i); stopAuto(); };
    p.addEventListener('click', pick);
    p.addEventListener('focus', pick);
    if (finePointer) p.addEventListener('mouseenter', pick);
  });
  ScrollTrigger.create({ trigger: '.panels', start: 'top 80%', end: 'bottom 20%', onToggle: (s) => (s.isActive ? startAuto() : stopAuto()) });
  if (!reduce) gsap.from('.panel', { y: 80, opacity: 0, duration: 1.2, stagger: 0.1, ease: 'expo.out', scrollTrigger: { trigger: '.panels', start: 'top 85%' } });

  // ---------- arabic ----------
  if (!reduce) {
    gsap.from('.arabic__title span', { yPercent: 60, opacity: 0, duration: 1.4, stagger: 0.14, ease: 'expo.out', scrollTrigger: { trigger: '.arabic__title', start: 'top 85%' } });
    gsap.from('.arabic__body, .arabic__en', { y: 30, opacity: 0, duration: 1.2, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: '.arabic__body', start: 'top 90%' } });
    gsap.to('.arabic__title', { yPercent: -12, ease: 'none', scrollTrigger: { trigger: '.arabic', start: 'top bottom', end: 'bottom top', scrub: true } });
  }

  // ---------- faq ----------
  const qs = $$('.q'), ansN = $('.faq__n'), ansT = $('.faq__text');
  qs.forEach((q, i) => q.addEventListener('click', () => {
    const wasOn = q.classList.contains('is-on');
    qs.forEach((o) => { o.classList.remove('is-on'); o.setAttribute('aria-expanded', 'false'); });
    if (wasOn && mobile()) return;
    q.classList.add('is-on'); q.setAttribute('aria-expanded', 'true');
    const text = q.nextElementSibling.textContent.trim();
    if (reduce) { ansN.textContent = '0' + (i + 1); ansT.textContent = text; return; }
    gsap.timeline()
      .to([ansN, ansT], { y: -20, opacity: 0, duration: 0.25, ease: 'power2.in', overwrite: true })
      .add(() => { ansN.textContent = '0' + (i + 1); ansT.textContent = text; })
      .fromTo([ansN, ansT], { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.06, ease: 'expo.out' });
    gsap.fromTo('.faq__moon', { rotate: 0 }, { rotate: 60, duration: 1.2, ease: 'expo.out' });
  }));

  // ---------- waitlist fan ----------
  const fan = $$('.fan__s');
  const spread = () => (mobile() ? 13 : 15);
  if (reduce) fan.forEach((s, i) => gsap.set(s, { rotation: (i - 2.5) * spread() }));
  else {
    gsap.timeline({ scrollTrigger: { trigger: '.waitlist', start: 'top 85%', end: 'center 55%', scrub: 1 } })
      .fromTo(fan, { rotation: 0, y: 120, opacity: 0 }, { rotation: (i) => (i - 2.5) * spread(), y: (i) => Math.abs(i - 2.5) * 10, opacity: 1, stagger: 0.04, ease: 'power2.out' });
  }

  // ---------- form ----------
  const form = $('.form'), input = $('#email'), msg = $('.form__msg');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(input.value.trim());
    form.classList.toggle('is-error', !ok);
    if (!ok) { msg.textContent = 'Please enter a valid email address.'; input.focus(); return; }
    form.classList.add('is-sent');
    msg.textContent = 'Thank you. We will be in touch before launch.';
    if (!reduce) gsap.from(msg, { y: 20, opacity: 0, duration: 0.9, ease: 'expo.out' });
  });
  input.addEventListener('input', () => { if (form.classList.contains('is-error')) { form.classList.remove('is-error'); msg.textContent = ''; } });

  // ---------- footer ----------
  if (!reduce) gsap.from('.foot__lockup', { y: 80, opacity: 0, scale: 0.95, duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: '.foot', start: 'top 85%' } });

  window.addEventListener('load', () => ScrollTrigger.refresh());
  window.__mauvelle = { tl, st, lenis };
})();
