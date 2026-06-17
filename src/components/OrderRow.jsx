import { STATUS_CONFIG, orderTotal } from '../data/mockData'
import Badge from './ui/Badge'

const STATUS_BADGE = {
  pending: 'pending', preparing: 'preparing', ready: 'ready',
  delivered: 'delivered', cancelled: 'cancelled',
}

function timeAgo(ts) {
  const m = Math.floor((Date.now() - ts) / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  return `${Math.floor(m/60)}h ago`
}

export default function OrderRow({ order, vendorName, showCustomer, actionLabel, onAction, actionColor }) {
  const total = orderTotal(order)
  const items = order.items.map(i => `${i.name} ×${i.qty}`).join(', ')

  return (
    <div className="flex flex-wrap items-center gap-3 px-4 py-3.5 border-b border-dashed border-warm last:border-0 bg-chalk hover:bg-paper transition-colors">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-xs text-muted">{order.id}</span>
          <Badge variant={STATUS_BADGE[order.status]}>{order.status}</Badge>
        </div>
        <p className="text-sm text-ink mt-0.5 truncate">{items}</p>
        <p className="text-xs text-muted mt-0.5 font-mono">
          {vendorName && `${vendorName} · `}
          {showCustomer && `${order.studentName} · ${order.table} · `}
          {timeAgo(order.createdAt)}
        </p>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <span className="font-mono font-semibold text-sm">₹{total}</span>
        {actionLabel && (
          <button onClick={() => onAction(order)}
            className="px-3 py-1.5 text-xs font-semibold border-2 border-ink rounded-sm hover:bg-ink hover:text-paper transition-colors">
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  )
}
