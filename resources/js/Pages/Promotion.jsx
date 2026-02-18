import InnerPageLayout from "@/Layouts/InnerPageLayout";
import { Link, router } from "@inertiajs/react";
import useTranslate from "@/hooks/useTranslate";
import Pagination from "@/Components/Pagination";

export default function Promotion({ promotions = { data: [] }, filters = {}, latestNewsId }) {
  const { t, locale } = useTranslate();

  const handleTypeChange = (e) => {
    const type = e.target.value;
    router.get(route('promotion'), { type }, {
      preserveState: true,
      replace: true
    });
  };

  const toPublicUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    if (path.startsWith("/storage/")) return path;
    return `/storage/${path}`;
  };

  const formatDate = (promo) => {
    if (promo.type === 'news') {
      if (promo.id === latestNewsId) {
        // Show both label and date for the latest news
        return `${t("messages.latest_update")} - ${new Date(promo.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}`;
      }
      return new Date(promo.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    }
    return new Date(promo.start_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  console.log("promotions", promotions)
  return (
    <InnerPageLayout titleKey="messages.promotion">
      <section className="py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Page Heading */}
          <div className="text-center">
            <h2 className={`text-[35px] font-SemiBold ${locale === 'kh' ? '' : 'tracking-[0.25em]'} text-[#D4793F] font-display`}>
              {t("messages.promotion_news_heading")}
            </h2>
            <p className={`mt-3 text-[15px] font-SemiBold ${locale === 'kh' ? '' : 'tracking-[0.25em]'} text-[#185C9B]`}>
              {t("messages.promotion_intro_subtitle")}
            </p>
          </div>

          {/* Sort Dropdown (Type Filter) */}
          <div className="mt-12 flex justify-end">
            <div className="relative inline-block w-64">
              <select
                value={filters.type || ""}
                onChange={handleTypeChange}
                className={`block w-full appearance-none rounded-xl border border-slate-200 bg-white px-6 py-3 pr-10 text-xs font-Bold ${locale === 'kh' ? '' : 'tracking-widest'} text-slate-700 uppercase focus:border-[#185C9B] focus:outline-none focus:ring-1 focus:ring-[#185C9B] transition-all cursor-pointer`}
              >
                <option value="">{t("messages.all_types")}</option>
                <option value="promotion">{t("messages.promotion_label")}</option>
                <option value="news">{t("messages.news_label")}</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* List */}
          <div className="mt-12 space-y-6">
            {promotions.data && promotions.data.length > 0 ? (
              promotions.data.map((promo) => (
                <PromoRow key={promo.id} promo={promo} t={t} locale={locale} toPublicUrl={toPublicUrl} formatDate={formatDate} />
              ))
            ) : (
              <p className="text-center text-slate-500 py-20 font-Medium italic">{t("messages.no_promotions")}</p>
            )}
          </div>

          {/* Pagination */}
          <Pagination links={promotions.links} />
        </div>
      </section>
    </InnerPageLayout>
  );
}

function PromoRow({ promo, t, locale, toPublicUrl, formatDate }) {
  return (
    <Link
      href={route('promotions.show_detail', promo.id)}
      className="grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-8 group bg-white border border-slate-100 p-5 transition-all duration-500 rounded-[2rem] hover:shadow-2xl hover:shadow-slate-200/50 hover:translate-y-[-4px]"
    >
      {/* Left image */}
      <div className="md:col-span-4">
        <div className="relative overflow-hidden rounded-2xl bg-slate-100 aspect-[16/10] ring-1 ring-slate-100">
          <img
            src={toPublicUrl(promo.image_path)}
            alt={promo.title}
            className="h-full w-full object-fit transition-transform duration-500 ease-in-out group-hover:scale-110"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>
      </div>

      {/* Right content */}
      <div className="relative md:col-span-8 flex flex-col justify-center py-2">
        <div className="flex items-center justify-between gap-6 mb-2">
          <h3 className="text-[26px] font-Medium tracking-tight text-slate-700 group-hover:text-[#185C9B] transition-colors duration-500">
            {promo.title}
          </h3>
          <div className={`shrink-0 bg-[#D4793F]/10 px-5 py-1 text-[10px] font-Bold ${locale === 'kh' ? '' : 'tracking-[0.2em]'} text-[#D4793F] rounded-full border border-[#D4793F]/20 uppercase`}>
            {t(promo.type === 'promotion' ? 'messages.promotion_label' : 'messages.news_label')}
          </div>
        </div>

        <div className="h-[1px] w-full border-t border-dotted border-slate-200 mb-4 opacity-60" />

        <p className="text-[15px] leading-relaxed tracking-wide text-slate-600 line-clamp-2 transition-colors duration-500 group-hover:text-slate-900">
          {promo.description}
        </p>

        <div className="mt-6 flex items-center justify-between">
          <div className={`text-[12px] font-Bold text-slate-400 ${locale === 'kh' ? '' : 'tracking-widest'} uppercase`}>
            {formatDate(promo)}
          </div>
          <div className={`text-[#D4793F] font-Bold text-[13px] ${locale === 'kh' ? '' : 'tracking-[0.2em]'} uppercase flex items-center gap-2 group-hover:gap-4 transition-all duration-500`}>
            {t("messages.read_more")}
            <svg className="h-4 w-4 transform transition-transform duration-500 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}


