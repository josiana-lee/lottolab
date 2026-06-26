export function ChartSkeleton({ title = true, height = 280 }: { title?: boolean; height?: number }) {
  return (
    <section className="rounded-[20px] border border-white/[0.07] bg-card p-7">
      {title && (
        <div className="mb-5 flex items-center justify-between gap-4">
          <div className="skeleton-shine h-5 w-44 rounded bg-white/[0.06]" />
          <div className="skeleton-shine h-3 w-20 rounded bg-white/[0.05]" />
        </div>
      )}
      <div className="flex items-end gap-2" style={{ height }}>
        {Array.from({ length: 15 }, (_, i) => (
          <div
            key={i}
            className="skeleton-shine flex-1 rounded-t bg-white/[0.055]"
            style={{ height: `${28 + ((i * 17) % 58)}%`, animationDelay: `${i * 0.04}s` }}
          />
        ))}
      </div>
    </section>
  )
}

export function PanelSkeleton() {
  return (
    <section className="grid gap-4 md:grid-cols-2">
      {Array.from({ length: 2 }, (_, panel) => (
        <div key={panel} className="rounded-[20px] border border-white/[0.07] bg-card px-7 py-[26px]">
          <div className="mb-5">
            <div className="skeleton-shine mb-2 h-4 w-28 rounded bg-white/[0.06]" />
            <div className="skeleton-shine h-3 w-40 rounded bg-white/[0.045]" />
          </div>
          <div className="space-y-[9px]">
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className="grid grid-cols-[34px_1fr_42px] items-center gap-2.5">
                <div className="skeleton-shine h-[34px] w-[34px] rounded-full bg-white/[0.06]" />
                <div className="h-[5px] overflow-hidden rounded-[3px] bg-white/[0.05]">
                  <div className="skeleton-shine h-full rounded-[3px] bg-white/[0.08]" style={{ width: `${42 + ((i * 13) % 55)}%` }} />
                </div>
                <div className="skeleton-shine h-3 rounded bg-white/[0.045]" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}

export function DistributionSkeleton() {
  return (
    <section className="grid gap-4 md:grid-cols-2">
      {Array.from({ length: 4 }, (_, i) => (
        <ChartSkeleton key={i} height={200} />
      ))}
    </section>
  )
}
