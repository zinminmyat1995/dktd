import React, { useEffect, useMemo, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import CommonToast from "@/Components/CommonToast";
import CommonConfirmModal from "@/Components/CommonConfirmModal";

/* =======================
   Helpers
======================= */
function cn(...xs) {
  return xs.filter(Boolean).join(" ");
}

function getCsrfToken() {
  const el = document.querySelector('meta[name="csrf-token"]');
  return el ? el.getAttribute("content") : "";
}

async function apiGet(path) {
  const res = await fetch(path, {
    headers: { Accept: "application/json" },
    credentials: "same-origin",
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function apiJson(method, path, body) {
  const res = await fetch(path, {
    method,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-CSRF-TOKEN": getCsrfToken(),
      "X-Requested-With": "XMLHttpRequest",
    },
    credentials: "same-origin",
    body: body ? JSON.stringify(body) : null,
  });

  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {}

  if (!res.ok) {
    const err = new Error(text || "Request failed");
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

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
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);

  /* Toast */
  const [toast, setToast] = useState({ open: false, type: "", title: "", message: "" });
  const closeToast = () => setToast((p) => ({ ...p, open: false }));

  /* Confirm Modal */
  const [confirm, setConfirm] = useState({ open: false, title: "", message: "", onConfirm: async () => {} });

  /* Register Form */
  const [form, setForm] = useState({ name: "", email: "", role: "staff", password: "" });
  const [errors, setErrors] = useState({});

  /* Edit Modal */
  const [editOpen, setEditOpen] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", role: "staff" });
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
      const res = await apiGet("/admin/users/data");
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
    const e = {};
    if (!form.name.trim()) e.name = "Name is required.";
    if (!form.email.trim()) e.email = "Email is required.";
    if (!form.role) e.role = "Role is required.";
    if (!form.password) e.password = "Password is required.";
    setErrors(e);

    if (Object.keys(e).length) return;

    try {
      setLoading(true);
      const res = await apiJson("POST", "/admin/users", form);
      if (res?.ok === false) {
        showToast("error", "Failed", res?.message || "Cannot create user.");
        return;
      }

      showToast("success", "Success", res?.message || "User created.");
      setForm({ name: "", email: "", role: "staff", password: "" });
      fetchUsers();
    } catch (err) {
      showToast("error", "Error", err?.data?.message || "Failed to create user.");
    } finally {
      setLoading(false);
    }
  }

  /* =======================
     Edit User
  ======================= */
  function openEdit(row) {
    setEditRow(row);
    setEditForm({ name: row.name ?? "", email: row.email ?? "", role: row.role ?? "staff" });
    setEditErrors({});
    setEditOpen(true);
  }

  async function submitEdit() {
    const e = {};
    if (!editForm.name.trim()) e.name = "Name is required.";
    if (!editForm.email.trim()) e.email = "Email is required.";
    if (!editForm.role) e.role = "Role is required.";
    setEditErrors(e);

    if (Object.keys(e).length) return;

    try {
      setLoading(true);
      const res = await apiJson("PUT", `/admin/users/${editRow.id}`, editForm);

      if (res?.ok === false) {
        showToast("error", "Failed", res?.message || "Cannot update user.");
        return;
      }

      showToast("success", "Updated", res?.message || "User updated.");
      setEditOpen(false);
      fetchUsers();
    } catch (err) {
      showToast("error", "Error", err?.data?.message || "Failed to update user.");
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
    const e = {};
    if (!pwdForm.password) e.password = "Password is required.";
    if (pwdForm.password !== pwdForm.password_confirmation)
      e.password_confirmation = "Password confirmation does not match.";

    setPwdErrors(e);
    if (Object.keys(e).length) return;

    try {
      setLoading(true);
      const res = await apiJson("PUT", `/admin/users/${pwdRow.id}/password`, pwdForm);

      if (res?.ok === false) {
        showToast("error", "Failed", res?.message || "Cannot change password.");
        return;
      }

      showToast("success", "Success", res?.message || "Password updated.");
      setPwdOpen(false);
    } catch (err) {
      showToast("error", "Error", err?.data?.message || "Failed to change password.");
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
      const res = await apiJson("DELETE", `/admin/users/${row.id}`);

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
                        {/* ✅ Name width + truncate */}
                        <td className="px-4 py-3 font-semibold text-slate-900 w-[220px]">
                            <div className="max-w-[220px] truncate">{u.name}</div>
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
