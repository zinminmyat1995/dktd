import React from "react";
import { Link } from "@inertiajs/react";

export default function Pagination({ links }) {
    if (!links || links.length <= 3) return null;

    return (
        <div className="flex justify-center mt-14">
            <div className="flex items-center gap-2">
                {links.map((link, i) => {
                    const isPrevious = link.label.includes("Previous");
                    const isNext = link.label.includes("Next");

                    let content = link.label;
                    if (isPrevious) {
                        content = (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                            </svg>
                        );
                    } else if (isNext) {
                        content = (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                            </svg>
                        );
                    }

                    if (!link.url) {
                        return (
                            <span
                                key={i}
                                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-300 cursor-not-allowed border border-slate-100"
                            >
                                {content}
                            </span>
                        );
                    }

                    return (
                        <Link
                            key={i}
                            href={link.url}
                            className={`
                flex h-12 w-12 items-center justify-center rounded-2xl border text-[14px] font-Bold transition-all duration-300
                ${link.active
                                    ? "bg-[#185C9B] border-[#185C9B] text-white shadow-xl shadow-blue-900/20 translate-y-[-2px]"
                                    : "bg-white border-slate-200 text-slate-600 hover:border-[#185C9B] hover:text-[#185C9B] hover:bg-blue-50/50"
                                }
              `}
                            preserveScroll
                        >
                            <span dangerouslySetInnerHTML={{ __html: typeof content === 'string' ? content : '' }} />
                            {typeof content !== 'string' && content}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
