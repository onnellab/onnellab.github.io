/**
 * Three original Android screenshots in fixed showroom slots.
 * Pointer swipes, minimal pagination dots, and keyboard input share one rotation path.
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
    const announcement = carousel.querySelector<HTMLElement>('[data-hero-announcement]');
    if (!stage || !previousSlot || !activeSlot || !nextSlot ||
      slides.length !== 3 || slides.length !== dots.length) continue;

    type SlideRects = Map<HTMLAnchorElement, DOMRect>;
    type DragSession = {
      pointerId: number;
      startX: number;
      startY: number;
      dragging: boolean;
      startRects?: SlideRects;
      targetX: number;
      renderedX: number;
      frameId: number | null;
      lastFrameTime: number | null;
    };

    let active = 0;
    let drag: DragSession | null = null;
    let suppressClick = false;
    let animationVersion = 0;
    let running: Animation[] = [];

    // Deliberate, cinematic motion with no elastic overshoot.
    // The pointer leads the artwork slightly; release glides into place.
    const dragResponseMs = 43;
    const releaseDurationMs = 555;
    const navigationDurationMs = 625;
    const settleDurationMs = 340;
    const releaseEase = 'cubic-bezier(0.3, 0.62, 0.22, 1)';
    const navigationEase = 'cubic-bezier(0.4, 0.06, 0.24, 1)';

    const prefersReducedMotion = () =>
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const cancelRunning = () => {
      animationVersion++;
      for (const animation of running) animation.cancel();
      running = [];
      delete stage.dataset.animating;
    };

    const measureSlides = () => new Map(
      slides.map((slide) => [slide, slide.getBoundingClientRect()])
    );

    const clearDragStyles = () => {
      delete stage.dataset.dragging;
      delete stage.dataset.dragPreview;
      for (const slide of slides) {
        slide.style.removeProperty('transform');
        slide.style.removeProperty('opacity');
      }
      for (const slot of [previousSlot, activeSlot, nextSlot]) {
        slot.style.removeProperty('z-index');
      }
    };

    // The two adjacent cards move along *different* paths. The wrapped card
    // fades out on its old side and reappears on the opposite side rather than
    // flying through (and obscuring) the center card.
    const updateDrag = (session: DragSession, deltaX: number) => {
      const start = session.startRects;
      if (!start) return;
      const forward = deltaX < 0;
      // A slightly longer gesture is needed to fill an entire slot: the
      // preview has perceptible inertia instead of snapping under the cursor.
      const progress = Math.min(1, Math.abs(deltaX) / Math.max(80, stage.clientWidth * 0.33));
      const previous = previousSlot.querySelector<HTMLAnchorElement>('[data-hero-slide]')!;
      const current = activeSlot.querySelector<HTMLAnchorElement>('[data-hero-slide]')!;
      const following = nextSlot.querySelector<HTMLAnchorElement>('[data-hero-slide]')!;
      const destinations = forward
        ? [[current, previous], [following, current], [previous, following]]
        : [[current, following], [previous, current], [following, previous]];
      const wrapping = forward ? previous : following;
      const incoming = forward ? following : previous;

      stage.dataset.dragging = 'true';
      // Once the new card visually occupies the center, let its caption lead
      // too. Commit aria-current and the counter only when the drag settles.
      if (progress >= 0.50) stage.dataset.dragPreview = forward ? 'next' : 'previous';
      else delete stage.dataset.dragPreview;
      for (const [slide, destination] of destinations) {
        const from = start.get(slide)!;
        const to = start.get(destination)!;
        const isWrapping = slide === wrapping;
        // At half-progress the wrapping card is fully transparent. Its
        // position can then jump to the far side without a visible flash.
        // Staggered, continuous progress: the incoming card leads and grows
        // first, while the centered card eases out behind it. This is not one
        // shared stage translate masquerading as a draggable carousel.
        const moved = isWrapping
          ? (progress <= 0.5 ? 0 : 1)
          : slide === incoming
            ? 1 - Math.pow(1 - progress, 1.22)
            : Math.pow(progress, 1.17);
        const dx = ((to.left + to.width / 2) - (from.left + from.width / 2)) * moved;
        const dy = ((to.top + to.height / 2) - (from.top + from.height / 2)) * moved;
        const sx = 1 + (to.width / from.width - 1) * moved;
        const sy = 1 + (to.height / from.height - 1) * moved;
        slide.style.transform =
          'translate(' + dx + 'px, ' + dy + 'px) scale(' + sx + ', ' + sy + ')';
        slide.style.opacity = isWrapping
          ? String(Math.abs(1 - 2 * progress))
          : '1';
      }
      // When the incoming card reaches the center it comes to the foreground,
      // without changing the permanent stacking of the resting layout.
      previousSlot.style.zIndex = !forward && progress > 0.5 ? '4' : '';
      nextSlot.style.zIndex = forward && progress > 0.5 ? '4' : '';
    };

    // A small, frame-rate-independent low-pass filter creates a restrained
    // trailing response while the pointer is held. There is no timer and no
    // dependency; requestAnimationFrame stops as soon as it catches up.
    const stopDragFrame = (session: DragSession) => {
      if (session.frameId !== null) window.cancelAnimationFrame(session.frameId);
      session.frameId = null;
      session.lastFrameTime = null;
    };
    const paintDragFrame = (session: DragSession, now: number) => {
      if (drag !== session || !session.dragging) return;
      const elapsed = session.lastFrameTime === null
        ? 16.67 : Math.min(48, Math.max(1, now - session.lastFrameTime));
      session.lastFrameTime = now;
      const blend = 1 - Math.exp(-elapsed / dragResponseMs);
      session.renderedX += (session.targetX - session.renderedX) * blend;
      if (Math.abs(session.targetX - session.renderedX) <= 0.35) {
        session.renderedX = session.targetX;
      }
      updateDrag(session, session.renderedX);
      session.frameId = session.renderedX === session.targetX
        ? null : window.requestAnimationFrame((timestamp) => paintDragFrame(session, timestamp));
    };
    const trackDrag = (session: DragSession, deltaX: number) => {
      session.targetX = deltaX;
      if (prefersReducedMotion()) {
        stopDragFrame(session);
        session.renderedX = deltaX;
        updateDrag(session, deltaX);
        return;
      }
      stage.dataset.dragging = 'true';
      if (session.frameId === null) {
        session.frameId = window.requestAnimationFrame((timestamp) => paintDragFrame(session, timestamp));
      }
    };

    const settleShortDrag = () => {
      if (prefersReducedMotion() || typeof slides[0].animate !== 'function') {
        clearDragStyles();
        return;
      }
      cancelRunning();
      const version = animationVersion;
      const before = slides.map((slide) => ({
        slide,
        transform: slide.style.transform || 'none',
        opacity: slide.style.opacity || '1'
      }));
      clearDragStyles();
      stage.dataset.animating = 'true';
      running = before.map(({ slide, transform, opacity }) =>
        slide.animate([
          { transform, opacity },
          { transform: 'none', opacity: '1' }
        ], { duration: settleDurationMs, easing: releaseEase })
      );
      void Promise.all(running.map((animation) => animation.finished))
        .then(() => {
          if (version !== animationVersion) return;
          running = [];
          delete stage.dataset.animating;
        })
        .catch(() => { /* A later interaction superseded the return motion. */ });
    };

    const rotate = (index: number, options?: { initial?: boolean; from?: Map<HTMLAnchorElement, DOMRect> }) => {
      const nextActive = (index + slides.length) % slides.length;
      if (nextActive === active && !options?.initial) {
        clearDragStyles();
        return;
      }

      // Capture the visible positions, including interrupted motion or a
      // pointer offset, before changing the permanent slot assignments.
      const before = options?.from ?? measureSlides();
      const fromOpacity = new Map(slides.map((slide) => [
        slide, Number.parseFloat(slide.style.opacity || '1')
      ]));
      const focusedSlide = slides.find((slide) => slide === document.activeElement);
      cancelRunning();
      const animate = !options?.initial && !prefersReducedMotion() &&
        typeof slides[0].animate === 'function';
      if (animate) stage.dataset.animating = 'true';
      clearDragStyles();
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
      // With no visible counter, announce the selected app to screen readers
      // after dot, swipe or arrow-key navigation.
      if (announcement && !options?.initial) {
        announcement.textContent = slides[active].getAttribute('aria-label') ?? slides[active].textContent?.trim() ?? '';
      }
      if (!animate) return;

      // FLIP: semantic DOM state updates at once, and each original card
      // visually travels between the same three fixed positions.
      const version = animationVersion;
      running = slides.map((slide) => {
        const from = before.get(slide)!;
        const to = slide.getBoundingClientRect();
        // A centered transform origin means FLIP translation must use center
        // deltas, otherwise scaling introduces a visible sideways jump.
        const deltaX = from.left + from.width / 2 - to.left - to.width / 2;
        const deltaY = from.top + from.height / 2 - to.top - to.height / 2;
        const scaleX = from.width / to.width;
        const scaleY = from.height / to.height;

        const fromTransform =
          'translate(' + deltaX + 'px, ' + deltaY + 'px) scale(' + scaleX + ', ' + scaleY + ')';
        // The card wrapping behind the carousel travels out of sight and
        // fades back in. It never darts across the readable center screen.
        const isWrapping = Math.abs(deltaX) > stage.clientWidth * 0.47;
        const keyframes: Keyframe[] = [
          { transform: fromTransform, opacity: fromOpacity.get(slide) ?? 1 }
        ];
        if (isWrapping) {
          keyframes.push(
            {
              transform: 'translate(' + (deltaX * 0.54) + 'px, ' +
                (deltaY * 0.54) + 'px) scale(' +
                (1 + (scaleX - 1) * 0.54) + ', ' +
                (1 + (scaleY - 1) * 0.54) + ')',
              opacity: 0,
              offset: 0.46
            },
            {
              transform: 'translate(' + (deltaX * 0.38) + 'px, ' +
                (deltaY * 0.38) + 'px) scale(' +
                (1 + (scaleX - 1) * 0.38) + ', ' +
                (1 + (scaleY - 1) * 0.38) + ')',
              opacity: 0,
              offset: 0.62
            }
          );
        }
        keyframes.push({ transform: 'none', opacity: 1 });

        return slide.animate(keyframes, {
          duration: options?.from ? releaseDurationMs : navigationDurationMs,
          easing: options?.from ? releaseEase : navigationEase
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
      // A normal click must not cancel FLIP mid-frame: snapping a moving
      // link back to its resting slot between pointerdown and pointerup can
      // discard the click. Cancel only once a real horizontal drag begins.
      drag = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        dragging: false,
        targetX: 0,
        renderedX: 0,
        frameId: null,
        lastFrameTime: null
      };
    });

    window.addEventListener('pointermove', (event: PointerEvent) => {
      if (!drag || event.pointerId !== drag.pointerId) return;
      const deltaX = event.clientX - drag.startX;
      const deltaY = event.clientY - drag.startY;

      if (!drag.dragging) {
        // A vertical gesture is still normal page scrolling. Horizontal
        // movement captures the pointer only after a small intentional drag.
        if (Math.abs(deltaY) > 9 && Math.abs(deltaY) > Math.abs(deltaX)) {
          drag = null;
          return;
        }
        if (Math.abs(deltaX) < 9 || Math.abs(deltaX) <= Math.abs(deltaY)) return;
        cancelRunning();
        drag.dragging = true;
        drag.startRects = measureSlides();
        stage.setPointerCapture(event.pointerId);
      }

      trackDrag(drag, deltaX);
      if (event.cancelable) event.preventDefault();
    }, { passive: false });

    window.addEventListener('pointerup', (event: PointerEvent) => {
      if (!drag || drag.pointerId !== event.pointerId) return;
      const session = drag;
      stopDragFrame(session);
      drag = null;
      if (!session.dragging) return;

      suppressClick = true;
      if (stage.hasPointerCapture(event.pointerId)) {
        stage.releasePointerCapture(event.pointerId);
      }
      const distance = event.clientX - session.startX;
      const threshold = Math.max(32, Math.min(64, stage.clientWidth * 0.12));
      if (Math.abs(distance) >= threshold) {
        // Each card has already followed its own path throughout the drag.
        // Continue from the exact on-screen progress into its resting slot.
        const from = measureSlides();
        rotate(active + (distance < 0 ? 1 : -1), { from });
      } else {
        settleShortDrag();
      }

      // Prevent the synthetic pointerup click from opening an app on swipe.
      window.setTimeout(() => { suppressClick = false; }, 0);
    });

    window.addEventListener('pointercancel', (event: PointerEvent) => {
      if (!drag || drag.pointerId !== event.pointerId) return;
      const wasDragging = drag.dragging;
      stopDragFrame(drag);
      drag = null;
      if (wasDragging) settleShortDrag();
      else clearDragStyles();
    });

    rotate(0, { initial: true });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeHomeCarousels, { once: true });
} else {
  initializeHomeCarousels();
}
