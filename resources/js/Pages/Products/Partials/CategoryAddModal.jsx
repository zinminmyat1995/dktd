import React from "react";
import { cn } from "@/lib/utils";
import { AdminModal, Input } from "@/Components/AdminUI";

export default function CategoryAddModal({
    open,
    onClose,
    loading,
    newCategoryName,
    setNewCategoryName,
    error,
    setError,
    onSave
}) {
    return (
        <AdminModal
            open={open}
            title="Add Category"
            onClose={onClose}
        >
            <div className="space-y-3">
                <div>
                    <label className="text-sm font-semibold text-slate-700">
                        Category Name
                    </label>
                    <Input
                        value={newCategoryName}
                        onChange={(e) => {
                            setNewCategoryName(e.target.value);
                            if (error) setError("");
                        }}
                        className={error ? "border-rose-400" : ""}
                    />
                    {error && (
                        <p className="mt-1 text-xs font-medium text-rose-600">
                            {error}
                        </p>
                    )}
                </div>

                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="rounded-xl border px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        type="button"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onSave}
                        disabled={loading}
                        className={cn(
                            "rounded-xl px-4 py-2 text-sm font-bold text-white",
                            loading
                                ? "bg-indigo-400"
                                : "bg-indigo-600 hover:bg-indigo-700"
                        )}
                        type="button"
                    >
                        {loading ? "Saving..." : "Save"}
                    </button>
                </div>
            </div>
        </AdminModal>
    );
}
