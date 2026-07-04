import { Link } from "react-router-dom";

// Hero section with staggered load animation and floating brand icons.
export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
      {/* Ambient gradient glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-10%] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-brand-blue/20 blur-[120px]" />
        <div className="absolute right-[8%] top-[30%] h-[360px] w-[360px] rounded-full bg-brand-green/20 blur-[120px]" />
      </div>

      <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 sm:px-6 lg:grid-cols-2">
        <div>
          <span
            className="animate-in inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--bg-elevated)] px-3.5 py-1.5 text-xs font-500 text-[var(--ink-soft)]"
            style={{ animationDelay: "0ms" }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-brand-green" />
            Built for BSIT students in the Philippines
          </span>

          <h1
            className="animate-in mt-6 text-4xl font-700 leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl"
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
            Collabify brings the whole class into one place. Professors create classes and
            organize groups; students collaborate on projects with group chat, a kanban board,
            and progress they can actually see.
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
            className="animate-in mt-10 flex items-center gap-6 text-xs text-[var(--ink-soft)]"
            style={{ animationDelay: "360ms" }}
          >
            <span>For professors and students</span>
            <span className="h-1 w-1 rounded-full bg-[var(--ink-soft)]/50" />
            <span>Aligned to your syllabus</span>
          </div>
        </div>

        {/* Hero visual: primary collaboration icon with floating accents */}
        <div className="animate-in relative mx-auto w-full max-w-md" style={{ animationDelay: "220ms" }}>
          <div className="relative aspect-square">
            <div aria-hidden className="absolute inset-6 rounded-[2.5rem] bg-brand-gradient opacity-10 blur-2xl" />
            <div className="absolute inset-0 flex items-center justify-center animate-float">
              <img src="/icons/collaboration.png" alt="" className="w-4/5 drop-shadow-2xl" />
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
