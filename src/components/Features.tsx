import { Reveal } from "./Reveal";

const features = [
  {
    icon: "/icons/collaboration.png",
    title: "Group chat",
    desc: "Every group gets a dedicated space to message teammates, share updates, and keep decisions in one thread.",
  },
  {
    icon: "/icons/kanban.png",
    title: "Kanban board",
    desc: "Break projects into tasks and move them across To do, In progress, and Done so everyone knows what is next.",
  },
  {
    icon: "/icons/tasks.png",
    title: "Task management",
    desc: "Assign work, set deadlines, and check items off. Each member sees exactly what they own.",
  },
  {
    icon: "/icons/analytics.png",
    title: "Progress and performance",
    desc: "Track how the group is doing overall and how each student contributes, individually and together.",
  },
  {
    icon: "/icons/time-tracking.png",
    title: "Time and milestones",
    desc: "Keep projects on schedule with milestones that stay aligned to the class syllabus and curriculum.",
  },
];

// Feature grid built from the brand icon set with staggered scroll reveal.
export function Features() {
  return (
    <section id="features" className="scroll-mt-20 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <Reveal className="max-w-2xl">
          <span className="text-sm font-600 text-gradient">Everything in one place</span>
          <h2 className="mt-3 text-3xl font-700 tracking-tight sm:text-4xl">
            Tools that keep group projects moving
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[var(--ink-soft)]">
            From the first task to the final grade, Collabify gives students the space to
            collaborate and gives professors the visibility to guide them.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 80}>
              <article className="group h-full rounded-2xl border border-[var(--line)] bg-[var(--bg-elevated)] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-blue/30 hover:shadow-brand">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[var(--bg)]">
                  <img src={f.icon} alt="" className="h-12 w-12 object-contain transition-transform duration-300 group-hover:scale-110" />
                </div>
                <h3 className="mt-5 text-lg font-600">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">{f.desc}</p>
              </article>
            </Reveal>
          ))}

          {/* Closing highlight card */}
          <Reveal delay={features.length * 80}>
            <article className="flex h-full flex-col justify-center rounded-2xl bg-brand-gradient p-6 text-white shadow-brand">
              <h3 className="text-xl font-700">One class, fully organized</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/85">
                Classes, groups, projects, and progress connected end to end so nothing slips
                through the cracks.
              </p>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
