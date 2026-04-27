import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "SESSIONS", href: "/" },
  { label: "PROFILE", href: "/profile" },
];

export function Header() {
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-40 bg-terminal-bg/95 backdrop-blur-sm border-b border-terminal-border">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 select-none">
          <span className="text-xl leading-none">🎾</span>
          <span className="font-mono font-medium text-amber-glow tracking-widest text-sm">
            Evenstar
          </span>
        </Link>

        {/* Desktop nav — hidden on mobile (bottom nav handles it) */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "px-4 py-4 font-mono text-xs tracking-[0.15em] transition-colors border-b-2 -mb-px",
                pathname === link.href
                  ? "text-amber-glow border-amber-glow"
                  : "text-terminal-muted border-transparent hover:text-terminal-secondary",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
