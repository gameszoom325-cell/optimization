import { useEffect, useRef } from "react";
import { revealTimeline } from "../effects/animations.js";

export default function ScrollReveal({
  children,
  as: Element = "div",
  className = "",
  delay = 0,
  once = true,
  ...props
}) {
  const elementRef = useRef(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let cleanup;
    const syncMotion = () => {
      cleanup?.();
      cleanup = undefined;
      if (reducedMotion.matches || !elementRef.current) return;
      cleanup = revealTimeline(elementRef.current, {
        y: 22,
        scale: 0.99,
        blur: 6,
        duration: 0.78,
        stagger: 0.075,
        once,
        delay
      });
    };
    reducedMotion.addEventListener("change", syncMotion);
    syncMotion();
    return () => {
      reducedMotion.removeEventListener("change", syncMotion);
      cleanup?.();
    };
  }, [delay, once]);

  return <Element ref={elementRef} className={className} {...props}>{children}</Element>;
}
