import { useState, useEffect, useCallback, useRef } from "react";
import { STORAGE_THEME_KEY } from "../constants";

const getInitialTheme = () => {
  const stored = localStorage.getItem(STORAGE_THEME_KEY);
  if (stored) return stored === "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
};

const THEME_COLORS = {
  light: "#fcfbff",
  dark: "#1b1c22",
};

const DURATION = 800;

export function useTheme() {
  const [isDark, setIsDark] = useState(getInitialTheme);
  const animating = useRef(false);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem(STORAGE_THEME_KEY, isDark ? "dark" : "light");
  }, [isDark]);

  const toggle = useCallback(
    (buttonEl) => {
      if (animating.current) return;

      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (!buttonEl || prefersReduced) {
        setIsDark((prev) => !prev);
        return;
      }

      animating.current = true;

      const rect = buttonEl.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      const xPercent = (x / window.innerWidth) * 100;
      const yPercent = (y / window.innerHeight) * 100;

      const nextIsDark = !isDark;
      const bgColor = THEME_COLORS[nextIsDark ? "dark" : "light"];

      const overlay = document.createElement("div");
      overlay.setAttribute("aria-hidden", "true");
      Object.assign(overlay.style, {
        position: "fixed",
        inset: "0",
        zIndex: "9999",
        background: bgColor,
        clipPath: `circle(0% at ${xPercent}% ${yPercent}%)`,
        transition: `clip-path ${DURATION}ms cubic-bezier(0.25, 0.1, 0.25, 1)`,
        pointerEvents: "none",
      });

      document.body.appendChild(overlay);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          overlay.style.clipPath = `circle(150% at ${xPercent}% ${yPercent}%)`;
        });
      });

      setTimeout(() => {
        setIsDark(nextIsDark);
      }, DURATION * 0.45);

      setTimeout(() => {
        overlay.style.opacity = "0";
        overlay.style.transition = `opacity ${DURATION * 0.4}ms ease-out`;
      }, DURATION * 0.9);

      setTimeout(() => {
        overlay.remove();
        animating.current = false;
      }, DURATION * 1.4);
    },
    [isDark],
  );

  return { isDark, toggle };
}
