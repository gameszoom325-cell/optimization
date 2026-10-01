import { useCallback, useEffect, useRef } from "react";
import { scrambleString } from "../effects/animations.js";

export default function TextScramble({ text, as: Element = "h2", className = "", trigger = "hover" }) {
  const visualRef = useRef(null);
  const frameRef = useRef(0);
  const sourceRef = useRef(text);
  sourceRef.current = text;

  const start = useCallback(() => {
    const visual = visualRef.current;
    if (!visual) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      visual.textContent = sourceRef.current;
      return;
    }
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    const startTime = performance.now();
    const duration = 650;
    const update = (now) => {
      const progress = Math.min(1, (now - startTime) / duration);
      visual.textContent = progress === 1 ? sourceRef.current : scrambleString(sourceRef.current, progress);
      if (progress < 1) frameRef.current = requestAnimationFrame(update);
    };
    frameRef.current = requestAnimationFrame(update);
  }, []);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotionPreferenceChange = (event) => {
      if (!event.matches) return;
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      frameRef.current = 0;
      if (visualRef.current) visualRef.current.textContent = sourceRef.current;
    };
    reducedMotion.addEventListener("change", onMotionPreferenceChange);
    if (trigger === "load") start();
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      reducedMotion.removeEventListener("change", onMotionPreferenceChange);
    };
  }, [start, text, trigger]);

  return (
    <Element
      className={className}
      aria-label={text}
      tabIndex={trigger === "hover" ? 0 : undefined}
      onPointerEnter={trigger === "hover" ? start : undefined}
      onFocus={trigger === "hover" ? start : undefined}
    >
      <span ref={visualRef} aria-hidden="true">{text}</span>
    </Element>
  );
}
