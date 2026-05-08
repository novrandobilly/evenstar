import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Sessions", href: "/" },
  { label: "Profile", href: "/profile" },
];

export function Header() {
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur-sm border-b border-line">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 select-none group">
          <span className="text-xl leading-none">🎾</span>
          <span
            className="font-display italic text-[1.35rem] font-bold text-ace leading-none tracking-normal"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Evenstar
          </span>
        </Link>

        {/* Desktop nav — hidden on mobile */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "px-4 py-2 rounded-full text-xs tracking-[0.08em] uppercase font-bold transition-all",
                pathname === link.href
                  ? "bg-ace text-surface"
                  : "text-ink-3 hover:text-ink hover:bg-raised",
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
