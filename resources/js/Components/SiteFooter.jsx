import { Link } from "@inertiajs/react";
import useTranslate from "@/hooks/useTranslate";
import { cn } from "@/lib/utils";

const footerLinksCol1 = [
  { key: "messages.home", label: "Home", routeName: "home" },
  { key: "messages.about", label: "About us", routeName: "about" },
  { key: "messages.products", label: "All Products", routeName: "products" },
];

const footerLinksCol2 = [
  { key: "messages.promotion", label: "Promotions", routeName: "promotion" },
  // { key: "messages.locations", label: "Locations", routeName: "contact" }, // route မရှိသေးရင် contact ကိုချိတ်ထား
  { key: "messages.contact", label: "Contact Us", routeName: "contact" },
];

// const footerLinksCol3 = [
//   { key: "messages.terms", label: "Terms & Conditions", href: "#" },
// ];

// simple social icons (same style as header)
const socials = [
  { name: "TikTok", href: "#", icon: TikTokIcon },
  { name: "Telegram", href: "#", icon: TelegramIcon },
  { name: "Facebook", href: "https://www.facebook.com/DKTD.Genki", icon: FacebookIcon },
];

export default function SiteFooter() {
  const { t, locale } = useTranslate();

  return (
    <footer className="mt-8">
      {/* Top footer (white) */}
      <div className="bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-10 sm:px-6 lg:grid-cols-12 lg:px-8">
          {/* Left: Logo + text + socials */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3">
              <img
                src="/images/logo.png"
                alt="DKTD-Genki"
                className="h-12 w-auto"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            </div>

            <p className="mt-4 text-[15px] text-slate-700">
              {t('messages.slogan', 'Genki snack will make Cambodia people happy and smile.')}
            </p>

            <div className="mt-4 flex items-center gap-4">
              {socials.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#0C4A6E] hover:opacity-75"
                  aria-label={s.name}
                >
                  <s.icon className="h-7 w-7" />
                </a>
              ))}
            </div>
          </div>

          {/* Center: Useful links */}
          <div className="lg:col-span-8">
            <div className="text-center lg:text-left">
              <div className={`text-[18px] font-SemiBold ${locale === 'kh' ? '' : 'tracking-[0.25em]'} text-[#C46A2A]`}>
                {t("messages.useful_links")}
              </div>

              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
                <FooterCol items={footerLinksCol1} t={t} />
                <FooterCol items={footerLinksCol2} t={t} />
                {/* <FooterCol items={footerLinksCol3} t={t} /> */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom black bar */}
      <div className="bg-black">
        <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between px-4 py-4 sm:py-3 text-[13px] text-white sm:px-6 lg:px-8 gap-2 sm:gap-0 text-center sm:text-left">
          <div className="tracking-[0.15em]">
            Copyright © 2025 DKTD-Genki. All rights reserved.
          </div>

          {/* <a href="#" className="tracking-[0.15em] hover:opacity-80">
            {t("messages.terms", "Terms & Conditions")}
          </a> */}
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ items, t }) {
  return (
    <ul className="space-y-3 text-[14px] text-slate-800">
      {items.map((it) => (
        <li key={it.key} className="flex items-center gap-2">
          <span className="text-slate-700">.</span>

          {it.href ? (
            <a href={it.href} className="hover:underline">
              {t(it.key, it.label)}
            </a>
          ) : (
            <Link href={route(it.routeName)} className="hover:underline">
              {t(it.key, it.label)}
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
}

/** Icons */
function TikTokIcon({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="currentColor">
      <path d="M34 6c1.2 4.6 4.6 8.1 9 9.3V24c-3.7-.1-6.9-1.3-9-3.3V32c0 8-6.5 14.5-14.5 14.5S5 40 5 32.1 11.5 17.6 19.5 17.6c.5 0 1 0 1.5.1V26c-.5-.2-1-.3-1.5-.3-3.5 0-6.4 2.9-6.4 6.4s2.9 6.4 6.4 6.4 6.4-2.9 6.4-6.4V6h8z" />
    </svg>
  );
}

function TelegramIcon({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="currentColor">
      <path d="M24 4C13 4 4 13 4 24s9 20 20 20 20-9 20-20S35 4 24 4zm10.7 14.3-3.5 15.2c-.2 1.1-.8 1.3-1.6 1.3-1.4 0-1.9-1-2.9-1.7l-4.1-3-2 2c-.3.3-.6.6-1.2.6l.4-6.1 11.1-10.1c.5-.4-.1-.7-.8-.2L17.3 24l-5.9-1.8c-1.3-.4-1.3-1.3.3-1.9L34.1 11.8c1.2-.4 2.2.3 1.7 2.5z" />
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
