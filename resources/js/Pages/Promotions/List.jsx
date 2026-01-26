import React, { useEffect, useState, useRef } from "react";
import { Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import CommonToast from "@/Components/CommonToast";
import CommonConfirmModal from "@/Components/CommonConfirmModal";

/* =======================
   Helpers
======================= */
function cn(...xs) {
    return xs.filter(Boolean).join(" ");
}

function buildQuery(params) {
    const usp = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
        if (v === null || v === undefined || v === "") return;
        usp.set(k, String(v));
    });
    return usp.toString();
}

function toPublicUrl(path) {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    if (path.startsWith("/storage/")) return path;
    return `/storage/${path}`;
}

function formatDateShort(dateStr) {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "-";
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
}

function toDateInputValue(dateStr) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    return d.toISOString().slice(0, 10);
}

function csrfToken() {
    return document.querySelector("meta[name='csrf-token']")?.content || "";
}

async function apiFetch(url, options = {}) {
    const method = (options.method || "GET").toUpperCase();
    const headers = {
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
        ...(options.headers || {}),
    };
    if (method !== "GET") headers["X-CSRF-TOKEN"] = csrfToken();

    const res = await fetch(url, { credentials: "same-origin", ...options, headers });
    const text = await res.text();
    let data = null;
    try { data = text ? JSON.parse(text) : null; } catch { data = text; }

    if (!res.ok) {
        const err = new Error(data?.message || "Request failed");
        err.status = res.status;
        err.data = data;
        throw err;
    }
    return data;
}

/* =======================
   UI Components
======================= */
const Input = React.forwardRef(({ className = "", ...props }, ref) => (
    <input
        ref={ref}
        className={cn(
            "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100",
            className
        )}
        {...props}
    />
));

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

const Modal = ({ open, title, subtitle, children, onClose, maxWidth = "max-w-xl" }) => {
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
                    <button className="px-2 py-1 rounded-lg hover:bg-slate-100 text-slate-600" onClick={onClose} type="button">✕</button>
                </div>
                <div className="p-5 max-h-[calc(100vh-180px)] overflow-y-auto">{children}</div>
            </div>
        </div>
    );
};

/* =======================
   Main Component
======================= */
export default function List({ categories = [] }) {
    const [loading, setLoading] = useState(false);
    const [rows, setRows] = useState([]);
    const [meta, setMeta] = useState({ total: 0, per_page: 10, current_page: 1, last_page: 1 });
    const [toast, setToast] = useState({ open: false, type: "success", title: "", message: "" });
    const [confirm, setConfirm] = useState({ open: false, title: "", message: "", onConfirm: async () => { } });

    const [q, setQ] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [status, setStatus] = useState("");
    const [type, setType] = useState("");
    const [page, setPage] = useState(1);

    const [modalOpen, setModalOpen] = useState(false);
    const [editRow, setEditRow] = useState(null);
    const [form, setForm] = useState({
        title: "",
        type: "promotion",
        category_id: "",
        description: "",
        status: "published",
        start_date: "",
        end_date: "",
        image: null,
        imagePreview: "",
    });
    const [errors, setErrors] = useState({});

    function showToast(type, title, message) {
        setToast({ open: true, type, title, message });
    }

    async function fetchData() {
        setLoading(true);
        try {
            const query = buildQuery({ q, category_id: categoryId, status, type, page });
            const json = await apiFetch(`/admin/promotions/data?${query}`);
            setRows(json.data ?? []);
            setMeta({
                total: json.total,
                per_page: json.per_page,
                current_page: json.current_page,
                last_page: json.last_page,
            });
        } catch (err) {
            showToast("error", "Error", "Failed to load promotions.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { fetchData(); }, [q, categoryId, status, type, page]);

    function openCreate() {
        setEditRow(null);
        setForm({
            title: "",
            type: "promotion",
            category_id: "",
            description: "",
            status: "published",
            start_date: "",
            end_date: "",
            image: null,
            imagePreview: "",
        });
        setErrors({});
        setModalOpen(true);
    }

    function openEdit(row) {
        setEditRow(row);
        setForm({
            title: row.title,
            type: row.type,
            category_id: row.category_id ? String(row.category_id) : "",
            description: row.description || "",
            status: row.status,
            start_date: row.start_date || "",
            end_date: row.end_date || "",
            image: null,
            imagePreview: toPublicUrl(row.image_path) || "",
        });
        setErrors({});
        setModalOpen(true);
    }

    async function handleSubmit() {
        setLoading(true);
        try {
            const fd = new FormData();
            if (editRow) fd.append("_method", "PUT");
            fd.append("title", form.title);
            fd.append("type", form.type);
            fd.append("category_id", form.category_id);
            fd.append("description", form.description);
            fd.append("status", form.status);
            fd.append("start_date", form.start_date);
            fd.append("end_date", form.end_date);
            if (form.image) fd.append("image", form.image);

            const url = editRow ? `/admin/promotions/${editRow.id}` : "/admin/promotions";
            await apiFetch(url, { method: "POST", body: fd });

            showToast("success", "Success", editRow ? "Updated successfully" : "Created successfully");
            setModalOpen(false);
            fetchData();
        } catch (err) {
            if (err.status === 422) setErrors(err.data.errors);
            else showToast("error", "Error", err.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(row) {
        try {
            await apiFetch(`/admin/promotions/${row.id}`, { method: "DELETE" });
            showToast("success", "Deleted", "Promotion deleted successfully.");
            fetchData();
        } catch (err) {
            showToast("error", "Error", err.message);
        }
    }

    return (
        <AuthenticatedLayout header="Promotions & News" subtitle="Manage your marketing content">
            <div className="p-4 rounded-2xl border bg-white shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                    <div className="md:col-span-2">
                        <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Search..." />
                    </div>
                    <Select value={type} onChange={e => setType(e.target.value)}>
                        <option value="">All Types</option>
                        <option value="promotion">Promotion</option>
                        <option value="news">News</option>
                    </Select>
                    <Select value={status} onChange={e => setStatus(e.target.value)}>
                        <option value="">All Status</option>
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                        <option value="archived">Archived</option>
                    </Select>
                    <button onClick={openCreate} className="h-10 px-4 rounded-full bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700">+ Create</button>
                </div>
            </div>

            <div className="mt-4 rounded-2xl border bg-white shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-slate-600">
                        <tr className="sticky top-0 z-10">
                            <th className="px-4 py-3 text-left">Content</th>
                            <th className="px-4 py-3 text-left">Type</th>
                            <th className="px-4 py-3 text-left">Category</th>
                            <th className="px-4 py-3 text-left">Dates</th>
                            <th className="px-4 py-3 text-left">Status</th>
                            <th className="px-4 py-3 text-left">Created By</th>
                            <th className="px-4 py-3 text-left">Updated By</th>
                            <th className="px-4 py-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {rows.map(r => (
                            <tr key={r.id}>
                                <td className="px-4 py-3 flex gap-3 items-center">
                                    <img src={toPublicUrl(r.image_path)} className="w-10 h-10 rounded object-cover" onError={e => e.target.src = "/images/placeholder.png"} />
                                    <div>
                                        <div className="font-semibold">{r.title}</div>
                                        <div className="text-xs text-slate-500 truncate w-40">{r.description}</div>
                                    </div>
                                </td>
                                <td className="px-4 py-3 capitalize">{r.type}</td>
                                <td className="px-4 py-3">{r.category?.name || "—"}</td>
                                <td className="px-4 py-3 text-xs">
                                    {r.type === 'promotion' ? (
                                        <div>{formatDateShort(r.start_date)} to {formatDateShort(r.end_date)}</div>
                                    ) : "—"}
                                </td>
                                <td className="px-4 py-3">
                                    <span className={cn("px-2 py-1 rounded-full text-[10px] font-bold uppercase",
                                        r.status === 'published' ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-slate-100 text-slate-600")}>
                                        {r.status}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="text-xs font-Medium text-slate-900">{r.creator?.name ?? "—"}</div>
                                    <div className="text-[10px] text-slate-400 uppercase tracking-tighter">{formatDateShort(r.created_at)}</div>
                                </td>
                                <td className="px-4 py-3">
                                    {r.updated_at !== r.created_at ? (
                                        <>
                                            <div className="text-xs font-Medium text-slate-900">{r.updater?.name ?? "—"}</div>
                                            <div className="text-[10px] text-slate-400 uppercase tracking-tighter">{formatDateShort(r.updated_at)}</div>
                                        </>
                                    ) : (
                                        <span className="text-xs text-slate-400">—</span>
                                    )}
                                </td>
                                <td className="px-4 py-3 text-center space-x-2 whitespace-nowrap">
                                    <button onClick={() => openEdit(r)} className="text-indigo-600 font-semibold">Edit</button>
                                    <button onClick={() => setConfirm({
                                        open: true,
                                        title: "Delete Content?",
                                        message: `Delete "${r.title}"?`,
                                        onConfirm: async () => { setConfirm(p => ({ ...p, open: false })); await handleDelete(r); }
                                    })} className="text-rose-600 font-semibold">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {/* Simple Pagination */}
                <div className="p-4 bg-slate-50 border-t flex justify-between items-center text-xs">
                    <div>Page {meta.current_page} of {meta.last_page}</div>
                    <div className="flex gap-2">
                        <button disabled={meta.current_page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1 bg-white border rounded">Prev</button>
                        <button disabled={meta.current_page === meta.last_page} onClick={() => setPage(p => p + 1)} className="px-3 py-1 bg-white border rounded">Next</button>
                    </div>
                </div>
            </div>

            <Modal open={modalOpen} title={editRow ? "Edit Content" : "Create Content"} onClose={() => setModalOpen(false)} maxWidth="max-w-2xl">
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-semibold">Title</label>
                        <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                        {errors.title && <div className="text-rose-600 text-[10px]">{errors.title}</div>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-semibold">Type</label>
                            <Select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                                <option value="promotion">Promotion</option>
                                <option value="news">News</option>
                            </Select>
                        </div>
                        <div>
                            <label className="text-xs font-semibold">Category (Label)</label>
                            <Select value={form.category_id} onChange={e => setForm({ ...form, category_id: e.target.value })}>
                                <option value="">None</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </Select>
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-semibold">Description</label>
                        <textarea rows={3} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                    </div>
                    {form.type === 'promotion' && (
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-semibold">Start Date</label>
                                <Input type="date" value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })} />
                            </div>
                            <div>
                                <label className="text-xs font-semibold">End Date</label>
                                <Input type="date" value={form.end_date} onChange={e => setForm({ ...form, end_date: e.target.value })} />
                            </div>
                        </div>
                    )}
                    <div className="grid grid-cols-2 gap-4 items-end">
                        <div>
                            <label className="text-xs font-semibold">Status</label>
                            <Select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                                <option value="published">Published</option>
                                <option value="draft">Draft</option>
                                <option value="archived">Archived</option>
                            </Select>
                        </div>
                        <div>
                            <label className="text-xs font-semibold">Image</label>
                            <input type="file" onChange={e => {
                                const file = e.target.files[0];
                                if (file) setForm({ ...form, image: file, imagePreview: URL.createObjectURL(file) });
                            }} />
                        </div>
                    </div>
                    {form.imagePreview && <img src={form.imagePreview} className="h-32 rounded object-cover" alt="Preview" />}

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

                    <div className="flex justify-end gap-2 pt-4">
                        <button onClick={() => setModalOpen(false)} className="px-4 py-2 border rounded-xl">Cancel</button>
                        <button onClick={handleSubmit} disabled={loading} className="px-4 py-2 bg-indigo-600 text-white rounded-xl">{loading ? "Saving..." : "Save"}</button>
                    </div>
                </div>
            </Modal>

            <CommonToast open={toast.open} type={toast.type} title={toast.title} message={toast.message} onClose={() => setToast(p => ({ ...p, open: false }))} />
            <CommonConfirmModal open={confirm.open} title={confirm.title} message={confirm.message} onCancel={() => setConfirm(p => ({ ...p, open: false }))} onConfirm={confirm.onConfirm} />
        </AuthenticatedLayout>
    );
}
