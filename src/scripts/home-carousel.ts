/** Three-card showroom. Arrows rotate which complete Android capture is centered. */
function initializeHomeCarousels(): void {
  for (const carousel of document.querySelectorAll<HTMLElement>('[data-hero-carousel]')) {
    if (carousel.dataset.initialized === 'true') continue;
    carousel.dataset.initialized = 'true';

    const stage = carousel.querySelector<HTMLElement>('[data-hero-track]');
    const slides = Array.from(carousel.querySelectorAll<HTMLElement>('[data-hero-slide]'))
      .sort((a, b) => Number(a.dataset.index) - Number(b.dataset.index));
    const previousSlot = carousel.querySelector<HTMLElement>('[data-hero-slot="previous"]');
    const activeSlot = carousel.querySelector<HTMLElement>('[data-hero-slot="active"]');
    const nextSlot = carousel.querySelector<HTMLElement>('[data-hero-slot="next"]');
    const dots = Array.from(carousel.querySelectorAll<HTMLButtonElement>('[data-hero-dot]'));
    const previous = carousel.querySelector<HTMLButtonElement>('[data-hero-previous]');
    const next = carousel.querySelector<HTMLButtonElement>('[data-hero-next]');
    const counter = carousel.querySelector<HTMLElement>('[data-hero-counter]');
    if (!stage || !previousSlot || !activeSlot || !nextSlot ||
      slides.length !== 3 || slides.length !== dots.length) continue;

    let active = 0;
    const rotate = (index: number): void => {
      active = (index + slides.length) % slides.length;
      // The slots are permanent grid cells. Re-parent existing links instead of
      // changing their grid columns or letting intrinsic image ratios move the cards.
      const fixedSlots = [
        { container: previousSlot, slide: slides[(active + slides.length - 1) % slides.length], position: 'previous' },
        { container: activeSlot, slide: slides[active], position: 'active' },
        { container: nextSlot, slide: slides[(active + 1) % slides.length], position: 'next' }
      ] as const;
      for (const { container, slide, position } of fixedSlots) {
        container.replaceChildren(slide);
        slide.dataset.position = position;
        if (position === 'active') slide.setAttribute('aria-current', 'true');
        else slide.removeAttribute('aria-current');
      }
      dots.forEach((dot, i) => {
        if (i === active) dot.setAttribute('aria-current', 'true');
        else dot.removeAttribute('aria-current');
      });
      if (counter) {
        counter.textContent =
          String(active + 1).padStart(2, '0') + ' / ' +
          String(slides.length).padStart(2, '0');
      }
    };

    previous?.addEventListener('click', () => rotate(active - 1));
    next?.addEventListener('click', () => rotate(active + 1));
    dots.forEach((dot, index) => dot.addEventListener('click', () => rotate(index)));
    stage.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        rotate(active + (event.key === 'ArrowRight' ? 1 : -1));
      }
    });
    rotate(0);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeHomeCarousels, { once: true });
} else {
  initializeHomeCarousels();
}
