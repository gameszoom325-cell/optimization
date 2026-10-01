import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { SmoothScrollProvider } from "./effects/smoothScroll.js";
import "./styles/globals.css";
import "./styles/animations.css";
import "./styles/effects.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SmoothScrollProvider>
      <App />
    </SmoothScrollProvider>
  </React.StrictMode>
);
