import type { ReactNode } from "react";
import { useInView } from "../hooks/useInView";

type Variant = "up" | "left" | "right" | "scale";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  variant?: Variant;
  once?: boolean;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

// Reveals content as it scrolls in and reverses it as it scrolls back out.
export function Reveal({
  children,
  delay = 0,
  variant = "up",
  once = false,
  className = "",
  as = "div",
}: RevealProps) {
  // rootMargin keeps items visible past the top, but reverses once they drop below.
  const { ref, inView } = useInView<HTMLElement>({
    once,
    rootMargin: "20% 0px -12% 0px",
  });
  const Tag = as as "div";

  return (
    <Tag
      ref={ref as never}
      className={`reveal reveal-${variant} ${inView ? "is-visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}
