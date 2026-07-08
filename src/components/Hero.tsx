import { Link } from "react-router-dom";
import { useParallax } from "../hooks/useScrollFx";

const chips = ["Auto class codes", "3 ways to group", "Kanban + chat", "Live progress"];

// Hero: blueprint-grid backdrop, staggered load, and a parallax icon cluster.
export function Hero() {
  const glow = useParallax<HTMLDivElement>(0.18);
  const cluster = useParallax<HTMLDivElement>(0.1);

  return (
    <section id="top" className="relative overflow-hidden">
      {/* Backdrop: faint grid fading out, plus drifting gradient glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute inset-0 bg-grid opacity-60"
          style={{
            maskImage: "radial-gradient(ellipse 75% 55% at 50% 0%, #000 35%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(ellipse 75% 55% at 50% 0%, #000 35%, transparent 100%)",
          }}
        />
        <div ref={glow} className="absolute inset-0">
          <div className="absolute left-1/2 top-[-12%] h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-brand-blue/20 blur-[130px]" />
          <div className="absolute right-[6%] top-[26%] h-[380px] w-[380px] rounded-full bg-brand-green/20 blur-[120px]" />
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 pb-24 pt-36 sm:px-6 sm:pt-40 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <span
            className="animate-in eyebrow inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--bg-elevated)] px-3.5 py-1.5 text-[var(--ink-soft)]"
            style={{ animationDelay: "0ms" }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-brand-green" />
            BSIT / Philippines
          </span>

          <h1
            className="animate-in mt-6 text-[2.6rem] font-700 leading-[1.04] tracking-[-0.03em] sm:text-6xl lg:text-[4.4rem]"
            style={{ animationDelay: "90ms" }}
          >
            Where BSIT teams
            <br />
            <span className="text-gradient">get work done.</span>
          </h1>

          <p
            className="animate-in mt-6 max-w-xl text-base leading-relaxed text-[var(--ink-soft)] sm:text-lg"
            style={{ animationDelay: "180ms" }}
          >
            Collabify brings the whole class into one place. Professors create classes and organize
            groups; students collaborate on projects with group chat, a kanban board, and progress
            they can actually see.
          </p>

          <div
            className="animate-in mt-9 flex flex-col gap-3 sm:flex-row"
            style={{ animationDelay: "270ms" }}
          >
            <Link
              to="/register"
              className="rounded-full bg-brand-gradient px-6 py-3 text-center text-sm font-600 text-white shadow-brand transition-transform hover:-translate-y-0.5"
            >
              Get started free
            </Link>
            <a
              href="#how-it-works"
              className="rounded-full border border-[var(--line)] bg-[var(--bg-elevated)] px-6 py-3 text-center text-sm font-500 text-[var(--ink)] transition-colors hover:border-brand-blue/40"
            >
              See how it works
            </a>
          </div>

          <div
            className="animate-in mt-10 flex flex-wrap gap-2"
            style={{ animationDelay: "360ms" }}
          >
            {chips.map((c) => (
              <span
                key={c}
                className="eyebrow rounded-md border border-[var(--line)] px-2.5 py-1 text-[0.62rem] text-[var(--ink-soft)]"
              >
                {c}
              </span>
            ))}
          </div>
        </div>

        {/* Parallax icon cluster */}
        <div ref={cluster} className="animate-in relative mx-auto w-full max-w-md" style={{ animationDelay: "220ms" }}>
          <div className="relative aspect-square">
            <div aria-hidden className="absolute inset-6 rounded-[2.5rem] bg-brand-gradient opacity-10 blur-2xl" />
            <div className="absolute inset-0 flex items-center justify-center">
              <img src="/icons/collaboration.png" alt="" className="w-4/5 animate-float drop-shadow-2xl" />
            </div>
            <img
              src="/icons/kanban.png"
              alt=""
              className="animate-float-slow absolute -left-2 top-6 w-24 drop-shadow-xl sm:w-28"
            />
            <img
              src="/icons/analytics.png"
              alt=""
              className="animate-float absolute -right-1 bottom-8 w-24 drop-shadow-xl sm:w-28"
              style={{ animationDelay: "1.5s" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
