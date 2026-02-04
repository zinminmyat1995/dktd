import { Link, usePage, router } from "@inertiajs/react";
import { useEffect, useRef, useState } from "react";
import SiteFooter from "@/Components/SiteFooter";
import useTranslate from "@/hooks/useTranslate";

const socials = [
  { name: "TikTok", href: "#", icon: TikTokIcon },
  { name: "Instagram", href: "#", icon: InstagramIcon },
  { name: "Facebook", href: "https://www.facebook.com/DKTD.Genki", icon: FacebookIcon },
];

const navItems = [
  { key: "messages.home", routeName: "home" },
  { key: "messages.about", routeName: "about" },
  { key: "messages.products", routeName: "products" },
  { label: "Promos", routeName: "promotion" },
  { key: "messages.contact", routeName: "contact" },
];

export default function PublicLayout({ children }) {
  const { t, locale } = useTranslate();
  const page = usePage();
  const url = page.url;


  const [openLang, setOpenLang] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const langRef = useRef(null);

  const isActive = (path) => url === path || url.startsWith(path + "/");

  const changeLanguage = (lang) => {
    setOpenLang(false);
    setIsMenuOpen(false);

    router.visit(route("language.switch", lang), {
      method: "get",
      preserveScroll: true,
      preserveState: false, // ✅ props (locale/t) update ဖြစ်အောင်
      replace: true,
    });
  };

  // ✅ click outside => close dropdown
  useEffect(() => {
    const onDown = (e) => {
      if (!langRef.current) return;
      if (!langRef.current.contains(e.target)) setOpenLang(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [url]);

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-[100] w-full bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="mx-auto flex h-[88px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-12">
          {/* Left: Logo */}
          <Link href={route("home")} className="flex items-center gap-2 relative z-[110]">
            <img
              src="/images/logo.png"
              alt="DKTD-Genki"
              className="h-10 w-auto"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          </Link>

          {/* Center: Desktop Nav (Hidden on < 1024px) */}
          <nav className="hidden items-center gap-8 lg:flex">
            {navItems.map((item) => {
              const href = route(item.routeName);
              const path = new URL(href, window.location.origin).pathname;
              const active = isActive(path);

              return (
                <Link
                  key={item.routeName}
                  href={href}
                  className={[
                    "text-[15px] font-Bold uppercase tracking-widest transition-all duration-300",
                    active
                      ? "text-[#185C9B] border-b-2 border-[#185C9B] pb-1"
                      : "text-slate-600 hover:text-[#185C9B] border-b-2 border-transparent pb-1",
                  ].join(" ")}
                >
                  {/* ✅ translation key မရရင် fallback */}
                  {item.label || t(item.key)}
                </Link>
              );
            })}
          </nav>

          {/* Right: Language + Social (Desktop) + Burger (Mobile) */}
          <div className="flex items-center gap-4 relative z-[110]">
            {/* Desktop only features */}
            <div className="hidden lg:flex items-center gap-6">
              {/* Language dropdown */}
              <div ref={langRef} className="relative">
                <button
                  type="button"
                  onClick={() => setOpenLang((v) => !v)}
                  className="flex items-center gap-2 rounded-full border border-slate-200 px-5 py-2.5 text-[12px] font-Bold uppercase tracking-widest text-[#185C9B] hover:bg-slate-50 transition-all shadow-sm"
                >
                  {locale.toUpperCase()}
                  <ChevronDownIcon className={`h-4 w-4 transition-transform duration-300 ${openLang ? 'rotate-180' : ''}`} />
                </button>

                {openLang && (
                  <div className="absolute right-0 mt-3 w-40 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-2xl z-50 p-1">
                    <button
                      type="button"
                      onClick={() => changeLanguage("en")}
                      className={[
                        "block w-full px-4 py-3 text-left rounded-xl transition-colors text-[13px] font-Bold uppercase tracking-wider",
                        locale === "en" ? "bg-slate-50 text-[#185C9B]" : "text-slate-600 hover:bg-slate-50",
                      ].join(" ")}
                    >
                      English
                    </button>

                    <button
                      type="button"
                      onClick={() => changeLanguage("kh")}
                      className={[
                        "block w-full px-4 py-3 text-left rounded-xl transition-colors text-[13px] font-Bold uppercase tracking-wider",
                        locale === "kh" ? "bg-slate-50 text-[#185C9B]" : "text-slate-600 hover:bg-slate-50",
                      ].join(" ")}
                    >
                      ខ្មែរ
                    </button>
                  </div>
                )}
              </div>

              {/* Social icons */}
              <div className="flex items-center gap-3">
                {socials.map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="w-10 h-10 rounded-full flex items-center justify-center text-[#185C9B] hover:bg-[#185C9B] hover:text-white transition-all duration-500 border border-slate-100"
                    aria-label={s.name}
                  >
                    <s.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Hamburger Button (Visible on < 1024px) */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden w-12 h-12 flex flex-col items-center justify-center gap-1.5 rounded-full bg-slate-50 text-[#185C9B] hover:bg-slate-100 transition-all border border-slate-200"
              aria-label="Toggle Menu"
            >
              <div className={`h-0.5 w-6 bg-current rounded-full transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <div className={`h-0.5 w-6 bg-current rounded-full transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`} />
              <div className={`h-0.5 w-6 bg-current rounded-full transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay (slide-down) */}
        <div
          className={`
            fixed inset-0 top-0 z-[100] h-screen w-full bg-white transition-all duration-500 ease-in-out lg:hidden
            ${isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'}
          `}
        >
          <div className="flex flex-col h-full pt-[100px] px-8 pb-12 overflow-y-auto">
            {/* Mobile Nav Links */}
            <div className="space-y-6 flex flex-col items-center flex-1 justify-center">
              {navItems.map((item, idx) => {
                const href = route(item.routeName);
                const path = new URL(href, window.location.origin).pathname;
                const active = isActive(path);

                return (
                  <Link
                    key={item.routeName}
                    href={href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`
                      text-[24px] font-Bold uppercase tracking-[0.2em] transition-all duration-300
                      ${active ? 'text-[#185C9B] scale-110' : 'text-slate-400 hover:text-slate-900'}
                    `}
                    style={{ transitionDelay: `${idx * 50}ms` }}
                  >
                    {item.label || t(item.key)}
                  </Link>
                );
              })}
            </div>

            {/* Mobile Actions Footer */}
            <div className={`mt-auto pt-12 border-t border-slate-100 flex flex-col items-center gap-8 transition-all duration-700 delay-300 ${isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              {/* Language Selection */}
              <div className="flex gap-4">
                <button
                  onClick={() => changeLanguage("en")}
                  className={`px-6 py-2 rounded-full border-2 text-[12px] font-Bold uppercase tracking-widest transition-all ${locale === 'en' ? 'bg-[#185C9B] border-[#185C9B] text-white shadow-lg shadow-blue-900/20' : 'border-slate-200 text-slate-400'}`}
                >
                  English
                </button>
                <button
                  onClick={() => changeLanguage("kh")}
                  className={`px-6 py-2 rounded-full border-2 text-[12px] font-Bold uppercase tracking-widest transition-all ${locale === 'kh' ? 'bg-[#185C9B] border-[#185C9B] text-white shadow-lg shadow-blue-900/20' : 'border-slate-200 text-slate-400'}`}
                >
                  ខ្មែរ
                </button>
              </div>

              {/* Social Icons */}
              <div className="flex items-center gap-6">
                {socials.map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    className="w-14 h-14 rounded-full flex items-center justify-center text-[#185C9B] bg-slate-50 border border-slate-100 shadow-sm"
                  >
                    <s.icon className="h-7 w-7" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}

/** Icons (SVG) */
function ChevronDownIcon({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
      <path d="M5.5 7.5a1 1 0 0 1 1.4 0L10 10.6l3.1-3.1a1 1 0 1 1 1.4 1.4l-3.8 3.8a1 1 0 0 1-1.4 0L5.5 8.9a1 1 0 0 1 0-1.4z" />
    </svg>
  );
}

function TikTokIcon({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="currentColor">
      <path d="M34 6c1.2 4.6 4.6 8.1 9 9.3V24c-3.7-.1-6.9-1.3-9-3.3V32c0 8-6.5 14.5-14.5 14.5S5 40 5 32.1 11.5 17.6 19.5 17.6c.5 0 1 0 1.5.1V26c-.5-.2-1-.3-1.5-.3-3.5 0-6.4 2.9-6.4 6.4s2.9 6.4 6.4 6.4 6.4-2.9 6.4-6.4V6h8z" />
    </svg>
  );
}

function InstagramIcon({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="currentColor">
      <path d="M24 16.3A7.7 7.7 0 1 0 24 31.7a7.7 7.7 0 0 0 0-15.4zm0 12.7A5 5 0 1 1 24 19a5 5 0 0 1 0 10z" />
      <path d="M31.8 8H16.2A8.2 8.2 0 0 0 8 16.2v15.6A8.2 8.2 0 0 0 16.2 40h15.6A8.2 8.2 0 0 0 40 31.8V16.2A8.2 8.2 0 0 0 31.8 8zm5.5 23.8a5.5 5.5 0 0 1-5.5 5.5H16.2a5.5 5.5 0 0 1-5.5-5.5V16.2a5.5 5.5 0 0 1 5.5-5.5h15.6a5.5 5.5 0 0 1 5.5 5.5v15.6z" />
      <circle cx="33.5" cy="14.5" r="1.8" />
    </svg>
  );
}

function FacebookIcon({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M22 12a10 10 0 1 0-11.5 9.9v-7H8v-3h2.5V9.5c0-2.5 1.5-3.9 3.8-3.9
        1.1 0 2.2.2 2.2.2v2.4H15c-1.4 0-1.8.9-1.8 1.8V12H16l-.5 3h-2.3v7A10 10 0 0 0 22 12z"/>
    </svg>
  );
}

