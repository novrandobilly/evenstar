import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Sessions", href: "/" },
  { label: "Profile", href: "/profile" },
];

export function Header() {
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-40 bg-club-green border-b-2 border-gold">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 select-none">
          <span className="text-xl leading-none">🎾</span>
          <span className="font-serif italic text-ivory text-lg leading-none tracking-wide">
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
                "px-4 py-4 text-xs tracking-[0.2em] uppercase transition-colors border-b-2 -mb-0.5 font-medium",
                pathname === link.href
                  ? "text-gold-light border-gold-light"
                  : "text-ivory/50 border-transparent hover:text-ivory/80",
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
