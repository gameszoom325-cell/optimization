(function () {
  "use strict";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (reducedMotion.matches) return;

  const headings = [...document.querySelectorAll(".project-head .section-title, .contact-title")];
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!<>-_/";
  const activeRuns = new WeakMap();
  const originalText = new WeakMap();
  const completed = new WeakSet();
  const duration = 620;

  const scramble = (heading) => {
    const glyphs = [...heading.querySelectorAll(".char-glyph")];
    if (!glyphs.length) return;

    const previousRun = activeRuns.get(heading);
    if (previousRun) cancelAnimationFrame(previousRun.frame);

    let originals = originalText.get(heading);
    if (!originals || originals.length !== glyphs.length) {
      originals = glyphs.map((glyph) => glyph.textContent || "");
      originalText.set(heading, originals);
    }
    const widths = glyphs.map((glyph) => glyph.getBoundingClientRect().width);
    glyphs.forEach((glyph, index) => {
      glyph.style.width = `${widths[index]}px`;
      glyph.textContent = originals[index];
    });

    let previousTick = 0;
    let frame = 0;
    const start = performance.now();

    const update = (now) => {
      if (now - previousTick < 32 && now - start < duration) {
        frame = requestAnimationFrame(update);
        activeRuns.set(heading, { frame, glyphs, originals });
        return;
      }
      previousTick = now;
      const progress = Math.min(1, (now - start) / duration);
      glyphs.forEach((glyph, index) => {
        const original = originals[index];
        if (!original || /^\s+$/u.test(original)) return;
        const resolveAt = index / glyphs.length;
        if (progress >= resolveAt + 0.2 || /[^\p{L}\p{N}]/u.test(original)) {
          glyph.textContent = original;
        } else {
          glyph.textContent = alphabet[Math.floor(Math.random() * alphabet.length)];
        }
      });

      if (progress < 1) {
        frame = requestAnimationFrame(update);
        activeRuns.set(heading, { frame, glyphs, originals });
        return;
      }

      glyphs.forEach((glyph, index) => {
        glyph.textContent = originals[index];
        glyph.style.removeProperty("width");
      });
      activeRuns.delete(heading);
      completed.add(heading);
    };

    frame = requestAnimationFrame(update);
    activeRuns.set(heading, { frame, glyphs, originals });
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting || completed.has(entry.target)) return;
      scramble(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.35, rootMargin: "0px 0px -5% 0px" });

  headings.forEach((heading) => {
    observer.observe(heading);
    heading.addEventListener("pointerenter", () => scramble(heading), { passive: true });
  });

  const onMotionPreferenceChange = (event) => {
    if (!event.matches) return;
    observer.disconnect();
    headings.forEach((heading) => {
      const run = activeRuns.get(heading);
      if (run) cancelAnimationFrame(run.frame);
      const glyphs = [...heading.querySelectorAll(".char-glyph")];
      const originals = originalText.get(heading);
      glyphs.forEach((glyph, index) => {
        if (originals) glyph.textContent = originals[index];
        glyph.style.removeProperty("width");
      });
      activeRuns.delete(heading);
    });
  };
  reducedMotion.addEventListener("change", onMotionPreferenceChange);

  window.addEventListener("pagehide", () => {
    observer.disconnect();
    headings.forEach((heading) => {
      const run = activeRuns.get(heading);
      if (run) cancelAnimationFrame(run.frame);
    });
    reducedMotion.removeEventListener("change", onMotionPreferenceChange);
  }, { once: true });
})();
