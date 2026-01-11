import { useEffect, useMemo } from "react";

export default function CommonToast({
  open,
  type = "success", // ✅ success | error | warning
  title,
  message,
  onClose,
}) {
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => onClose?.(), 2500);
    return () => clearTimeout(t);
  }, [open, onClose]);

  // ✅ default title by type (if title not provided)
  const computedTitle = useMemo(() => {
    if (title) return title;
    if (type === "error") return "Error";
    if (type === "warning") return "Warning";
    return "Success";
  }, [title, type]);

  const theme = useMemo(() => {
    if (type === "error") {
      return {
        border: "border-rose-200",
        bar: "bg-rose-600",
        iconWrap: "bg-rose-50 text-rose-700",
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 9v4m0 4h.01M10.3 4.5h3.4L21 20H3L10.3 4.5Z"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ),
      };
    }

    if (type === "warning") {
      return {
        border: "border-amber-200",
        bar: "bg-amber-500",
        iconWrap: "bg-amber-50 text-amber-800",
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 9v4m0 4h.01M10.3 4.5h3.4L21 20H3L10.3 4.5Z"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ),
      };
    }

    // ✅ success default
    return {
      border: "border-emerald-200",
      bar: "bg-emerald-600",
      iconWrap: "bg-emerald-50 text-emerald-700",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M20 6 9 17l-5-5"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    };
  }, [type]);

  if (!open) return null;

  return (
    <div className="fixed top-20 right-4  z-[9999] w-[92vw] max-w-sm">
      <div
        className={`rounded-2xl border bg-white shadow-lg overflow-hidden ${theme.border}`}
        role="status"
        aria-live="polite"
      >
        <div className={`h-1.5 ${theme.bar}`} />
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div
              className={`mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl ${theme.iconWrap}`}
            >
              {theme.icon}
            </div>

            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-slate-900">
                {computedTitle}
              </div>

              <div className="mt-0.5 text-sm text-slate-600 break-words whitespace-pre-line">
                {message}
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="ml-2 inline-flex h-9 w-9 items-center justify-center rounded-xl hover:bg-slate-100"
              aria-label="Close"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
