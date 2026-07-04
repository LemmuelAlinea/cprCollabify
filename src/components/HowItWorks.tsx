import { Reveal } from "./Reveal";

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

// Numbered vertical timeline explaining the class-to-collaboration flow.
export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20 border-y border-[var(--line)] bg-[var(--bg-elevated)] py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <Reveal className="max-w-2xl">
          <span className="text-sm font-600 text-gradient">How it works</span>
          <h2 className="mt-3 text-3xl font-700 tracking-tight sm:text-4xl">
            From class code to collaboration
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[var(--ink-soft)]">
            A simple flow that mirrors how BSIT classes actually run a semester.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-x-10 gap-y-8 md:grid-cols-2">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 70}>
              <div className="flex gap-5">
                <div className="flex-shrink-0">
                  <span className="text-gradient text-2xl font-800">{s.n}</span>
                </div>
                <div className="border-b border-[var(--line)] pb-6">
                  <h3 className="text-lg font-600">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">{s.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
