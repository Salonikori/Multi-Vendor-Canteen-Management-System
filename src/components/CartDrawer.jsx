import { useCart } from '../context/CartContext'

export default function CartDrawer({ onClose, onPlaceOrder, placing }) {
  const { cart, addItem, decreaseItem, totalPrice } = useCart()
  const totalQty = cart.reduce((s, i) => s + i.qty, 0)

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <div className="absolute inset-0 bg-ink/40" onClick={onClose} />

      <div className="relative flex flex-col h-full w-full max-w-sm bg-chalk border-l-2 border-ink animate-slide">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b-2 border-ink bg-paper">
          <div>
            <h2 className="font-serif text-2xl text-ink">Your Basket</h2>
            <p className="text-xs text-muted font-mono mt-0.5">{totalQty} item{totalQty !== 1 ? 's' : ''}</p>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 border-2 border-ink rounded-sm flex items-center justify-center font-bold text-ink hover:bg-ink hover:text-paper transition-colors text-sm">
            ✕
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {cart.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">🧺</div>
              <p className="text-muted text-sm">Nothing here yet.</p>
              <p className="text-muted text-xs mt-1">Pick something from the menu!</p>
            </div>
          ) : (
            <div className="space-y-0">
              {cart.map(item => (
                <div key={item.id} className="flex items-center justify-between py-3.5 border-b border-dashed border-warm last:border-0">
                  <div className="flex-1 min-w-0 pr-3">
                    <div className="text-sm font-medium text-ink">{item.name}</div>
                    <div className="text-xs text-muted font-mono mt-0.5">{item.vendorName}</div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="flex items-center border border-ink rounded-sm overflow-hidden">
                      <button onClick={() => decreaseItem(item.id)}
                        className="px-2 py-0.5 text-sm font-bold hover:bg-ink hover:text-paper transition-colors">−</button>
                      <span className="px-2 text-sm font-mono border-x border-ink">{item.qty}</span>
                      <button onClick={() => addItem(item, { id: item.vendorId, name: item.vendorName, color: item.vendorColor })}
                        className="px-2 py-0.5 text-sm font-bold hover:bg-ink hover:text-paper transition-colors">+</button>
                    </div>
                    <span className="font-mono text-sm font-semibold w-14 text-right">₹{item.price * item.qty}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Checkout ticket */}
        {cart.length > 0 && (
          <div className="border-t-2 border-ink px-5 py-4 bg-paper">
            {/* Ticket divider */}
            <div className="ticket mx-2 mb-4 px-4 py-3 bg-chalk">
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-xs text-muted uppercase tracking-widest font-mono">Subtotal</span>
                <span className="font-mono font-semibold">₹{totalPrice}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-muted uppercase tracking-widest font-mono">Service</span>
                <span className="font-mono text-sm text-muted">Free</span>
              </div>
              <div className="border-t border-dashed border-warm mt-2 pt-2 flex justify-between items-baseline">
                <span className="font-serif text-lg">Total</span>
                <span className="font-mono font-bold text-xl">₹{totalPrice}</span>
              </div>
            </div>

            <button onClick={onPlaceOrder} disabled={placing}
              className="w-full bg-accent text-paper py-3.5 text-sm font-bold border-2 border-ink shadow-hard hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all rounded-sm disabled:opacity-60">
              {placing ? 'Placing order…' : 'Place Order →'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
