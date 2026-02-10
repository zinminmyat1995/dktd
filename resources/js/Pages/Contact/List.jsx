import React, { useEffect, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import CommonToast from "@/Components/CommonToast";
import { cn, buildQuery, formatDateShort } from "@/lib/utils";
import { apiFetch } from "@/services/api";

/* =======================
   Local UI Components
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
export default function List() {
    const [loading, setLoading] = useState(false);
    const [rows, setRows] = useState([]);
    const [meta, setMeta] = useState({ total: 0, per_page: 10, current_page: 1, last_page: 1, from: 1 });

    const [toast, setToast] = useState({ open: false, type: "success", title: "", message: "" });
    const closeToast = () => setToast((p) => ({ ...p, open: false }));

    /* ===== Filters ===== */
    const [q, setQ] = useState("");
    const [status, setStatus] = useState("");
    const [sortBy, setSortBy] = useState("created_at");
    const [sortDir, setSortDir] = useState("desc");
    const [perPage, setPerPage] = useState(10);
    const [page, setPage] = useState(1);

    /* ===== Detail View ===== */
    const [viewMode, setViewMode] = useState("list"); // "list" | "detail"
    const [messages, setMessages] = useState([]);
    const [loadingMessages, setLoadingMessages] = useState(false);

    /* ===== Reply Modal (Keep for list view or reuse) ===== */
    const [replyOpen, setReplyOpen] = useState(false);
    const [selectedContact, setSelectedContact] = useState(null);
    const [replyMessage, setReplyMessage] = useState("");
    const [sendingReply, setSendingReply] = useState(false);

    function showToast(type, title, message) {
        setToast({ open: true, type, title, message });
    }

    /* =======================
       Fetch Data
    ======================= */
    async function fetchData() {
        setLoading(true);
        try {
            const query = buildQuery({
                q,
                status,
                sort_by: sortBy,
                sort_dir: sortDir,
                per_page: perPage,
                page,
            });

            const json = await apiFetch(`/admin/contacts/data?${query}`, { method: "GET" });

            setRows(json.data ?? []);
            setMeta({
                total: json.total ?? 0,
                per_page: json.per_page ?? perPage,
                current_page: json.current_page ?? page,
                last_page: json.last_page ?? 1,
                from: json.from ?? 1,
            });
        } catch {
            showToast("error", "Error", "Failed to load contacts.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line
    }, [q, status, sortBy, sortDir, perPage, page]);

    /* =======================
       Reply Logic
    ======================= */
    /* ===== Detail Logic ===== */
    async function openDetail(contact) {
        setSelectedContact(contact);
        setViewMode("detail");
        setMessages([]);
        setLoadingMessages(true);

        try {
            const json = await apiFetch(`/admin/contacts/${contact.id}/messages`, { method: "GET" });
            setMessages(json.data || []);
        } catch (err) {
            console.error(err);
            showToast("error", "Error", "Failed to load messages.");
        } finally {
            setLoadingMessages(false);
        }
    }

    function closeDetail() {
        setViewMode("list");
        setSelectedContact(null);
        setMessages([]);
    }

    /* ===== Reply Logic ===== */
    function openReplyModal(contact) {
        setSelectedContact(contact);
        setReplyMessage("");
        setReplyOpen(true);
    }

    async function submitReply() {
        if (!replyMessage.trim()) {
            showToast("error", "Validation", "Please enter a message.");
            return;
        }

        setSendingReply(true);
        try {
            const json = await apiFetch(`/admin/contacts/${selectedContact.id}/reply`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: replyMessage }),
            });

            if (json?.ok === false) {
                showToast("error", "Error", json?.message || "Failed to send reply.");
                return;
            }

            showToast("success", "Success", "Reply sent successfully.");
            setReplyOpen(false);

            // If in detail view, refresh messages
            if (viewMode === "detail") {
                setReplyMessage(""); // Clear input if we keep it open or just close it
                // Refresh messages
                const msgs = await apiFetch(`/admin/contacts/${selectedContact.id}/messages`, { method: "GET" });
                setMessages(msgs.data || []);

                // Update the status in the local list so when we go back it is updated
                setRows((prev) => prev.map((r) => (r.id === selectedContact.id ? { ...r, status: 1 } : r)));
            } else {
                fetchData(); // Refresh list
            }
        } catch (err) {
            console.error(err);
            showToast("error", "Error", err?.data?.message || "Failed to send reply.");
        } finally {
            setSendingReply(false);
        }
    }

    return (
        <AuthenticatedLayout header="Contact List" subtitle="Manage user inquiries">
            {/* Filters (Hidden in Detail View) */}
            {viewMode === "list" && (
                <div className="p-4 rounded-2xl border bg-white shadow-sm mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        <div className="md:col-span-2">
                            <label className="text-xs text-slate-500">Search (name / email)</label>
                            <Input
                                value={q}
                                onChange={(e) => {
                                    setPage(1);
                                    setQ(e.target.value);
                                }}
                                placeholder="Search contact..."
                            />
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
                                <option value="0">Pending</option>
                                <option value="1">Replied</option>
                            </Select>
                        </div>
                    </div>
                </div>
            )}

            {/* Table (Hidden in Detail View) */}
            {viewMode === "list" && (
                <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-[800px] w-full text-sm">
                            <thead className="bg-slate-50 text-slate-600 sticky top-0 z-10">
                                <tr>
                                    <th className="px-3 py-3 text-left w-[60px]">No</th>
                                    <th className="px-3 py-3 text-left w-[200px]">Name</th>
                                    <th className="px-3 py-3 text-left w-[250px]">Email</th>
                                    <th className="px-3 py-3 text-left w-[120px]">Status</th>
                                    <th className="px-3 py-3 text-left w-[150px]">Date</th>
                                    <th className="px-3 py-3 text-center w-[150px]">Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {loading && (
                                    <tr>
                                        <td colSpan={6} className="px-3 py-10 text-center text-slate-500">
                                            Loading...
                                        </td>
                                    </tr>
                                )}

                                {!loading && rows.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-3 py-10 text-center text-slate-500">
                                            No contacts found
                                        </td>
                                    </tr>
                                )}

                                {!loading &&
                                    rows.map((r, index) => {
                                        const statusLabel = r.status === 1 ? "Replied" : "Pending";
                                        const statusClass = r.status === 1
                                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                            : "bg-amber-50 text-amber-700 border-amber-200";

                                        return (
                                            <tr key={r.id} className="border-t hover:bg-slate-50/50">
                                                <td className="px-3 py-3 text-slate-500">
                                                    {(meta.from || 1) + index}
                                                </td>

                                                <td className="px-3 py-3 font-medium text-slate-900">
                                                    {r.full_name || "—"}
                                                </td>

                                                <td className="px-3 py-3 text-slate-600">
                                                    {r.email || "—"}
                                                </td>

                                                <td className="px-3 py-3">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusClass}`}>
                                                        {statusLabel}
                                                    </span>
                                                </td>

                                                <td className="px-3 py-3 text-slate-500 text-xs">
                                                    {formatDateShort(r.created_at)}
                                                </td>

                                                <td className="px-3 py-3 text-center">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            onClick={() => openReplyModal(r)}
                                                            className="p-2 rounded-lg text-indigo-600 hover:bg-indigo-50 border border-transparent hover:border-indigo-100 transition-all"
                                                            title="Reply"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                                                            </svg>
                                                        </button>

                                                        <button
                                                            onClick={() => openDetail(r)}
                                                            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all"
                                                            title="Details"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                            </svg>
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
                    <div className="p-4 border-t bg-slate-50/50 flex items-center justify-between">
                        <div className="text-sm font-Medium text-slate-500">
                            Showing page <span className="text-slate-900 font-Bold">{meta.current_page}</span> of{" "}
                            <span className="text-slate-900 font-Bold">{meta.last_page}</span>
                        </div>

                        <div className="flex gap-2">
                            <button
                                className="px-4 py-2 rounded-lg border bg-white text-sm font-medium hover:bg-slate-50 disabled:opacity-50"
                                disabled={meta.current_page <= 1 || loading}
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                            >
                                Prev
                            </button>
                            <button
                                className="px-4 py-2 rounded-lg border bg-white text-sm font-medium hover:bg-slate-50 disabled:opacity-50"
                                disabled={meta.current_page >= meta.last_page || loading}
                                onClick={() => setPage((p) => p + 1)}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Detail View */}
            {viewMode === "detail" && selectedContact && (
                <div className="flex flex-col h-[calc(100vh-160px)] bg-white rounded-2xl shadow-sm border overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center gap-4 px-6 py-4 border-b bg-white z-10">
                        <button
                            onClick={closeDetail}
                            className="p-2 -ml-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 leading-none">{selectedContact.full_name}</h2>
                            <div className="text-xs text-slate-500 font-medium mt-1">{selectedContact.email}</div>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
                        {loadingMessages ? (
                            <div className="flex items-center justify-center h-full text-slate-400 text-sm">Loading chat...</div>
                        ) : messages.length === 0 ? (
                            <div className="flex items-center justify-center h-full text-slate-400 text-sm italic">No messages found.</div>
                        ) : (
                            messages.map((msg) => {
                                const isAdmin = msg.status === 1; // 1 = Admin, 0 = User
                                return (
                                    <div key={msg.id} className={cn("flex flex-col max-w-[80%]", isAdmin ? "ml-auto items-end" : "mr-auto items-start")}>
                                        <span className="text-[10px] font-bold text-slate-400 mb-1 px-1">
                                            {isAdmin ? (msg.admin?.name || "Admin") : selectedContact.full_name}
                                        </span>
                                        <div
                                            className={cn(
                                                "px-4 py-3 text-sm shadow-sm break-words whitespace-pre-wrap",
                                                isAdmin
                                                    ? "bg-indigo-600 text-white rounded-2xl rounded-tr-sm"
                                                    : "bg-white border border-slate-200 text-slate-700 rounded-2xl rounded-tl-sm"
                                            )}
                                        >
                                            {msg.message}
                                        </div>
                                        <span className="text-[10px] text-slate-400 mt-1 px-1">
                                            {new Date(msg.created_at).toLocaleString([], {
                                                year: 'numeric', month: 'short', day: 'numeric',
                                                hour: '2-digit', minute: '2-digit'
                                            })}
                                        </span>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Reply Input Area (Quick Reply) */}
                    <div className="p-4 bg-white border-t">
                        <div className="relative flex gap-2">
                            <textarea
                                value={replyMessage}
                                onChange={e => setReplyMessage(e.target.value)}
                                placeholder="Type a message..."
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 resize-none h-[50px] min-h-[50px]"
                                style={{ paddingRight: '100px' }} // Space for button
                            />
                            <button
                                onClick={submitReply}
                                disabled={sendingReply || !replyMessage.trim()}
                                className="absolute right-2 top-1.5 bottom-1.5 px-4 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                            >
                                {sendingReply ? "..." : "Send"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reply Modal */}
            <Modal
                open={replyOpen}
                onClose={() => setReplyOpen(false)}
                title="Reply to Contact"
                subtitle={`Sending message to ${selectedContact?.full_name}`}
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Recipient</label>
                        <input
                            type="text"
                            value={selectedContact?.email || ""}
                            readOnly
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                        <textarea
                            rows={6}
                            value={replyMessage}
                            onChange={(e) => setReplyMessage(e.target.value)}
                            placeholder="Type your reply here..."
                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 resize-none"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => setReplyOpen(false)}
                            className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100"
                            disabled={sendingReply}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={submitReply}
                            className="px-4 py-2 rounded-xl text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-70 flex items-center gap-2"
                            disabled={sendingReply}
                        >
                            {sendingReply && (
                                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            )}
                            Send Message
                        </button>
                    </div>
                </div>
            </Modal>

            <CommonToast open={toast.open} type={toast.type} title={toast.title} message={toast.message} onClose={closeToast} />
        </AuthenticatedLayout>
    );
}