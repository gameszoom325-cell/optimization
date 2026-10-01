import { useEffect, useRef } from "react";
import { mountParticles } from "../effects/particles.js";

export default function AmbientParticles() {
  const canvasRef = useRef(null);
  useEffect(() => {
    if (!canvasRef.current) return undefined;
    return mountParticles(canvasRef.current);
  }, []);
  return <canvas ref={canvasRef} className="ambient-particles" aria-hidden="true" />;
}
