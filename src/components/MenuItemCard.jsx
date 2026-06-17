// Menu-board style row, not a card grid
export default function MenuItemCard({ item, vendor, qtyInCart, onAdd, onRemove }) {
  return (
    <div className={`flex items-center gap-3 py-3.5 border-b border-dashed border-warm last:border-0 group ${!vendor.open ? 'opacity-50 pointer-events-none' : ''}`}>
      {item.popular && (
        <span className="shrink-0 w-1 h-full min-h-[36px] rounded-full" style={{ background: vendor.color }} />
      )}
      {!item.popular && <span className="shrink-0 w-1" />}

      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="font-medium text-ink">{item.name}</span>
          {item.popular && (
            <span className="text-[10px] font-mono uppercase tracking-wide text-muted">popular</span>
          )}
        </div>
        <p className="text-xs text-muted mt-0.5 truncate">{item.desc}</p>
      </div>

      {/* Dot leader */}
      <div className="menu-leader hidden sm:block" />

      <div className="flex items-center gap-3 shrink-0">
        <span className="font-mono font-semibold text-ink text-sm">₹{item.price}</span>

        {qtyInCart > 0 ? (
          <div className="flex items-center border border-ink rounded-sm overflow-hidden">
            <button onClick={() => onRemove(item)}
              className="px-2 py-1 text-sm font-bold text-ink hover:bg-ink hover:text-paper transition-colors">−</button>
            <span className="px-2 text-sm font-mono border-x border-ink">{qtyInCart}</span>
            <button onClick={() => onAdd(item)}
              className="px-2 py-1 text-sm font-bold text-ink hover:bg-ink hover:text-paper transition-colors">+</button>
          </div>
        ) : (
          <button onClick={() => onAdd(item)}
            className="px-3 py-1 text-xs font-semibold border-2 border-ink rounded-sm text-ink hover:bg-ink hover:text-paper transition-colors">
            Add
          </button>
        )}
      </div>
    </div>
  )
}
