import React from "react";
import { formatDateShort } from "@/lib/utils";

export default function PromotionCell({ start, end }) {
  if (!start && !end) return <span className="text-xs text-slate-400">—</span>;

  return (
    <div className="inline-flex flex-col gap-1 rounded-xl px-3 py-2">
      <div className="flex items-center gap-2">
        <span className="text-[12px] font-semibold text-indigo-600 uppercase">Start</span>
        <span className="text-xs font-medium text-slate-900">{formatDateShort(start)}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[12px] font-semibold text-rose-600 uppercase">End</span>
        <span className="text-xs font-medium text-slate-900">{formatDateShort(end)}</span>
      </div>
    </div>
  );
}
