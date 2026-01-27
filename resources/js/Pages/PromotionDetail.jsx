import InnerPageLayout from "@/Layouts/InnerPageLayout";
import { Link } from "@inertiajs/react";
import useTranslate from "@/hooks/useTranslate";
import { useState, useRef, useLayoutEffect } from "react";

export default function PromotionDetail({ promotion }) {
    const { t } = useTranslate();
    const [isExpanded, setIsExpanded] = useState(false);
    const [showViewMore, setShowViewMore] = useState(false);
    const descriptionRef = useRef(null);

    // Reliable "View More" detection for 5 lines
    useLayoutEffect(() => {
        const checkHeight = () => {
            if (descriptionRef.current) {
                // ~125px is the target for 5 lines (25px per line)
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
    }, [promotion.description]);

    const toPublicUrl = (path) => {
        if (!path) return null;
        if (path.startsWith("http")) return path;
        if (path.startsWith("/storage/")) return path;
        return `/storage/${path}`;
    };

    return (
        <InnerPageLayout titleKey="messages.promotion">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-stretch h-full">

                    {/* Left: Promotion Image */}
                    <div className="overflow-hidden rounded-[2rem] bg-gray-50 shadow-xl shadow-slate-200/50 h-fit aspect-square ring-1 ring-slate-100 flex items-center justify-center">
                        <img
                            src={toPublicUrl(promotion.image_path)}
                            alt={promotion.title}
                            className="w-full h-[90%] object-contain transition-transform duration-700 hover:scale-105"
                            onError={(e) => {
                                e.target.src = "/images/placeholder.png";
                            }}
                        />
                    </div>

                    {/* Right: Promotion Details Panel */}
                    <div className="flex flex-col h-full min-h-0">

                        {/* Top Content */}
                        <div className="flex-none">
                            <nav className="flex mb-6 overflow-x-auto no-scrollbar" aria-label="Breadcrumb">
                                <ol className="flex items-center space-x-2 sm:space-x-4 whitespace-nowrap">
                                    <li>
                                        <Link href={route('promotion')} className="text-[12px] sm:text-sm font-Bold text-slate-400 hover:text-[#185C9B] uppercase tracking-wider">
                                            {t('messages.promotion')}
                                        </Link>
                                    </li>
                                    <li>
                                        <div className="flex items-center">
                                            <svg className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 text-slate-300" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" />
                                            </svg>
                                            <span className="ml-2 sm:ml-4 text-[12px] sm:text-sm font-Bold text-slate-900 uppercase tracking-wider truncate max-w-[150px] sm:max-w-none">
                                                {promotion.title}
                                            </span>
                                        </div>
                                    </li>
                                </ol>
                            </nav>

                            <div className="flex flex-wrap items-center gap-2 mb-4">
                                <span className="inline-flex items-center rounded-full bg-[#185C9B]/10 px-4 py-1.5 text-[10px] sm:text-xs font-Bold tracking-widest text-[#185C9B] uppercase">
                                    {t(promotion.type === 'promotion' ? 'messages.promotion_label' : 'messages.news_label')}
                                </span>
                                {promotion.category && (
                                    <span className="inline-flex items-center rounded-full bg-[#D4793F]/10 px-4 py-1.5 text-[10px] sm:text-xs font-Bold tracking-widest text-[#D4793F] uppercase">
                                        {promotion.category.name}
                                    </span>
                                )}
                            </div>

                            <h1 className="text-[28px] sm:text-4xl lg:text-5xl font-Bold tracking-tight text-slate-900 font-display uppercase leading-tight break-words">
                                {promotion.title}
                            </h1>

                            <div className="mt-4 flex items-center gap-2 text-slate-400">
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="text-[11px] font-Bold uppercase tracking-widest">
                                    {promotion.start_date ? new Date(promotion.start_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Latest Update'}
                                    {promotion.end_date && ` - ${new Date(promotion.end_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}`}
                                </span>
                            </div>
                        </div>

                        {/* Middle Content (Stretchy Description Area) */}
                        <div className="mt-8 mb-6 flex-1 flex flex-col min-h-0">
                            <h3 className="text-sm font-SemiBold text-[#D4793F] tracking-[0.2em] uppercase mb-4 font-display">
                                {t("messages.product_description_heading") || 'Description'}
                            </h3>

                            <div className="relative flex-1 overflow-hidden min-h-0">
                                <div
                                    ref={descriptionRef}
                                    className={`text-base leading-relaxed text-slate-600 whitespace-pre-line break-words custom-scrollbar
                                    ${isExpanded ? 'overflow-y-auto h-full pr-4' : 'max-h-[125px] overflow-hidden'}`}
                                >
                                    {promotion.description || t("messages.no_description_available")}
                                </div>

                                {/* Gradient fade-out overlay when collapsed */}
                                {showViewMore && !isExpanded && (
                                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                                )}
                            </div>

                            {/* View More Button */}
                            {showViewMore && (
                                <button
                                    onClick={() => setIsExpanded(!isExpanded)}
                                    className="mt-4 text-sm font-Bold text-[#185C9B] hover:text-[#1E4F7A] transition-colors uppercase tracking-widest flex items-center gap-1 group w-fit"
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

                        {/* Bottom Buttons - Strictly level with image bottom */}
                        <div className="mt-auto pt-6 border-t border-slate-100 flex gap-2 sm:gap-4 bg-white flex-none">
                            {/* <Link
                                href={route('contact')}
                                className="flex flex-[2] items-center justify-center rounded-full border border-transparent bg-[#185C9B] px-4 py-3 sm:px-8 sm:py-4 text-[13px] sm:text-base font-Bold text-white shadow-lg shadow-blue-900/10 hover:bg-[#1E4F7A] hover:translate-y-[-1px] transition-all focus:outline-none uppercase tracking-widest"
                            >
                                {t("messages.contact")}
                            </Link> */}
                            <button
                                onClick={() => window.history.back()}
                                className="flex flex-1 items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-3 sm:px-8 sm:py-4 text-[13px] sm:text-base font-Bold text-slate-700 shadow-sm hover:bg-slate-50 hover:translate-y-[-1px] transition-all focus:outline-none uppercase tracking-widest"
                            >
                                {t("messages.back")}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
            `}} />
        </InnerPageLayout>
    );
}
