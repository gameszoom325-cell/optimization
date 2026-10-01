import { useEffect, useRef } from "react";
import { createCursorController } from "../effects/cursor.js";

export default function CursorSpotlight() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return undefined;

    const controller = createCursorController({ dot, ring });
    const sync = () => {
      const enabled = finePointer.matches && !reducedMotion.matches;
      document.body.classList.toggle("has-custom-cursor", enabled);
      controller.setEnabled(enabled);
    };
    sync();
    finePointer.addEventListener("change", sync);
    reducedMotion.addEventListener("change", sync);

    let pointerFrame = 0;
    const updateSpotlight = (event) => {
      if (pointerFrame) return;
      const { clientX, clientY } = event;
      pointerFrame = requestAnimationFrame(() => {
        pointerFrame = 0;
        document.documentElement.style.setProperty("--spotlight-x", `${clientX}px`);
        document.documentElement.style.setProperty("--spotlight-y", `${clientY}px`);
        document.documentElement.style.setProperty("--spotlight-alpha", finePointer.matches && !reducedMotion.matches ? "1" : "0");
      });
    };
    window.addEventListener("pointermove", updateSpotlight, { passive: true });

    return () => {
      if (pointerFrame) cancelAnimationFrame(pointerFrame);
      finePointer.removeEventListener("change", sync);
      reducedMotion.removeEventListener("change", sync);
      window.removeEventListener("pointermove", updateSpotlight);
      document.body.classList.remove("has-custom-cursor");
      controller.destroy();
    };
  }, []);

  return (
    <>
      <div className="cursor-spotlight" aria-hidden="true" />
      <div ref={dotRef} className="react-cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="react-cursor-ring" aria-hidden="true" />
    </>
  );
}
