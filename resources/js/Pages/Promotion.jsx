import InnerPageLayout from "@/Layouts/InnerPageLayout";
import { Link } from "@inertiajs/react";
import useTranslate from "@/hooks/useTranslate";
import Pagination from "@/Components/Pagination";

export default function Promotion({ promotions = { data: [] } }) {
  const { t } = useTranslate();

  return (
    <InnerPageLayout titleKey="messages.promotion">
      <section className="py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Page Heading */}
          <div className="text-center">
            <h2 className="text-[35px] font-SemiBold tracking-[0.25em] text-[#D4793F] font-display">
              {t("messages.promotion_heading")}
            </h2>
            <p className="mt-3 text-[15px] font-SemiBold tracking-[0.25em] text-[#185C9B]">
              {t("messages.business_insights")}
            </p>
          </div>

          {/* List */}
          <div className="mt-12 space-y-6">
            {promotions.data && promotions.data.length > 0 ? (
              promotions.data.map((promo) => (
                <PromoRow key={promo.id} promo={promo} t={t} /> // Pass t to PromoRow
              ))
            ) : (
              <p className="text-center text-slate-500 py-20">{t("messages.no_promotions")}</p>
            )}
          </div>

          {/* Pagination */}
          <Pagination links={promotions.links} />
        </div>
      </section>
    </InnerPageLayout>
  );
}

function PromoRow({ promo, t }) { // Receive t as prop
  return (
    <Link
      href={route('products.show_detail', promo.id)}
      className="grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-8 group bg-white border border-slate-100 p-5 transition-all duration-500 rounded-[2rem] hover:shadow-2xl hover:shadow-slate-200/50 hover:translate-y-[-4px]"
    >
      {/* Left image */}
      <div className="md:col-span-4">
        <div className="relative overflow-hidden rounded-2xl bg-slate-100 aspect-[16/10] ring-1 ring-slate-100">
          <img
            src={promo.image_path}
            alt={promo.title}
            className="h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>
      </div>

      {/* Right content */}
      <div className="relative md:col-span-8 flex flex-col justify-center py-2">
        <div className="flex items-center justify-between gap-6 mb-2">
          <h3 className="text-[26px] font-Bold tracking-tight text-slate-900 group-hover:text-[#185C9B] transition-colors duration-500 uppercase">
            {promo.title}
          </h3>
          {promo.is_new && (
            <div className="shrink-0 bg-[#1E4F7A] px-5 py-1 text-[10px] font-Bold tracking-[0.2em] text-white rounded-full shadow-lg shadow-blue-900/10 transform transition-transform duration-500 group-hover:scale-110">
              {t("messages.new_badge")}
            </div>
          )}
        </div>

        <div className="h-[1px] w-full border-t border-dotted border-slate-200 mb-4 opacity-60" />

        <p className="text-[15px] leading-relaxed tracking-wide text-slate-600 line-clamp-2 transition-colors duration-500 group-hover:text-slate-900">
          {promo.description}
        </p>

        <div className="mt-6 flex items-center justify-between">
          <div className="text-[12px] font-Bold text-slate-400 tracking-widest uppercase">
            {promo.start_date ? new Date(promo.start_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : t("messages.latest_update")}
          </div>
          <div className="text-[#D4793F] font-Bold text-[13px] tracking-[0.2em] uppercase flex items-center gap-2 group-hover:gap-4 transition-all duration-500">
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


