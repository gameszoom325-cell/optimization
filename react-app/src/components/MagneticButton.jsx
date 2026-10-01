import { useEffect, useRef } from "react";
import gsap from "gsap";
import { magneticOffset } from "../effects/cursor.js";

export default function MagneticButton({
  as: Element = "a",
  className = "",
  href,
  children,
  strength = 0.12,
  limit = 14,
  ...props
}) {
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    const finePointer = window.matchMedia("(pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!element) return undefined;
    const setX = gsap.quickTo(element, "x", { duration: 0.34, ease: "power3.out" });
    const setY = gsap.quickTo(element, "y", { duration: 0.34, ease: "power3.out" });

    const onMove = (event) => {
      if (!finePointer.matches || reducedMotion.matches) return;
      const offset = magneticOffset(event.clientX, event.clientY, element.getBoundingClientRect(), strength, limit);
      setX(offset.x);
      setY(offset.y);
    };
    const reset = () => {
      setX(0);
      setY(0);
    };

    element.addEventListener("pointermove", onMove, { passive: true });
    element.addEventListener("pointerleave", reset, { passive: true });
    const onEnvironmentChange = () => {
      if (reducedMotion.matches || !finePointer.matches) reset();
    };
    finePointer.addEventListener("change", onEnvironmentChange);
    reducedMotion.addEventListener("change", onEnvironmentChange);

    return () => {
      element.removeEventListener("pointermove", onMove);
      element.removeEventListener("pointerleave", reset);
      finePointer.removeEventListener("change", onEnvironmentChange);
      reducedMotion.removeEventListener("change", onEnvironmentChange);
      gsap.killTweensOf(element, "x,y");
      gsap.set(element, { x: 0, y: 0 });
    };
  }, [strength, limit]);

  return (
    <Element
      ref={elementRef}
      href={Element === "a" ? href : undefined}
      className={`magnetic-control ${className}`}
      {...props}
    >
      {children}
    </Element>
  );
}
