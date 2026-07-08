import { Reveal } from "./Reveal";
import { useParallax } from "../hooks/useScrollFx";

const professor = [
  "Create classes with auto-generated join codes",
  "Upload projects aligned to your syllabus",
  "Group students randomly, by performance, or let them form their own",
  "Monitor every group's progress and performance",
];

const student = [
  "Join a class with a single code",
  "See class details and professor-uploaded projects",
  "Collaborate with group chat and a kanban board",
  "Track your individual and group performance",
];

function Check() {
  return (
    <svg viewBox="0 0 24 24" className="mt-0.5 h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

// Two-column split contrasting the professor and student experience.
export function ForRoles() {
  const blob = useParallax<HTMLDivElement>(0.14);

  return (
    <section id="for-roles" className="relative scroll-mt-20 py-24 sm:py-32">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div ref={blob} className="absolute inset-0">
          <div className="absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 rounded-full bg-brand-blue/10 blur-[130px]" />
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <Reveal variant="up" className="mx-auto max-w-2xl text-center">
          <span className="eyebrow text-gradient">Two roles, one platform</span>
          <h2 className="mt-4 text-3xl font-700 tracking-tight sm:text-4xl">
            Built for both sides of the class
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          <Reveal variant="left">
            <div className="h-full rounded-2xl border border-[var(--line)] bg-[var(--bg-elevated)] p-8">
              <span className="inline-flex rounded-full bg-brand-blue/10 px-3 py-1 text-xs font-600 text-brand-blue">
                For professors
              </span>
              <h3 className="mt-4 text-xl font-700">Run the class, not the busywork</h3>
              <ul className="mt-6 space-y-4">
                {professor.map((item, i) => (
                  <Reveal as="li" key={item} variant="up" delay={i * 90} className="flex gap-3 text-sm text-[var(--ink-soft)]">
                    <span className="text-brand-blue">
                      <Check />
                    </span>
                    <span>{item}</span>
                  </Reveal>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal variant="right" delay={80}>
            <div className="h-full rounded-2xl border border-[var(--line)] bg-[var(--bg-elevated)] p-8">
              <span className="inline-flex rounded-full bg-brand-green/10 px-3 py-1 text-xs font-600 text-brand-green">
                For students
              </span>
              <h3 className="mt-4 text-xl font-700">Collaborate and see your growth</h3>
              <ul className="mt-6 space-y-4">
                {student.map((item, i) => (
                  <Reveal as="li" key={item} variant="up" delay={i * 90} className="flex gap-3 text-sm text-[var(--ink-soft)]">
                    <span className="text-brand-green">
                      <Check />
                    </span>
                    <span>{item}</span>
                  </Reveal>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
