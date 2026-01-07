import { useState } from "react";
import { Link, useLocation } from "@remix-run/react";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/#services" },
  { name: "Contact", href: "/#contact" },
];

// Hexagon logo component
function HexagonLogo() {
  return (
    <svg
      className="w-9 h-9"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Outer hexagon */}
      <path
        d="M20 2L36.5 11V29L20 38L3.5 29V11L20 2Z"
        fill="url(#hexGradient)"
        stroke="#92400e"
        strokeWidth="1.5"
      />
      {/* Inner hexagon pattern */}
      <path
        d="M20 8L30 14V26L20 32L10 26V14L20 8Z"
        fill="none"
        stroke="#fef3c7"
        strokeWidth="1"
        opacity="0.6"
      />
      {/* Center honeycomb cell */}
      <path
        d="M20 14L25 17.5V24.5L20 28L15 24.5V17.5L20 14Z"
        fill="#fef3c7"
        opacity="0.8"
      />
      <defs>
        <linearGradient id="hexGradient" x1="3.5" y1="2" x2="36.5" y2="38" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fbbf24" />
          <stop offset="1" stopColor="#d97706" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 glass border-b border-primary-100">
      <nav className="container-custom" aria-label="Main navigation">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2 font-bold text-xl text-slate-900"
            aria-label="Hexacomb - Home"
          >
            <HexagonLogo />
            <span className="text-slate-800">Hexa<span className="text-primary-600">comb</span></span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary-600 ${
                  location.pathname === item.href
                    ? "text-primary-600"
                    : "text-slate-600"
                }`}
              >
                {item.name}
              </Link>
            ))}
            <Link to="/#contact" className="btn-primary text-sm">
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-primary-50 focus-visible:ring-2 focus-visible:ring-primary-500"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-primary-100" id="mobile-menu">
            <div className="flex flex-col gap-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`text-base font-medium transition-colors ${
                    location.pathname === item.href
                      ? "text-primary-600"
                      : "text-slate-600 hover:text-primary-600"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Link 
                to="/#contact" 
                className="btn-primary text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
