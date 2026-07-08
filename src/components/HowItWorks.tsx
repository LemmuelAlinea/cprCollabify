import { Reveal } from "./Reveal";
import { useScrollProgress } from "../hooks/useScrollFx";

const steps = [
  {
    n: "01",
    title: "Professor creates a class",
    desc: "A unique class code is generated automatically. No manual setup or spreadsheets.",
  },
  {
    n: "02",
    title: "Students join with the code",
    desc: "Students enter the class code to join instantly and see the class details and projects.",
  },
  {
    n: "03",
    title: "Groups are formed",
    desc: "Professors group students their way: randomly, performance-based, or student-formed.",
  },
  {
    n: "04",
    title: "Teams collaborate",
    desc: "Groups chat, plan tasks on a kanban board, and work through professor-uploaded projects.",
  },
  {
    n: "05",
    title: "Everyone tracks progress",
    desc: "Students see individual and group performance; professors monitor every class and group.",
  },
];

// Vertical timeline whose gradient thread draws with scroll and reverses on the way up.
export function HowItWorks() {
  const { ref, progress } = useScrollProgress<HTMLOListElement>();
  const filled = progress * steps.length;

  return (
    <section
      id="how-it-works"
      className="scroll-mt-20 border-y border-[var(--line)] bg-[var(--bg-elevated)] py-24 sm:py-32"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <Reveal variant="up" className="max-w-2xl">
          <span className="eyebrow text-gradient">How it works</span>
          <h2 className="mt-4 text-3xl font-700 tracking-tight sm:text-4xl">
            From class code to collaboration
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[var(--ink-soft)]">
            A simple flow that mirrors how BSIT classes actually run a semester.
          </p>
        </Reveal>

        <ol ref={ref} className="relative mx-auto mt-16 max-w-3xl">
          {/* Thread track and scroll-drawn gradient fill */}
          <div className="absolute bottom-2 left-[15px] top-2 w-px bg-[var(--line)]" />
          <div
            className="absolute left-[15px] top-2 w-px bg-brand-gradient"
            style={{ height: `calc((100% - 1rem) * ${progress})` }}
          />

          {steps.map((s, i) => {
            const active = i < filled;
            return (
              <li key={s.n} className="relative flex gap-6 pb-10 last:pb-0">
                <span
                  className={`relative z-10 mt-1 h-[9px] w-[9px] shrink-0 translate-x-[11px] rounded-full ring-4 ring-[var(--bg-elevated)] transition-colors duration-300 ${
                    active ? "bg-brand-green" : "bg-[var(--line)]"
                  }`}
                />
                <Reveal variant="left" delay={40} className="flex-1 pl-2">
                  <span className="eyebrow text-gradient">{s.n}</span>
                  <h3 className="mt-1.5 text-lg font-600">{s.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-[var(--ink-soft)]">{s.desc}</p>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
