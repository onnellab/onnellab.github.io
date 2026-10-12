/** Lightweight, accessible homepage carousel. Native scrolling handles touch and trackpads. */
function initializeHomeCarousels(): void {
  for (const carousel of document.querySelectorAll<HTMLElement>('[data-hero-carousel]')) {
    if (carousel.dataset.initialized === 'true') continue;
    carousel.dataset.initialized = 'true';

    const track = carousel.querySelector<HTMLElement>('[data-hero-track]');
    const slides = Array.from(carousel.querySelectorAll<HTMLElement>('[data-hero-slide]'));
    const dots = Array.from(carousel.querySelectorAll<HTMLButtonElement>('[data-hero-dot]'));
    const previous = carousel.querySelector<HTMLButtonElement>('[data-hero-previous]');
    const next = carousel.querySelector<HTMLButtonElement>('[data-hero-next]');
    const counter = carousel.querySelector<HTMLElement>('[data-hero-counter]');
    if (!track || slides.length === 0 || slides.length !== dots.length) continue;

    let active = 0;
    let scrollFrame = 0;

    const setActive = (index: number): void => {
      active = Math.max(0, Math.min(index, slides.length - 1));
      dots.forEach((dot, dotIndex) => {
        if (dotIndex === active) {
          dot.setAttribute('aria-current', 'true');
        } else {
          dot.removeAttribute('aria-current');
        }
      });
      if (previous) previous.disabled = active === 0;
      if (next) next.disabled = active === slides.length - 1;
      if (counter) {
        counter.textContent =
          String(active + 1).padStart(2, '0') + ' / ' +
          String(slides.length).padStart(2, '0');
      }
    };

    const navigateTo = (index: number): void => {
      const desired = Math.max(0, Math.min(index, slides.length - 1));
      const slide = slides[desired];
      const stageLeft = track.getBoundingClientRect().left;
      const paddingLeft = Number.parseFloat(getComputedStyle(track).paddingLeft) || 0;
      const offset = slide.getBoundingClientRect().left - stageLeft +
        track.scrollLeft - paddingLeft;
      // A deterministic immediate step avoids stale smooth-scroll callbacks
      // overriding the next arrow/keyboard command. Touch swipes remain native.
      track.scrollTo({
        left: Math.max(0, Math.min(offset, track.scrollWidth - track.clientWidth)),
        behavior: 'auto'
      });
      setActive(desired);
    };

    const followScroll = (): void => {
      cancelAnimationFrame(scrollFrame);
      scrollFrame = requestAnimationFrame(() => {
        const origin = track.getBoundingClientRect().left +
          (Number.parseFloat(getComputedStyle(track).paddingLeft) || 0);
        let nearest = 0;
        let nearestDistance = Infinity;
        slides.forEach((slide, index) => {
          const distance = Math.abs(slide.getBoundingClientRect().left - origin);
          if (distance < nearestDistance) {
            nearest = index;
            nearestDistance = distance;
          }
        });
        setActive(nearest);
      });
    };

    previous?.addEventListener('click', () => navigateTo(active - 1));
    next?.addEventListener('click', () => navigateTo(active + 1));
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => navigateTo(index));
    });
    track.addEventListener('scroll', followScroll, { passive: true });
    track.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        navigateTo(active + (event.key === 'ArrowRight' ? 1 : -1));
      }
    });
    setActive(0);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeHomeCarousels, { once: true });
} else {
  initializeHomeCarousels();
}
