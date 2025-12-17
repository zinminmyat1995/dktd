import { Link, usePage } from "@inertiajs/react";

const socials = [
  { name: "TikTok", href: "#", icon: TikTokIcon },
  { name: "Instagram", href: "#", icon: InstagramIcon },
  { name: "Facebook", href: "#", icon: FacebookIcon },
];

const navItems = [
  { label: "Home", routeName: "home" },
  { label: "About Us", routeName: "about" },
  { label: "Products", routeName: "products" },
  { label: "Promotion", routeName: "promotion" },
  { label: "Contact Us", routeName: "contact" },
];

export default function PublicLayout({ children }) {
  const { url } = usePage();

  // Inertia url က "/about" "/products" စတာမျိုးဖြစ်မယ်
  const isActive = (path) => url === path || url.startsWith(path + "/");

  return (
    <div className="min-h-screen bg-white">
      <header className="w-full bg-white">
        <div className="mx-auto flex h-[88px] max-w-7xl items-center justify-between px-4">
          {/* Left: Logo */}
          <Link href={route("home")} className="flex items-center gap-2">
            {/* TODO: မင်း logo image file ထည့်ချင်ရင် public/images/logo.png ထားပြီး img သုံး */}
            <img
              src="/images/logo.png"
              alt="DKTD-Genki"
              className="h-10 w-auto"
              onError={(e) => {
                // logo မရှိသေးရင် text fallback
                e.currentTarget.style.display = "none";
              }}
            />
            <span className="text-sm font-semibold tracking-wide text-slate-800">
              {/* fallback text (logo မထည့်သေးရင်မြင်ချင်တာ) */}
            </span>
          </Link>

          {/* Center: Nav */}
          <nav className="hidden items-center gap-10 md:flex">
            {navItems.map((item) => {
              const href = route(item.routeName);
              // path ကို route URL ကနေယူ (simple)
              const path = new URL(href, window.location.origin).pathname;
              const active = isActive(path);

              return (
                <Link
                  key={item.routeName}
                  href={href}
                  className={[
                    "text-[16px] font-semibold",
                    active ? "text-[#0C4A6E]" : "text-[#0C4A6E]",
                    "hover:opacity-80",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right: Language + Social */}
          <div className="flex items-center gap-4">
            {/* Language dropdown (UI only) */}
            <button
              type="button"
              className="flex items-center gap-2 rounded-full border border-[#0C4A6E] px-4 py-2 text-sm font-semibold text-[#0C4A6E] hover:bg-slate-50"
            >
              EN
              <ChevronDownIcon className="h-4 w-4" />
            </button>

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

        {/* Divider line */}
        <div className="h-[1px] w-full bg-slate-100" />
      </header>

      <main>{children}</main>
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
    <svg className={className} viewBox="0 0 48 48" fill="currentColor">
      <path d="M27.5 41V26.6h4.8l.7-5.6h-5.5v-3.6c0-1.6.4-2.7 2.8-2.7h3V9.6c-.5-.1-2.3-.2-4.4-.2-4.4 0-7.4 2.7-7.4 7.6V21h-5v5.6h5V41h5z" />
    </svg>
  );
}
