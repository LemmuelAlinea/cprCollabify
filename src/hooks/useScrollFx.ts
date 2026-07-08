import { useEffect, useRef, useState } from "react";

const prefersReduced = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Translates an element on the Y axis as the page scrolls, for a parallax feel.
// Positive speed moves opposite the scroll; keep small (0.05-0.25).
export function useParallax<T extends HTMLElement = HTMLDivElement>(speed = 0.12) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReduced()) return;

    let raf = 0;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const delta = center - window.innerHeight / 2;
      el.style.transform = `translate3d(0, ${(-delta * speed).toFixed(1)}px, 0)`;
      raf = 0;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [speed]);

  return ref;
}

// Reports 0..1 progress as an element travels up through the viewport.
// Used to draw the How-it-works thread and reverse it on scroll up.
export function useScrollProgress<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * 0.8; // begins as the section nears mid-screen
      const end = vh * 0.2;
      const p = (start - rect.top) / (start - end + rect.height);
      setProgress(Math.max(0, Math.min(1, p)));
      raf = 0;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return { ref, progress };
}
