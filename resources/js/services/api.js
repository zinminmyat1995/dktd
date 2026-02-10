function getCookie(name) {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(name + "="))
    ?.split("=")[1];
}

export async function apiFetch(url, options = {}) {
  const method = (options.method || "GET").toUpperCase();

  const headers = {
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
    ...(options.headers || {}),
  };

  // ✅ Use XSRF cookie (avoid stale meta csrf-token issue)
  if (method !== "GET") {
    const xsrf = getCookie("XSRF-TOKEN");
    if (xsrf) headers["X-XSRF-TOKEN"] = decodeURIComponent(xsrf);

    // ❌ Don't send meta-based token (stale after login/session regenerate)
    // headers["X-CSRF-TOKEN"] = csrfToken();
  }

  // If body is NOT FormData, and not already set, default to JSON
  if (options.body && !(options.body instanceof FormData) && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
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
export function extract422Errors(err) {
  const errors = err?.data?.errors;
  if (!errors) return {};
  const out = {};
  for (const k of Object.keys(errors))
    out[k] = errors[k]?.[0] ?? String(errors[k]);
  return out;
}