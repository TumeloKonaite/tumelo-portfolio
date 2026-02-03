document.documentElement.classList.add('js');

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const heroSequence = () => {
  const stage1 = Array.from(document.querySelectorAll('.hero-reveal-1'));
  const stage2 = Array.from(document.querySelectorAll('.hero-reveal-2'));
  const stage3 = Array.from(document.querySelectorAll('.hero-reveal-3'));
  const heroEls = [...stage1, ...stage2, ...stage3];

  if (!heroEls.length) {
    return;
  }

  if (prefersReducedMotion.matches) {
    heroEls.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  heroEls.forEach((el) => el.classList.add('will-animate'));

  const revealStage = (elements, delay) => {
    elements.forEach((el) => {
      window.setTimeout(() => {
        el.classList.add('is-visible');
        el.classList.remove('will-animate');
      }, delay);
    });
  };

  revealStage(stage1, 0);
  revealStage(stage2, 120);
  revealStage(stage3, 240);
};

const buildRevealObserver = () => {
  if (prefersReducedMotion.matches) {
    document.querySelectorAll('.reveal, .reveal-item').forEach((el) => {
      el.classList.add('is-visible');
    });
    return null;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const target = entry.target;
        target.classList.add('will-animate');

        const staggerGroup = target.closest('[data-stagger-group]');
        if (staggerGroup) {
          const items = Array.from(staggerGroup.querySelectorAll('.reveal-item'));
          items.forEach((item, index) => {
            item.classList.add('will-animate');
            const delay = index * 80;
            window.setTimeout(() => {
              item.classList.add('is-visible');
              item.classList.remove('will-animate');
              obs.unobserve(item);
            }, delay);
          });

          obs.unobserve(staggerGroup);
          return;
        }

        target.classList.add('is-visible');
        target.classList.remove('will-animate');
        obs.unobserve(target);
      });
    },
    { threshold: 0.2 }
  );

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
  document.querySelectorAll('[data-stagger-group]').forEach((group) => observer.observe(group));

  return observer;
};

const initReveals = () => {
  heroSequence();
  buildRevealObserver();
};

if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', initReveals);
} else {
  initReveals();
}

