import InnerPageLayout from "@/Layouts/InnerPageLayout";
import useTranslate from "@/hooks/useTranslate";
import { Link } from "@inertiajs/react";

export default function Home({ products, promotions }) {
  const { t, locale } = useTranslate();

  const toPublicUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    if (path.startsWith("/storage/")) return path;
    return `/storage/${path}`;
  };

  return (
    <InnerPageLayout titleKey="messages.home" isHome>
      {/* ================= HERO SECTION ================= */}
      {/* 
      <section className="relative h-[400px] sm:h-[500px] lg:h-[650px] overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="/images/banner.png" 
            alt="Hero Banner" 
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-transparent" />
        </div>
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 h-full flex items-center">
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-6xl font-Bold text-[#185C9B] tracking-tight font-display leading-tight uppercase drop-shadow-sm">
              Premium Snacks <br />
              <span className="text-[#C46A2A]">For Everyone</span>
            </h1>
            <p className="mt-6 text-[18px] font-Medium text-slate-700 tracking-wide max-w-lg leading-relaxed">
              Discover our wide range of imported snacks and candies. 
              Quality taste that brings joy to every moment.
            </p>
            <div className="mt-10 flex gap-4 font-Bold tracking-widest uppercase">
              <Link 
                href={route('products')}
                className="bg-[#185C9B] text-white px-10 py-4 rounded-full shadow-xl shadow-blue-900/20 hover:bg-[#1E4F7A] transition-all hover:translate-y-[-2px]"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      </section>
      */}
      <section className="relative">
      </section>

      {/* ================= ABOUT SECTION ================= */}
      <section className="py-16 bg-slate-50/30 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 items-center">
            {/* Left */}
            <div className="lg:col-span-7">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-[2px] w-12 bg-[#185C9B]" />
                <p className={`text-[14px] font-Bold ${locale === 'kh' ? '' : 'tracking-[0.3em]'} text-[#185C9B] uppercase`}>
                  {t("messages.about_intro_subtitle")}
                </p>
              </div>

              <h2 className={`text-[40px] font-Bold ${locale === 'kh' ? '' : 'tracking-[0.1em]'} text-[#C46A2A] sm:text-[48px] font-display uppercase leading-tight`}>
                {t("messages.about", "About Us")}
              </h2>

              <div className="mt-8 space-y-6">
                <p className="max-w-xl text-[16px] font-Medium leading-relaxed tracking-wide text-slate-600 whitespace-pre-line">
                  {t("messages.short_Desc")}
                </p>
              </div>

              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href={route('about')}
                  className="
                    inline-flex items-center justify-center
                    bg-[#C46A2A] border-2 border-[#C46A2A]
                    px-10 py-4 text-[14px]
                    font-Bold tracking-[0.18em]
                    text-white
                    hover:bg-transparent hover:text-[#C46A2A] transition-all duration-500
                    rounded-full shadow-lg shadow-orange-900/10
                  "
                >
                  {t("messages.read_more")}
                  <svg className="ml-3 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>

              </div>

              {/* two small images */}
              <div className="mt-16 grid grid-cols-2 gap-8">
                <div className="overflow-hidden rounded-[2rem] shadow-2xl shadow-slate-200/50 ring-1 ring-slate-100">
                  <img
                    src="/images/about/image1.jpg"
                    alt="About visual 1"
                    className="h-[200px] w-full object-cover transition-transform duration-700 hover:scale-110"
                    onError={(e) => (e.target.src = "/images/placeholder.png")}
                  />
                </div>

                <div className="overflow-hidden rounded-[2rem] shadow-2xl shadow-slate-200/50 ring-1 ring-slate-100">
                  <img
                    src="/images/about/image2.jpg"
                    alt="About visual 2"
                    className="h-[200px] w-full object-cover transition-transform duration-700 hover:scale-110"
                    onError={(e) => (e.target.src = "/images/placeholder.png")}
                  />
                </div>
              </div>
            </div>

            {/* Right big image */}
            <div className="lg:col-span-5">
              <div className="relative">
                <div className="overflow-hidden rounded-[3rem] shadow-2xl shadow-slate-300 ring-1 ring-slate-100">
                  <img
                    src="/images/about/image3.jpg"
                    alt="Main about visual"
                    className="h-[400px] w-full object-cover sm:h-[500px] lg:h-[650px] transition-transform duration-700 hover:scale-110"
                    onError={(e) => (e.target.src = "/images/placeholder.png")}
                  />
                </div>
                {/* Decorative floating badge */}
                <div className="absolute -bottom-6 -left-6 bg-white p-8 rounded-[2rem] shadow-2xl border border-slate-50 hidden sm:block">
                  <p className="text-[32px] font-Bold text-[#185C9B] leading-none">{t("messages.years_legacy_number")}</p>
                  <p className="text-[10px] font-Bold text-slate-400 uppercase tracking-widest mt-2">{t("messages.years_legacy_text")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= OUR PRODUCTS ================= */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center">
            <h2 className={`mt-3 text-[35px] ${locale === 'kh' ? '' : 'tracking-[0.25em]'} text-[#D4793F] font-display font-SemiBold`}>
              {t("messages.our_products")}
            </h2>
            <p className={`text-[15px] ${locale === 'kh' ? '' : 'tracking-[0.25em]'} text-[#185C9B]`}>
              {t("messages.products_intro_subtitle")}
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <Link
                key={product.id}
                href={route('products.show_detail', product.id)}
                className="group relative h-120 overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-500 hover:shadow-2xl hover:translate-y-[-4px] block"
              >
                {product.is_new && (
                  <div className="absolute top-5 right-5 z-10 transition-transform duration-500 group-hover:scale-110">
                    <span className="bg-[#1E4F7A] text-white text-[10px] font-Bold px-4 py-1.5 rounded-full tracking-[0.2em] shadow-xl">
                      {t("messages.new_badge")}
                    </span>
                  </div>
                )}
                {/* Product Image */}
                <div className="h-[300px] sm:h-[350px] lg:h-[450px] xl:h-[500px] w-full overflow-hidden flex items-center justify-center">
                  <img
                    src={product.image_path}
                    alt={product.title}
                    className=" h-[90%] w-[90%] object-contain transition-transform duration-[1.5s] ease-out group-hover:scale-110"
                    onError={(e) => {
                      e.target.src = '/images/placeholder.png';
                    }}
                  />
                </div>

                {/* Product Info Overlay */}
                <div className="absolute inset-0 flex flex-col justify-end rounded-2xl bg-gradient-to-t from-black/60 via-white/0 to-transparent p-8 text-white transition-all duration-500 group-hover:from-black/90">
                  <div className="mb-2 transform transition-all duration-500 group-hover:-translate-y-1">
                    <span className="text-xl font-Bold text-[#D4793F] font-display">
                      0{index + 1}
                    </span>
                  </div>

                  <h3 className="text-xl font-Bold tracking-wider text-white mb-2 transform transition-all duration-500 group-hover:-translate-y-1">
                    {product.title}
                  </h3>

                  {/* Fixed-height description area to keep title/number aligned */}
                  <div className="min-h-[40px] mb-6">
                    <p className="text-sm leading-5 text-slate-200 line-clamp-2 transition-all duration-500 group-hover:line-clamp-4 group-hover:text-white group-hover:-translate-y-1">
                      {product.description}
                    </p>
                  </div>

                  <div className="inline-flex items-center text-sm font-Bold text-[#D4793F] group-hover:text-amber-300 transition-all duration-500 transform group-hover:-translate-y-1">
                    {t("messages.read_more")}
                    <svg className="ml-2 h-4 w-4 transform transition-transform duration-500 group-hover:translate-x-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href={route("products")}
              className="
                inline-flex items-center justify-center
                border-2 border-[#C46A2A]
                px-10 py-4 text-[13px]
                font-Bold tracking-[0.2em]
                text-[#C46A2A]
                hover:bg-[#C46A2A] hover:text-white transition-all duration-500
                rounded-full shadow-lg shadow-orange-900/5 hover:shadow-orange-900/20
                hover:translate-y-[-2px]
                uppercase
              "
            >
              {t("messages.view_more")}
            </Link>
          </div>
        </div>
      </section>

      {/* ================= PROMOTION ================= */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className={`mt-3 text-center text-[35px] ${locale === 'kh' ? '' : 'tracking-[0.25em]'} text-[#D4793F] font-display`}>
            {t("messages.promotion")}
          </h2>
          <p className={`text-center text-[15px] ${locale === 'kh' ? '' : 'tracking-[0.25em]'} text-[#185C9B]`}>
            {t("messages.promotion_intro_subtitle")}
          </p>


          {/* List */}
          <div className="mt-8 space-y-6">
            {promotions.map((promo) => (
              <Link
                key={promo.id}
                href={route('promotions.show_detail', promo.id)}
                className="flex flex-col sm:flex-row gap-6 sm:gap-8 border-b border-slate-100 pb-6 pt-2 hover:bg-slate-50/50 transition-all duration-500 group rounded-xl px-2 sm:px-0"
              >
                {/* Left image */}
                <div className="h-[180px] sm:h-[140px] w-full sm:w-[260px] shrink-0 overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-slate-200">
                  <img
                    src={toPublicUrl(promo.image_path)}
                    alt={promo.title}
                    className="h-full w-full object-fit transition-transform duration-[1.5s] ease-in-out group-hover:scale-110"
                    onError={(e) => (e.currentTarget.parentElement.style.display = "none")}
                  />
                </div>

                <div className="min-w-0 flex-1 flex flex-col justify-between py-1 transform transition-all duration-500 sm:group-hover:translate-x-1">
                  <div>
                    {/* Title row + Type badge */}
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
                      <h3 className="text-[20px] sm:text-[24px] font-Bold tracking-tight text-slate-900 group-hover:text-[#185C9B] transition-colors duration-500 uppercase truncate">
                        {promo.title}
                      </h3>

                      <div className="shrink-0 bg-[#D4793F]/10 px-4 py-1 text-[10px] font-Bold tracking-[0.2em] text-[#D4793F] rounded-full border border-[#D4793F]/20 uppercase">
                        {t(promo.type === 'promotion' ? 'messages.promotion_label' : 'messages.news_label')}
                      </div>
                    </div>

                    {/* dotted line under title */}
                    <div className="h-[1px] w-full border-t border-dotted border-slate-300 mb-3 opacity-50" />

                    {/* description */}
                    <p className="text-[14px] leading-relaxed tracking-wide text-slate-600 line-clamp-2 transition-colors duration-500 group-hover:text-slate-900">
                      {promo.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-6 sm:mt-auto pb-1">
                    <span className="text-[12px] font-Medium text-slate-400 uppercase tracking-widest">
                      {promo.start_date ? new Date(promo.start_date).toLocaleDateString() : t("messages.latest_update")}
                    </span>
                    <span className="text-[12px] font-Bold text-[#D4793F] uppercase tracking-widest flex items-center gap-2 group-hover:gap-4 transition-all duration-500">
                      {t("messages.read_more")}
                      <svg className="h-4 w-4 transform transition-all duration-500 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>


          <div className="mt-6 text-center">
            <Link
              href={route("promotion")}
              className="
                inline-flex items-center justify-center
                border-2 border-[#C46A2A]
                px-10 py-4 text-[13px]
                font-Bold tracking-[0.2em]
                text-[#C46A2A]
                hover:bg-[#C46A2A] hover:text-white transition-all duration-500
                rounded-full shadow-lg shadow-orange-900/5 hover:shadow-orange-900/20
                hover:translate-y-[-2px]
                uppercase
              "
            >
              {t("messages.view_more")}
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-50/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 items-center">
            {/* Left text */}
            <div className="lg:col-span-12 xl:col-span-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-[2px] w-12 bg-[#185C9B]" />
                <p className={`text-[14px] font-Bold ${locale === 'kh' ? '' : 'tracking-[0.3em]'} text-[#185C9B] uppercase`}>
                  {t("messages.find_our_store")}
                </p>
              </div>

              <h2 className="text-[40px] font-Bold tracking-[0.1em] text-[#C46A2A] sm:text-[48px] font-display uppercase leading-tight">
                {t("messages.locations")}
              </h2>

              <div className="mt-10 space-y-6">
                <div className="flex gap-6 p-4 rounded-2xl transition-all duration-500 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 group">
                  <div className="h-12 w-12 shrink-0 rounded-2xl bg-white shadow-lg border border-slate-100 flex items-center justify-center text-[#185C9B] transition-transform duration-500 group-hover:scale-110">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h5 className="text-[12px] font-Bold text-slate-400 uppercase tracking-widest mb-1 transition-colors duration-500 group-hover:text-[#185C9B]">{t("messages.opening_hours")}</h5>
                    <p className="text-[16px] font-Bold text-slate-900 tracking-wide">{t("messages.opening_hours_time")}</p>
                  </div>
                </div>

                <div className="flex gap-6 p-4 rounded-2xl transition-all duration-500 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 group">
                  <div className="h-12 w-12 shrink-0 rounded-2xl bg-white shadow-lg border border-slate-100 flex items-center justify-center text-[#C46A2A] transition-transform duration-500 group-hover:scale-110">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h5 className="text-[12px] font-Bold text-slate-400 uppercase tracking-widest mb-1 transition-colors duration-500 group-hover:text-[#C46A2A]">{t("messages.headquarters")}</h5>
                    <p className="text-[16px] font-Bold text-slate-900 leading-relaxed max-w-sm tracking-wide">
                      {t("messages.headquarters_address")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-12">
                <Link
                  href={route('contact')}
                  className={`inline-flex items-center text-[12px] font-Bold text-[#185C9B] border-b-2 border-transparent hover:border-[#185C9B] pb-1 transition-all uppercase ${locale === 'kh' ? '' : 'tracking-widest'}`}
                >
                  {t("messages.get_directions")}
                  <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Right map */}
            <div className="lg:col-span-12 xl:col-span-7">
              <div className="overflow-hidden rounded-[3rem] shadow-2xl shadow-slate-200 ring-4 ring-white">
                <iframe
                  title="DKTD-Genki Location"
                  className="h-[400px] w-full lg:h-[500px]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src="https://www.google.com/maps?q=Phnom%20Penh&output=embed"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </InnerPageLayout >
  );
}
