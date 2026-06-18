import { Link, useNavigate } from "react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";

interface AppHeaderProps {
  isBuilder?: boolean;
  isScanner?: boolean;
}

const navLinks = [
  { label: "How it Works", href: "/#how-it-works" },
  { label: "Builder", href: "/builder" },
  { label: "Scanner", href: "/scanner" },
  { label: "Skill Outputs", href: "/#output-preview" },
];

export function AppHeader({ isBuilder, isScanner }: AppHeaderProps) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleAnchor = (href: string) => {
    setMenuOpen(false);
    if (href.includes("#")) {
      const [path, id] = href.split("#");
      const targetPath = path || "/";
      if (window.location.pathname !== targetPath) {
        navigate(targetPath);
        setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 150);
      } else {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }
      return;
    }
    navigate(href);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[#2B3139] bg-[#0B0E11]/95 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link to="/" className="flex min-w-0 items-center gap-3 transition-opacity hover:opacity-90">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#F0B90B]/25 bg-[#F0B90B]/10 shadow-[0_0_20px_rgba(240,185,11,0.08)]">
              <img
                src="/assets/beststrat-logo-mark.png"
                alt="BestStrat logo"
                className="h-9 w-9 object-contain"
                draggable={false}
              />
            </div>
            <div className="min-w-0">
              <div className="truncate font-semibold leading-none tracking-tight text-white">BestStrat</div>
              <div className="mt-0.5 truncate text-xs leading-none text-[#848E9C]">CMC-powered strategy research</div>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <nav className="hidden items-center gap-1 md:flex">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleAnchor(link.href)}
                  className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                    (isBuilder && link.href === "/builder") || (isScanner && link.href === "/scanner")
                      ? "bg-[#F0B90B]/10 text-[#F0B90B]"
                      : "text-[#848E9C] hover:bg-[#1E2329] hover:text-white"
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </nav>

            <button
              onClick={() => handleAnchor("/builder")}
              className="hidden rounded-lg bg-[#F0B90B] px-4 py-2 text-sm font-semibold text-[#0B0E11] transition-colors hover:bg-[#F0B90B]/90 lg:inline-flex"
            >
              Start Builder
            </button>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="rounded-lg p-1.5 text-[#848E9C] transition-colors hover:bg-[#1E2329] hover:text-white md:hidden"
              aria-label="Toggle navigation menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="flex flex-col gap-1 border-t border-[#2B3139] py-3 md:hidden">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleAnchor(link.href)}
                className="rounded-lg px-3 py-2 text-left text-sm text-[#848E9C] transition-colors hover:bg-[#1E2329] hover:text-white"
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => handleAnchor("/builder")}
              className="mt-2 rounded-lg bg-[#F0B90B] px-3 py-2 text-left text-sm font-semibold text-[#0B0E11]"
            >
              Start Builder
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
