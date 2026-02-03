import React, { useEffect, useMemo, useState, useRef } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import CommonToast from "@/Components/CommonToast";
import CommonConfirmModal from "@/Components/CommonConfirmModal";

// Libs & Services
import { cn, buildQuery, toPublicUrl, formatDateShort } from "@/lib/utils";
import { apiFetch } from "@/services/api";

// Components
import { NewBadge, HomeBadge } from "@/Components/Products/ProductBadges";
import HomeModal from "./Partials/HomeModal";
import EditModal from "./Partials/EditModal";

/* =======================
   Local UI Components (Keep here if specific to this page or small)
======================= */
const Input = React.forwardRef(function Input({ className = "", ...props }, ref) {
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

const Select = ({ className = "", children, ...props }) => (
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

function Toggle({ value, onChange }) {
    return (
        <button
            type="button"
            onClick={() => onChange(!value)}
            className={cn(
                "relative inline-flex h-8 w-14 items-center rounded-full transition",
                value ? "bg-indigo-600" : "bg-slate-300"
            )}
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

function Modal({ open, title, subtitle, children, onClose, maxWidth = "max-w-xl" }) {
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

/* =======================
   Main Component
======================= */
export default function List({ categories = [] }) {
    const [loading, setLoading] = useState(false);
    const [rows, setRows] = useState([]);
    const [meta, setMeta] = useState({ total: 0, per_page: 10, current_page: 1, last_page: 1 });

    const [toast, setToast] = useState({ open: false, type: "success", title: "", message: "" });
    const closeToast = () => setToast((p) => ({ ...p, open: false }));

    const [confirm, setConfirm] = useState({
        open: false,
        title: "",
        message: "",
        onConfirm: async () => { },
    });

    /* ===== Filters ===== */
    const [q, setQ] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [status, setStatus] = useState("");
    const [sortBy, setSortBy] = useState("updated_at");
    const [sortDir, setSortDir] = useState("desc");
    const [perPage, setPerPage] = useState(10);
    const [page, setPage] = useState(1);

    /* ===== Selection ===== */
    const [selected, setSelected] = useState([]);
    const selectedItems = selected;
    const [isAllSelected, setIsAllSelected] = useState(false);

    /* ===== Home modal ===== */
    const [homeOpen, setHomeOpen] = useState(false);
    const [homeError, setHomeError] = useState("");
    const [homeSelectedIds, setHomeSelectedIds] = useState([]);

    /* ===== Edit modal ===== */
    const [editOpen, setEditOpen] = useState(false);
    const [editRow, setEditRow] = useState(null);

    const [editForm, setEditForm] = useState({
        title: "",
        category_id: "",
        description: "",
        status: "draft",
        is_new: false,
        published_at: "",
        image: null,
        imagePreview: "",
    });

    const [editErrors, setEditErrors] = useState({});
    const imagePreviewRef = useRef(null);

    function showToast(type, title, message) {
        setToast({ open: true, type, title, message });
    }

    /* =======================
       Fetch Products
    ======================= */
    async function fetchData() {
        setLoading(true);
        try {
            const query = buildQuery({
                q,
                category_id: categoryId,
                status,
                sort_by: sortBy,
                sort_dir: sortDir,
                per_page: perPage,
                page,
            });

            const json = await apiFetch(`/admin/products/data?${query}`, { method: "GET" });

            setRows(json.data ?? []);
            setMeta({
                total: json.total ?? 0,
                per_page: json.per_page ?? perPage,
                current_page: json.current_page ?? page,
                last_page: json.last_page ?? 1,
            });

            setSelected([]);
            setIsAllSelected(false);
        } catch {
            showToast("error", "Error", "Failed to load products.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line
    }, [q, categoryId, status, sortBy, sortDir, perPage, page]);

    /* =======================
       Selection Handlers
    ======================= */
    function toggleSelect(row) {
        setSelected((prev) => {
            const exists = prev.find((x) => x.id === row.id);
            if (exists) {
                return prev.filter((x) => x.id !== row.id);
            }
            return [...prev, row];
        });
    }

    async function toggleSelectAll() {
        try {
            setLoading(true);

            const query = buildQuery({
                q,
                category_id: categoryId,
                status,
                sort_by: sortBy,
                sort_dir: sortDir,
            });

            const json = await apiFetch(`/admin/products/all-ids?${query}`, { method: "GET" });
            const ids = json?.ids ?? [];

            if (isAllSelected) {
                setSelected([]);
                setIsAllSelected(false);
                return;
            }

            const newList = ids.map((id) => ({ id }));

            setSelected(newList);
            setIsAllSelected(true);

            showToast("success", "Selected", `Selected ${ids.length} products (All pages).`);
        } catch (err) {
            console.error(err);
            showToast("error", "Error", err?.data?.message || "Failed to select all.");
        } finally {
            setLoading(false);
        }
    }

    const headerChecked = isAllSelected;
    const headerIndeterminate = selectedItems.length > 0 && !headerChecked;

    /* =======================
       Delete
    ======================= */
    async function deleteOne(row) {
        const isLastItemOnPage = rows.length === 1;
        const canGoPrev = page > 1;

        try {
            const json = await apiFetch(`/admin/products/${row.id}`, { method: "DELETE" });

            if (json?.ok === false) {
                showToast("error", "Delete Failed", json?.message || "Failed to delete product.");
                return;
            }

            showToast("success", "Deleted", json?.message || "Product deleted successfully.");

            if (isLastItemOnPage && canGoPrev) {
                setPage((p) => Math.max(1, p - 1));
                return;
            }

            fetchData();
        } catch (err) {
            console.error(err);
            showToast("error", "Error", err?.data?.message || "Failed to delete product.");
        }
    }

    /* =======================
       Home Products
    ======================= */
    async function loadHomeSelected() {
        try {
            const json = await apiFetch(`/admin/products/home-selected`, { method: "GET" });
            const ids = (json?.ids ?? []).map((x) => Number(x));
            setHomeSelectedIds(ids);
            return ids;
        } catch {
            return [];
        }
    }

    async function openHomeModal() {
        await loadHomeSelected();
        setHomeError("");

        if (selectedItems.length > 0) {
            if (selectedItems.length > 3) {
                showToast("warning", "Warning", "You can select maximum 3 products for Home page.");
                return;
            }
        }

        setHomeOpen(true);
    }

    async function submitHomeProducts() {
        setHomeError("");

        if (selectedItems.length > 3) {
            setHomeError("You can select maximum 3 products for Home page.");
            return;
        }

        try {
            setLoading(true);

            const json = await apiFetch(`/admin/products/home`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    product_ids: selectedItems.map((x) => x.id),
                }),
            });

            if (json?.ok === false) {
                setHomeError(json?.message || "Failed to update home products.");
                return;
            }

            showToast("success", "Success", json?.message || "Home products updated.");
            setHomeOpen(false);
            await loadHomeSelected();
            fetchData();
        } catch (err) {
            console.error(err);
            setHomeError(err?.data?.message || "Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    async function clearHomeProducts() {
        try {
            setLoading(true);

            const json = await apiFetch(`/admin/products/home`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    product_ids: [],
                }),
            });

            if (json?.ok === false) {
                showToast("error", "Failed", json?.message || "Failed to clear home products.");
                return;
            }

            showToast("success", "Cleared", json?.message || "Home products cleared.");
            setHomeOpen(false);
            await loadHomeSelected();
            fetchData();
        } catch (err) {
            console.error(err);
            showToast("error", "Error", err?.data?.message || "Failed to clear home products.");
        } finally {
            setLoading(false);
        }
    }

    /* =======================
       Edit Modal
    ======================= */
    async function openEditModal(row) {
        setEditErrors({});
        setEditRow(row);

        const preview = toPublicUrl(row.image_path) || "";
        setEditForm({
            title: row.title ?? "",
            category_id: row.category_id ? String(row.category_id) : "",
            description: row.description ?? "",
            status: row.status ?? "draft",
            is_new: Boolean(row.is_new),
            published_at: row.published_at ? String(row.published_at).slice(0, 10) : "",
            image: null,
            imagePreview: preview,
        });

        setEditOpen(true);
    }

    function closeEditModal() {
        setEditOpen(false);
        setEditRow(null);
        setEditErrors({});
    }

    function onEditImageChange(file) {
        if (!file) return;
        if (imagePreviewRef.current) URL.revokeObjectURL(imagePreviewRef.current);
        const preview = URL.createObjectURL(file);
        imagePreviewRef.current = preview;
        setEditForm((p) => ({ ...p, image: file, imagePreview: preview }));
    }

    useEffect(() => {
        return () => {
            if (imagePreviewRef.current) URL.revokeObjectURL(imagePreviewRef.current);
        };
    }, []);

    function validateEditForm() {
        const e = {};
        if (!editForm.title.trim()) e.title = "Title is required.";
        if (!editForm.category_id) e.category_id = "Category is required.";
        if (!editForm.description.trim()) e.description = "Description is required.";
        if (!editForm.status) e.status = "Status is required.";
        if (!editForm.published_at) e.published_at = "Published date is required.";

        setEditErrors(e);
        return Object.keys(e).length === 0;
    }

    async function submitEdit() {
        if (!editRow) return;

        const ok = validateEditForm();
        if (!ok) return;

        try {
            setLoading(true);

            const fd = new FormData();
            fd.append("_method", "PUT");
            fd.append("title", editForm.title.trim());
            fd.append("category_id", editForm.category_id ? String(Number(editForm.category_id)) : "");
            fd.append("description", editForm.description.trim());
            fd.append("status", editForm.status);
            fd.append("is_new", editForm.is_new ? "1" : "0");
            fd.append("published_at", editForm.published_at || "");

            if (editForm.image) fd.append("image", editForm.image);

            const json = await apiFetch(`/admin/products/${editRow.id}`, {
                method: "POST",
                body: fd,
            });

            if (json?.ok === false) {
                showToast("error", "Update Failed", json?.message || "Failed to update product.");
                return;
            }

            showToast("success", "Updated", json?.message || "Product updated successfully.");
            closeEditModal();
            fetchData();
        } catch (err) {
            console.error(err);
            showToast("error", "Error", err?.data?.message || "Failed to update product.");
        } finally {
            setLoading(false);
        }
    }

    /* =======================
       Render
    ======================= */
    const selectedPreview = useMemo(() => {
        const homeProducts = rows
            .filter(row => homeSelectedIds.includes(row.id))
            .sort((a, b) => (a.show_on_home || 0) - (b.show_on_home || 0));

        if (selectedItems.length > 0) {
            return selectedItems
                .slice(0, 3)
                .map((x, index) => {
                    const full = rows.find((r) => r.id === x.id) || x;
                    return { ...full, show_on_home: 3 - index };
                })
                .sort((a, b) => (a.show_on_home || 0) - (b.show_on_home || 0));
        }

        return homeProducts;
    }, [selectedItems, rows, homeSelectedIds]);

    return (
        <AuthenticatedLayout header="Product List" subtitle="View & manage products with promotion">
            {/* Filters */}
            <div className="p-4 rounded-2xl border bg-white shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="md:col-span-2">
                        <label className="text-xs text-slate-500">Search (title / description)</label>
                        <Input
                            value={q}
                            onChange={(e) => {
                                setPage(1);
                                setQ(e.target.value);
                            }}
                            placeholder="Search product..."
                        />
                    </div>

                    <div>
                        <label className="text-xs text-slate-500">Category</label>
                        <Select
                            value={categoryId}
                            onChange={(e) => {
                                setPage(1);
                                setCategoryId(e.target.value);
                            }}
                        >
                            <option value="">All</option>
                            {categories.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                        </Select>
                    </div>

                    <div>
                        <label className="text-xs text-slate-500">Status</label>
                        <Select
                            value={status}
                            onChange={(e) => {
                                setPage(1);
                                setStatus(e.target.value);
                            }}
                        >
                            <option value="">All</option>
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                            <option value="archived">Archived</option>
                        </Select>
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-4 flex items-center justify-between flex-wrap gap-2">
                    <div className="text-sm text-slate-500 flex items-center gap-3">
                        <div>
                            Total: <span className="font-semibold text-slate-900">{meta.total}</span>
                        </div>
                        <div className="text-slate-400">|</div>
                        <div>
                            Selected: <span className="font-semibold text-indigo-600">{selectedItems.length}</span>
                            <span className="ml-2 text-xs text-slate-400">(Home max 3)</span>
                        </div>
                    </div>

                    <div className="flex gap-2 flex-wrap justify-end">
                        <button
                            onClick={toggleSelectAll}
                            className="h-10 px-4 rounded-full border text-sm font-semibold hover:bg-slate-50 disabled:opacity-50"
                            type="button"
                            disabled={meta.total === 0 || loading}
                        >
                            {isAllSelected ? "Unselect All" : "Select All"}
                        </button>

                        <button
                            onClick={openHomeModal}
                            className={cn(
                                "h-10 px-4 rounded-full bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700"
                            )}
                            type="button"
                            disabled={loading}
                        >
                            Home Products
                        </button>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="mt-4 rounded-2xl border bg-white shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-[1350px] w-full text-sm">
                        <thead className="bg-slate-50 text-slate-600 sticky top-0 z-10">
                            <tr>
                                <th className="px-3 py-3 text-left w-[44px]">
                                    <input
                                        type="checkbox"
                                        checked={headerChecked}
                                        ref={(el) => el && (el.indeterminate = headerIndeterminate)}
                                        onChange={toggleSelectAll}
                                    />
                                </th>
                                <th className="px-3 py-3 text-left w-[90px]">Image</th>
                                <th className="px-3 py-3 text-left min-w-[200px]">Title</th>
                                <th className="px-3 py-3 text-left w-[180px]">Category</th>
                                <th className="px-3 py-3 text-left w-[110px]">New</th>
                                <th className="px-3 py-3 text-left w-[120px]">Promotion</th>
                                <th className="px-3 py-3 text-left w-[120px]">Home</th>
                                <th className="px-3 py-3 text-left w-[120px]">Status</th>
                                <th className="px-3 py-3 text-left w-[180px]">Created By</th>
                                <th className="px-3 py-3 text-left w-[180px]">Updated By</th>
                                <th className="px-3 py-3 text-center w-[250px]">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading && (
                                <tr>
                                    <td colSpan={11} className="px-3 py-10 text-center text-slate-500">
                                        Loading...
                                    </td>
                                </tr>
                            )}

                            {!loading && rows.length === 0 && (
                                <tr>
                                    <td colSpan={11} className="px-3 py-10 text-center text-slate-500">
                                        No data
                                    </td>
                                </tr>
                            )}

                            {!loading &&
                                rows.map((r) => {
                                    const img = toPublicUrl(r.image_path);

                                    return (
                                        <tr key={r.id} className="border-t">
                                            <td className="px-3 py-3">
                                                <input
                                                    type="checkbox"
                                                    checked={selected.some((x) => x.id === r.id)}
                                                    onChange={() => toggleSelect(r)}
                                                />
                                            </td>

                                            <td className="px-3 py-3">
                                                {img ? (
                                                    <img src={img} alt="" className="w-12 h-12 rounded-lg object-cover border" />
                                                ) : (
                                                    <div className="w-12 h-12 rounded-lg bg-slate-100 border flex items-center justify-center text-slate-400">
                                                        —
                                                    </div>
                                                )}
                                            </td>

                                            <td className="px-3 py-3">
                                                <div className="font-semibold text-slate-900">{r.title}</div>
                                                <div className="text-xs text-slate-500 line-clamp-1">{r.description}</div>
                                            </td>

                                            <td className="px-3 py-3">{r.category?.name ?? "—"}</td>

                                            <td className="px-3 py-3">
                                                <NewBadge value={r.is_new} />
                                            </td>

                                            <td className="px-3 py-3">
                                                {r.promotions && r.promotions.some(p => p.status === 'published') ? (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-700 border border-orange-200">
                                                        Promotion
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-400 text-xs text-center block w-full">—</span>
                                                )}
                                            </td>

                                            <td className="px-3 py-3">
                                                <HomeBadge value={r.show_on_home} />
                                            </td>

                                            <td className="px-3 py-3">
                                                <span
                                                    className={cn(
                                                        "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold",
                                                        r.status === "published"
                                                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                                            : r.status === "archived"
                                                                ? "bg-rose-50 text-rose-700 border border-rose-200"
                                                                : "bg-slate-100 text-slate-700 border border-slate-200"
                                                    )}
                                                >
                                                    {r.status}
                                                </span>
                                            </td>

                                            <td className="px-3 py-3">
                                                <div className="text-xs font-Medium text-slate-900">{r.creator?.name ?? "—"}</div>
                                                <div className="text-[10px] text-slate-400 uppercase tracking-tighter">{formatDateShort(r.created_at)}</div>
                                            </td>

                                            <td className="px-3 py-3">
                                                {r.updated_at !== r.created_at ? (
                                                    <>
                                                        <div className="text-xs font-Medium text-slate-900">{r.updater?.name ?? "—"}</div>
                                                        <div className="text-[10px] text-slate-400 uppercase tracking-tighter">{formatDateShort(r.updated_at)}</div>
                                                    </>
                                                ) : (
                                                    <span className="text-xs text-slate-400">—</span>
                                                )}
                                            </td>

                                            <td className="px-3 py-3 text-right">
                                                <div className="flex justify-end gap-2 flex-wrap">
                                                    <button
                                                        className="px-3 py-2 rounded-lg border border-indigo-200 text-indigo-700 hover:bg-indigo-50 font-semibold"
                                                        onClick={() => openEditModal(r)}
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        className="px-3 py-2 rounded-lg bg-rose-600 text-white hover:bg-rose-700 font-semibold"
                                                        onClick={() =>
                                                            setConfirm({
                                                                open: true,
                                                                title: "Delete Product",
                                                                message: `Are you sure you want to delete "${r.title}"?`,
                                                                onConfirm: async () => {
                                                                    setConfirm((p) => ({ ...p, open: false }));
                                                                    await deleteOne(r);
                                                                },
                                                            })
                                                        }
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-6 flex items-center justify-between border-t bg-slate-50/50">
                    <div className="text-sm font-Medium text-slate-500">
                        Showing page <span className="text-slate-900 font-Bold">{meta.current_page}</span> of{" "}
                        <span className="text-slate-900 font-Bold">{meta.last_page}</span>
                    </div>

                    <div className="flex gap-3">
                        <button
                            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl border border-slate-200 bg-white text-sm font-SemiBold text-slate-700 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            disabled={meta.current_page <= 1 || loading}
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Prev
                        </button>

                        <button
                            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl border border-slate-200 bg-white text-sm font-SemiBold text-slate-700 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            disabled={meta.current_page >= meta.last_page || loading}
                            onClick={() => setPage((p) => p + 1)}
                        >
                            Next
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <HomeModal
                open={homeOpen}
                onClose={() => setHomeOpen(false)}
                loading={loading}
                homeSelectedIds={homeSelectedIds}
                selectedItems={selectedItems}
                homeError={homeError}
                selectedPreview={selectedPreview}
                onClear={() => setConfirm({
                    open: true,
                    title: "Clear Home Products",
                    message: "Are you sure you want to clear Home products?",
                    onConfirm: async () => {
                        setConfirm((p) => ({ ...p, open: false }));
                        await clearHomeProducts();
                    },
                })}
                onSave={() => setConfirm({
                    open: true,
                    title: "Save Home Products",
                    message: `Set selected products (${selectedItems.length}) to show on Home page? (max 3)`,
                    onConfirm: async () => {
                        setConfirm((p) => ({ ...p, open: false }));
                        await submitHomeProducts();
                    },
                })}
                Modal={Modal}
            />

            <EditModal
                open={editOpen}
                onClose={closeEditModal}
                loading={loading}
                editRow={editRow}
                editForm={editForm}
                setEditForm={setEditForm}
                editErrors={editErrors}
                setEditErrors={setEditErrors}
                onImageChange={onEditImageChange}
                onSave={() => setConfirm({
                    open: true,
                    title: "Confirm Save",
                    message: "Are you sure you want to save these changes?",
                    onConfirm: async () => {
                        setConfirm((p) => ({ ...p, open: false }));
                        await submitEdit();
                    },
                })}
                categories={categories}
                Modal={Modal}
                Input={Input}
                Select={Select}
                Toggle={Toggle}
            />

            {/* Toast */}
            <CommonToast open={toast.open} type={toast.type} title={toast.title} message={toast.message} onClose={closeToast} />

            {/* Confirm */}
            <CommonConfirmModal
                open={confirm.open}
                title={confirm.title}
                message={confirm.message}
                loading={loading}
                onCancel={() => setConfirm((p) => ({ ...p, open: false }))}
                onConfirm={confirm.onConfirm}
            />
        </AuthenticatedLayout>
    );
}