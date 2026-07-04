import { Reveal } from "./Reveal";

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
  return (
    <section id="for-roles" className="scroll-mt-20 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-600 text-gradient">Built for both sides of the class</span>
          <h2 className="mt-3 text-3xl font-700 tracking-tight sm:text-4xl">
            One platform, two clear roles
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-2xl border border-[var(--line)] bg-[var(--bg-elevated)] p-8">
              <span className="inline-flex rounded-full bg-brand-blue/10 px-3 py-1 text-xs font-600 text-brand-blue">
                For professors
              </span>
              <h3 className="mt-4 text-xl font-700">Run the class, not the busywork</h3>
              <ul className="mt-6 space-y-4">
                {professor.map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-[var(--ink-soft)]">
                    <span className="text-brand-blue">
                      <Check />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="h-full rounded-2xl border border-[var(--line)] bg-[var(--bg-elevated)] p-8">
              <span className="inline-flex rounded-full bg-brand-green/10 px-3 py-1 text-xs font-600 text-brand-green">
                For students
              </span>
              <h3 className="mt-4 text-xl font-700">Collaborate and see your growth</h3>
              <ul className="mt-6 space-y-4">
                {student.map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-[var(--ink-soft)]">
                    <span className="text-brand-green">
                      <Check />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
