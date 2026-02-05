import PublicLayout from "@/Layouts/PublicLayout";
import InnerBanner from "@/Components/InnerBanner";
import useTranslate from "@/hooks/useTranslate";
import { cn } from "@/lib/utils";

function HomeHero({ image = "/images/banner1.png" }) {
  const { t, locale } = useTranslate();

  // Condition for Khmer font sizing (adjusting for larger Khmer script)
  const titleSizing = locale === 'kh'
    ? "text-[18px] xs:text-[21px] sm:text-[30px] md:text-[38px] lg:text-[48px]"
    : "text-[26px] xs:text-[30px] sm:text-[40px] md:text-[50px] lg:text-[60px]";

  const leadingSizing = locale === 'kh' ? "leading-relaxed" : "leading-tight";

  return (
    <section className="relative w-full overflow-hidden">
      <div className="relative w-full h-[500px] sm:h-[600px] md:h-[700px] lg:h-[800px] xl:h-[900px]">
        <img
          src={image}
          alt="Home banner"
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
        />

        {/* Enhanced Gradients for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white via-white/50 to-transparent opacity-90" />

        <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 lg:items-center w-full gap-12">
            {/* Left Column: Text Content */}
            <div className="w-full max-w-4xl">
              {/* Kicker with accent line */}
              <div className="flex items-center gap-3 mb-4">
                <div className="h-[2px] w-10 bg-[#C46A2A] shadow-md" />
                <p className={`text-[13px] sm:text-[14px] font-Bold uppercase tracking-[0.3em] text-white/90 drop-shadow-md`}>
                  {t("messages.hero_kicker")}
                </p>
              </div>

              {/* Main Title - White + Orange Accent */}
              <h1 className={`${titleSizing} ${leadingSizing} font-Bold text-white drop-shadow-2xl font-display uppercase`}>
                <span className="block drop-shadow-sm">{t("messages.hero_title_1")}</span>
                <span className="block text-[#C46A2A] relative w-fit mt-1">
                  {t("messages.hero_title_2")}
                  {/* Decorative Straight Underline */}
                  <div className="absolute -bottom-1 sm:-bottom-2 left-0 w-[50%] h-[3px] sm:h-[4px] bg-[#185C9B] rounded-full shadow-sm" />
                </span>
              </h1>

              <p className="mt-6 text-[16px] sm:text-[18px] md:text-[20px] font-Medium text-white/95 leading-relaxed max-w-xl drop-shadow-lg tracking-wide">
                {t("messages.hero_description")}
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href={route("contact")}
                  className="
                    group relative overflow-hidden rounded-full 
                    bg-[#C46A2A] px-8 py-4 
                    text-[12px] sm:text-[13px] font-Bold uppercase tracking-[0.2em] text-white 
                    shadow-2xl shadow-orange-900/40 
                    transition-all duration-500 
                    hover:-translate-y-1 hover:shadow-orange-900/60
                    border-2 border-[#C46A2A] hover:bg-transparent hover:text-white
                  "
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {t("messages.contact")}
                    <svg className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                  <div className="absolute inset-0 bg-white/20 translate-y-full transition-transform duration-500 group-hover:translate-y-0" />
                </a>
              </div>
            </div>

            {/* Right Column: Character Image */}
            <div className="hidden lg:flex items-center justify-center lg:justify-end h-full">
              <div className="relative w-full max-w-[605px] animate-float">
                <img
                  src="/images/character.png"
                  alt="DKTD-Genki Character"
                  className="w-full h-auto drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)] transform rotate-[-2deg]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(-2deg); }
          50% { transform: translateY(-30px) rotate(1deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}} />
    </section>
  );
}

export default function InnerPageLayout({ titleKey, children, isHome = false }) {
  const { t } = useTranslate();

  return (
    <PublicLayout>
      {isHome ? (
        <HomeHero />
      ) : (
        <InnerBanner
          title={t(titleKey)}
          image="/images/banner3.png"
          objectPosition="center"
        />
      )}

      <main>{children}</main>
    </PublicLayout>
  );
}
