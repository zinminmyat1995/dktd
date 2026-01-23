import PublicLayout from "@/Layouts/PublicLayout";
import InnerBanner from "@/Components/InnerBanner";
import useTranslate from "@/hooks/useTranslate";

function HomeHero({ image = "/images/banner1.png" }) {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="relative w-full h-[500px] sm:h-[600px] md:h-[700px] lg:h-[800px] xl:h-[900px]">
        <img
          src={image}
          alt="Home banner"
          className="absolute inset-0 h-full w-full object-fit"
          draggable={false}
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white to-transparent" />

        <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-4 sm:px-6 lg:px-12">
          <div className="w-full max-w-4xl">
            <p className="text-[15px] sm:text-[16px] font-Bold uppercase tracking-[0.3em] text-white/90">
              DKTD-Genki
            </p>

            <h1 className="whitespace-nowrap text-[38px] sm:text-[50px] md:text-[62px] lg:text-[70px] font-Bold leading-tight text-[#C46A2A] drop-shadow">
              <span className="block">Premium Snacks</span>
              <span className="block text-[#185C9B]">For Everyone</span>
            </h1>

            <p className="mt-4 text-[18px] sm:text-[20px] md:text-[22px] text-[#C46A2A] leading-relaxed">
              Imported snacks & candies that bring joy to every moment.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={route("products")}
                className="inline-flex items-center justify-center rounded-full bg-[#185C9B] px-7 py-3 text-[12px] sm:text-[13px] font-Bold uppercase tracking-[0.2em] text-white shadow-lg shadow-[#185C9B]/30 hover:bg-[#124b80] transition-colors"
              >
                Shop Now
              </a>

              <a
                href={route("contact")}
                className="inline-flex items-center justify-center rounded-full border-2 border-[#185C9B] bg-white/90 px-7 py-3 text-[12px] sm:text-[13px] font-Bold uppercase tracking-[0.2em] text-[#185C9B] hover:bg-[#f0f7ff] transition-colors"
              >
                Contact Us
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
        <HomeHero />
      ) : (
        <InnerBanner
          title={t(titleKey)}
          image="/images/banner3.png"
          objectPosition="center"
        />
      )}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {children}
      </div>
    </PublicLayout>
  );
}
