export function csrfToken() {
  return document.querySelector("meta[name='csrf-token']")?.content || "";
}

export async function apiFetch(url, options = {}) {
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