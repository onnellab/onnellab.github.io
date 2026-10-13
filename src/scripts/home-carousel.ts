/**
 * Three original Android screenshots in fixed showroom slots.
 * Pointer swipes, arrows, dots, and keyboard input share one rotation path.
 * A FLIP transition moves cards without changing the physical grid.
 */
function initializeHomeCarousels(): void {
  for (const carousel of document.querySelectorAll<HTMLElement>('[data-hero-carousel]')) {
    if (carousel.dataset.initialized === 'true') continue;
    carousel.dataset.initialized = 'true';

    const stage = carousel.querySelector<HTMLElement>('[data-hero-track]');
    const slides = Array.from(carousel.querySelectorAll<HTMLAnchorElement>('[data-hero-slide]'))
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

    type DragSession = {
      pointerId: number;
      startX: number;
      startY: number;
      dragging: boolean;
    };

    let active = 0;
    let drag: DragSession | null = null;
    let suppressClick = false;
    let animationVersion = 0;
    let running: Animation[] = [];

    const prefersReducedMotion = () =>
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const cancelRunning = () => {
      animationVersion++;
      for (const animation of running) animation.cancel();
      running = [];
      delete stage.dataset.animating;
    };

    const clearDragOffset = () => {
      delete stage.dataset.dragging;
      stage.style.removeProperty('--hero-drag-x');
    };

    const measureSlides = () => new Map(
      slides.map((slide) => [slide, slide.getBoundingClientRect()])
    );

    const rotate = (index: number, options?: { initial?: boolean; from?: Map<HTMLAnchorElement, DOMRect> }) => {
      const nextActive = (index + slides.length) % slides.length;
      if (nextActive === active && !options?.initial) {
        clearDragOffset();
        return;
      }

      // Capture the visible positions, including interrupted motion or a
      // pointer offset, before changing the permanent slot assignments.
      const before = options?.from ?? measureSlides();
      const focusedSlide = slides.find((slide) => slide === document.activeElement);
      cancelRunning();
      const animate = !options?.initial && !prefersReducedMotion() &&
        typeof slides[0].animate === 'function';
      if (animate) stage.dataset.animating = 'true';
      clearDragOffset();
      active = nextActive;

      const assignments = [
        { container: previousSlot, slide: slides[(active + 2) % 3], position: 'previous' },
        { container: activeSlot, slide: slides[active], position: 'active' },
        { container: nextSlot, slide: slides[(active + 1) % 3], position: 'next' }
      ] as const;

      for (const { container, slide, position } of assignments) {
        container.replaceChildren(slide);
        slide.dataset.position = position;
        if (position === 'active') slide.setAttribute('aria-current', 'true');
        else slide.removeAttribute('aria-current');
      }
      if (focusedSlide) focusedSlide.focus({ preventScroll: true });

      dots.forEach((dot, index) => {
        if (index === active) dot.setAttribute('aria-current', 'true');
        else dot.removeAttribute('aria-current');
      });
      if (counter) {
        counter.textContent =
          String(active + 1).padStart(2, '0') + ' / ' + String(slides.length).padStart(2, '0');
      }
      if (!animate) return;

      // FLIP: semantic DOM state updates at once, and each original card
      // visually travels between the same three fixed positions.
      const version = animationVersion;
      running = slides.map((slide) => {
        const from = before.get(slide)!;
        const to = slide.getBoundingClientRect();
        const deltaX = from.left - to.left;
        const deltaY = from.top - to.top;
        const scaleX = from.width / to.width;
        const scaleY = from.height / to.height;

        return slide.animate([
          { transform: 'translate(' + deltaX + 'px, ' + deltaY + 'px) scale(' + scaleX + ', ' + scaleY + ')' },
          { transform: 'translate(0px, 0px) scale(1, 1)' }
        ], {
          duration: 340,
          easing: 'cubic-bezier(0.22, 1, 0.36, 1)'
        });
      });

      void Promise.all(running.map((animation) => animation.finished))
        .then(() => {
          if (version !== animationVersion) return;
          running = [];
          delete stage.dataset.animating;
        })
        .catch(() => { /* A newer rotation canceled this transition. */ });
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

    // Native image/link dragging must not compete with pointer swiping.
    // A stationary click still opens the app product page.
    stage.addEventListener('dragstart', (event) => event.preventDefault());
    stage.addEventListener('click', (event) => {
      if (!suppressClick) return;
      event.preventDefault();
      event.stopPropagation();
      suppressClick = false;
    }, true);

    stage.addEventListener('pointerdown', (event: PointerEvent) => {
      if (event.button !== 0 || (event.pointerType !== 'mouse' && !event.isPrimary) || drag) return;
      cancelRunning();
      drag = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        dragging: false
      };
    });

    window.addEventListener('pointermove', (event: PointerEvent) => {
      if (!drag || event.pointerId !== drag.pointerId) return;
      const deltaX = event.clientX - drag.startX;
      const deltaY = event.clientY - drag.startY;

      if (!drag.dragging) {
        // Leave vertical scrolling to the browser. Capture only a deliberate
        // horizontal gesture after passing the pointer slop threshold.
        if (Math.abs(deltaY) > 9 && Math.abs(deltaY) > Math.abs(deltaX)) {
          drag = null;
          return;
        }
        if (Math.abs(deltaX) < 9 || Math.abs(deltaX) <= Math.abs(deltaY)) return;
        drag.dragging = true;
        stage.dataset.dragging = 'true';
        stage.setPointerCapture(event.pointerId);
      }

      const limit = stage.clientWidth * 0.22;
      const offset = Math.max(-limit, Math.min(limit, deltaX));
      stage.style.setProperty('--hero-drag-x', offset + 'px');
      if (event.cancelable) event.preventDefault();
    }, { passive: false });

    window.addEventListener('pointerup', (event: PointerEvent) => {
      if (!drag || drag.pointerId !== event.pointerId) return;
      const session = drag;
      drag = null;
      if (!session.dragging) return;

      suppressClick = true;
      if (stage.hasPointerCapture(event.pointerId)) {
        stage.releasePointerCapture(event.pointerId);
      }

      const distance = event.clientX - session.startX;
      const threshold = Math.max(32, Math.min(64, stage.clientWidth * 0.12));
      if (Math.abs(distance) >= threshold) {
        const from = measureSlides();
        rotate(active + (distance < 0 ? 1 : -1), { from });
      } else {
        clearDragOffset(); // A short drag smoothly springs back to the center.
      }

      // The click generated by pointerup runs before the next task.
      // Never navigate to a product after a swipe gesture.
      window.setTimeout(() => { suppressClick = false; }, 0);
    });

    window.addEventListener('pointercancel', (event: PointerEvent) => {
      if (!drag || drag.pointerId !== event.pointerId) return;
      drag = null;
      clearDragOffset();
    });

    rotate(0, { initial: true });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeHomeCarousels, { once: true });
} else {
  initializeHomeCarousels();
}
