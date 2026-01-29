import React, { useEffect, useMemo, useState, useRef } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import CommonToast from "@/Components/CommonToast";
import CommonConfirmModal from "@/Components/CommonConfirmModal";

// Libs & Services
import { cn, formatDateShort } from "@/lib/utils";
import { apiFetch, extract422Errors } from "@/services/api";

// Components
import { Input, Select, Toggle } from "@/Components/AdminUI";
import CategoryAddModal from "./Partials/CategoryAddModal";
import CategoryManageModal from "./Partials/CategoryManageModal";

function normalizeArray(res) {
    return Array.isArray(res) ? res : res?.data ?? [];
}

export default function ProductCreate() {
    const [categories, setCategories] = useState([]);
    const fileInputRef = useRef(null);

    // Product form states
    const [title, setTitle] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("draft");
    const [isNew, setIsNew] = useState(false);
    const [showOnHome, setShowOnHome] = useState(false);
    const [publishedAt, setPublishedAt] = useState("");
    const [imageFile, setImageFile] = useState(null);

    // preview URL
    const [imagePreviewUrl, setImagePreviewUrl] = useState("");
    useEffect(() => {
        if (!imageFile) {
            setImagePreviewUrl("");
            return;
        }
        const url = URL.createObjectURL(imageFile);
        setImagePreviewUrl(url);
        return () => URL.revokeObjectURL(url);
    }, [imageFile]);

    const [loading, setLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({
        title: "",
        categoryId: "",
        description: "",
        status: "",
        publishedAt: "",
        image: "",
        newCategoryName: "",
    });

    const [toast, setToast] = useState({ open: false, type: "", title: "", message: "" });
    const closeToast = () => setToast((p) => ({ ...p, open: false }));

    // Category modals states
    const [openAddCategoryModal, setOpenAddCategoryModal] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [openManageCategoryModal, setOpenManageCategoryModal] = useState(false);
    const [editingCategoryId, setEditingCategoryId] = useState(null);
    const [editingCategoryName, setEditingCategoryName] = useState("");
    const [editCategoryError, setEditCategoryError] = useState("");

    const [confirm, setConfirm] = useState({ open: false, title: "", message: "", onConfirm: null });

    // load categories
    useEffect(() => {
        (async () => {
            try {
                const res = await apiFetch("/admin/categories");
                setCategories(normalizeArray(res));
            } catch {
                setToast({ open: true, type: "error", title: "Error", message: "Failed to load categories." });
            }
        })();
    }, []);

    async function refreshCategories() {
        const res = await apiFetch("/admin/categories");
        setCategories(normalizeArray(res));
    }

    // Category Actions
    async function onCreateCategory() {
        const name = newCategoryName.trim();
        if (!name) {
            setFieldErrors((p) => ({ ...p, newCategoryName: "Category Name is required." }));
            return;
        }
        if (categories.some((c) => String(c.name).trim().toLowerCase() === name.toLowerCase())) {
            setFieldErrors((p) => ({ ...p, newCategoryName: "This category already exists." }));
            return;
        }

        try {
            setLoading(true);
            setFieldErrors((p) => ({ ...p, newCategoryName: "" }));
            const created = await apiFetch("/admin/categories", {
                method: "POST",
                body: JSON.stringify({ name })
            });
            const obj = created?.data ?? created;
            setCategories((prev) => [obj, ...prev]);
            setCategoryId(String(obj.id));
            setNewCategoryName("");
            setOpenAddCategoryModal(false);
            setToast({ open: true, type: "success", title: "Success", message: "Category added." });
        } catch (e) {
            const errs = extract422Errors(e);
            if (e.status === 422 && errs.name) setFieldErrors((p) => ({ ...p, newCategoryName: errs.name }));
            setToast({ open: true, type: "error", title: "Error", message: "Failed to add category." });
        } finally {
            setLoading(false);
        }
    }

    async function submitEditCategory() {
        const name = editingCategoryName.trim();
        if (!name) {
            setEditCategoryError("Category Name is required.");
            return;
        }
        if (categories.some((c) => c.id !== editingCategoryId && String(c.name ?? "").trim().toLowerCase() === name.toLowerCase())) {
            setEditCategoryError("This category already exists.");
            return;
        }

        try {
            setLoading(true);
            setEditCategoryError("");
            const updated = await apiFetch(`/admin/categories/${editingCategoryId}`, {
                method: "PUT",
                body: JSON.stringify({ name })
            });
            const obj = updated?.data ?? updated;
            setCategories((prev) => prev.map((c) => (c.id === editingCategoryId ? { ...c, ...obj } : c)));
            setToast({ open: true, type: "success", title: "Success", message: "Category updated." });
            setEditingCategoryId(null);
        } catch (e) {
            const errs = extract422Errors(e);
            if (e.status === 422 && errs.name) setEditCategoryError(errs.name);
            setToast({ open: true, type: "error", title: "Error", message: "Failed to update category." });
        } finally {
            setLoading(false);
        }
    }

    async function doDeleteCategory(id) {
        try {
            setLoading(true);
            await apiFetch(`/admin/categories/${id}`, { method: "DELETE" });
            setCategories((prev) => prev.filter((c) => c.id !== id));
            if (String(categoryId) === String(id)) setCategoryId("");
            setToast({ open: true, type: "success", title: "Success", message: "Category deleted." });
        } catch (e) {
            setToast({ open: true, type: "error", title: "Error", message: e?.data?.message || "Failed to delete category." });
        } finally {
            setLoading(false);
        }
    }

    // Product Actions
    async function onSaveProduct() {
        const nextErrors = { title: "", categoryId: "", description: "", status: "", publishedAt: "", image: "", newCategoryName: "" };
        if (!title.trim()) nextErrors.title = "Title is required.";
        if (!categoryId) nextErrors.categoryId = "Category is required.";
        if (!description.trim()) nextErrors.description = "Description is required.";
        if (!status) nextErrors.status = "Status is required.";
        if (!publishedAt) nextErrors.publishedAt = "Published date is required.";
        if (!imageFile) nextErrors.image = "Image is required.";

        setFieldErrors(nextErrors);
        if (Object.values(nextErrors).some(err => err !== "")) return;

        const fd = new FormData();
        fd.append("title", title.trim());
        fd.append("category_id", String(Number(categoryId)));
        fd.append("description", description.trim());
        fd.append("status", status);
        fd.append("is_new", isNew ? "1" : "0");
        fd.append("show_on_home", showOnHome ? "1" : "0");
        fd.append("published_at", publishedAt);
        fd.append("image", imageFile);

        try {
            setLoading(true);
            await apiFetch("/admin/products", { method: "POST", body: fd });
            setToast({ open: true, type: "success", title: "Success", message: "Product saved successfully." });

            setTitle("");
            setCategoryId("");
            setDescription("");
            setStatus("draft");
            setIsNew(false);
            setShowOnHome(false);
            setPublishedAt("");
            setImageFile(null);
            setImagePreviewUrl("");
            if (fileInputRef.current) fileInputRef.current.value = "";
            await refreshCategories();
        } catch (e) {
            if (e.status === 422) {
                const errs = extract422Errors(e);
                setFieldErrors({
                    title: errs.title || "",
                    categoryId: errs.category_id || "",
                    description: errs.description || "",
                    status: errs.status || "",
                    publishedAt: errs.published_at || "",
                    image: errs.image || "",
                    newCategoryName: "",
                });
                setToast({ open: true, type: "error", title: "Save Failed", message: e?.data?.message || "Please fix the errors below." });
            } else {
                setToast({ open: true, type: "error", title: "Error", message: "A server error occurred. Please try again." });
            }
        } finally {
            setLoading(false);
        }
    }

    const activeCategoryCount = useMemo(() => categories.filter((c) => c.is_active).length, [categories]);

    return (
        <AuthenticatedLayout header="Product Management" subtitle="Create product item and manage categories quickly.">
            <div className="w-full px-3 sm:px-4 lg:px-6 py-6" style={{ paddingTop: "1px" }}>
                {/* Quick Actions */}
                <div className="rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
                    <div className="flex flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <div className="text-base font-semibold text-slate-900">Quick Actions</div>
                            <div className="text-xs text-slate-500">Add & manage categories quickly.</div>
                        </div>
                        <div className="flex flex-wrap items-center justify-start gap-2 sm:justify-end">
                            <button onClick={() => setOpenAddCategoryModal(true)} className="inline-flex h-10 items-center justify-center rounded-full bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700" type="button">+ Add Category</button>
                            <button onClick={() => setOpenManageCategoryModal(true)} className="inline-flex h-10 items-center justify-center rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50" type="button">Manage Categories</button>
                        </div>
                    </div>
                </div>

                {/* Layout */}
                <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-5">
                    {/* Left Form */}
                    <div className="lg:col-span-2">
                        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-semibold text-slate-700">Product Title <span className="text-rose-500">*</span></label>
                                    <Input value={title} onChange={(e) => { setTitle(e.target.value); if (fieldErrors.title) setFieldErrors((p) => ({ ...p, title: "" })); }} className={fieldErrors.title ? "border-rose-400" : "border-slate-200"} />
                                    {fieldErrors.title && <p className="mt-1 text-xs font-medium text-rose-600">{fieldErrors.title}</p>}
                                </div>

                                <div>
                                    <label className="text-sm font-semibold text-slate-700">Category <span className="text-xs font-normal text-slate-400">({activeCategoryCount} active)</span> <span className="text-rose-500">*</span></label>
                                    <Select value={categoryId} onChange={(e) => { setCategoryId(e.target.value); if (fieldErrors.categoryId) setFieldErrors((p) => ({ ...p, categoryId: "" })); }} className={fieldErrors.categoryId ? "border-rose-400" : "border-slate-200"}>
                                        <option value="">Select category...</option>
                                        {categories.filter((c) => c.is_active).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </Select>
                                    {fieldErrors.categoryId && <p className="mt-1 text-xs font-medium text-rose-600">{fieldErrors.categoryId}</p>}
                                </div>

                                <div>
                                    <label className="text-sm font-semibold text-slate-700">Upload Image <span className="text-rose-500">*</span></label>
                                    <Input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => { setImageFile(e.target.files?.[0] ?? null); if (fieldErrors.image) setFieldErrors((p) => ({ ...p, image: "" })); }} className={fieldErrors.image ? "border-rose-400" : "border-slate-200"} />
                                    {fieldErrors.image && <p className="mt-1 text-xs font-medium text-rose-600">{fieldErrors.image}</p>}
                                    {imagePreviewUrl && (
                                        <div className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 flex items-center justify-center overflow-hidden">
                                            <img src={imagePreviewUrl} alt="preview" className="h-28 w-full object-contain rounded-lg" />
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="text-sm font-semibold text-slate-700">Description <span className="text-rose-500">*</span></label>
                                    <textarea value={description} onChange={(e) => { setDescription(e.target.value); if (fieldErrors.description) setFieldErrors((p) => ({ ...p, description: "" })); }} rows={4} placeholder="Short description for card..." className={cn("mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none focus:border-indigo-400", fieldErrors.description ? "border-rose-400" : "border-slate-200")} />
                                    {fieldErrors.description && <p className="mt-1 text-xs font-medium text-rose-600">{fieldErrors.description}</p>}
                                </div>

                                <div className="rounded-2xl border border-slate-200 p-4 space-y-3">
                                    <div>
                                        <label className="text-sm font-semibold text-slate-700">Status <span className="text-rose-500">*</span></label>
                                        <Select value={status} onChange={(e) => { setStatus(e.target.value); if (fieldErrors.status) setFieldErrors((p) => ({ ...p, status: "" })); }} className={fieldErrors.status ? "border-rose-400" : "border-slate-200"}>
                                            <option value="">Select status...</option>
                                            <option value="draft">Draft</option>
                                            <option value="published">Published</option>
                                            <option value="archived">Archived</option>
                                        </Select>
                                        {fieldErrors.status && <p className="mt-1 text-xs font-medium text-rose-600">{fieldErrors.status}</p>}
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="text-sm font-semibold text-slate-700">Mark as NEW</div>
                                            <div className="text-xs text-slate-600">Show NEW badge on card.</div>
                                        </div>
                                        <Toggle value={isNew} onChange={setIsNew} />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="text-sm font-semibold text-slate-700">Show on Homepage</div>
                                            <div className="text-xs text-slate-400">Display this product on the homepage carousel.</div>
                                        </div>
                                        <Toggle value={showOnHome} onChange={setShowOnHome} />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-semibold text-slate-700">Published At <span className="text-rose-500">*</span></label>
                                    <Input type="date" value={publishedAt} onChange={(e) => { setPublishedAt(e.target.value); if (fieldErrors.publishedAt) setFieldErrors((p) => ({ ...p, publishedAt: "" })); }} className={fieldErrors.publishedAt ? "border-rose-400" : "border-slate-200"} />
                                    {fieldErrors.publishedAt && <p className="mt-1 text-xs font-medium text-rose-600">{fieldErrors.publishedAt}</p>}
                                </div>

                                <button onClick={() => setConfirm({ open: true, title: "Save Product", message: "Are you sure you want to save this product?", onConfirm: async () => { setConfirm((p) => ({ ...p, open: false })); await onSaveProduct(); } })} disabled={loading} className={cn("w-full rounded-2xl px-4 py-3 text-sm font-bold text-white shadow-sm", loading ? "bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-700")} type="button">
                                    {loading ? "Saving..." : "Save Product"}
                                </button>

                                <div className="text-xs text-slate-500">Tip: Use <b>Status = Published</b> to show on public page.</div>
                            </div>
                        </div>
                    </div>

                    {/* Right Preview */}
                    <div className="lg:col-span-3">
                        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                            <div className="border-b px-5 py-4">
                                <h2 className="text-lg font-bold text-slate-900">Preview</h2>
                                <p className="text-sm text-slate-600">This is how your product card will look.</p>
                            </div>
                            <div className="p-6">
                                <div className="rounded-2xl border border-slate-200 overflow-hidden">
                                    <div className="relative w-full h-[500px] overflow-hidden bg-slate-100 flex items-center justify-center">
                                        {imagePreviewUrl ? <img src={imagePreviewUrl} className="w-full h-[90%] object-contain transition-transform duration-300 hover:scale-105" alt="preview" /> : <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">No Image Selected</div>}
                                    </div>
                                    <div className="p-5">
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="text-sm font-semibold text-indigo-600">{categories.find((c) => String(c.id) === String(categoryId))?.name ?? "Category"}</div>
                                            {isNew && <span className="rounded-full bg-indigo-600 px-3 py-1 text-xs font-bold text-white">NEW</span>}
                                        </div>
                                        <h3 className="mt-2 text-xl font-bold text-slate-900">{title || "Product Title"}</h3>
                                        <p className="mt-2 text-sm text-slate-600 line-clamp-3">{description || "Product description will appear here..."}</p>
                                        <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
                                            <span className="rounded-full bg-slate-100 px-3 py-1">Status: {status || "-"}</span>
                                            {publishedAt && <span className="rounded-full bg-slate-100 px-3 py-1">Publish: {publishedAt}</span>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="border-t px-5 py-4 text-xs text-slate-500">Note: Preview is for admin only. Public page will filter by <b>published</b>.</div>
                        </div>
                    </div>
                </div>
            </div>

            <CategoryAddModal open={openAddCategoryModal} onClose={() => setOpenAddCategoryModal(false)} loading={loading} newCategoryName={newCategoryName} setNewCategoryName={setNewCategoryName} error={fieldErrors.newCategoryName} setError={(msg) => setFieldErrors(p => ({ ...p, newCategoryName: msg }))} onSave={onCreateCategory} />
            <CategoryManageModal open={openManageCategoryModal} onClose={() => setOpenManageCategoryModal(false)} loading={loading} categories={categories} editingCategoryId={editingCategoryId} editingCategoryName={editingCategoryName} setEditingCategoryName={setEditingCategoryName} editCategoryError={editCategoryError} setEditCategoryError={setEditCategoryError} startEdit={(cat) => { setEditingCategoryId(cat.id); setEditingCategoryName(cat.name); setEditCategoryError(""); }} cancelEdit={() => setEditingCategoryId(null)} submitEdit={submitEditCategory} onDelete={(cat) => setConfirm({ open: true, title: "Delete Category", message: `Are you sure you want to delete "${cat.name}"?`, onConfirm: async () => { setConfirm(p => ({ ...p, open: false })); await doDeleteCategory(cat.id); } })} />

            <CommonToast open={toast.open} type={toast.type} title={toast.title} message={toast.message} onClose={closeToast} />
            <CommonConfirmModal open={confirm.open} title={confirm.title} message={confirm.message} loading={loading} onCancel={() => setConfirm((p) => ({ ...p, open: false }))} onConfirm={confirm.onConfirm} />
        </AuthenticatedLayout>
    );
}