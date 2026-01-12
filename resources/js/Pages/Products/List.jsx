import React, { useEffect, useMemo, useState, useRef } from "react";
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

  if (path.startsWith("http")) {
    try {
      const u = new URL(path);
      return u.pathname;
    } catch {
      return path;
    }
  }

  if (path.startsWith("storage/app/public/")) {
    const rel = path.replace("storage/app/public/", "");
    return `/storage/${rel}`;
  }

  if (path.startsWith("/storage/")) return path;
  if (!path.includes("/")) return `/storage/${path}`;
  return null;
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

// ✅ Convert to input type="date" format: YYYY-MM-DD
function toDateInputValue(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

/* =======================
   CSRF + apiFetch ✅
======================= */
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

  // ✅ CSRF for POST/PUT/PATCH/DELETE
  if (method !== "GET") {
    headers["X-CSRF-TOKEN"] = csrfToken();
  }

  const res = await fetch(url, {
    credentials: "same-origin",
    ...options,
    headers,
  });

  const text = await res.text();
  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    const err = new Error(data?.message || "Request failed");
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

/* =======================
   Promotion Cell
======================= */
function PromotionCell({ start, end }) {
  if (!start && !end) return <span className="text-xs text-slate-400">—</span>;

  return (
    <div className="inline-flex flex-col gap-1 rounded-xl px-3 py-2">
      <div className="flex items-center gap-2">
        <span className="text-[12px] font-semibold text-indigo-600 uppercase">Start</span>
        <span className="text-xs font-medium text-slate-900">{formatDateShort(start)}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[12px] font-semibold text-rose-600 uppercase">End</span>
        <span className="text-xs font-medium text-slate-900">{formatDateShort(end)}</span>
      </div>
    </div>
  );
}

/* =======================
   UI Components
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
  const [selected, setSelected] = useState({});
  const selectedItems = useMemo(() => Object.values(selected), [selected]);

  // ✅ For Select All pages
  const [isAllSelected, setIsAllSelected] = useState(false);

  /* ===== Promotion modal ===== */
  const [promoOpen, setPromoOpen] = useState(false);
  const [promoStart, setPromoStart] = useState("");
  const [promoEnd, setPromoEnd] = useState("");
  const [promoError, setPromoError] = useState("");

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
     Fetch Products ✅
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

      // ✅ If user changed filter / paging -> reset selection state
      setSelected({});
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
    const key = row.id;
    setSelected((prev) => {
      const next = { ...prev };
      if (next[key]) delete next[key];
      else next[key] = row;
      return next;
    });
  }

  // ✅ Select ALL across all pages (not current page)
  async function toggleSelectAll() {
    try {
      setLoading(true);

      // ✅ Filter params same as data query (but NO pagination)
      const query = buildQuery({
        q,
        category_id: categoryId,
        status,
        sort_by: sortBy,
        sort_dir: sortDir,
      });

      // ✅ MUST create this endpoint in backend:
      // GET /admin/products/all-ids?{filters}
      // response: { ids: [1,2,3...] }
      const json = await apiFetch(`/admin/products/all-ids?${query}`, { method: "GET" });

      const ids = json?.ids ?? [];

      if (isAllSelected) {
        // ✅ unselect all
        setSelected({});
        setIsAllSelected(false);
        return;
      }

      // ✅ Fill selected by id only (mock row object)
      const map = {};
      ids.forEach((id) => {
        map[id] = { id };
      });

      setSelected(map);
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
     Delete ✅
     ✅ Fix: if last item on current page deleted => auto go prev page
  ======================= */
  async function deleteOne(row) {
    // ✅ snapshot before delete
    const isLastItemOnPage = rows.length === 1;
    const canGoPrev = page > 1;

    try {
      const json = await apiFetch(`/admin/products/${row.id}`, { method: "DELETE" });

      if (json?.ok === false) {
        showToast("error", "Delete Failed", json?.message || "Failed to delete product.");
        return;
      }

      showToast("success", "Deleted", json?.message || "Product deleted successfully.");

      // ✅ if last row on page, go prev page
      if (isLastItemOnPage && canGoPrev) {
        setPage((p) => Math.max(1, p - 1));
        return; // fetchData will auto run due to page change
      }

      fetchData();
    } catch (err) {
      console.error(err);
      showToast("error", "Error", err?.data?.message || "Failed to delete product.");
    }
  }

  /* =======================
     Promotion ✅
  ======================= */
  function openPromotionModal() {
    if (selectedItems.length === 0) {
      showToast("warning", "Warning", "Please select at least 1 product before setting promotion.");
      return;
    }

    const starts = selectedItems.map((x) => x.start_date || "");
    const ends = selectedItems.map((x) => x.end_date || "");

    const allSameStart = starts.every((s) => s === starts[0]);
    const allSameEnd = ends.every((e) => e === ends[0]);

    const s0 = starts[0];
    const e0 = ends[0];

    if (allSameStart && allSameEnd && s0 && e0) {
      setPromoStart(toDateInputValue(s0));
      setPromoEnd(toDateInputValue(e0));
    } else {
      setPromoStart("");
      setPromoEnd("");
    }

    setPromoError("");
    setPromoOpen(true);
  }

  async function submitPromotion() {
    setPromoError("");

    if (!promoStart || !promoEnd) {
      setPromoError("Start date and end date are required.");
      return;
    }
    if (promoEnd < promoStart) {
      setPromoError("End date must be after start date.");
      return;
    }

    try {
      setLoading(true);

      const json = await apiFetch(`/admin/products/promotion`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_ids: selectedItems.map((x) => x.id),
          start_date: promoStart,
          end_date: promoEnd,
        }),
      });

      if (json?.ok === false) {
        setPromoError(json?.message || "Failed to update promotion.");
        return;
      }

      showToast("success", "Success", json?.message || "Promotion updated.");
      setPromoOpen(false);
      setPromoStart("");
      setPromoEnd("");
      fetchData();
    } catch (err) {
      console.error(err);
      setPromoError(err?.data?.message || "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function clearPromotion() {
    try {
      setLoading(true);

      const json = await apiFetch(`/admin/products/promotion`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_ids: selectedItems.map((x) => x.id),
          start_date: null,
          end_date: null,
        }),
      });

      if (json?.ok === false) {
        showToast("error", "Failed", json?.message || "Failed to clear promotion.");
        return;
      }

      showToast("success", "Cleared", json?.message || "Promotion cleared.");
      setPromoOpen(false);
      setPromoStart("");
      setPromoEnd("");
      fetchData();
    } catch (err) {
      console.error(err);
      showToast("error", "Error", err?.data?.message || "Failed to clear promotion.");
    } finally {
      setLoading(false);
    }
  }

  /* =======================
     Edit Modal (Fetch + Open) ✅
  ======================= */
  async function openEditModal(row) {
    setEditErrors({});
    setEditRow(row);
    setEditOpen(true);

    try {
      setLoading(true);
      const json = await apiFetch(`/admin/products/${row.id}`, { method: "GET" });

      const data = json?.data ?? row;
      const preview = toPublicUrl(data.image_path) || "";

      setEditForm({
        title: data.title ?? "",
        category_id: data.category_id ? String(data.category_id) : "",
        description: data.description ?? "",
        status: data.status ?? "draft",
        is_new: Boolean(data.is_new),
        published_at: data.published_at ? String(data.published_at).slice(0, 10) : "",
        image: null,
        imagePreview: preview,
      });
    } catch (err) {
      showToast("error", "Error", err?.data?.message || "Failed to load product detail.");
    } finally {
      setLoading(false);
    }
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
    ✅ NEW Badge Component (Show only if NEW)
 ======================= */
  function NewBadge({ value }) {
    const isNew = Boolean(value);

    // ✅ Not NEW => render nothing
    if (!isNew) return null;

    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full px-3 py-1 border",
          "bg-emerald-50 text-emerald-700 border-emerald-200"
        )}
      >
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
        {/* ✅ NEW text smaller */}
        <span className="text-[11px] font-bold leading-none tracking-wide">NEW</span>
      </span>
    );
  }


  /* =======================
     Render
  ======================= */
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
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={toggleSelectAll}
              className="h-10 px-4 rounded-full border text-sm font-semibold hover:bg-slate-50 disabled:opacity-50"
              type="button"
              disabled={meta.total === 0 || loading}
            >
              {isAllSelected ? "Unselect All" : "Select All"}
            </button>

            <button
              onClick={openPromotionModal}
              className="h-10 px-4 rounded-full bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700"
              type="button"
            >
              Promotion
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="mt-4 rounded-2xl border bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-[1200px] w-full text-sm">
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
                <th className="px-3 py-3 text-left">Title</th>
                <th className="px-3 py-3 text-left w-[180px]">Category</th>
                <th className="px-3 py-3 text-left w-[110px]">New</th>
                <th className="px-3 py-3 text-left w-[120px]">Status</th>
                <th className="px-3 py-3 text-left w-[200px]">Promotion</th>
                <th className="px-3 py-3 text-center w-[200px]">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr>
                  <td colSpan={7} className="px-3 py-10 text-center text-slate-500">
                    Loading...
                  </td>
                </tr>
              )}

              {!loading && rows.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-3 py-10 text-center text-slate-500">
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
                        <input type="checkbox" checked={!!selected[r.id]} onChange={() => toggleSelect(r)} />
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
                        <PromotionCell start={r.start_date} end={r.end_date} />
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
            Showing page <span className="text-slate-900 font-Bold">{meta.current_page}</span> of <span className="text-slate-900 font-Bold">{meta.last_page}</span>
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

      {/* ✅ Promotion Modal */}
      <Modal
        open={promoOpen}
        title="Promotion Dates"
        subtitle={
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Selected</span>
            <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700 border border-indigo-200">
              {selectedItems.length}
            </span>
          </div>
        }
        onClose={() => setPromoOpen(false)}
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
              onClick={() =>
                setConfirm({
                  open: true,
                  title: "Clear Promotion",
                  message: "Are you sure you want to clear promotion dates for selected products?",
                  onConfirm: async () => {
                    setConfirm((p) => ({ ...p, open: false }));
                    await clearPromotion();
                  },
                })
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 disabled:opacity-50"
              type="button"
              disabled={loading}
            >
              Clear
            </button>

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setPromoOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                onClick={submitPromotion}
                disabled={loading}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 text-white text-sm font-semibold shadow-sm hover:from-indigo-700 hover:to-indigo-600 disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Promotion"}
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* ✅ Edit Modal */}
      <Modal
        open={editOpen}
        title="Edit Product"
        subtitle={editRow ? `Editing: ${editRow.title}` : ""}
        onClose={() => closeEditModal()}
        maxWidth="max-w-2xl"
      >
        <div className="space-y-4">
          <div>
            <label className="text-xs text-slate-500">Product Title *</label>
            <Input
              value={editForm.title}
              onChange={(e) => {
                setEditForm((p) => ({ ...p, title: e.target.value }));
                setEditErrors((p) => ({ ...p, title: "" }));
              }}
              className={editErrors.title ? "border-rose-500" : ""}
            />
            {editErrors.title && <div className="mt-1 text-xs text-rose-600">{editErrors.title}</div>}
          </div>

          <div>
            <label className="text-xs text-slate-500">Category *</label>
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
            {editErrors.category_id && <div className="mt-1 text-xs text-rose-600">{editErrors.category_id}</div>}
          </div>

          <div>
            <label className="text-xs text-slate-500">Upload Image</label>
            <Input type="file" accept="image/*" onChange={(e) => onEditImageChange(e.target.files?.[0])} />

            <div className="mt-3 w-44 h-28 rounded-xl border border-slate-200 bg-slate-50 overflow-hidden flex items-center justify-center">
              {editForm.imagePreview ? (
                <img src={editForm.imagePreview} alt="preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs text-slate-400">No image</span>
              )}
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-500">Description *</label>
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
            {editErrors.description && <div className="mt-1 text-xs text-rose-600">{editErrors.description}</div>}
          </div>

          <div className="rounded-2xl border border-slate-200 p-4 space-y-3">
            <div>
              <label className="text-xs text-slate-500">Status *</label>
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
              {editErrors.status && <div className="mt-1 text-xs text-rose-600">{editErrors.status}</div>}
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-slate-900">Mark as NEW</div>
                <div className="text-xs text-slate-500">Show NEW badge on card.</div>
              </div>
              <Toggle value={editForm.is_new} onChange={(v) => setEditForm((p) => ({ ...p, is_new: v }))} />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-500">Published At *</label>
            <Input
              type="date"
              value={editForm.published_at}
              onChange={(e) => {
                setEditForm((p) => ({ ...p, published_at: e.target.value }));
                setEditErrors((p) => ({ ...p, published_at: "" }));
              }}
              className={editErrors.published_at ? "border-rose-500" : ""}
            />
            {editErrors.published_at && <div className="mt-1 text-xs text-rose-600">{editErrors.published_at}</div>}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button onClick={closeEditModal} className="px-4 py-2 rounded-lg border hover:bg-slate-50" type="button">
              Cancel
            </button>

            <button
              onClick={() =>
                setConfirm({
                  open: true,
                  title: "Confirm Save",
                  message: "Are you sure you want to save these changes?",
                  onConfirm: async () => {
                    setConfirm((p) => ({ ...p, open: false }));
                    await submitEdit();
                  },
                })
              }
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
              disabled={loading}
              type="button"
            >
              Save
            </button>
          </div>
        </div>
      </Modal>

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
