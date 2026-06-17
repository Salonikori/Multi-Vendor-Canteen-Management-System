import { useState, useEffect } from 'react'
import { VENDORS } from '../data/mockData'

export default function CanteenFloor({ onSelectVendor }) {
  const [active, setActive] = useState(null)

  useEffect(() => {
    const iv = setInterval(() => {
      const v = VENDORS[Math.floor(Math.random() * VENDORS.length)]
      setActive(v.id)
      setTimeout(() => setActive(null), 1200)
    }, 2200)
    return () => clearInterval(iv)
  }, [])

  // Stall grid — 3 columns, 2 rows
  const layout = [
    [1, 4, null],
    [6, 2, null],
    [3, null, 5],
  ]

  return (
    <div className="border-2 border-ink rounded-sm p-5 bg-chalk shadow-hard">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-serif text-xl text-ink">Floor Plan</h2>
        <span className="text-[11px] font-mono text-muted tracking-widest uppercase">Live · Today</span>
      </div>

      {/* Floor grid */}
      <div className="grid grid-cols-3 gap-2">
        {layout.flat().map((vendorId, i) => {
          if (!vendorId) return (
            <div key={`e${i}`} className="border border-dashed border-warm rounded-sm h-20 flex items-center justify-center">
              <span className="text-[10px] text-warm uppercase tracking-widest">Aisle</span>
            </div>
          )
          const v = VENDORS.find(vv => vv.id === vendorId)
          const isActive = active === vendorId
          return (
            <button key={vendorId} onClick={() => onSelectVendor?.(v)}
              className={`relative h-20 border-2 rounded-sm text-left px-3 py-2 transition-all duration-200 ${
                isActive
                  ? 'border-accent bg-accent/5 shadow-hard'
                  : v.open
                    ? 'border-ink bg-paper hover:shadow-hard hover:-translate-x-px hover:-translate-y-px'
                    : 'border-warm bg-warm/30 opacity-60'
              }`}>
              <div className="text-xl leading-none mb-1">{v.emoji}</div>
              <div className="text-[12px] font-semibold text-ink leading-tight">{v.name}</div>
              <div className="text-[10px] text-muted font-mono">Stall {v.stall}</div>
              {!v.open && <div className="absolute top-1.5 right-2 text-[9px] uppercase tracking-widest text-muted">closed</div>}
              {isActive && <div className="absolute top-1.5 right-2 w-2 h-2 rounded-full bg-accent animate-ping" />}
            </button>
          )
        })}
      </div>

      <p className="text-[11px] text-muted mt-3 font-mono">Click any stall to jump to its menu</p>
    </div>
  )
}
