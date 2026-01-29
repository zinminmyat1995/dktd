import React from "react";

export function NewBadge({ value }) {
  const isNew = Boolean(value);
  if (!isNew) return null;

  return (
    <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 border bg-emerald-50 text-emerald-700 border-emerald-200">
      <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
      <span className="text-[11px] font-bold leading-none tracking-wide">NEW</span>
    </span>
  );
}

export function HomeBadge({ value }) {
  const onHome = Boolean(value);
  if (!onHome) return <span className="text-xs text-slate-400">—</span>;

  return (
    <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 border bg-amber-50 text-amber-800 border-amber-200">
      <span className="inline-block w-2 h-2 rounded-full bg-amber-500" />
      <span className="text-[11px] font-extrabold tracking-wide">HOME</span>
    </span>
  );
}
