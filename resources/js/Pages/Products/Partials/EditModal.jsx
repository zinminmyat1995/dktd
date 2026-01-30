    import React from "react";
import { cn, formatDateShort } from "@/lib/utils";

export default function EditModal({
    open,
    onClose,
    loading,
    editRow,
    editForm,
    setEditForm,
    editErrors,
    setEditErrors,
    onImageChange,
    onSave,
    categories,
    Modal,
    Input,
    Select,
    Toggle
}) {
    return (
        <Modal
            open={open}
            title="Edit Product"
            subtitle={editRow ? `Editing: ${editRow.title}` : ""}
            onClose={onClose}
            maxWidth="max-w-2xl"
        >
            <div className="space-y-4">
                <div>
                    <label className="text-sm font-semibold text-slate-700">Product Title *</label>
                    <Input
                        value={editForm.title}
                        onChange={(e) => {
                            setEditForm((p) => ({ ...p, title: e.target.value }));
                            setEditErrors((p) => ({ ...p, title: "" }));
                        }}
                        className={editErrors.title ? "border-rose-500" : ""}
                    />
                    {editErrors.title && <div className="mt-1 text-xs font-medium text-rose-600">{editErrors.title}</div>}
                </div>

                <div>
                    <label className="text-sm font-semibold text-slate-700">Category *</label>
                    <Select
                        value={editForm.category_id}
                        onChange={(e) => {
                            setEditForm((p) => ({ ...p, category_id: e.target.value }));
                            setEditErrors((p) => ({ ...p, category_id: "" }));
                        }}
                        className={editErrors.category_id ? "border-rose-500" : ""}
                    >
                        <option value="">Select category...</option>
                        {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </Select>
                    {editErrors.category_id && <div className="mt-1 text-xs font-medium text-rose-600">{editErrors.category_id}</div>}
                </div>

                <div className="relative">
                    <label className="text-sm font-semibold text-slate-700">Upload Image</label>
                    <Input type="file" accept="image/*" onChange={(e) => onImageChange(e.target.files?.[0])} />

                    {editForm.imagePreview && (
                        <div className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 flex items-center justify-center overflow-hidden">
                            <img src={editForm.imagePreview} alt="preview" className="h-28 w-full object-contain rounded-lg" />
                        </div>
                    )}
                </div>

                <div>
                    <label className="text-sm font-semibold text-slate-700">Description *</label>
                    <textarea
                        rows={4}
                        value={editForm.description}
                        onChange={(e) => {
                            setEditForm((p) => ({ ...p, description: e.target.value }));
                            setEditErrors((p) => ({ ...p, description: "" }));
                        }}
                        className={cn(
                            "w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100",
                            editErrors.description ? "border-rose-500" : ""
                        )}
                    />
                    {editErrors.description && <div className="mt-1 text-xs font-medium text-rose-600">{editErrors.description}</div>}
                </div>

                <div className="rounded-2xl border border-slate-200 p-4 space-y-3">
                    <div>
                        <label className="text-sm font-semibold text-slate-700">Status *</label>
                        <Select
                            value={editForm.status}
                            onChange={(e) => {
                                setEditForm((p) => ({ ...p, status: e.target.value }));
                                setEditErrors((p) => ({ ...p, status: "" }));
                            }}
                            className={editErrors.status ? "border-rose-500" : ""}
                        >
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                            <option value="archived">Archived</option>
                        </Select>
                        {editErrors.status && <div className="mt-1 text-xs font-medium text-rose-600">{editErrors.status}</div>}
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm font-semibold text-slate-700">Mark as NEW</div>
                            <div className="text-xs text-slate-500">Show NEW badge on card.</div>
                        </div>
                        <Toggle value={editForm.is_new} onChange={(v) => setEditForm((p) => ({ ...p, is_new: v }))} />
                    </div>
                </div>

                <div>
                    <label className="text-sm font-semibold text-slate-700">Published At *</label>
                    <Input
                        type="date"
                        value={editForm.published_at}
                        onChange={(e) => {
                            setEditForm((p) => ({ ...p, published_at: e.target.value }));
                            setEditErrors((p) => ({ ...p, published_at: "" }));
                        }}
                        className={editErrors.published_at ? "border-rose-500" : ""}
                    />
                    {editErrors.published_at && <div className="mt-1 text-xs font-medium text-rose-600">{editErrors.published_at}</div>}
                    {editRow && (
                        <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100 flex flex-wrap gap-x-8 gap-y-3">
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
                </div>

                <div className="flex justify-end gap-2 pt-2">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg border hover:bg-slate-50 font-semibold" type="button">
                        Cancel
                    </button>

                    <button
                        onClick={onSave}
                        className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 font-bold"
                        disabled={loading}
                        type="button"
                    >
                        Save
                    </button>
                </div>
            </div>
        </Modal>
    );
}