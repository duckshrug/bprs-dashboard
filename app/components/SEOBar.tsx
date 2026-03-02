'use client'

export default function SEOBar({ done, total, label, color }: { done: number; total: number; label: string; color: string }) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0
  return (
    <div className="flex items-center gap-2 min-w-0">
      <span className="text-[10px] text-gray-500 w-6 shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-[10px] text-gray-400 w-8 text-right shrink-0">{done}/{total}</span>
    </div>
  )
}
