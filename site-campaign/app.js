/* Mauvelle photographic campaign: GSAP scroll chapters and interactive rituals. */
(function () {
  gsap.registerPlugin(ScrollTrigger);
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // nav border on scroll
  const nav = $('.nav');
  window.addEventListener('scroll', () => nav.classList.toggle('is-scrolled', window.scrollY > 100), { passive: true });
  ScrollTrigger.create({
    start: 0, end: 'max',
    onUpdate: self => gsap.set('.reading-progress', { scaleX: self.progress })
  });


  // hero intro
  if (!reduce) {
    gsap.from('.hero .reveal', { y: 28, opacity: 0, duration: 1, stagger: 0.12, ease: 'power3.out', delay: 0.1 });
    gsap.from('.hero__art', { opacity: 0, scale: 0.94, duration: 1.4, ease: 'power2.out' });
    // Keep visibility independent of the entrance animation when scrolling back.
    gsap.to('.hero__art > img', { yPercent: 4, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  }

  // Photographic chapters: the same story, now told through product images.
  const chapters = $$('.chapter');
  const captions = $$('.cap');
  const photos = $$('.story-photo');
  let activeChapter = -1;
  function showChapter(index) {
    if (activeChapter === index) return;
    $('.story-gallery').dataset.direction = index < activeChapter ? 'backward' : 'forward';
    activeChapter = index;
    chapters.forEach((button, i) => {
      button.classList.toggle('is-active', i === index);
      button.setAttribute('aria-pressed', String(i === index));
      captions[i].classList.toggle('is-active', i === index);
      captions[i].setAttribute('aria-hidden', String(i !== index));
      photos[i].classList.toggle('is-active', i === index);
      photos[i].setAttribute('aria-hidden', String(i !== index));
    });
    gsap.set('.progress span', { scaleX: (index + 1) / chapters.length });
  }
  showChapter(0);
  let storyTrigger;
  if (!reduce) {
    storyTrigger = ScrollTrigger.create({
      trigger: '.story', start: 'top top',
      end: () => '+=' + Math.round(window.innerHeight * 3.2),
      pin: '.story__stage',
      onUpdate: self => showChapter(Math.min(5, Math.floor(self.progress * 6)))
    });
  }
  chapters.forEach((button, i) => button.addEventListener('click', () => {
    showChapter(i);
    if (storyTrigger) {
      window.scrollTo({
        top: storyTrigger.start + ((i + 0.5) / chapters.length) * (storyTrigger.end - storyTrigger.start),
        behavior: 'instant'
      });
    }
  }));

  const navLinks = $$('.nav__links a');
  navLinks.forEach(link => {
    ScrollTrigger.create({
      trigger: $(link.getAttribute('href')), start: 'top 40%', end: 'bottom 40%',
      onToggle: self => {
        if (self.isActive) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      }
    });
  });

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
  const ritualPhotos = $$('.ritual-photo');
  let activeRitual = 0;
  function showRitual(index) {
    const i = (index + ritualButtons.length) % ritualButtons.length;
    activeRitual = i;
    ritualButtons.forEach((step, j) => {
      step.classList.toggle('is-active', i === j);
      step.setAttribute('aria-pressed', String(i === j));
      ritualPhotos[j].classList.toggle('is-active', i === j);
      ritualPhotos[j].setAttribute('aria-hidden', String(i !== j));
    });
    $('.ritual-counter').textContent = `0${i + 1} / 03`;
  }
  ritualButtons.forEach((button, i) => button.addEventListener('click', () => showRitual(i)));
  $('.ritual-prev').addEventListener('click', () => showRitual(activeRitual - 1));
  $('.ritual-next').addEventListener('click', () => showRitual(activeRitual + 1));
  // Horizontal gestures select a photo while vertical gestures keep native scrolling.
  let touchStart;
  $('.ritual-demo').addEventListener('touchstart', event => {
    const touch = event.changedTouches[0];
    touchStart = { x: touch.clientX, y: touch.clientY };
  }, { passive: true });
  $('.ritual-demo').addEventListener('touchend', event => {
    if (!touchStart) return;
    const touch = event.changedTouches[0];
    const dx = touch.clientX - touchStart.x, dy = touch.clientY - touchStart.y;
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.5) showRitual(activeRitual + (dx < 0 ? 1 : -1));
    touchStart = undefined;
  }, { passive: true });

  if (!reduce) {
    $$('.philosophy__intro h2, .how__heading h2, .faq__heading h2, .waitlist__content, .values article').forEach(element => {
      gsap.from(element, {
        y: 35, opacity: 0, duration: .9, ease: 'power3.out',
        scrollTrigger: { trigger: element, start: 'top 92%', once: true }
      });
    });
    gsap.from('.editorial-image', {
      clipPath: 'inset(10% 6% 10% 6%)', duration: 1.2, ease: 'power3.out',
      scrollTrigger: { trigger: '.editorial-collage', start: 'top 85%', once: true }
    });
    gsap.fromTo('.editorial-inset', { y: 70, rotation: 5 }, {
      y: -30, rotation: -4, ease: 'none',
      scrollTrigger: { trigger: '.editorial-collage', start: 'top bottom', end: 'bottom top', scrub: 1 }
    });
    gsap.from('.manifesto-line', {
      y: 65, opacity: .15, stagger: .18, ease: 'none',
      scrollTrigger: { trigger: '.manifesto', start: 'top 75%', end: 'center 48%', scrub: 1 }
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
  const submit = form?.querySelector('button');
  form?.addEventListener('submit', async event => {
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
  document.fonts.ready.then(() => ScrollTrigger.refresh());
})();
