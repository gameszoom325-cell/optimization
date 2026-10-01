import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function TiltCard({ children, className = "", as: Element = "article", ...props }) {
  const cardRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    const finePointer = window.matchMedia("(pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!card) return undefined;

    const rotateX = gsap.quickTo(card, "rotationX", { duration: 0.34, ease: "power3.out" });
    const rotateY = gsap.quickTo(card, "rotationY", { duration: 0.34, ease: "power3.out" });
    const lift = gsap.quickTo(card, "y", { duration: 0.28, ease: "power3.out" });
    gsap.set(card, { transformPerspective: 1000, transformOrigin: "50% 50%", force3D: true });

    const onMove = (event) => {
      if (!finePointer.matches || reducedMotion.matches) return;
      const bounds = card.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      const x = (event.clientX - bounds.left) / bounds.width;
      const y = (event.clientY - bounds.top) / bounds.height;
      card.style.setProperty("--card-pointer-x", `${x * 100}%`);
      card.style.setProperty("--card-pointer-y", `${y * 100}%`);
      rotateX((0.5 - y) * 5);
      rotateY((x - 0.5) * 5.5);
      lift(-4);
    };
    const reset = () => {
      rotateX(0);
      rotateY(0);
      lift(0);
    };
    const onPreferenceChange = () => {
      if (!finePointer.matches || reducedMotion.matches) reset();
    };

    card.addEventListener("pointermove", onMove, { passive: true });
    card.addEventListener("pointerleave", reset, { passive: true });
    finePointer.addEventListener("change", onPreferenceChange);
    reducedMotion.addEventListener("change", onPreferenceChange);
    return () => {
      card.removeEventListener("pointermove", onMove);
      card.removeEventListener("pointerleave", reset);
      finePointer.removeEventListener("change", onPreferenceChange);
      reducedMotion.removeEventListener("change", onPreferenceChange);
      gsap.killTweensOf(card, "rotationX,rotationY,y");
      gsap.set(card, { rotationX: 0, rotationY: 0, y: 0 });
    };
  }, []);

  return (
    <Element ref={cardRef} className={`tilt-card ${className}`} {...props}>
      {children}
    </Element>
  );
}
