import React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef(function Input({ className = "", ...props }, ref) {
    return (
        <input
            ref={ref}
            className={cn(
                "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100",
                className
            )}
            {...props}
        />
    );
});

export const Select = ({ className = "", children, ...props }) => (
    <select
        className={cn(
            "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100",
            className
        )}
        {...props}
    >
        {children}
    </select>
);

export function Toggle({ value, onChange }) {
    return (
        <button
            type="button"
            onClick={() => onChange(!value)}
            className={cn(
                "relative inline-flex h-8 w-14 items-center rounded-full transition",
                value ? "bg-indigo-600" : "bg-slate-300"
            )}
            aria-label="toggle"
        >
            <span
                className={cn(
                    "inline-block h-6 w-6 transform rounded-full bg-white transition",
                    value ? "translate-x-7" : "translate-x-1"
                )}
            />
        </button>
    );
}

export function AdminModal({ open, title, subtitle, children, onClose, maxWidth = "max-w-xl" }) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />
            <div className={cn("relative w-full rounded-2xl bg-white shadow-xl border overflow-hidden", maxWidth)}>
                <div className="px-5 py-4 border-b flex items-start justify-between gap-3">
                    <div>
                        <div className="text-lg font-semibold text-slate-900">{title}</div>
                        {subtitle ? <div className="text-xs text-slate-500 mt-0.5">{subtitle}</div> : null}
                    </div>
                    <button className="px-2 py-1 rounded-lg hover:bg-slate-100 text-slate-600" onClick={onClose} type="button">
                        ✕
                    </button>
                </div>

                <div className="p-5 max-h-[calc(100vh-180px)] overflow-y-auto">{children}</div>
            </div>
        </div>
    );
}
