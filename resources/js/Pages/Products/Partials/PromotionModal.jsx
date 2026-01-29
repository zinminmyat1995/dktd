import React from "react";

export default function PromotionModal({
    open,
    onClose,
    loading,
    selectedItems,
    promoStart,
    setPromoStart,
    promoEnd,
    setPromoEnd,
    promoError,
    onClear,
    onSave,
    Modal,
    Input
}) {
    return (
        <Modal
            open={open}
            title="Promotion Dates"
            subtitle={
                <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">Selected</span>
                    <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700 border border-indigo-200">
                        {selectedItems.length}
                    </span>
                </div>
            }
            onClose={onClose}
            maxWidth="max-w-2xl"
        >
            <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-600">Start Date</label>
                        <Input type="date" value={promoStart} onChange={(e) => setPromoStart(e.target.value)} />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-600">End Date</label>
                        <Input type="date" value={promoEnd} onChange={(e) => setPromoEnd(e.target.value)} />
                    </div>
                </div>

                {promoError ? (
                    <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                        <span className="mt-0.5">⚠️</span>
                        <div className="font-medium">{promoError}</div>
                    </div>
                ) : null}

                <div className="flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center gap-3 pt-2">
                    <button
                        onClick={onClear}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 disabled:opacity-50"
                        type="button"
                        disabled={loading}
                    >
                        Clear
                    </button>

                    <div className="flex gap-2 justify-end">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={onSave}
                            disabled={loading}
                            className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 text-white text-sm font-semibold shadow-sm hover:from-indigo-700 hover:to-indigo-600 disabled:opacity-50"
                        >
                            {loading ? "Saving..." : "Save Promotion"}
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
