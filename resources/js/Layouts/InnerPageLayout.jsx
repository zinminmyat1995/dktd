import PublicLayout from "@/Layouts/PublicLayout";
import InnerBanner from "@/Components/InnerBanner";
import useTranslate from "@/hooks/useTranslate";

function HomeHero({ image = "/images/banner1.png" }) {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="relative w-full h-[220px] sm:h-[320px] md:h-[420px] lg:h-[520px] xl:h-[600px]">
        <img
          src={image}
          alt="Home banner"
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white to-transparent" />

        <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-4 sm:px-6 lg:px-12">
          <div className="max-w-xl">
            <p className="text-[11px] sm:text-[12px] font-Bold uppercase tracking-[0.3em] text-white/90">
              DKTD-Genki
            </p>

            <h1 className="mt-3 text-[28px] sm:text-[40px] md:text-[52px] lg:text-[60px] font-Bold leading-tight text-white drop-shadow">
              Premium Snacks
              <span className="block text-white/90">For Everyone</span>
            </h1>

            <p className="mt-4 text-[14px] sm:text-[16px] md:text-[18px] text-white/85 leading-relaxed">
              Imported snacks & candies that bring joy to every moment.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={route("products")}
                className="inline-flex items-center justify-center rounded-full bg-white px-7 py-3 text-[12px] sm:text-[13px] font-Bold uppercase tracking-[0.2em] text-[#185C9B] shadow-lg shadow-black/10 hover:bg-white/90 transition"
              >
                Shop Now
              </a>

              <a
                href={route("contact")}
                className="inline-flex items-center justify-center rounded-full border border-white/60 px-7 py-3 text-[12px] sm:text-[13px] font-Bold uppercase tracking-[0.2em] text-white hover:bg-white/10 transition"
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function InnerPageLayout({ titleKey, children, isHome = false }) {
  const { t } = useTranslate();

  return (
    <PublicLayout>
      {isHome ? (
        <HomeHero image="/images/banner1.png" />
      ) : (
        <InnerBanner
          title={t(titleKey)}
          image="/images/banner.png"
          objectPosition="center"
        />
      )}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10 font">
        {children}
      </div>
    </PublicLayout>
  );
}
