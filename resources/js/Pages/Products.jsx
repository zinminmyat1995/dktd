import InnerPageLayout from "@/Layouts/InnerPageLayout";
import { Link, router } from "@inertiajs/react";
import Pagination from "@/Components/Pagination";
import useTranslate from "@/hooks/useTranslate"; // Added useTranslate import

export default function Products({ products, categories, filters }) {
  const { t } = useTranslate(); // Initialize useTranslate

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    router.get(route('products'), { category: categoryId }, {
      preserveState: true,
      replace: true
    });
  };

  return (
    <InnerPageLayout titleKey="messages.products">
      <section className="py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Page Heading */}
          <div className="text-center">
            <h2 className="text-[35px] font-SemiBold tracking-[0.25em] text-[#D4793F]">
              {t("messages.our_products")}
            </h2>
            <p className="mt-3 text-[15px] font-SemiBold tracking-[0.25em] text-[#185C9B]">
              {t("messages.business_insights")}
            </p>
          </div>

          {/* Sort Dropdown */}
          <div className="mt-12 flex justify-end">
            <div className="relative inline-block w-64">
              <select
                value={filters.category || ""}
                onChange={handleCategoryChange}
                className="block w-full appearance-none rounded-xl border border-slate-200 bg-white px-6 py-3 pr-10 text-xs font-Bold tracking-widest text-slate-700 uppercase focus:border-[#185C9B] focus:outline-none focus:ring-1 focus:ring-[#185C9B] transition-all cursor-pointer"
              >
                <option value="">{t("messages.all_categories")}</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Grid */}
          <div className="mt-8 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {products.data.length > 0 ? (
              products.data.map((product) => (
                <ProductCard key={product.id} product={product} t={t} />
              ))
            ) : (
              <div className="col-span-full py-20 text-center">
                <p className="text-slate-500 font-Medium italic">{t("messages.no_products_found")}</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          <Pagination links={products.links} />
        </div>
      </section>
    </InnerPageLayout>
  );
}

function ProductCard({ product, t }) { // Added t prop
  return (
    <Link
      href={route('products.show_detail', product.id)}
      className="group relative overflow-hidden rounded-2xl aspect-square shadow-md transition-all duration-500 hover:shadow-xl flex items-center justify-center"
    >
      {product.is_new && (
        <div className="absolute top-5 right-5 z-10 transition-transform duration-500 group-hover:scale-110">
          <span className="bg-[#1E4F7A] text-white text-[10px] font-Bold px-4 py-1.5 rounded-full tracking-[0.2em] shadow-xl">
            {t("messages.new_badge")}
          </span>
        </div>
      )}
      <img
        src={product.image_path}
        alt={product.title}
        className="h-[90%] w-full object-contain transition-transform duration-700 group-hover:scale-110"
        onError={(e) => {
          e.target.src = "/images/placeholder.png";
        }}
      />

      {/* Simple Overlay with Product Name & Desc */}
      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/60 via-black/0 text-white p-5 opacity-80 transition-opacity duration-300 group-hover:opacity-100">
        <h3 className="text-base font-SemiBold tracking-wider uppercase mb-1">
          {product.title}
        </h3>
        <p className="text-[11px] leading-relaxed text-slate-200 line-clamp-2">
          {product.description}
        </p>
      </div>

      <div className="absolute inset-0 ring-1 ring-inset ring-white/10 group-hover:ring-white/20 transition-all duration-300"></div>
    </Link>
  );
}


