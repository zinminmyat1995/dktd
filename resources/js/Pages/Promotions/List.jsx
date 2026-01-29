import React, { useEffect, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import CommonToast from "@/Components/CommonToast";
import CommonConfirmModal from "@/Components/CommonConfirmModal";

// Libs & Services
import { cn, buildQuery, toPublicUrl, formatDateShort } from "@/lib/utils";
import { apiFetch, extract422Errors } from "@/services/api";

// Components
import { Input, Select } from "@/Components/AdminUI";
import PromotionFormModal from "./Partials/PromotionFormModal";
import PromotionCell from "@/Components/Products/PromotionCell";

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
        const nextErrors = {};
        if (!form.title.trim()) nextErrors.title = "Title is required.";
        if (!editRow && !form.image) nextErrors.image = "Image is required.";
        
        if (form.type === 'promotion') {
            if (!form.start_date) nextErrors.start_date = "Start date is required.";
            if (!form.end_date) nextErrors.end_date = "End date is required.";
        }
        
        if (Object.keys(nextErrors).length > 0) {
            setErrors(nextErrors);
            return;
        }

        setLoading(true);
        setErrors({});
        try {
            const fd = new FormData();
            if (editRow) fd.append("_method", "PUT");
            fd.append("title", form.title.trim());
            fd.append("type", form.type);
            fd.append("category_id", form.category_id);
            fd.append("description", (form.description || "").trim());
            fd.append("status", form.status);
            fd.append("start_date", form.start_date || "");
            fd.append("end_date", form.end_date || "");
            if (form.image) fd.append("image", form.image);

            const url = editRow ? `/admin/promotions/${editRow.id}` : "/admin/promotions";
            await apiFetch(url, { method: "POST", body: fd });

            showToast("success", "Success", editRow ? "Updated successfully" : "Created successfully");
            setModalOpen(false);
            fetchData();
        } catch (err) {
            if (err.status === 422) {
                setErrors(extract422Errors(err));
            } else {
                showToast("error", "Error", err.message);
            }
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
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="md:col-span-2">
                        <label className="text-xs text-slate-500">Search</label>
                        <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Search..." />
                    </div>
                    <div>
                        <label className="text-xs text-slate-500">Type</label>
                        <Select value={type} onChange={e => setType(e.target.value)}>
                            <option value="">All Types</option>
                            <option value="promotion">Promotion</option>
                            <option value="news">News</option>
                        </Select>
                    </div>
                    <div>
                        <label className="text-xs text-slate-500">Status</label>
                        <Select value={status} onChange={e => setStatus(e.target.value)}>
                            <option value="">All Status</option>
                            <option value="published">Published</option>
                            <option value="draft">Draft</option>
                            <option value="archived">Archived</option>
                        </Select>
                    </div>
                </div>

                {/* Actions Row */}
                <div className="mt-4 flex items-center justify-between flex-wrap gap-2">
                    <div className="text-sm text-slate-500 flex items-center gap-3">
                        <div>
                            Total: <span className="font-semibold text-slate-900">{meta.total}</span>
                        </div>
                    </div>

                    <div className="flex gap-2 flex-wrap justify-end">
                        <button 
                            onClick={openCreate} 
                            className="h-10 px-4 rounded-full bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 shadow-sm"
                        >
                            + Create Content
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-4 rounded-2xl border bg-white shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-[1350px] w-full text-sm">
                        <thead className="bg-slate-50 text-slate-600 sticky top-0 z-10">
                            <tr>
                                <th className="px-3 py-3 text-left w-[90px]">Image</th>
                                <th className="px-3 py-3 text-left min-w-[200px]">Title</th>
                                <th className="px-3 py-3 text-left w-[120px]">Type</th>
                                <th className="px-3 py-3 text-left w-[180px]">Category</th>
                                <th className="px-3 py-3 text-left w-[200px]">Promotion</th>
                                <th className="px-3 py-3 text-left w-[120px]">Status</th>
                                <th className="px-3 py-3 text-left w-[180px]">Created By</th>
                                <th className="px-3 py-3 text-left w-[180px]">Updated By</th>
                                <th className="px-3 py-3 text-center w-[250px]">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {rows.map(r => (
                                <tr key={r.id}>
                                    <td className="px-3 py-3">
                                        <img 
                                            src={toPublicUrl(r.image_path)} 
                                            className="w-12 h-12 rounded-lg object-cover border" 
                                            onError={e => e.target.src = "/images/placeholder.png"} 
                                        />
                                    </td>
                                    <td className="px-3 py-3">
                                        <div className="font-semibold text-slate-900">{r.title}</div>
                                        <div className="text-xs text-slate-500 line-clamp-1">{r.description}</div>
                                    </td>
                                    <td className="px-3 py-3 capitalize">{r.type}</td>
                                    <td className="px-3 py-3">{r.category?.name || "—"}</td>
                                    <td className="px-3 py-3">
                                        {r.type === 'promotion' ? (
                                            <PromotionCell start={r.start_date} end={r.end_date} />
                                        ) : <span className="text-xs text-slate-400">—</span>}
                                    </td>
                                    <td className="px-3 py-3">
                                        <span className={cn("inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold",
                                            r.status === 'published' ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-slate-100 text-slate-700 border border-slate-200")}>
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
                                                onClick={() => openEdit(r)}
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                className="px-3 py-2 rounded-lg bg-rose-600 text-white hover:bg-rose-700 font-semibold"
                                                onClick={() => setConfirm({
                                                    open: true,
                                                    title: "Delete Content?",
                                                    message: `Are you sure you want to delete "${r.title}"?`,
                                                    onConfirm: async () => { setConfirm(p => ({ ...p, open: false })); await handleDelete(r); }
                                                })}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {rows.length === 0 && !loading && (
                                <tr>
                                    <td colSpan={9} className="px-3 py-10 text-center text-slate-500">No data found.</td>
                                </tr>
                            )}
                            {loading && (
                                <tr>
                                    <td colSpan={9} className="px-3 py-10 text-center text-slate-500">Loading...</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="p-6 flex items-center justify-between border-t bg-slate-50/50">
                    <div className="text-sm font-Medium text-slate-500">Page <span className="font-Bold text-slate-900">{meta.current_page}</span> of <span className="font-Bold text-slate-900">{meta.last_page}</span></div>
                    <div className="flex gap-3">
                        <button disabled={meta.current_page === 1 || loading} onClick={() => setPage(p => p - 1)} className="inline-flex items-center gap-2 px-5 py-2 rounded-xl border border-slate-200 bg-white text-sm font-SemiBold text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Prev
                        </button>
                        <button disabled={meta.current_page === meta.last_page || loading} onClick={() => setPage(p => p + 1)} className="inline-flex items-center gap-2 px-5 py-2 rounded-xl border border-slate-200 bg-white text-sm font-SemiBold text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                            Next
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <PromotionFormModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                loading={loading}
                editRow={editRow}
                form={form}
                setForm={setForm}
                errors={errors}
                categories={categories}
                onSubmit={handleSubmit}
            />

            <CommonToast open={toast.open} type={toast.type} title={toast.title} message={toast.message} onClose={() => setToast(p => ({ ...p, open: false }))} />
            <CommonConfirmModal open={confirm.open} title={confirm.title} message={confirm.message} onCancel={() => setConfirm(p => ({ ...p, open: false }))} onConfirm={confirm.onConfirm} />
        </AuthenticatedLayout>
    );
}