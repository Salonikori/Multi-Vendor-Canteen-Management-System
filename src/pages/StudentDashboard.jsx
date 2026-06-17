import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useOrderTracking } from '../hooks/useOrderTracking'
import * as api from '../services/api'
import { VENDORS, STATUS_CONFIG } from '../data/mockData'
import CanteenFloor from '../components/CanteenFloor'
import VendorCard from '../components/VendorCard'
import MenuItemCard from '../components/MenuItemCard'
import CartDrawer from '../components/CartDrawer'
import OrderRow from '../components/OrderRow'
import Pill from '../components/ui/Pill'
import Star from '../components/ui/Star'
import Spinner from '../components/ui/Spinner'

export default function StudentDashboard() {
  const { user } = useAuth()
  const { cart, addItem, decreaseItem, clearCart, totalItems, totalPrice } = useCart()
  const [searchParams, setSearchParams] = useSearchParams()

  const [selectedVendor, setSelectedVendor] = useState(null)
  const [menu, setMenu] = useState([])
  const [menuLoading, setMenuLoading] = useState(false)
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [showCart, setShowCart] = useState(searchParams.get('cart') === '1')
  const [placing, setPlacing] = useState(false)
  const [toast, setToast] = useState('')
  const [tab, setTab] = useState('browse') // 'browse' | 'orders'

  const { orders: myOrders, loading: ordersLoading } = useOrderTracking(
    () => api.getOrdersByStudent(user.id), 5000, [user.id]
  )

  useEffect(() => {
    if (searchParams.get('cart') === '1') {
      setShowCart(true)
      searchParams.delete('cart')
      setSearchParams(searchParams, { replace: true })
    }
  }, [])

  useEffect(() => {
    if (!selectedVendor) return
    setMenuLoading(true)
    api.getMenu(selectedVendor.id).then(items => {
      setMenu(items)
      setMenuLoading(false)
    })
  }, [selectedVendor])

  const cuisines = useMemo(() => ['All', ...new Set(VENDORS.map(v => v.cuisine))], [])
  const filteredVendors = VENDORS.filter(v =>
    (filter === 'All' || v.cuisine === filter) &&
    (!search || v.name.toLowerCase().includes(search.toLowerCase()))
  )

  const handlePlaceOrder = async () => {
    setPlacing(true)
    try {
      await api.createOrder({ studentId: user.id, studentName: user.name, items: cart, table: 'T-12' })
      clearCart()
      setShowCart(false)
      showToast('Order placed! Watch for updates below.')
    } catch (err) {
      showToast(err.message || 'Could not place order.')
    } finally { setPlacing(false) }
  }

  const showToast = msg => {
    setToast(msg)
    setTimeout(() => setToast(''), 3500)
  }

  const activeOrders = myOrders.filter(o => !['delivered','cancelled'].includes(o.status))
  const pastOrders   = myOrders.filter(o =>  ['delivered','cancelled'].includes(o.status))

  const menuByCategory = useMemo(() => {
    const cats = {}
    menu.forEach(item => {
      if (!cats[item.cat]) cats[item.cat] = []
      cats[item.cat].push(item)
    })
    return cats
  }, [menu])

  return (
    <div className="min-h-screen bg-paper">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[200] bg-ink text-paper px-5 py-3 text-sm font-medium rounded-sm border-2 border-ink shadow-harder animate-pop">
          {toast}
        </div>
      )}

      {showCart && <CartDrawer onClose={() => setShowCart(false)} onPlaceOrder={handlePlaceOrder} placing={placing} />}

      {/* Page header */}
      <div className="border-b-2 border-ink bg-chalk">
        <div className="max-w-6xl mx-auto px-4 py-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-mono text-muted uppercase tracking-widest mb-0.5">Welcome back</p>
            <h1 className="font-serif text-3xl text-ink">{user.name.split(' ')[0]}</h1>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setTab('browse')}
              className={`px-4 py-2 text-sm font-medium border-2 border-ink rounded-sm transition-all ${tab==='browse' ? 'bg-ink text-paper shadow-hard' : 'bg-transparent text-ink hover:bg-warm'}`}>
              Browse
            </button>
            <button onClick={() => setTab('orders')}
              className={`px-4 py-2 text-sm font-medium border-2 border-ink rounded-sm transition-all relative ${tab==='orders' ? 'bg-ink text-paper shadow-hard' : 'bg-transparent text-ink hover:bg-warm'}`}>
              My Orders
              {activeOrders.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-accent text-paper text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {activeOrders.length}
                </span>
              )}
            </button>
            <button onClick={() => setShowCart(true)}
              className={`px-4 py-2 text-sm font-medium border-2 rounded-sm transition-all ${
                totalItems > 0
                  ? 'border-accent bg-accent text-paper shadow-hard hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]'
                  : 'border-ink text-ink hover:bg-warm'
              }`}>
              Basket {totalItems > 0 && `(${totalItems})`}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-7">
        {/* ── BROWSE TAB ── */}
        {tab === 'browse' && !selectedVendor && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2">
                <CanteenFloor onSelectVendor={v => { setSelectedVendor(v); setTab('browse') }} />
              </div>

              {/* Quick stats sidebar */}
              <div className="space-y-3">
                <div className="border-2 border-ink rounded-sm bg-chalk p-4">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-muted mb-3">Your basket</p>
                  {cart.length === 0 ? (
                    <p className="text-sm text-muted">Nothing added yet.</p>
                  ) : (
                    <>
                      {cart.map(i => (
                        <div key={i.id} className="flex justify-between text-sm py-1 border-b border-dashed border-warm last:border-0">
                          <span className="text-ink truncate pr-2">{i.name} ×{i.qty}</span>
                          <span className="font-mono shrink-0">₹{i.price * i.qty}</span>
                        </div>
                      ))}
                      <div className="flex justify-between font-semibold text-sm pt-2 mt-1">
                        <span>Total</span>
                        <span className="font-mono">₹{totalPrice}</span>
                      </div>
                      <button onClick={() => setShowCart(true)}
                        className="w-full mt-3 py-2 text-xs font-semibold bg-ink text-paper border-2 border-ink rounded-sm shadow-hard hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all">
                        Checkout →
                      </button>
                    </>
                  )}
                </div>

                {activeOrders.length > 0 && (
                  <div className="border-2 border-ink rounded-sm bg-chalk p-4">
                    <p className="text-[10px] font-mono uppercase tracking-widest text-muted mb-3">Active orders</p>
                    {activeOrders.slice(0,3).map(o => {
                      const sc = STATUS_CONFIG[o.status]
                      return (
                        <div key={o.id} className="flex items-center justify-between py-1.5 border-b border-dashed border-warm last:border-0">
                          <span className="text-xs text-muted font-mono">{o.id}</span>
                          <span className="text-xs font-semibold" style={{ color: sc.color }}>{sc.label}</span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Search + filters */}
            <div className="flex flex-wrap gap-2 items-center mb-5">
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search vendors…"
                className="border-2 border-ink rounded-sm px-3 py-2 text-sm bg-chalk text-ink placeholder:text-muted/60 w-48" />
              <div className="flex gap-1.5 flex-wrap">
                {cuisines.map(c => <Pill key={c} active={filter===c} onClick={() => setFilter(c)}>{c}</Pill>)}
              </div>
            </div>

            {/* Vendor grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredVendors.map(v => (
                <VendorCard key={v.id} vendor={v} onClick={() => setSelectedVendor(v)} />
              ))}
              {filteredVendors.length === 0 && (
                <p className="col-span-3 py-10 text-center text-muted text-sm">No vendors match that search.</p>
              )}
            </div>
          </>
        )}

        {/* ── MENU VIEW ── */}
        {tab === 'browse' && selectedVendor && (
          <div>
            {/* Vendor hero */}
            <div className="border-2 border-ink rounded-sm bg-chalk mb-6 overflow-hidden">
              <div className="h-2" style={{ background: selectedVendor.color }} />
              <div className="p-5 flex flex-wrap items-start gap-4">
                <div className="text-5xl leading-none">{selectedVendor.emoji}</div>
                <div className="flex-1">
                  <h2 className="font-serif text-3xl text-ink">{selectedVendor.name}</h2>
                  <p className="text-sm text-muted mt-0.5">
                    {selectedVendor.cuisine} · Stall {selectedVendor.stall} · {selectedVendor.prepTime}
                  </p>
                  <div className="mt-2 flex items-center gap-3">
                    <Star value={selectedVendor.rating} />
                    <span className="text-xs text-muted font-mono">{selectedVendor.ordersToday} orders today</span>
                  </div>
                  <p className="text-xs text-muted mt-2">{selectedVendor.description}</p>
                </div>
                <button onClick={() => setSelectedVendor(null)}
                  className="border-2 border-ink px-4 py-2 text-sm rounded-sm hover:bg-ink hover:text-paper transition-colors">
                  ← All vendors
                </button>
              </div>
            </div>

            {!selectedVendor.open && (
              <div className="mb-5 border-2 border-amber/60 bg-amber/8 rounded-sm px-4 py-3 text-sm text-amber font-medium">
                This stall is currently closed. Browsing only — add to basket when they reopen.
              </div>
            )}

            {menuLoading ? <Spinner label="Loading menu…" /> : (
              <div className="border-2 border-ink rounded-sm bg-chalk overflow-hidden">
                {/* Menu board header */}
                <div className="bg-ink text-paper px-5 py-3 flex items-center justify-between">
                  <span className="font-serif text-lg">Menu</span>
                  <span className="font-mono text-xs text-paper/50">{menu.length} items</span>
                </div>

                <div className="divide-y-2 divide-ink">
                  {Object.entries(menuByCategory).map(([cat, items]) => (
                    <div key={cat}>
                      <div className="px-5 py-2 bg-warm/50">
                        <span className="text-[11px] font-mono uppercase tracking-widest text-muted">{cat}</span>
                      </div>
                      <div className="px-5">
                        {items.map(item => {
                          const cartItem = cart.find(c => c.id === item.id)
                          return (
                            <MenuItemCard key={item.id} item={item} vendor={selectedVendor}
                              qtyInCart={cartItem?.qty || 0}
                              onAdd={i => selectedVendor.open && addItem(i, selectedVendor)}
                              onRemove={i => decreaseItem(i.id)} />
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Floating basket button when items in cart */}
            {totalItems > 0 && (
              <div className="fixed bottom-6 right-6 z-40">
                <button onClick={() => setShowCart(true)}
                  className="bg-accent text-paper font-semibold text-sm px-5 py-3 border-2 border-ink rounded-sm shadow-harder hover:shadow-hard hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
                  View basket · ₹{totalPrice}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── ORDERS TAB ── */}
        {tab === 'orders' && (
          <div>
            {ordersLoading ? <Spinner label="Loading your orders…" /> : myOrders.length === 0 ? (
              <div className="text-center py-20 text-muted">
                <div className="text-5xl mb-4">🧾</div>
                <p className="text-sm">No orders yet.</p>
                <button onClick={() => setTab('browse')} className="mt-3 text-sm underline underline-offset-2 text-ink">Browse stalls →</button>
              </div>
            ) : (
              <>
                {activeOrders.length > 0 && (
                  <div className="mb-6">
                    <h2 className="font-serif text-xl text-ink mb-3">Active orders</h2>
                    <div className="border-2 border-ink rounded-sm bg-chalk overflow-hidden">
                      {activeOrders.map(o => {
                        const vendor = VENDORS.find(v => v.id === o.vendorId)
                        return <OrderRow key={o.id} order={o} vendorName={vendor?.name} />
                      })}
                    </div>
                  </div>
                )}

                {pastOrders.length > 0 && (
                  <div>
                    <h2 className="font-serif text-xl text-ink mb-3">Order history</h2>
                    <div className="border-2 border-ink rounded-sm bg-chalk overflow-hidden">
                      {pastOrders.slice(0,8).map(o => {
                        const vendor = VENDORS.find(v => v.id === o.vendorId)
                        return <OrderRow key={o.id} order={o} vendorName={vendor?.name} />
                      })}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
