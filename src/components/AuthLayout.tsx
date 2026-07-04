import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";

interface Props {
  title: string;
  subtitle: string;
  children: ReactNode;
}

// Two-column split shell shared by the Login and Register pages.
export function AuthLayout({ title, subtitle, children }: Props) {
  return (
    <div className="flex min-h-screen bg-[var(--bg)]">
      {/* Brand panel (desktop only) */}
      <aside className="relative hidden w-[45%] overflow-hidden bg-brand-gradient p-12 text-white lg:flex lg:flex-col">
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-20">
          <div className="absolute -left-16 top-10 h-72 w-72 rounded-full bg-white blur-3xl" />
          <div className="absolute -bottom-16 right-0 h-80 w-80 rounded-full bg-white blur-3xl" />
        </div>

        <Link to="/" className="relative flex items-center gap-2.5">
          <img src="/collabify-logo.png" alt="Collabify" className="h-9 w-9 object-contain" />
          <span className="text-xl font-700 tracking-tight text-white">Collabify</span>
        </Link>

        <div className="relative mt-auto">
          <img
            src="/icons/collaboration.png"
            alt=""
            className="animate-float mb-8 w-40 drop-shadow-2xl"
          />
          <h2 className="max-w-sm text-3xl font-700 leading-tight">
            Where BSIT teams get work done.
          </h2>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/85">
            Classes, groups, projects, and progress connected end to end for professors and
            students in the Philippines.
          </p>
        </div>
      </aside>

      {/* Form panel */}
      <main className="relative flex flex-1 flex-col px-5 py-8 sm:px-10">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 lg:invisible">
            <img src="/collabify-logo.png" alt="Collabify" className="h-8 w-8 object-contain" />
            <span className="text-lg font-700 tracking-tight">
              Collab<span className="text-gradient">ify</span>
            </span>
          </Link>
          <ThemeToggle />
        </div>

        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-8">
          <h1 className="text-2xl font-700 tracking-tight sm:text-3xl">{title}</h1>
          <p className="mt-2 text-sm text-[var(--ink-soft)]">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </main>
    </div>
  );
}
