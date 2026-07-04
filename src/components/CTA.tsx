import { Link } from "react-router-dom";
import { Reveal } from "./Reveal";

// Closing call-to-action band with the brand gradient.
export function CTA() {
  return (
    <section className="pb-24 sm:pb-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-brand-gradient px-8 py-16 text-center text-white shadow-brand sm:px-16 sm:py-20">
            <div aria-hidden className="pointer-events-none absolute inset-0 opacity-20">
              <div className="absolute -left-10 -top-10 h-48 w-48 rounded-full bg-white blur-3xl" />
              <div className="absolute -bottom-10 -right-10 h-56 w-56 rounded-full bg-white blur-3xl" />
            </div>
            <div className="relative">
              <h2 className="text-3xl font-700 tracking-tight sm:text-4xl">
                Ready to collaborate?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/85">
                Bring your class into Collabify and give every group the tools to do their best
                work this semester.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  to="/register"
                  className="rounded-full bg-white px-6 py-3 text-sm font-600 text-brand-blue transition-transform hover:-translate-y-0.5"
                >
                  Get started free
                </Link>
                <a
                  href="#features"
                  className="rounded-full border border-white/40 px-6 py-3 text-sm font-500 text-white transition-colors hover:bg-white/10"
                >
                  Explore features
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
