const columns = [
  {
    title: "Product",
    links: ["Features", "How it works", "For educators"],
  },
  {
    title: "Account",
    links: ["Log in", "Sign up", "Reset password"],
  },
  {
    title: "Resources",
    links: ["Help center", "Contact", "Privacy"],
  },
];

// Site footer with brand mark, link columns, and Philippine context note.
export function Footer() {
  return (
    <footer className="border-t border-[var(--line)] bg-[var(--bg-elevated)]">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <img src="/collabify-logo.png" alt="Collabify" className="h-8 w-8 object-contain" />
              <span className="text-lg font-700 tracking-tight">
                Collab<span className="text-gradient">ify</span>
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[var(--ink-soft)]">
              A project management and collaboration platform built for BSIT students and
              professors in the Philippines.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-600">{col.title}</h4>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-[var(--ink-soft)] transition-colors hover:text-[var(--ink)]">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-[var(--line)] pt-6 text-xs text-[var(--ink-soft)] sm:flex-row">
          <span>&copy; {new Date().getFullYear()} Collabify. All rights reserved.</span>
          <span>Made for BSIT students in the Philippines.</span>
        </div>
      </div>
    </footer>
  );
}
