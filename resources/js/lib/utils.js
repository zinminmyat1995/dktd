export function cn(...xs) {
  return xs.filter(Boolean).join(" ");
}

export function buildQuery(params) {
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === null || v === undefined || v === "") return;
    usp.set(k, String(v));
  });
  return usp.toString();
}

export function toPublicUrl(path) {
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

export function formatDateShort(dateStr) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "-";

  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();

  return `${dd}-${mm}-${yyyy}`;
}

export function toDateInputValue(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}
