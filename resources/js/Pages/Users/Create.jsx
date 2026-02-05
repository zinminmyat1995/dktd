import React, { useEffect, useMemo, useState } from "react";
import { usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import CommonToast from "@/Components/CommonToast";
import CommonConfirmModal from "@/Components/CommonConfirmModal";

// Libs & Services
import { cn, toPublicUrl, formatDateShort } from "@/lib/utils";
import { apiFetch, extract422Errors } from "@/services/api";

function Modal({ open, title, children, onClose, maxWidth = "max-w-lg" }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/35 p-4">
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

/* =======================
   Main Component
======================= */
export default function Create() {
  const { auth } = usePage().props;
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);

  /* Toast */
  const [toast, setToast] = useState({ open: false, type: "", title: "", message: "" });
  const closeToast = () => setToast((p) => ({ ...p, open: false }));

  /* Confirm Modal */
  const [confirm, setConfirm] = useState({ open: false, title: "", message: "", onConfirm: async () => { } });

  /* Register Form */
  const [form, setForm] = useState({ name: "", email: "", role: "staff", password: "", image: null, imagePreview: "" });
  const [errors, setErrors] = useState({});

  /* Edit Modal */
  const [editOpen, setEditOpen] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", role: "staff", image: null, imagePreview: "" });
  const [editErrors, setEditErrors] = useState({});

  /* Password Modal */
  const [pwdOpen, setPwdOpen] = useState(false);
  const [pwdRow, setPwdRow] = useState(null);
  const [pwdForm, setPwdForm] = useState({ password: "", password_confirmation: "" });
  const [pwdErrors, setPwdErrors] = useState({});

  function showToast(type, title, message) {
    setToast({ open: true, type, title, message });
  }

  async function fetchUsers() {
    setLoading(true);
    try {
      const res = await apiFetch("/admin/users/data");
      setUsers(res.data ?? []);
    } catch {
      showToast("error", "Error", "Failed to load users.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  /* =======================
     Create User
  ======================= */
  async function submitCreate() {
    setLoading(true);
    setErrors({});
    try {
      const fd = new FormData();
      fd.append("name", form.name.trim());
      fd.append("email", form.email.trim());
      fd.append("role", form.role);
      fd.append("password", form.password);
      if (form.image) fd.append("image", form.image);

      const res = await apiFetch("/admin/users", { method: "POST", body: fd });
      if (res?.ok === false) {
        showToast("error", "Failed", res?.message || "Cannot create user.");
        return;
      }

      showToast("success", "Success", res?.message || "User created.");
      setForm({ name: "", email: "", role: "staff", password: "", image: null, imagePreview: "" });
      fetchUsers();
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

  /* =======================
     Edit User
  ======================= */
  function openEdit(row) {
    setEditRow(row);
    setEditForm({
      name: row.name ?? "",
      email: row.email ?? "",
      role: row.role ?? "staff",
      image: null,
      imagePreview: toPublicUrl(row.image_path) || ""
    });
    setEditErrors({});
    setEditOpen(true);
  }

  async function submitEdit() {
    setLoading(true);
    setEditErrors({});
    try {
      const fd = new FormData();
      fd.append("_method", "PUT");
      fd.append("name", editForm.name.trim());
      fd.append("email", editForm.email.trim());
      fd.append("role", editForm.role);
      if (editForm.image) fd.append("image", editForm.image);

      const res = await apiFetch(`/admin/users/${editRow.id}`, { method: "POST", body: fd });

      if (res?.ok === false) {
        showToast("error", "Failed", res?.message || "Cannot update user.");
        return;
      }

      showToast("success", "Updated", res?.message || "User updated.");
      setEditOpen(false);
      fetchUsers();
    } catch (err) {
      if (err.status === 422) {
        setEditErrors(extract422Errors(err));
      } else {
        showToast("error", "Error", err.message);
      }
    } finally {
      setLoading(false);
    }
  }

  /* =======================
     Change Password
  ======================= */
  function openPassword(row) {
    setPwdRow(row);
    setPwdForm({ password: "", password_confirmation: "" });
    setPwdErrors({});
    setPwdOpen(true);
  }

  async function submitPassword() {
    setLoading(true);
    setPwdErrors({});
    try {
      const res = await apiFetch(`/admin/users/${pwdRow.id}/password`, {
        method: "PUT",
        body: JSON.stringify(pwdForm)
      });

      if (res?.ok === false) {
        showToast("error", "Failed", res?.message || "Cannot change password.");
        return;
      }

      showToast("success", "Success", res?.message || "Password updated.");
      setPwdOpen(false);
    } catch (err) {
      if (err.status === 422) {
        setPwdErrors(extract422Errors(err));
      } else {
        showToast("error", "Error", err.message);
      }
    } finally {
      setLoading(false);
    }
  }

  /* =======================
     Delete User
  ======================= */
  function askDelete(row) {
    setConfirm({
      open: true,
      title: "Delete User",
      message: `Are you sure you want to delete "${row.name}"?`,
      onConfirm: async () => {
        setConfirm((p) => ({ ...p, open: false }));
        await doDelete(row);
      },
    });
  }

  async function doDelete(row) {
    try {
      setLoading(true);
      const res = await apiFetch(`/admin/users/${row.id}`, { method: "DELETE" });

      if (res?.ok === false) {
        showToast("error", "Failed", res?.message || "Cannot delete user.");
        return;
      }

      showToast("success", "Deleted", res?.message || "User deleted.");
      fetchUsers();
    } catch (err) {
      showToast("error", "Error", err?.data?.message || "Failed to delete user.");
    } finally {
      setLoading(false);
    }
  }

  /* =======================
     UI
  ======================= */
  return (
    <AuthenticatedLayout header="User Management" subtitle="Register users and manage roles safely.">
      <div className="w-full px-3 sm:px-4 lg:px-6 py-6" style={{ paddingTop: "1px" }}>
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-5">
          {/* ✅ Area 1: Register */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-base font-bold text-slate-900">User Register</h2>
              <p className="text-xs text-slate-500">Create new user account with role.</p>

              <div className="mt-4 space-y-4">
                <div>
                  <label className="text-sm font-semibold text-slate-700">Name *</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    className={cn("mt-1 w-full rounded-xl border px-3 py-2 text-sm", errors.name ? "border-rose-400" : "border-slate-200")}
                  />
                  {errors.name && <p className="mt-1 text-xs text-rose-600">{errors.name}</p>}
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700">Email *</label>
                  <input
                    value={form.email}
                    onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                    className={cn("mt-1 w-full rounded-xl border px-3 py-2 text-sm", errors.email ? "border-rose-400" : "border-slate-200")}
                  />
                  {errors.email && <p className="mt-1 text-xs text-rose-600">{errors.email}</p>}
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700">Password *</label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                    className={cn("mt-1 w-full rounded-xl border px-3 py-2 text-sm", errors.password ? "border-rose-400" : "border-slate-200")}
                  />
                  {errors.password && <p className="mt-1 text-xs text-rose-600">{errors.password}</p>}
                </div>

                {auth.user.role === 'admin' && (
                  <div>
                    <label className="text-sm font-semibold text-slate-700">Profile Image</label>
                    <input
                      type="file"
                      onChange={e => {
                        const file = e.target.files[0];
                        if (file) setForm({ ...form, image: file, imagePreview: URL.createObjectURL(file) });
                      }}
                      className={cn("mt-1 w-full rounded-xl border px-3 py-2 text-sm", errors.image ? "border-rose-400" : "border-slate-200")}
                    />
                    {errors.image && <p className="mt-1 text-xs text-rose-600">{errors.image}</p>}
                    {form.imagePreview && (
                      <div className="mt-2 flex justify-center">
                        <img src={form.imagePreview} alt="preview" className="h-20 w-20 rounded-full object-cover border-2 border-slate-100" />
                      </div>
                    )}
                  </div>
                )}

                <button
                  onClick={() =>
                    setConfirm({
                      open: true,
                      title: "Create User",
                      message: "Are you sure you want to create this user?",
                      onConfirm: async () => {
                        setConfirm((p) => ({ ...p, open: false }));
                        await submitCreate();
                      },
                    })
                  }
                  disabled={loading}
                  className={cn("w-full rounded-2xl px-4 py-3 text-sm font-bold text-white", loading ? "bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-700")}
                  type="button"
                >
                  {loading ? "Saving..." : "Save User"}
                </button>
              </div>
            </div>
          </div>

          {/* ✅ Area 2: Table */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
              <div className="border-b px-5 py-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">User List</h2>
                  <p className="text-sm text-slate-600">Manage users, roles and password safely.</p>
                </div>
                <div className="text-sm text-slate-500">
                  Total: <span className="font-bold text-slate-900">{users.length}</span>
                </div>
              </div>

              <div className="p-5">
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="min-w-full text-sm">
                    <thead className="bg-slate-50 text-slate-600">
                      <tr>
                        <th className="px-4 py-3 text-left">Name</th>
                        <th className="px-4 py-3 text-left">Email</th>
                        <th className="px-4 py-3 text-left w-[110px]">Role</th>
                        <th className="px-4 py-3 text-right w-[260px]">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {users.map((u) => {
                        const isAdmin = u.role === "admin";

                        return (
                          <tr key={u.id}>
                            {/* ✅ Avatar + Name */}
                            <td className="px-4 py-3 font-semibold text-slate-900 w-[220px]">
                              <div className="flex items-center gap-3">
                                {u.image_path ? (
                                  <img
                                    src={toPublicUrl(u.image_path)}
                                    className="w-8 h-8 rounded-full object-cover border"
                                    onError={e => e.target.src = "/images/avatar-placeholder.png"}
                                  />
                                ) : (
                                  <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">
                                    <span className="text-[10px] font-bold text-slate-600 uppercase">
                                      {u.name?.charAt(0) || "U"}
                                    </span>
                                  </div>
                                )}
                                <div className="max-w-[150px] truncate">{u.name}</div>
                              </div>
                            </td>

                            {/* ✅ Email width + truncate */}
                            <td className="px-4 py-3 text-slate-600 w-[280px]">
                              <div className="max-w-[280px] truncate">{u.email}</div>
                            </td>

                            {/* ✅ Role badge */}
                            <td className="px-4 py-3 w-[110px]">
                              <span
                                className={cn(
                                  "inline-flex px-3 py-1 rounded-full text-xs font-bold",
                                  isAdmin
                                    ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                                    : "bg-slate-100 text-slate-700 border border-slate-200"
                                )}
                              >
                                {u.role}
                              </span>
                            </td>

                            {/* ✅ Actions (Admin cannot be edited/deleted) */}
                            <td className="px-4 py-3 text-right w-[260px]">
                              {isAdmin ? (
                                <span className="text-xs text-slate-400 italic">Protected</span>
                              ) : (
                                <div className="inline-flex gap-2">
                                  <button
                                    className="rounded-lg border px-3 py-2 text-xs font-semibold hover:bg-slate-50"
                                    onClick={() => openEdit(u)}
                                  >
                                    Edit
                                  </button>

                                  <button
                                    className="rounded-lg border border-indigo-200 text-indigo-700 px-3 py-2 text-xs font-semibold hover:bg-indigo-50"
                                    onClick={() => openPassword(u)}
                                  >
                                    Password
                                  </button>

                                  <button
                                    className="rounded-lg bg-rose-600 px-3 py-2 text-xs font-bold text-white hover:bg-rose-700"
                                    onClick={() => askDelete(u)}
                                  >
                                    Delete
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}


                      {users.length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-4 py-12 text-center text-slate-500">
                            No users found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="border-t px-5 py-4 text-xs text-slate-500">
                Note: Only Admin role can create/edit/delete users.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Edit Modal */}
      <Modal open={editOpen} title="Edit User" onClose={() => setEditOpen(false)}>
        <div className="space-y-3">
          <div>
            <label className="text-sm font-semibold text-slate-700">Name *</label>
            <input
              value={editForm.name}
              onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))}
              className={cn("mt-1 w-full rounded-xl border px-3 py-2 text-sm", editErrors.name ? "border-rose-400" : "border-slate-200")}
            />
            {editErrors.name && <p className="mt-1 text-xs text-rose-600">{editErrors.name}</p>}
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700">Email *</label>
            <input
              value={editForm.email}
              onChange={(e) => setEditForm((p) => ({ ...p, email: e.target.value }))}
              className={cn("mt-1 w-full rounded-xl border px-3 py-2 text-sm", editErrors.email ? "border-rose-400" : "border-slate-200")}
            />
            {editErrors.email && <p className="mt-1 text-xs text-rose-600">{editErrors.email}</p>}
          </div>
          {(editRow?.id === auth?.user?.id || auth?.user?.role === 'admin') && (
            <div>
              <label className="text-sm font-semibold text-slate-700">Profile Image</label>
              <input
                type="file"
                onChange={e => {
                  const file = e.target.files[0];
                  if (file) setEditForm({ ...editForm, image: file, imagePreview: URL.createObjectURL(file) });
                }}
                className={cn("mt-1 w-full rounded-xl border px-3 py-2 text-sm", editErrors.image ? "border-rose-400" : "border-slate-200")}
              />
              {editErrors.image && <p className="mt-1 text-xs text-rose-600">{editErrors.image}</p>}
              {editForm.imagePreview && (
                <div className="mt-2 flex justify-center">
                  <img src={editForm.imagePreview} alt="preview" className="h-20 w-20 rounded-full object-cover border-2 border-slate-100" />
                </div>
              )}
            </div>
          )}
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setEditOpen(false)} className="px-4 py-2 rounded-lg border hover:bg-slate-50">
              Cancel
            </button>
            <button
              onClick={submitEdit}
              disabled={loading}
              className={cn("px-4 py-2 rounded-lg text-white font-bold", loading ? "bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-700")}
            >
              Save
            </button>
          </div>
        </div>
      </Modal>

      {/* ✅ Password Modal */}
      <Modal open={pwdOpen} title="Change Password" onClose={() => setPwdOpen(false)}>
        <div className="space-y-3">
          <div>
            <label className="text-sm font-semibold text-slate-700">New Password *</label>
            <input
              type="password"
              value={pwdForm.password}
              onChange={(e) => setPwdForm((p) => ({ ...p, password: e.target.value }))}
              className={cn("mt-1 w-full rounded-xl border px-3 py-2 text-sm", pwdErrors.password ? "border-rose-400" : "border-slate-200")}
            />
            {pwdErrors.password && <p className="mt-1 text-xs text-rose-600">{pwdErrors.password}</p>}
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700">Confirm Password *</label>
            <input
              type="password"
              value={pwdForm.password_confirmation}
              onChange={(e) => setPwdForm((p) => ({ ...p, password_confirmation: e.target.value }))}
              className={cn("mt-1 w-full rounded-xl border px-3 py-2 text-sm", pwdErrors.password_confirmation ? "border-rose-400" : "border-slate-200")}
            />
            {pwdErrors.password_confirmation && (
              <p className="mt-1 text-xs text-rose-600">{pwdErrors.password_confirmation}</p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setPwdOpen(false)} className="px-4 py-2 rounded-lg border hover:bg-slate-50">
              Cancel
            </button>
            <button
              onClick={submitPassword}
              disabled={loading}
              className={cn("px-4 py-2 rounded-lg text-white font-bold", loading ? "bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-700")}
            >
              Update
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
