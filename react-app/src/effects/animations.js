import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function revealTimeline(target, options = {}) {
  const {
    y = 24,
    scale = 0.985,
    blur = 7,
    duration = 0.8,
    stagger = 0.08,
    delay = 0,
    start = "top 88%",
    once = true
  } = options;
  const elements = typeof target === "string" ? gsap.utils.toArray(target) : gsap.utils.toArray(target);
  if (!elements.length) return () => {};

  const context = gsap.context(() => {
    elements.forEach((element) => {
      const children = element.querySelectorAll("[data-reveal-child]");
      const targets = children.length ? [...children] : [element];
      gsap.fromTo(targets,
        { autoAlpha: 0, y, scale, filter: `blur(${blur}px)` },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          duration,
          delay,
          stagger,
          ease: "power3.out",
          clearProps: "filter",
          scrollTrigger: { trigger: element, start, once, invalidateOnRefresh: true }
        }
      );
    });
  });
  return () => context.revert();
}

export function createSectionTransition(section, options = {}) {
  return revealTimeline(section, { y: 18, scale: 1, blur: 4, ...options });
}

export function scrambleString(value, progress, alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!<>-_") {
  const source = Array.from(value);
  const resolvedCount = Math.floor(source.length * Math.min(1, Math.max(0, progress)));
  return source.map((character, index) => {
    if (/\s/u.test(character) || index < resolvedCount) return character;
    return alphabet[Math.floor(Math.random() * alphabet.length)];
  }).join("");
}
