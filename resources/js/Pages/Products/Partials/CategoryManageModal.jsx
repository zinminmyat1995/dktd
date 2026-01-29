import React from "react";
import { cn, formatDateShort } from "@/lib/utils";
import { AdminModal, Input } from "@/Components/AdminUI";

export default function CategoryManageModal({
    open,
    onClose,
    loading,
    categories,
    editingCategoryId,
    editingCategoryName,
    setEditingCategoryName,
    editCategoryError,
    setEditCategoryError,
    startEdit,
    cancelEdit,
    submitEdit,
    onDelete
}) {
    return (
        <AdminModal
            open={open}
            title="Manage Categories"
            onClose={onClose}
            maxWidth="max-w-3xl"
        >
            <div className="space-y-3">
                <div className="max-h-[420px] overflow-auto rounded-xl border border-slate-200">
                    <table className="min-w-full text-left text-sm">
                        <thead className="sticky top-0 z-10 bg-slate-50 text-slate-600">
                            <tr>
                                <th className="px-4 py-3">Name</th>
                                <th className="px-4 py-3">Created By</th>
                                <th className="px-4 py-3">Updated By</th>
                                <th className="w-56 px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y">
                            {categories.map((c) => {
                                const isEditing = editingCategoryId === c.id;
                                return (
                                    <tr key={c.id}>
                                        <td className="px-4 py-3">
                                            {isEditing ? (
                                                <>
                                                    <Input
                                                        value={editingCategoryName}
                                                        onChange={(e) => {
                                                            setEditingCategoryName(e.target.value);
                                                            if (editCategoryError) setEditCategoryError("");
                                                        }}
                                                        className={editCategoryError ? "border-rose-400" : ""}
                                                    />
                                                    {editCategoryError && (
                                                        <p className="mt-1 text-xs font-medium text-rose-600">
                                                            {editCategoryError}
                                                        </p>
                                                    )}
                                                </>
                                            ) : (
                                                <span className="font-medium text-slate-900">
                                                    {c.name}
                                                </span>
                                            )}
                                        </td>

                                        <td className="px-4 py-3">
                                            <div className="text-xs font-Medium text-slate-900">{c.creator?.name ?? "—"}</div>
                                            <div className="text-[10px] text-slate-400 uppercase tracking-tighter">{formatDateShort(c.created_at)}</div>
                                        </td>

                                        <td className="px-4 py-3">
                                            {c.updated_at !== c.created_at ? (
                                                <>
                                                    <div className="text-xs font-Medium text-slate-900">{c.updater?.name ?? "—"}</div>
                                                    <div className="text-[10px] text-slate-400 uppercase tracking-tighter">{formatDateShort(c.updated_at)}</div>
                                                </>
                                            ) : (
                                                <span className="text-xs text-slate-400">—</span>
                                            )}
                                        </td>

                                        <td className="px-4 py-3">
                                            <div className="flex justify-end gap-2">
                                                {isEditing ? (
                                                    <>
                                                        <button
                                                            type="button"
                                                            onClick={cancelEdit}
                                                            className="rounded-lg border px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={submitEdit}
                                                            disabled={loading}
                                                            className={cn(
                                                                "rounded-lg px-3 py-2 text-xs font-bold text-white",
                                                                loading
                                                                    ? "bg-indigo-400"
                                                                    : "bg-indigo-600 hover:bg-indigo-700"
                                                            )}
                                                        >
                                                            Save
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button
                                                            type="button"
                                                            onClick={() => startEdit(c)}
                                                            className="rounded-lg border px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => onDelete(c)}
                                                            className="rounded-lg bg-rose-600 px-3 py-2 text-xs font-bold text-white hover:bg-rose-700"
                                                        >
                                                            Delete
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}

                            {categories.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="px-4 py-10 text-center text-slate-500"
                                    >
                                        No categories yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminModal>
    );
}
