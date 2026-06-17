import { Link, useNavigate } from "react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";

interface AppHeaderProps {
  isBuilder?: boolean;
  isScanner?: boolean;
}

const navLinks = [
  { label: "How it Works", href: "/#how-it-works" },
  { label: "Strategy Builder", href: "/builder" },
  { label: "Strategy Scanner", href: "/scanner" },
  { label: "API", href: "/#api" },
  { label: "Skill Output", href: "/#output-preview" },
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#F0B90B]/10 border border-[#F0B90B]/25 shadow-[0_0_20px_rgba(240,185,11,0.08)] overflow-hidden">
              <img
                src="/assets/beststrat-logo-mark.png"
                alt="BestStrat logo"
                className="w-9 h-9 object-contain"
                draggable={false}
              />
            </div>
            <div>
              <div className="text-white font-semibold tracking-tight leading-none">BestStrat</div>
              <div className="text-[#848E9C] text-xs leading-none mt-0.5">CMC Strategy Skill Builder</div>
            </div>
          </Link>

          {/* Badge + Desktop Nav */}
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#F0B90B]/10 text-[#F0B90B] border border-[#F0B90B]/30">
              CMC Strategy Skill
            </span>
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleAnchor(link.href)}
                  className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                    (isBuilder && link.href === "/builder") || (isScanner && link.href === "/scanner")
                      ? "bg-[#F0B90B]/10 text-[#F0B90B]"
                      : "text-[#848E9C] hover:text-white hover:bg-[#1E2329]"
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </nav>
            {/* Mobile menu toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-1.5 rounded-lg text-[#848E9C] hover:text-white hover:bg-[#1E2329] transition-colors"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Dropdown */}
        {menuOpen && (
          <div className="md:hidden border-t border-[#2B3139] py-3 flex flex-col gap-1">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleAnchor(link.href)}
                className="text-left px-3 py-2 rounded-lg text-sm text-[#848E9C] hover:text-white hover:bg-[#1E2329] transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
