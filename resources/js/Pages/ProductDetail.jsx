import InnerPageLayout from "@/Layouts/InnerPageLayout";
import { Link } from "@inertiajs/react";
import useTranslate from "@/hooks/useTranslate";
import { useState, useRef, useLayoutEffect } from "react";

export default function ProductDetail({ product }) {
    const { t, locale } = useTranslate();
    const [isExpanded, setIsExpanded] = useState(false);
    const [showViewMore, setShowViewMore] = useState(false);
    const descriptionRef = useRef(null);

    // Reliable "View More" detection for 5 lines (Consistent with PromotionDetail)
    useLayoutEffect(() => {
        const checkHeight = () => {
            if (descriptionRef.current) {
                // ~125px is approximately 5 lines
                const scrollHeight = descriptionRef.current.scrollHeight;
                setShowViewMore(scrollHeight > 125);
            }
        };

        const observer = new ResizeObserver(checkHeight);
        if (descriptionRef.current) {
            observer.observe(descriptionRef.current);
            checkHeight();
        }

        const timers = [100, 500, 1000].map(ms => setTimeout(checkHeight, ms));
        return () => {
            observer.disconnect();
            timers.forEach(clearTimeout);
        };
    }, [product.description]);

    const toPublicUrl = (path) => {
        if (!path) return null;
        if (path.startsWith("http")) return path;
        if (path.startsWith("/storage/")) return path;
        return `/storage/${path}`;
    };

    return (
        <InnerPageLayout titleKey="messages.products">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-[35%_1fr_280px] lg:items-stretch h-full">

                    {/* Left: Product Image */}
                    <div className="overflow-hidden rounded-[2rem] bg-gray-50 shadow-xl shadow-slate-200/50 h-fit aspect-square ring-1 ring-slate-100 flex items-center justify-center">
                        <img
                            src={product.image_path}
                            alt={product.title}
                            className="w-full h-[90%] object-contain transition-transform duration-700 hover:scale-105"
                            onError={(e) => {
                                e.target.src = "/images/placeholder.png";
                            }}
                        />
                    </div>

                    {/* Right: Product Details Panel */}
                    <div className="flex flex-col h-full min-h-0">

                        {/* Top Content */}
                        <div className="flex-none">
                            <nav className="flex mb-6 overflow-x-auto no-scrollbar" aria-label="Breadcrumb">
                                <ol className="flex items-center space-x-2 sm:space-x-4 whitespace-nowrap">
                                    <li>
                                        <div>
                                            <Link href={route('products')} className={`text-[12px] sm:text-sm font-Bold text-slate-400 hover:text-[#185C9B] uppercase ${locale === 'kh' ? '' : 'tracking-wider'}`}>
                                                {t('messages.products')}
                                            </Link>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="flex items-center">
                                            <svg className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 text-slate-300" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" />
                                            </svg>
                                            <span className={`ml-2 sm:ml-4 text-[12px] sm:text-sm font-Bold text-slate-900 ${locale === 'kh' ? '' : 'tracking-wider'} truncate max-w-[150px] sm:max-w-none`}>{product.title}</span>
                                        </div>
                                    </li>
                                </ol>
                            </nav>

                            <div className="flex flex-wrap items-center gap-2">
                                {product.category && (
                                    <span className={`inline-flex items-center rounded-full bg-[#185C9B]/10 px-4 py-1.5 text-[10px] sm:text-xs font-Bold ${locale === 'kh' ? '' : 'tracking-widest'} text-[#185C9B] uppercase`}>
                                        {product.category.name}
                                    </span>
                                )}
                                {product.is_new && (
                                    <span className={`inline-flex items-center rounded-full bg-[#1E4F7A] px-4 py-1.5 text-[10px] sm:text-xs font-Bold ${locale === 'kh' ? '' : 'tracking-widest'} text-white uppercase shadow-sm`}>
                                        {t("messages.new_badge")}
                                    </span>
                                )}
                                {product.promotions && product.promotions.length > 0 && (
                                    <span className="inline-flex items-center rounded-full bg-[#D4793F] px-4 py-1.5 text-[10px] sm:text-xs font-Bold tracking-widest text-white uppercase shadow-sm">
                                        {t("messages.promotion_label") || "Promotion"}
                                    </span>
                                )}
                            </div>

                            <h1 className="mt-4 text-[28px] sm:text-4xl lg:text-5xl font-Medium tracking-tight text-slate-700 font-display leading-tight break-words">
                                {product.title}
                            </h1>

                            <div className="mt-2 text-[10px] font-Bold text-slate-400 uppercase tracking-widest">
                                {t("messages.posted_date") || "Posted"}: {new Date(product.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                            </div>
                        </div>

                        {/* Middle Content */}
                        <div className="mt-8 mb-6 flex-1 flex flex-col min-h-0">
                            <h3 className={`text-sm font-SemiBold text-[#D4793F] ${locale === 'kh' ? '' : 'tracking-[0.2em]'} uppercase mb-4 font-display`}>
                                {t("messages.product_description_heading")}
                            </h3>

                            <div className="relative flex-1 overflow-hidden min-h-0">
                                <div
                                    ref={descriptionRef}
                                    className={`text-base leading-relaxed text-slate-600 whitespace-pre-line break-words custom-scrollbar
                                    ${isExpanded ? 'overflow-y-auto h-full pr-4' : 'max-h-[125px] overflow-hidden'}`}
                                >
                                    {product.description || t("messages.no_description_available")}
                                </div>

                                {showViewMore && !isExpanded && (
                                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                                )}
                            </div>

                            {showViewMore && (
                                <button
                                    onClick={() => setIsExpanded(!isExpanded)}
                                    className={`mt-4 text-sm font-Bold text-[#185C9B] hover:text-[#1E4F7A] transition-colors uppercase ${locale === 'kh' ? '' : 'tracking-widest'} flex items-center gap-1 group w-fit`}
                                >
                                    {isExpanded ? t("messages.view_less") : t("messages.view_more")}
                                    <svg
                                        className={`h-4 w-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : 'group-hover:translate-y-0.5'}`}
                                        fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                            )}
                        </div>





                        {/* Bottom Buttons */}
                        <div className="mt-auto pt-6 sm:pt-8 border-t border-slate-100 flex gap-2 sm:gap-4 bg-white flex-none">
                            <Link
                                href={route('contact')}
                                className={`flex flex-[2] items-center justify-center rounded-full border border-transparent bg-[#185C9B] px-4 py-3 sm:px-8 sm:py-4 text-[13px] sm:text-base font-Bold text-white shadow-lg shadow-blue-900/10 hover:bg-[#1E4F7A] hover:translate-y-[-1px] transition-all focus:outline-none uppercase ${locale === 'kh' ? '' : 'tracking-widest'}`}
                            >
                                {t("messages.contact")}
                            </Link>
                            <button
                                onClick={() => window.history.back()}
                                className={`flex flex-1 items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-3 sm:px-8 sm:py-4 text-[13px] sm:text-base font-Bold text-slate-700 shadow-sm hover:bg-slate-50 hover:translate-y-[-1px] transition-all focus:outline-none uppercase ${locale === 'kh' ? '' : 'tracking-widest'}`}
                            >
                                {t("messages.back")}
                            </button>
                        </div>
                    </div>

                    {/* Related Promotions (Right Column) */}
                    <div>
                        <div className="bg-slate-50/50 rounded-[2rem] p-5 border border-slate-100 lg:sticky lg:top-8">
                            <h4 className="text-[10px] font-Bold text-[#D4793F] uppercase tracking-[0.2em] mb-3">
                                {t("messages.related_promotions") || "Related Promotions"}
                            </h4>
                            <div className="space-y-2 max-h-[335px] overflow-y-auto custom-scrollbar pr-1">
                                {product.promotions && product.promotions.length > 0 ? (
                                    product.promotions.map(promo => (
                                        <Link
                                            key={promo.id}
                                            href={route('promotions.show_detail', promo.id)}
                                            className="group flex gap-2 items-start p-1.5 -mx-1.5 rounded-xl hover:bg-white hover:shadow-sm hover:border-slate-100 border border-transparent transition-all duration-300"
                                        >
                                            <div className="w-12 h-12 shrink-0 rounded-lg bg-white overflow-hidden border border-slate-200">
                                                <img
                                                    src={toPublicUrl(promo.image_path)}
                                                    alt={promo.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            </div>
                                            <div className="min-w-0 flex-1 overflow-hidden">
                                                <h5 className="text-[11px] font-Bold text-slate-700 leading-tight mb-0.5 group-hover:text-[#185C9B] transition-colors line-clamp-2 truncate">
                                                    {promo.title}
                                                </h5>
                                                <p className="text-[10px] text-slate-400 font-Medium uppercase tracking-wider">
                                                    {new Date(promo.start_date || promo.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </Link>
                                    ))
                                ) : (
                                    <div className="text-[10px] text-slate-400 italic text-center py-4 opacity-50">
                                        No active promotions
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>



            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
            `}} />
        </InnerPageLayout>
    );
}
