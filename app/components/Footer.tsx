import { Link } from "@remix-run/react";

const footerLinks = {
  company: [
    { name: "About", href: "/about" },
    { name: "Services", href: "/#services" },
    { name: "Contact", href: "/#contact" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
  ],
};

// Hexagon logo for footer
function HexagonLogo() {
  return (
    <svg
      className="w-9 h-9"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M20 2L36.5 11V29L20 38L3.5 29V11L20 2Z"
        fill="url(#hexGradientFooter)"
        stroke="#fef3c7"
        strokeWidth="1.5"
        opacity="0.9"
      />
      <path
        d="M20 8L30 14V26L20 32L10 26V14L20 8Z"
        fill="none"
        stroke="#fef3c7"
        strokeWidth="1"
        opacity="0.4"
      />
      <path
        d="M20 14L25 17.5V24.5L20 28L15 24.5V17.5L20 14Z"
        fill="#fef3c7"
        opacity="0.6"
      />
      <defs>
        <linearGradient id="hexGradientFooter" x1="3.5" y1="2" x2="36.5" y2="38" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fbbf24" />
          <stop offset="1" stopColor="#d97706" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 relative overflow-hidden" role="contentinfo">
      {/* Subtle honeycomb pattern overlay */}
      <div className="absolute inset-0 bg-honeycomb opacity-5" aria-hidden="true" />
      
      <div className="container-custom py-12 md:py-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link 
              to="/" 
              className="flex items-center gap-2 font-bold text-xl text-white mb-4"
              aria-label="Hexacomb"
            >
              <HexagonLogo />
              <span>Hexa<span className="text-primary-400">comb</span></span>
            </Link>
            <p className="text-slate-400 max-w-md">
              Building the digital hive for your business. We craft efficient, 
              scalable solutions that work as hard as you do. Sweet results, guaranteed.
            </p>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-3" role="list">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-slate-400 hover:text-primary-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-3" role="list">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-slate-400 hover:text-primary-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">
            © {currentYear} Hexacomb. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-primary-400 transition-colors"
              aria-label="Follow us on Twitter"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-primary-400 transition-colors"
              aria-label="Connect on LinkedIn"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
