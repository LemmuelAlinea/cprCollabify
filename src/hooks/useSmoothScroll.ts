import { useEffect } from "react";

// Offset (px) so anchor targets clear the fixed navbar (h-16 = 64px).
const NAV_OFFSET = 80;
// Lerp factor: higher glides faster, lower feels heavier.
const EASE = 0.1;

// Adds custom smooth scrolling: RAF momentum for the wheel plus eased
// anchor navigation. Momentum is skipped on touch and reduced-motion.
export function useSmoothScroll() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const momentum = !reduce && !isTouch;

    const root = document.documentElement;
    let target = window.scrollY;
    let current = window.scrollY;
    let rafId = 0;
    let running = false;

    const maxScroll = () => root.scrollHeight - window.innerHeight;
    const clamp = (v: number) => Math.max(0, Math.min(v, maxScroll()));

    const loop = () => {
      current += (target - current) * EASE;
      if (Math.abs(target - current) < 0.4) {
        current = target;
        window.scrollTo(0, current);
        running = false;
        return;
      }
      window.scrollTo(0, current);
      rafId = requestAnimationFrame(loop);
    };

    const start = () => {
      if (!running) {
        running = true;
        rafId = requestAnimationFrame(loop);
      }
    };

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey) return; // Leave pinch-zoom alone.
      e.preventDefault();
      // Normalize line and page delta modes to pixels.
      const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1;
      target = clamp(target + e.deltaY * unit);
      start();
    };

    // Resync target when scrolling comes from elsewhere (keys, scrollbar).
    const onScroll = () => {
      if (!running) {
        current = window.scrollY;
        target = window.scrollY;
      }
    };

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey) return;
      const link = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      const hash = link?.getAttribute("href");
      if (!hash || hash === "#") return;
      const el = document.querySelector(hash);
      if (!el) return;

      e.preventDefault();
      const top = clamp(el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET);
      if (momentum) {
        target = top;
        start();
      } else {
        window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
      }
      history.replaceState(null, "", hash);
    };

    if (momentum) {
      // Disable CSS smoothing so the RAF loop fully owns the position.
      root.style.scrollBehavior = "auto";
      window.addEventListener("wheel", onWheel, { passive: false });
      window.addEventListener("scroll", onScroll, { passive: true });
    }
    document.addEventListener("click", onClick);

    return () => {
      cancelAnimationFrame(rafId);
      root.style.scrollBehavior = "";
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("click", onClick);
    };
  }, []);
}
