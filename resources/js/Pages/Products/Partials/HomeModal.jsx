import React from "react";
import { cn } from "@/lib/utils";

export default function HomeModal({
    open,
    onClose,
    loading,
    homeSelectedIds,
    selectedItems,
    homeError,
    selectedPreview,
    onClear,
    onSave,
    Modal // Passing the custom Modal component for now
}) {
    return (
        <Modal
            open={open}
            title="Home Page Products"
            subtitle={
                <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">Pick maximum</span>
                    <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-800 border border-amber-200">
                        3
                    </span>
                    <span className="text-xs text-slate-400">products to show on Home page</span>
                </div>
            }
            onClose={onClose}
            maxWidth="max-w-3xl"
        >
            <div className="space-y-4">
                {/* current home selected info */}
                <div className="rounded-2xl border bg-slate-50 p-4">
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                        <div>
                            <div className="text-sm font-semibold text-slate-900">Current Home products</div>
                            <div className="text-xs text-slate-500">
                                Currently selected: <span className="font-semibold">{homeSelectedIds.length}</span>
                            </div>
                        </div>
                        <button
                            type="button"
                            className="px-4 py-2 rounded-xl border border-rose-200 bg-white text-sm font-semibold text-rose-600 hover:bg-rose-50"
                            onClick={onClear}
                            disabled={loading}
                        >
                            Clear Home
                        </button>
                    </div>
                </div>

                {/* selected preview */}
                <div>
                    <div className="flex items-center justify-between">
                        <div className="text-sm font-semibold text-slate-900">
                            Selected for Home (from checkbox):{" "}
                            <span className={cn("font-extrabold", selectedItems.length > 3 ? "text-rose-600" : "text-amber-700")}>
                                {selectedItems.length}
                            </span>
                            <span className="text-xs text-slate-400 ml-2">(max 3)</span>
                        </div>
                    </div>

                    <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 min-h-[200px]">
                        {selectedPreview.length > 0 ? (
                            selectedPreview.map((p, index) => {
                                // Simplified image handling, passed via preview or similar
                                const img = p.image_path && (p.image_path.startsWith('/') ? p.image_path : `/storage/${p.image_path.replace('storage/app/public/', '')}`);

                                return (
                                    <div key={p.id} className="group relative h-80 overflow-hidden rounded-2xl bg-white shadow-md border border-slate-100">
                                        {p.is_new && (
                                            <div className="absolute top-3 right-3 z-10 transition-transform duration-500 group-hover:scale-110">
                                                <span className="bg-[#1E4F7A] text-white text-[8px] font-Bold px-3 py-1 rounded-full tracking-widest shadow-lg">
                                                    NEW
                                                </span>
                                            </div>
                                        )}

                                        {/* Product Image */}
                                        <div className="h-full w-full overflow-hidden flex items-center justify-center bg-slate-50">
                                            {img ? (
                                                <img
                                                    src={img}
                                                    alt={p.title}
                                                    className="h-[85%] w-[85%] object-contain transition-transform duration-700 group-hover:scale-110"
                                                    onError={(e) => { e.target.src = '/images/placeholder.png'; }}
                                                />
                                            ) : (
                                                <div className="text-slate-400 text-xs">No Image</div>
                                            )}
                                        </div>

                                        {/* Product Info Overlay */}
                                        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 text-white transition-all duration-500 group-hover:via-black/40">
                                            <div className="mb-1 transform transition-all duration-500 group-hover:-translate-y-1">
                                                <span className="text-lg font-Bold text-[#D4793F] font-display">
                                                    0{index + 1}
                                                </span>
                                            </div>

                                            <h3 className="text-sm font-Bold tracking-wider text-white mb-1 transform transition-all duration-500 group-hover:-translate-y-1 line-clamp-1">
                                                {p.title}
                                            </h3>

                                            <p className="text-[10px] leading-tight text-slate-200 line-clamp-2 mb-3 transition-all duration-500 group-hover:text-white group-hover:-translate-y-1">
                                                {p.description}
                                            </p>

                                            <div className="inline-flex items-center text-[10px] font-Bold text-[#D4793F] group-hover:text-amber-300 transition-all duration-500 transform group-hover:-translate-y-1">
                                                READ MORE
                                                <svg className="ml-1.5 h-3 w-3 transform transition-transform duration-500 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="col-span-3 flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                                <svg className="w-12 h-12 text-slate-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 00-2 2z" />
                                </svg>
                                <div className="text-center">
                                    <p className="text-sm font-medium text-slate-600">No products selected</p>
                                    <p className="text-xs text-slate-400 mt-1">Select products from the table to preview them here</p>
                                </div>
                            </div>
                        )}
                    </div>
                    {selectedItems.length === 0 && homeSelectedIds.length > 0 && (
                        <div className="text-xs text-slate-500 text-center mt-2">
                            Currently showing {homeSelectedIds.length} home product{homeSelectedIds.length !== 1 ? 's' : ''}. Select new products to update.
                        </div>
                    )}
                </div>

                {homeError ? (
                    <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                        <span className="mt-0.5">⚠️</span>
                        <div className="font-medium">{homeError}</div>
                    </div>
                ) : null}

                <div className="flex justify-end gap-2 pt-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        type="button"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onSave}
                        disabled={loading || selectedItems.length === 0 || selectedItems.length > 3}
                        className={"px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 text-white text-sm font-semibold shadow-sm hover:from-indigo-700 hover:to-indigo-600 disabled:opacity-50"}
                        type="button"
                    >
                        {loading ? "Saving..." : "Save Home"}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
