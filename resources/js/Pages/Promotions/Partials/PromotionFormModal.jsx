import React from "react";
import { formatDateShort } from "@/lib/utils";
import { AdminModal, Input, Select } from "@/Components/AdminUI";

export default function PromotionFormModal({
    open,
    onClose,
    loading,
    editRow,
    form,
    setForm,
    errors,
    categories,
    products,
    onSubmit
}) {
    // Filter products based on selected category
    const availableProducts = form.category_id
        ? products.filter(p => String(p.category_id) === String(form.category_id))
        : products;

    const handleProductChange = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions, option => Number(option.value));
        setForm({ ...form, product_ids: selectedOptions });
    };

    const availableProductIds = availableProducts.map(p => p.id);
    const isAllSelected = availableProducts.length > 0 && availableProducts.every(p => form.product_ids?.includes(p.id));

    const handleToggleSelectAll = () => {
        if (isAllSelected) {
            // Deselect all available
            const newIds = (form.product_ids || []).filter(id => !availableProductIds.includes(id));
            setForm({ ...form, product_ids: newIds });
        } else {
            // Select all available
            const currentIds = form.product_ids || [];
            const newIds = Array.from(new Set([...currentIds, ...availableProductIds]));
            setForm({ ...form, product_ids: newIds });
        }
    };

    return (
        <AdminModal open={open} title={editRow ? "Edit Content" : "Create Content"} onClose={onClose} maxWidth="max-w-2xl">
            {/* Using a single column stack to match the Product Register reference */}
            <div className="space-y-6 px-1 py-1">

                {/* Product Title */}
                <div className="relative">
                    <label className="text-sm font-semibold text-slate-700">Content Title <span className="text-rose-500">*</span></label>
                    <Input
                        value={form.title}
                        onChange={e => setForm({ ...form, title: e.target.value })}
                        className={errors.title ? "border-rose-400" : "border-slate-200"}
                    />
                    {errors.title && <div className="absolute -bottom-5 left-1 text-[11px] font-medium text-rose-600 whitespace-nowrap">{errors.title}</div>}
                </div>

                {/* Type & Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
                    <div className="relative">
                        <label className="text-sm font-semibold text-slate-700">Type <span className="text-rose-500">*</span></label>
                        <Select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className={errors.type ? "border-rose-400" : "border-slate-200"}>
                            <option value="promotion">Promotion</option>
                            <option value="news">News</option>
                        </Select>
                        {errors.type && <div className="absolute -bottom-5 left-1 text-[11px] font-medium text-rose-600 whitespace-nowrap">{errors.type}</div>}
                    </div>
                    <div className="relative">
                        <label className="text-sm font-semibold text-slate-700">Category</label>
                        <Select value={form.category_id} onChange={e => setForm({ ...form, category_id: e.target.value, product_ids: [] })} className={errors.category_id ? "border-rose-400" : "border-slate-200"}>
                            <option value="">None</option>
                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </Select>
                        {errors.category_id && <div className="absolute -bottom-5 left-1 text-[11px] font-medium text-rose-600 whitespace-nowrap">{errors.category_id}</div>}
                    </div>
                </div>

                {/* Link Products */}
                <div className="relative">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-semibold text-slate-700">
                            Products {form.type === 'promotion' && <span className="text-rose-500">*</span>}
                        </label>
                        <button
                            type="button"
                            onClick={handleToggleSelectAll}
                            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
                            disabled={availableProducts.length === 0}
                        >
                            {isAllSelected ? "Deselect All" : "Select All"}
                        </button>
                    </div>
                    <div className="space-y-2 mt-1">
                        {/* Dropbox to add product */}
                        <Select
                            value=""
                            onChange={e => {
                                const val = Number(e.target.value);
                                if (val && !form.product_ids.includes(val)) {
                                    setForm({ ...form, product_ids: [...(form.product_ids || []), val] });
                                }
                            }}
                            className="border-slate-200"
                            disabled={availableProducts.length === 0}
                        >
                            <option value="">Select a product...</option>
                            {availableProducts.map(p => (
                                <option
                                    key={p.id}
                                    value={p.id}
                                    disabled={form.product_ids?.includes(p.id)}
                                    className={form.product_ids?.includes(p.id) ? "text-slate-400 bg-slate-50" : ""}
                                >
                                    {p.title} {form.product_ids?.includes(p.id) ? "(Selected)" : ""}
                                </option>
                            ))}
                        </Select>

                        {/* Selected Items List - Horizontal Scroll */}
                        <div className={`flex items-center gap-2 overflow-x-auto whitespace-nowrap rounded-xl border p-2 bg-slate-50 min-h-[42px] ${errors.product_ids ? "border-rose-400" : "border-slate-200"} custom-scrollbar`}>
                            {(!form.product_ids || form.product_ids.length === 0) && (
                                <span className="text-xs text-slate-400 italic p-1 shrink-0">No products linked</span>
                            )}
                            {form.product_ids?.map(id => {
                                const product = products.find(p => p.id === id);
                                if (!product) return null;
                                return (
                                    <div key={id} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200 shadow-sm transition-all group hover:border-indigo-200 shrink-0">
                                        <span className="text-xs font-Medium text-slate-700 max-w-[150px] truncate">{product.title}</span>
                                        <button
                                            onClick={() => setForm({ ...form, product_ids: form.product_ids.filter(pid => pid !== id) })}
                                            className="text-slate-400 hover:text-rose-500 transition-colors p-0.5 rounded-full hover:bg-rose-50"
                                            type="button"
                                        >
                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <style>{`
                        .custom-scrollbar::-webkit-scrollbar { height: 6px; }
                        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
                        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
                    `}</style>
                    {errors.product_ids && <div className="absolute -bottom-5 left-1 text-[11px] font-medium text-rose-600 whitespace-nowrap">{errors.product_ids}</div>}
                </div>

                {/* Upload Image */}
                <div className="relative">
                    <label className="text-sm font-semibold text-slate-700">Upload Image <span className="text-rose-500">*</span></label>
                    <Input
                        type="file"
                        onChange={e => {
                            const file = e.target.files[0];
                            if (file) setForm({ ...form, image: file, imagePreview: URL.createObjectURL(file) });
                        }}
                        className={errors.image ? "border-rose-400" : "border-slate-200"}
                    />
                    {errors.image && <div className="absolute -bottom-5 left-1 text-[11px] font-medium text-rose-600 whitespace-nowrap">{errors.image}</div>}

                    {form.imagePreview && (
                        <div className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 flex items-center justify-center overflow-hidden">
                            <img src={form.imagePreview} className="h-28 w-full object-contain rounded-lg" alt="preview" />
                        </div>
                    )}
                </div>

                {/* Description */}
                <div className="relative">
                    <label className="text-sm font-semibold text-slate-700">Description <span className="text-rose-500">*</span></label>
                    <textarea
                        rows={4}
                        className={`mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 ${errors.description ? "border-rose-400" : "border-slate-200"}`}
                        value={form.description}
                        onChange={e => setForm({ ...form, description: e.target.value })}
                        placeholder="Short description..."
                    />
                    {errors.description && <div className="absolute -bottom-5 left-1 text-[11px] font-medium text-rose-600 whitespace-nowrap">{errors.description}</div>}
                </div>

                {/* Combined Grid for Dates and Status */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                    {form.type === 'promotion' && (
                        <>
                            <div className="relative">
                                <label className="text-sm font-semibold text-slate-700">Start Date <span className="text-rose-500">*</span></label>
                                <Input type="date" value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })} className={errors.start_date ? "border-rose-400" : "border-slate-200"} />
                                {errors.start_date && <div className="absolute -bottom-5 left-1 text-[11px] font-medium text-rose-600 whitespace-nowrap">{errors.start_date}</div>}
                            </div>
                            <div className="relative">
                                <label className="text-sm font-semibold text-slate-700">End Date <span className="text-rose-500">*</span></label>
                                <Input type="date" value={form.end_date} onChange={e => setForm({ ...form, end_date: e.target.value })} className={errors.end_date ? "border-rose-400" : "border-slate-200"} />
                                {errors.end_date && <div className="absolute -bottom-5 left-1 text-[11px] font-medium text-rose-600 whitespace-nowrap">{errors.end_date}</div>}
                            </div>
                        </>
                    )}

                    <div className="relative">
                        <label className="text-sm font-semibold text-slate-700">Status <span className="text-rose-500">*</span></label>
                        <Select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className={errors.status ? "border-rose-400" : "border-slate-200"}>
                            <option value="published">Published</option>
                            <option value="draft">Draft</option>
                            <option value="archived">Archived</option>
                        </Select>
                        {errors.status && <div className="absolute -bottom-5 left-1 text-[11px] font-medium text-rose-600 whitespace-nowrap">{errors.status}</div>}
                    </div>
                </div>

                {/* Meta Information (Edit Only) */}
                {editRow && (
                    <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100 flex flex-wrap gap-x-8 gap-y-3 mt-4">
                        <div className="space-y-1">
                            <div className="text-[10px] font-Bold text-slate-400 uppercase tracking-widest leading-none">Created By</div>
                            <div className="text-sm font-SemiBold text-slate-700">{editRow.creator?.name ?? "—"}</div>
                            <div className="text-[10px] text-slate-400 font-Medium">{formatDateShort(editRow.created_at)}</div>
                        </div>
                        {editRow.updated_at !== editRow.created_at && (
                            <div className="space-y-1">
                                <div className="text-[10px] font-Bold text-slate-400 uppercase tracking-widest leading-none">Last Updated</div>
                                <div className="text-sm font-SemiBold text-slate-700">{editRow.updater?.name ?? "—"}</div>
                                <div className="text-[10px] text-slate-400 font-Medium">{formatDateShort(editRow.updated_at)}</div>
                            </div>
                        )}
                    </div>
                )}

                {/* Actions */}
                <div className="flex justify-end gap-2 pt-6">
                    <button onClick={onClose} className="px-4 py-2 border rounded-xl hover:bg-slate-50 font-semibold text-slate-700">Cancel</button>
                    <button onClick={onSubmit} disabled={loading} className="px-5 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 font-bold shadow-sm">{loading ? "Saving..." : "Save Content"}</button>
                </div>
            </div>
        </AdminModal>
    );
}