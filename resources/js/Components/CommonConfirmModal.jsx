export default function CommonConfirmModal({
  open,
  title = "Confirm",
  message = "Are you sure?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  danger = false,
  loading = false, // ✅ NEW
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => {
          if (!loading) onCancel?.();
        }}
      />

      <div className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white shadow-xl overflow-hidden">
        <div className="p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <div
              className={[
                "mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl",
                danger ? "bg-red-50 text-red-700" : "bg-indigo-50 text-indigo-700",
              ].join(" ")}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 9v4m0 4h.01M10.3 4.7 2.6 18a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.7 4.7a2 2 0 0 0-3.4 0Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div className="min-w-0 flex-1">
              <div className="text-base font-semibold text-slate-900">{title}</div>
              <div className="mt-1 text-sm text-slate-600">{message}</div>
            </div>
          </div>

          <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            {/* Cancel */}
            <button
              type="button"
              disabled={loading}
              onClick={onCancel}
              className={[
                "rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50",
                loading ? "opacity-60 cursor-not-allowed hover:bg-white" : "",
              ].join(" ")}
            >
              {cancelText}
            </button>

            {/* Confirm */}
            <button
              type="button"
              disabled={loading}
              onClick={() => {
                if (!loading) onConfirm?.();
              }}
              className={[
                "rounded-xl px-4 py-2.5 text-sm font-semibold text-white flex items-center justify-center gap-2 min-w-[120px]",
                danger ? "bg-red-600 hover:bg-red-700" : "bg-indigo-600 hover:bg-indigo-700",
                loading ? "opacity-80 cursor-not-allowed" : "",
              ].join(" ")}
            >
              {loading ? (
                <>
                  {/* ✅ Spinner */}
                  <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                confirmText
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
