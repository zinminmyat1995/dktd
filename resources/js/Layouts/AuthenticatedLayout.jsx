import { useEffect, useMemo, useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import { menu } from "@/Layouts/menu.jsx";

export default function AuthenticatedLayout({
  header,
  children,

  // Optional (မသုံးလည်းရ)
  subtitle = "",
  headerActions = null, // JSX buttons (optional)
}) {
  const { auth } = usePage().props;

  // desktop collapsed (icon-only) state
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);

  // drawer state for small screens / zoomed-in
  const [drawerOpen, setDrawerOpen] = useState(false);

  // track desktop vs mobile using media query (zoom changes this too)
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window === "undefined") return true;
    return window.matchMedia("(min-width: 768px)").matches; // Tailwind md
  });

  // submenu open states: { "Users": true, "Settings": false }
  const [openGroups, setOpenGroups] = useState({});

  // ===== media query listener (auto hide/show) =====
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mq = window.matchMedia("(min-width: 768px)");

    const onChange = (e) => {
      setIsDesktop(e.matches);
      if (e.matches) setDrawerOpen(false);
    };

    setIsDesktop(mq.matches);

    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else mq.addListener(onChange);

    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", onChange);
      else mq.removeListener(onChange);
    };
  }, []);

  // ===== helpers =====
  const isRouteActive = (routeName) => {
    if (!routeName) return false;
    try {
      return route().current(routeName);
    } catch {
      return false;
    }
  };

  const findActiveGroups = useMemo(() => {
    const actives = {};
    for (const sec of menu) {
      for (const item of sec.items) {
        if (item.children?.length) {
          const anyChildActive = item.children.some((c) => isRouteActive(c.routeName));
          if (anyChildActive) actives[item.label] = true;
        }
      }
    }
    return actives;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setOpenGroups((prev) => ({ ...prev, ...findActiveGroups }));
  }, [findActiveGroups]);

  const toggleGroup = (label) => {
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  // ===== sidebar mode =====
  const sidebarExpanded = isDesktop ? !desktopCollapsed : true;

  return (
    // ✅ BODY background ကို ပို premium ဖြစ်အောင်
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-b from-slate-50 to-slate-100 font-sans admin-font">
        {/* ===== Topbar ===== */}
        <div className="sticky top-0 z-40 bg-[#4f46e5] border-b">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6">

            {/* Left Brand */}
            <div className="flex items-center gap-3 min-w-0">
            <button
                onClick={() => {
                if (isDesktop) setDesktopCollapsed((v) => !v);
                else setDrawerOpen(true);
                }}
                className="inline-flex items-center justify-center w-10 h-10 rounded-xl hover:bg-white/10"
                type="button"
                aria-label="Toggle sidebar"
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                    d="M4 6h16M4 12h16M4 18h16"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    style={{ color: "white" }}
                />
                </svg>
            </button>

            <Link href={route("dashboard")} className="flex items-center gap-2 min-w-0 text-white">
                <ApplicationLogo className="h-8 w-auto" />
                <div className="flex flex-col leading-tight">
                <span className="font-semibold truncate text-base">DKDT</span>
                <span className="text-xs text-white/70 hidden sm:block">Admin Panel</span>
                </div>
            </Link>
            </div>

            {/* Right User + Logout */}
            <div className="flex items-center gap-3">

            {/* ✅ User badge */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-full bg-white/10 hover:bg-white/15 transition">
                {/* Avatar circle */}
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                    d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    />
                    <path
                    d="M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    />
                </svg>
                </div>

                <div className="flex flex-col leading-tight max-w-[160px]">
                <span className="text-sm font-semibold text-white truncate">
                    {auth?.user?.name}
                </span>
                </div>
            </div>

            {/* ✅ Logout Button */}
            <Link
                href={route("logout")}
                method="post"
                as="button"
                title="Log out"
                className="
                    inline-flex items-center justify-center
                    w-11 h-11 rounded-full
                    bg-white/10 text-white
                    hover:bg-white/20
                    transition shadow-sm
                    ring-1 ring-white/20
                    hover:ring-white/40
                "
                >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                    d="M10 17l5-5-5-5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    />
                    <path
                    d="M15 12H3"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    />
                    <path
                    d="M21 21V3"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    />
                </svg>
            </Link>

            </div>

        </div>
        </div>


      {/* ===== Overlay (mobile drawer) ===== */}
      {!isDesktop && drawerOpen && (
        <div className="fixed inset-0 z-40 bg-black/30" onClick={() => setDrawerOpen(false)} />
      )}

      {/* ✅ ✅ ✅ Layout body (FIXED HEIGHT + ONLY BODY SCROLL) ✅ ✅ ✅ */}
      <div className="flex min-w-0 h-[calc(100vh-4rem)] overflow-hidden">
        {/* ===== Sidebar (NO LOGIC CHANGE, only height/scroll behavior) ===== */}
        <aside
          className={[
            "bg-white border-r transition-all duration-200 overflow-hidden",
            "h-full flex flex-col", // ✅ important: sidebar height fixed, not growing with content
            isDesktop ? (desktopCollapsed ? "w-20" : "w-72") : "fixed z-50 top-16 left-0 h-[calc(100vh-4rem)] w-72",
            !isDesktop ? (drawerOpen ? "translate-x-0" : "-translate-x-full") : "",
            !isDesktop ? "transform transition-transform duration-200" : "",
          ].join(" ")}
        >
          {/* Sidebar header */}
          <div className="px-4 pt-4 shrink-0">
            <div className="rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 border p-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border flex items-center justify-center">
                  <span className="font-bold text-gray-800">G</span>
                </div>

                {sidebarExpanded && (
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-gray-900 truncate">Welcome</div>
                    <div className="text-xs text-gray-600 truncate">{auth?.user?.email}</div>
                  </div>
                )}

                {!isDesktop && (
                  <button
                    type="button"
                    className="ml-auto w-9 h-9 rounded-xl hover:bg-white/70 flex items-center justify-center"
                    onClick={() => setDrawerOpen(false)}
                    aria-label="Close drawer"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ✅ Scrollable menu (only sidebar menu scroll) */}
          <div className="mt-4 px-3 pb-4 overflow-y-auto flex-1 min-h-0">
            {menu.map((sec) => (
              <div key={sec.section} className="mb-4">
                <div className="px-2 mb-2 text-[11px] font-semibold tracking-wider text-gray-500">
                  {sidebarExpanded ? sec.section : "•"}
                </div>

                <div className="space-y-1">
                  {sec.items.map((item) => {
                    const hasChildren = !!item.children?.length;

                    const active =
                      (item.routeName && isRouteActive(item.routeName)) ||
                      (hasChildren && item.children.some((c) => isRouteActive(c.routeName)));

                    if (!hasChildren) {
                      return (
                        <SidebarLink
                          key={item.label}
                          open={sidebarExpanded}
                          href={route(item.routeName)}
                          label={item.label}
                          icon={item.icon}
                          active={active}
                          onNavigate={() => !isDesktop && setDrawerOpen(false)}
                        />
                      );
                    }

                    const expanded = !!openGroups[item.label];

                    return (
                      <div key={item.label} className="rounded-xl">
                        <button
                          type="button"
                          onClick={() => toggleGroup(item.label)}
                          className={[
                            "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition",
                            active ? "bg-indigo-50 text-indigo-700" : "text-gray-700 hover:bg-gray-100",
                          ].join(" ")}
                        >
                          <span className="shrink-0">{item.icon}</span>

                          {sidebarExpanded && (
                            <>
                              <span className="font-medium flex-1 text-left">{item.label}</span>
                              <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                className={["transition-transform", expanded ? "rotate-180" : ""].join(" ")}
                              >
                                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                              </svg>
                            </>
                          )}
                        </button>

                        {sidebarExpanded && expanded && (
                          <div className="mt-1 ml-10 space-y-1">
                            {item.children.map((child) => {
                              const childActive = isRouteActive(child.routeName);
                              return (
                                <Link
                                  key={child.label}
                                  href={route(child.routeName)}
                                  onClick={() => !isDesktop && setDrawerOpen(false)}
                                  className={[
                                    "block px-3 py-2 rounded-xl text-sm transition",
                                    childActive
                                      ? "bg-indigo-50 text-indigo-700"
                                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                                  ].join(" ")}
                                >
                                  <div className="flex items-center gap-2 min-w-0">
                                    <span
                                      className={[
                                        "w-2 h-2 rounded-full",
                                        childActive ? "bg-indigo-600" : "bg-gray-300",
                                      ].join(" ")}
                                    />
                                    <span className="font-medium truncate">{child.label}</span>
                                  </div>
                                </Link>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* ✅ Main (ONLY main scroll, sidebar not affected) */}
        <main className="flex-1 min-w-0 h-full overflow-y-auto px-3 sm:px-4 lg:px-6 py-4">
          {/* container to keep nice width on large screens */}
          <div className="w-full min-w-0">
            {/* Page header area (premium) */}
            {(header || headerActions) && (
              <div className="mb-5 sm:mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div className="min-w-0">
                  {header &&
                    (typeof header === "string" ? (
                      <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight break-words">
                        {header}
                      </h1>
                    ) : (
                      <div>{header}</div>
                    ))}
                  {subtitle && <p className="mt-1 text-sm text-slate-600">{subtitle}</p>}
                </div>

                {headerActions && <div className="flex flex-wrap items-center gap-2">{headerActions}</div>}
              </div>
            )}

            {/* Content shell (reference style) */}
            <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="p-4 sm:p-6">
                {/* ✅ body only responsive scroll for wide content */}
                <div className="min-w-0 overflow-x-auto">{children}</div>
              </div>
            </div>

            <div className="h-8" />
          </div>
        </main>
      </div>
    </div>
  );
}

function SidebarLink({ open, href, label, icon, active, onNavigate }) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={[
        "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition",
        active ? "bg-indigo-50 text-indigo-700" : "text-gray-700 hover:bg-gray-100",
      ].join(" ")}
    >
      <span className="shrink-0">{icon}</span>
      {open && <span className="font-medium truncate">{label}</span>}
    </Link>
  );
}
