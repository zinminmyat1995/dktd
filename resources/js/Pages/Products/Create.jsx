import React, { useEffect, useMemo, useState, useRef } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import CommonToast from "@/Components/CommonToast";
import CommonConfirmModal from "@/Components/CommonConfirmModal";

const API_BASE = "";

// -------------------- helpers --------------------
function getCsrfToken() {
  const el = document.querySelector('meta[name="csrf-token"]');
  return el ? el.getAttribute("content") : "";
}

async function apiGet(path) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { Accept: "application/json" },
    credentials: "same-origin",
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function apiJson(method, path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-CSRF-TOKEN": getCsrfToken(),
    },
    credentials: "same-origin",
    body: body ? JSON.stringify(body) : null,
  });

  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch { }

  if (!res.ok) {
    const err = new Error(text || "Request failed");
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

async function apiFormData(path, formData, method = "POST") {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      Accept: "application/json",
      "X-CSRF-TOKEN": getCsrfToken(),
    },
    credentials: "same-origin",
    body: formData,
  });

  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch { }

  if (!res.ok) {
    const err = new Error(text || "Request failed");
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

function cn(...xs) {
  return xs.filter(Boolean).join(" ");
}

function Modal({ open, title, children, onClose, maxWidth = "max-w-lg" }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4">
      <div className={cn("w-full rounded-2xl bg-white shadow-xl", maxWidth)}>
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-slate-500 hover:bg-slate-100"
            type="button"
          >
            ✕
          </button>
        </div>
        <div className="px-5 py-4">{children}</div>
      </div>
    </div>
  );
}

function Toggle({ value, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={cn(
        "relative inline-flex h-8 w-14 items-center rounded-full transition",
        value ? "bg-indigo-600" : "bg-slate-300"
      )}
      aria-label="toggle"
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

function normalizeArray(res) {
  return Array.isArray(res) ? res : res?.data ?? [];
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

function extract422Errors(err) {
  const errors = err?.data?.errors;
  if (!errors) return {};
  const out = {};
  for (const k of Object.keys(errors))
    out[k] = errors[k]?.[0] ?? String(errors[k]);
  return out;
}

// -------------------- component --------------------
export default function ProductCreate() {
  const [categories, setCategories] = useState([]);

  // ✅ file input ref (for reset choose file)
  const fileInputRef = useRef(null);

  // Product form states
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");

  const [status, setStatus] = useState("draft");
  const [isNew, setIsNew] = useState(false);
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

  const [toast, setToast] = useState({
    open: false,
    type: "",
    title: "",
    message: "",
  });
  const closeToast = () => setToast((p) => ({ ...p, open: false }));

  // Add Category modal
  const [openAddCategoryModal, setOpenAddCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  // Manage Categories modal
  const [openManageCategoryModal, setOpenManageCategoryModal] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editingCategoryName, setEditingCategoryName] = useState("");
  const [editCategoryError, setEditCategoryError] = useState("");

  const [confirm, setConfirm] = useState({
    open: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  // load categories
  useEffect(() => {
    (async () => {
      try {
        const res = await apiGet("/admin/categories");
        setCategories(normalizeArray(res));
      } catch {
        setToast({
          open: true,
          type: "error",
          title: "Error",
          message: "Failed to load categories.",
        });
      }
    })();
  }, []);

  async function refreshCategories() {
    const res = await apiGet("/admin/categories");
    setCategories(normalizeArray(res));
  }

  // POST /admin/categories
  async function onCreateCategory() {
    const name = newCategoryName.trim();
    if (!name) {
      setFieldErrors((p) => ({
        ...p,
        newCategoryName: "Category Name is required.",
      }));
      return;
    }

    const exists = categories.some(
      (c) => String(c.name).trim().toLowerCase() === name.toLowerCase()
    );
    if (exists) {
      setFieldErrors((p) => ({
        ...p,
        newCategoryName: "This category already exists.",
      }));
      return;
    }

    try {
      setLoading(true);
      setFieldErrors((p) => ({ ...p, newCategoryName: "" }));

      const created = await apiJson("POST", "/admin/categories", { name });
      const obj = created?.data ?? created;

      setCategories((prev) => [obj, ...prev]);
      setCategoryId(String(obj.id));
      setNewCategoryName("");
      setOpenAddCategoryModal(false);

      setToast({
        open: true,
        type: "success",
        title: "Success",
        message: "Category added.",
      });
    } catch (e) {
      const errs = extract422Errors(e);
      if (e.status === 422 && errs.name) {
        setFieldErrors((p) => ({ ...p, newCategoryName: errs.name }));
      }
      setToast({
        open: true,
        type: "error",
        title: "Error",
        message: "Failed to add category.",
      });
    } finally {
      setLoading(false);
    }
  }

  // Manage modal edit
  function startEditCategory(cat) {
    setEditingCategoryId(cat.id);
    setEditingCategoryName(String(cat.name ?? ""));
    setEditCategoryError("");
  }

  function cancelEditCategory() {
    setEditingCategoryId(null);
    setEditingCategoryName("");
    setEditCategoryError("");
  }

  async function submitEditCategory() {
    const name = editingCategoryName.trim();
    if (!name) {
      setEditCategoryError("Category Name is required.");
      return;
    }

    const existsOther = categories.some(
      (c) =>
        c.id !== editingCategoryId &&
        String(c.name ?? "").trim().toLowerCase() === name.toLowerCase()
    );
    if (existsOther) {
      setEditCategoryError("This category already exists.");
      return;
    }

    try {
      setLoading(true);
      setEditCategoryError("");

      const updated = await apiJson(
        "PUT",
        `/admin/categories/${editingCategoryId}`,
        { name }
      );
      const obj = updated?.data ?? updated;

      setCategories((prev) =>
        prev.map((c) => (c.id === editingCategoryId ? { ...c, ...obj } : c))
      );

      setToast({
        open: true,
        type: "success",
        title: "Success",
        message: "Category updated.",
      });
      cancelEditCategory();
    } catch (e) {
      const errs = extract422Errors(e);
      if (e.status === 422 && errs.name) setEditCategoryError(errs.name);
      setToast({
        open: true,
        type: "error",
        title: "Error",
        message: "Failed to update category.",
      });
    } finally {
      setLoading(false);
    }
  }

  // DELETE /admin/categories/{id}
  function askDeleteCategory(cat) {
    setConfirm({
      open: true,
      title: "Delete Category",
      message: `Are you sure you want to delete "${cat.name}"?`,
      onConfirm: async () => {
        setConfirm((p) => ({ ...p, open: false }));
        await doDeleteCategory(cat.id);
      },
    });
  }

  async function doDeleteCategory(id) {
    try {
      setLoading(true);
      await apiJson("DELETE", `/admin/categories/${id}`);

      setCategories((prev) => prev.filter((c) => c.id !== id));
      if (String(categoryId) === String(id)) setCategoryId("");

      setToast({
        open: true,
        type: "success",
        title: "Success",
        message: "Category deleted.",
      });
    } catch (e) {
      setToast({
        open: true,
        type: "error",
        title: "Error",
        message: e?.data?.message || "Failed to delete category.",
      });
    } finally {
      setLoading(false);
    }
  }

  // ✅ Save Product (multipart + REQUIRED)
  async function onSaveProduct() {
    const nextErrors = {
      title: "",
      categoryId: "",
      description: "",
      status: "",
      publishedAt: "",
      image: "",
      newCategoryName: "",
    };

    if (!title.trim()) nextErrors.title = "Title is required.";
    if (!categoryId) nextErrors.categoryId = "Category is required.";
    if (!description.trim()) nextErrors.description = "Description is required.";
    if (!status) nextErrors.status = "Status is required.";
    if (!publishedAt) nextErrors.publishedAt = "Published date is required.";
    if (!imageFile) nextErrors.image = "Image is required.";

    setFieldErrors(nextErrors);

    if (
      nextErrors.title ||
      nextErrors.categoryId ||
      nextErrors.description ||
      nextErrors.status ||
      nextErrors.publishedAt ||
      nextErrors.image
    )
      return;

    const fd = new FormData();
    fd.append("title", title.trim());
    fd.append("category_id", String(Number(categoryId)));
    fd.append("description", description.trim());
    fd.append("status", status);
    fd.append("is_new", isNew ? "1" : "0");
    fd.append("published_at", publishedAt);
    fd.append("image", imageFile);

    try {
      setLoading(true);
      await apiFormData("/admin/products", fd);

      setToast({
        open: true,
        type: "success",
        title: "Success",
        message: "Product saved successfully.",
      });

      // ✅ reset
      setTitle("");
      setCategoryId("");
      setDescription("");
      setStatus("draft");
      setIsNew(false);
      setPublishedAt("");
      setImageFile(null);

      // ✅ IMPORTANT: reset choose file UI (file name disappear)
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      await refreshCategories();
    } catch (e) {
      if (e.status === 422) {
        const errs = extract422Errors(e);
        setFieldErrors((p) => ({
          ...p,
          title: errs.title || p.title,
          categoryId: errs.category_id || p.categoryId,
          description: errs.description || p.description,
          status: errs.status || p.status,
          publishedAt: errs.published_at || p.publishedAt,
          image: errs.image || p.image,
        }));

        setToast({
          open: true,
          type: "error",
          title: "Save Failed",
          message: e?.data?.message || "Validation error.",
        });
      } else {
        setToast({
          open: true,
          type: "error",
          title: "Error",
          message: "Failed to save product.",
        });
      }
    } finally {
      setLoading(false);
    }
  }

  const activeCategoryCount = useMemo(
    () => categories.filter((c) => c.is_active).length,
    [categories]
  );

  // -------------------- UI --------------------
  return (
    <AuthenticatedLayout
      header="Product Management"
      subtitle="Create product item and manage categories quickly."
    >
      <div className="w-full px-3 sm:px-4 lg:px-6 py-6" style={{ paddingTop: "1px" }}>
        {/* Quick Actions */}
        <div className="rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
          <div className="flex flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-base font-semibold text-slate-900">
                Quick Actions
              </div>
              <div className="text-xs text-slate-500">
                Add & manage categories quickly.
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-start gap-2 sm:justify-end">
              <button
                onClick={() => setOpenAddCategoryModal(true)}
                className="inline-flex h-10 items-center justify-center rounded-full bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
                type="button"
              >
                + Add Category
              </button>

              <button
                onClick={() => setOpenManageCategoryModal(true)}
                className="inline-flex h-10 items-center justify-center rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                type="button"
              >
                Manage Categories
              </button>
            </div>
          </div>
        </div>

        {/* Layout */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-5">
          {/* Left Form */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="text-sm font-semibold text-slate-700">
                    Product Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      if (fieldErrors.title)
                        setFieldErrors((p) => ({ ...p, title: "" }));
                    }}
                    className={cn(
                      "mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none focus:border-indigo-400",
                      fieldErrors.title
                        ? "border-rose-400"
                        : "border-slate-200"
                    )}
                  />
                  {fieldErrors.title && (
                    <p className="mt-1 text-xs font-medium text-rose-600">
                      {fieldErrors.title}
                    </p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label className="text-sm font-semibold text-slate-700">
                    Category{" "}
                    <span className="text-xs font-normal text-slate-400">
                      ({activeCategoryCount} active)
                    </span>{" "}
                    <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => {
                      setCategoryId(e.target.value);
                      if (fieldErrors.categoryId)
                        setFieldErrors((p) => ({ ...p, categoryId: "" }));
                    }}
                    className={cn(
                      "mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none focus:border-indigo-400",
                      fieldErrors.categoryId
                        ? "border-rose-400"
                        : "border-slate-200"
                    )}
                  >
                    <option value="">Select category...</option>
                    {categories
                      .filter((c) => c.is_active)
                      .map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                  </select>
                  {fieldErrors.categoryId && (
                    <p className="mt-1 text-xs font-medium text-rose-600">
                      {fieldErrors.categoryId}
                    </p>
                  )}
                </div>

                {/* Image */}
                <div>
                  <label className="text-sm font-semibold text-slate-700">
                    Upload Image <span className="text-rose-500">*</span>
                  </label>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      setImageFile(e.target.files?.[0] ?? null);
                      if (fieldErrors.image)
                        setFieldErrors((p) => ({ ...p, image: "" }));
                    }}
                    className={cn(
                      "mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm",
                      fieldErrors.image
                        ? "border-rose-400"
                        : "border-slate-200"
                    )}
                  />

                  {fieldErrors.image && (
                    <p className="mt-1 text-xs font-medium text-rose-600">
                      {fieldErrors.image}
                    </p>
                  )}

                  {imagePreviewUrl && (
                    <div className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 flex items-center justify-center overflow-hidden">
                      <img
                        src={imagePreviewUrl}
                        alt="preview"
                        className="h-28 w-full object-contain rounded-lg"
                      />
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="text-sm font-semibold text-slate-700">
                    Description <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                      if (fieldErrors.description)
                        setFieldErrors((p) => ({ ...p, description: "" }));
                    }}
                    rows={4}
                    placeholder="Short description for card..."
                    className={cn(
                      "mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none focus:border-indigo-400",
                      fieldErrors.description
                        ? "border-rose-400"
                        : "border-slate-200"
                    )}
                  />
                  {fieldErrors.description && (
                    <p className="mt-1 text-xs font-medium text-rose-600">
                      {fieldErrors.description}
                    </p>
                  )}
                </div>

                {/* Status */}
                <div className="rounded-2xl border border-slate-200 p-4 space-y-3">
                  <div>
                    <label className="text-sm font-semibold text-slate-700">
                      Status <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={status}
                      onChange={(e) => {
                        setStatus(e.target.value);
                        if (fieldErrors.status)
                          setFieldErrors((p) => ({ ...p, status: "" }));
                      }}
                      className={cn(
                        "mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none focus:border-indigo-400",
                        fieldErrors.status
                          ? "border-rose-400"
                          : "border-slate-200"
                      )}
                    >
                      <option value="">Select status...</option>
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>

                    {fieldErrors.status && (
                      <p className="mt-1 text-xs font-medium text-rose-600">
                        {fieldErrors.status}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-slate-900">
                        Mark as NEW
                      </div>
                      <div className="text-xs text-slate-600">
                        Show NEW badge on card.
                      </div>
                    </div>
                    <Toggle value={isNew} onChange={setIsNew} />
                  </div>
                </div>

                {/* PublishedAt */}
                <div>
                  <label className="text-sm font-semibold text-slate-700">
                    Published At <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={publishedAt}
                    onChange={(e) => {
                      setPublishedAt(e.target.value);
                      if (fieldErrors.publishedAt)
                        setFieldErrors((p) => ({ ...p, publishedAt: "" }));
                    }}
                    className={cn(
                      "mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none focus:border-indigo-400",
                      fieldErrors.publishedAt
                        ? "border-rose-400"
                        : "border-slate-200"
                    )}
                  />
                  {fieldErrors.publishedAt && (
                    <p className="mt-1 text-xs font-medium text-rose-600">
                      {fieldErrors.publishedAt}
                    </p>
                  )}
                </div>

                {/* Save */}
                <button
                  onClick={() =>
                    setConfirm({
                      open: true,
                      title: "Save Product",
                      message: "Are you sure you want to save this product?",
                      onConfirm: async () => {
                        setConfirm((p) => ({ ...p, open: false }));
                        await onSaveProduct();
                      },
                    })
                  }
                  disabled={loading}
                  className={cn(
                    "w-full rounded-2xl px-4 py-3 text-sm font-bold text-white shadow-sm",
                    loading
                      ? "bg-indigo-400"
                      : "bg-indigo-600 hover:bg-indigo-700"
                  )}
                  type="button"
                >
                  {loading ? "Saving..." : "Save Product"}
                </button>

                <div className="text-xs text-slate-500">
                  Tip: Use <b>Status = Published</b> to show on public page.
                </div>
              </div>
            </div>
          </div>

          {/* Right Preview */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
              <div className="border-b px-5 py-4">
                <h2 className="text-lg font-bold text-slate-900">Preview</h2>
                <p className="text-sm text-slate-600">
                  This is how your product card will look.
                </p>
              </div>

              <div className="p-6">
                <div className="rounded-2xl border border-slate-200 overflow-hidden">
                  <div className="relative w-full h-[500px] overflow-hidden bg-slate-100 flex items-center justify-center">
                    {imagePreviewUrl ? (
                      <img
                        src={imagePreviewUrl}
                        className="w-full h-[90%] object-contain transition-transform duration-300 hover:scale-105"
                        alt="preview"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">
                        No Image Selected
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-sm font-semibold text-indigo-600">
                        {categories.find(
                          (c) => String(c.id) === String(categoryId)
                        )?.name ?? "Category"}
                      </div>

                      {isNew && (
                        <span className="rounded-full bg-indigo-600 px-3 py-1 text-xs font-bold text-white">
                          NEW
                        </span>
                      )}
                    </div>

                    <h3 className="mt-2 text-xl font-bold text-slate-900">
                      {title || "Product Title"}
                    </h3>

                    <p className="mt-2 text-sm text-slate-600 line-clamp-3">
                      {description || "Product description will appear here..."}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
                      <span className="rounded-full bg-slate-100 px-3 py-1">
                        Status: {status || "-"}
                      </span>
                      {publishedAt && (
                        <span className="rounded-full bg-slate-100 px-3 py-1">
                          Publish: {publishedAt}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t px-5 py-4 text-xs text-slate-500">
                Note: Preview is for admin only. Public page will filter by{" "}
                <b>published</b>.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Category Modal */}
      <Modal
        open={openAddCategoryModal}
        title="Add Category"
        onClose={() => setOpenAddCategoryModal(false)}
      >
        <div className="space-y-3">
          <div>
            <label className="text-sm font-semibold text-slate-700">
              Category Name
            </label>
            <input
              value={newCategoryName}
              onChange={(e) => {
                setNewCategoryName(e.target.value);
                if (fieldErrors.newCategoryName)
                  setFieldErrors((p) => ({ ...p, newCategoryName: "" }));
              }}
              className={cn(
                "mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none focus:border-indigo-400",
                fieldErrors.newCategoryName
                  ? "border-rose-400"
                  : "border-slate-200"
              )}
            />
            {fieldErrors.newCategoryName && (
              <p className="mt-1 text-xs font-medium text-rose-600">
                {fieldErrors.newCategoryName}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={() => setOpenAddCategoryModal(false)}
              className="rounded-xl border px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              type="button"
            >
              Cancel
            </button>
            <button
              onClick={onCreateCategory}
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
      </Modal>

      {/* Manage Categories Modal */}
      <Modal
        open={openManageCategoryModal}
        title="Manage Categories"
        onClose={() => {
          setOpenManageCategoryModal(false);
          cancelEditCategory();
        }}
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
                            <input
                              value={editingCategoryName}
                              onChange={(e) => {
                                setEditingCategoryName(e.target.value);
                                if (editCategoryError) setEditCategoryError("");
                              }}
                              className={cn(
                                "w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-indigo-400",
                                editCategoryError
                                  ? "border-rose-400"
                                  : "border-slate-200"
                              )}
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
                                onClick={cancelEditCategory}
                                className="rounded-lg border px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                onClick={submitEditCategory}
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
                                onClick={() => startEditCategory(c)}
                                className="rounded-lg border px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => askDeleteCategory(c)}
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
                      colSpan={2}
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
      </Modal>

      {/* Toast */}
      <CommonToast
        open={toast.open}
        type={toast.type}
        title={toast.title}
        message={toast.message}
        onClose={closeToast}
      />

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
