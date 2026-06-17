import Star from './ui/Star'

export default function VendorCard({ vendor, onClick }) {
  return (
    <button onClick={onClick}
      className={`group text-left border-2 border-ink rounded-sm p-0 overflow-hidden bg-chalk transition-all hover:shadow-harder hover:-translate-x-0.5 hover:-translate-y-0.5 ${!vendor.open ? 'opacity-55' : ''}`}>

      {/* Color band */}
      <div className="h-1.5 w-full" style={{ background: vendor.color }} />

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="text-4xl leading-none">{vendor.emoji}</div>
          <span className={`text-[10px] font-mono uppercase tracking-widest px-1.5 py-0.5 border rounded-sm ${
            vendor.open ? 'border-sage text-sage' : 'border-muted text-muted'
          }`}>
            {vendor.open ? 'Open' : 'Closed'}
          </span>
        </div>

        <h3 className="font-serif text-xl text-ink leading-tight mb-0.5">{vendor.name}</h3>
        <p className="text-xs text-muted mb-3">{vendor.cuisine} · Stall {vendor.stall}</p>

        <Star value={vendor.rating} />

        <div className="mt-3 pt-3 border-t border-warm flex justify-between text-xs text-muted">
          <span className="font-mono">{vendor.ordersToday} orders</span>
          <span>{vendor.prepTime}</span>
        </div>
      </div>
    </button>
  )
}
