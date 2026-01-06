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
  { key: "messages.promotion", routeName: "promotion" },
  { key: "messages.contact", routeName: "contact" },
];

export default function PublicLayout({ children }) {
  const { t, locale } = useTranslate();
  const page = usePage();
  const url = page.url;


  const [openLang, setOpenLang] = useState(false);
  const langRef = useRef(null);

  const isActive = (path) => url === path || url.startsWith(path + "/");

  const changeLanguage = (lang) => {
    setOpenLang(false);

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

  return (
    <div className="min-h-screen bg-white">
      <header className="w-full bg-white">
        <div className="mx-auto flex h-[88px] max-w-7xl items-center justify-between px-4">
          {/* Left: Logo */}
          <Link href={route("home")} className="flex items-center gap-2">
            <img
              src="/images/logo.png"
              alt="DKTD-Genki"
              className="h-10 w-auto"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          </Link>

          {/* Center: Nav */}
          <nav className="hidden items-center gap-10 md:flex">
            {navItems.map((item) => {
              const href = route(item.routeName);
              const path = new URL(href, window.location.origin).pathname;
              const active = isActive(path);

              return (
                <Link
                  key={item.routeName}
                  href={href}
                  className={[
                    "text-[16px] font-SemiBold",
                    "text-[#0C4A6E] hover:opacity-80",
                    active ? "opacity-100" : "opacity-90",
                  ].join(" ")}
                >
                  {/* ✅ translation key မရရင် fallback */}
                  {t(item.key)}
                </Link>
              );
            })}
          </nav>

          {/* Right: Language + Social */}
          <div className="flex items-center gap-4">
            {/* Language dropdown */}
            <div ref={langRef} className="relative">
              <button
                type="button"
                onClick={() => setOpenLang((v) => !v)}
                className="flex items-center gap-2 rounded-full border border-[#0C4A6E] px-4 py-2 text-sm font-SemiBold text-[#0C4A6E] hover:bg-slate-50"
              >
                {locale.toUpperCase()}
                <ChevronDownIcon className="h-4 w-4" />
              </button>

              {openLang && (
                <div className="absolute right-0 mt-2 w-36 overflow-hidden rounded-md border bg-white shadow z-50">
                  <button
                    type="button"
                    onClick={() => changeLanguage("en")}
                    className={[
                      "block w-full px-4 py-2 text-left hover:bg-gray-100",
                      locale === "en" ? "bg-gray-50 font-SemiBold" : "",
                    ].join(" ")}
                  >
                    English
                  </button>

                  <button
                    type="button"
                    onClick={() => changeLanguage("kh")}
                    className={[
                      "block w-full px-4 py-2 text-left hover:bg-gray-100",
                      locale === "th" ? "bg-gray-50 font-SemiBold" : "",
                    ].join(" ")}
                  >
                    ខ្មែរ
                  </button>
                </div>
              )}
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-4">
              {socials.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#0C4A6E] hover:opacity-75"
                  aria-label={s.name}
                >
                  <s.icon className="h-8 w-8" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="h-[1px] w-full bg-slate-100" />
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

