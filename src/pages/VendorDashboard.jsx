import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useOrderTracking } from '../hooks/useOrderTracking'
import * as api from '../services/api'
import { STATUS_FLOW, STATUS_CONFIG, orderTotal } from '../data/mockData'
import Badge from '../components/ui/Badge'
import Pill from '../components/ui/Pill'
import OrderRow from '../components/OrderRow'
import Spinner from '../components/ui/Spinner'

const STATUS_BADGE_MAP = { pending:'pending', preparing:'preparing', ready:'ready', delivered:'delivered', cancelled:'cancelled' }

export default function VendorDashboard() {
  const { user } = useAuth()
  const [vendor, setVendor] = useState(null)
  const [menu, setMenu] = useState([])
  const [tab, setTab] = useState('queue')
  const [toggling, setToggling] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newItem, setNewItem] = useState({ name:'', price:'', cat:'', desc:'' })
  const [toast, setToast] = useState('')

  const { orders, loading } = useOrderTracking(
    () => api.getOrdersByVendor(user.vendorId), 5000, [user.vendorId]
  )

  useEffect(() => {
    api.getVendor(user.vendorId).then(setVendor)
    api.getMenu(user.vendorId).then(setMenu)
  }, [user.vendorId])

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const toggleOpen = async () => {
    setToggling(true)
    const updated = await api.setVendorOpen(vendor.id, !vendor.open)
    setVendor(updated)
    setToggling(false)
    showToast(updated.open ? 'Stall is now open.' : 'Stall marked as closed.')
  }

  const advance = async order => {
    const idx = STATUS_FLOW.indexOf(order.status)
    const next = STATUS_FLOW[idx + 1]
    if (!next) return
    await api.updateOrderStatus(order.id, next)
    showToast(`${order.id} → ${STATUS_CONFIG[next].label}`)
  }

  if (!vendor) return <Spinner label="Loading dashboard…" />

  const queueOrders  = orders.filter(o => !['delivered','cancelled'].includes(o.status))
  const doneOrders   = orders.filter(o =>  ['delivered','cancelled'].includes(o.status))
  const todayRevenue = orders.reduce((s, o) => s + orderTotal(o), 0)

  return (
    <div className="min-h-screen bg-paper">
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[200] bg-ink text-paper px-5 py-3 text-sm font-medium rounded-sm border-2 border-ink shadow-harder animate-pop">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="border-b-2 border-ink bg-chalk">
        <div className="max-w-5xl mx-auto px-4 py-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="text-5xl leading-none">{vendor.emoji}</div>
              <div>
                <h1 className="font-serif text-3xl text-ink">{vendor.name}</h1>
                <p className="text-sm text-muted mt-0.5">
                  {vendor.cuisine} · Stall {vendor.stall} · {vendor.prepTime}
                </p>
                <div className="mt-2">
                  <Badge variant={vendor.open ? 'open' : 'closed'}>
                    {vendor.open ? '● Open' : '○ Closed'}
                  </Badge>
                </div>
              </div>
            </div>
            <button onClick={toggleOpen} disabled={toggling}
              className={`px-5 py-2.5 text-sm font-semibold border-2 border-ink rounded-sm transition-all shadow-hard hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] ${
                vendor.open ? 'bg-paper text-ink' : 'bg-sage text-chalk'
              }`}>
              {toggling ? 'Updating…' : vendor.open ? 'Mark closed' : 'Open stall'}
            </button>
          </div>

          {/* Stats row */}
          <div className="mt-5 grid grid-cols-3 gap-3 max-w-sm">
            {[
              { label: 'Revenue', val: `₹${todayRevenue}` },
              { label: 'In queue', val: queueOrders.length },
              { label: 'Done', val: doneOrders.length },
            ].map(s => (
              <div key={s.label} className="border-2 border-ink rounded-sm bg-paper px-3 py-2.5 text-center">
                <div className="font-mono font-bold text-lg text-ink">{s.val}</div>
                <div className="text-[10px] text-muted uppercase tracking-widest font-mono mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-5xl mx-auto px-4 flex gap-0 border-t-2 border-ink">
          {[['queue','Order Queue'],['history','History'],['menu','Menu']].map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)}
              className={`px-5 py-2.5 text-sm font-medium border-r-2 border-ink last:border-r-0 transition-colors ${
                tab === id ? 'bg-ink text-paper' : 'bg-chalk text-ink hover:bg-warm'
              }`}>
              {label}
              {id === 'queue' && queueOrders.length > 0 && (
                <span className="ml-2 bg-accent text-paper text-[10px] font-bold px-1.5 py-0.5 rounded-sm">{queueOrders.length}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-7">

        {/* ── QUEUE ── */}
        {tab === 'queue' && (
          loading ? <Spinner label="Loading orders…" /> :
          queueOrders.length === 0 ? (
            <div className="text-center py-20 text-muted">
              <div className="text-5xl mb-4">✓</div>
              <p className="text-sm">Queue is clear. Nice work.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {/* Kanban-style columns on desktop */}
              <div className="hidden md:grid grid-cols-3 gap-4">
                {['pending','preparing','ready'].map(status => {
                  const cols = queueOrders.filter(o => o.status === status)
                  const sc = STATUS_CONFIG[status]
                  return (
                    <div key={status} className="border-2 border-ink rounded-sm bg-chalk overflow-hidden">
                      <div className="px-4 py-2 border-b-2 border-ink flex items-center justify-between" style={{ background: `${sc.color}18` }}>
                        <span className="text-xs font-mono uppercase tracking-widest font-semibold" style={{ color: sc.color }}>{sc.label}</span>
                        <span className="text-xs font-mono text-muted">{cols.length}</span>
                      </div>
                      <div className="p-2 space-y-2 min-h-[120px]">
                        {cols.map(o => {
                          const idx = STATUS_FLOW.indexOf(o.status)
                          const next = STATUS_FLOW[idx + 1]
                          const nextSc = next ? STATUS_CONFIG[next] : null
                          return (
                            <div key={o.id} className="bg-paper border-2 border-ink rounded-sm p-3">
                              <div className="flex justify-between items-start mb-1">
                                <span className="font-mono text-xs text-muted">{o.id}</span>
                                <span className="font-mono text-xs font-semibold text-ink">₹{orderTotal(o)}</span>
                              </div>
                              <p className="text-xs text-ink mb-0.5">{o.items.map(i=>`${i.name} ×${i.qty}`).join(', ')}</p>
                              <p className="text-[11px] text-muted font-mono">{o.studentName} · {o.table}</p>
                              {next && (
                                <button onClick={() => advance(o)}
                                  className="mt-2 w-full text-[11px] font-semibold py-1.5 border-2 border-ink rounded-sm hover:bg-ink hover:text-paper transition-colors">
                                  → {nextSc.label}
                                </button>
                              )}
                            </div>
                          )
                        })}
                        {cols.length === 0 && (
                          <div className="h-20 flex items-center justify-center">
                            <span className="text-xs text-muted">Empty</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Mobile list */}
              <div className="md:hidden border-2 border-ink rounded-sm bg-chalk overflow-hidden">
                {queueOrders.map(o => {
                  const idx = STATUS_FLOW.indexOf(o.status)
                  const next = STATUS_FLOW[idx + 1]
                  const nextSc = next ? STATUS_CONFIG[next] : null
                  return (
                    <OrderRow key={o.id} order={o} showCustomer
                      actionLabel={next ? `→ ${nextSc.label}` : undefined}
                      onAction={advance} />
                  )
                })}
              </div>
            </div>
          )
        )}

        {/* ── HISTORY ── */}
        {tab === 'history' && (
          doneOrders.length === 0 ? (
            <p className="text-center text-muted py-12 text-sm">No completed orders yet.</p>
          ) : (
            <div className="border-2 border-ink rounded-sm bg-chalk overflow-hidden">
              {doneOrders.map(o => <OrderRow key={o.id} order={o} showCustomer />)}
            </div>
          )
        )}

        {/* ── MENU ── */}
        {tab === 'menu' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-serif text-xl text-ink">Menu items</h2>
              <button onClick={() => setShowAddForm(p => !p)}
                className="px-4 py-2 text-sm font-semibold bg-ink text-paper border-2 border-ink rounded-sm shadow-hard hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all">
                + Add item
              </button>
            </div>

            {/* Add item form */}
            {showAddForm && (
              <div className="border-2 border-ink rounded-sm bg-chalk p-5 mb-5">
                <h3 className="font-serif text-lg mb-4">New menu item</h3>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  {[['Name','name','text'],['Price (₹)','price','number'],['Category','cat','text'],['Description','desc','text']].map(([label, key, type]) => (
                    <div key={key} className={key === 'desc' ? 'col-span-2' : ''}>
                      <label className="block text-[11px] font-mono uppercase tracking-widest text-muted mb-1">{label}</label>
                      <input type={type} value={newItem[key]}
                        onChange={e => setNewItem(p => ({ ...p, [key]: e.target.value }))}
                        className="w-full border-2 border-ink rounded-sm px-3 py-2 text-sm bg-paper text-ink placeholder:text-muted/50" />
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => {
                    if (!newItem.name || !newItem.price) return
                    setMenu(prev => [...prev, { id: Date.now(), ...newItem, price: Number(newItem.price) }])
                    setNewItem({ name:'', price:'', cat:'', desc:'' })
                    setShowAddForm(false)
                    showToast('Item added.')
                  }} className="px-4 py-2 text-sm font-semibold bg-ink text-paper border-2 border-ink rounded-sm">
                    Save item
                  </button>
                  <button onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 text-sm border-2 border-ink rounded-sm hover:bg-warm">Cancel</button>
                </div>
              </div>
            )}

            <div className="border-2 border-ink rounded-sm bg-chalk overflow-hidden">
              <div className="grid grid-cols-3 bg-ink text-paper text-[11px] font-mono uppercase tracking-widest px-4 py-2">
                <span>Item</span>
                <span className="text-center">Category</span>
                <span className="text-right">Price</span>
              </div>
              {menu.map((item, i) => (
                <div key={item.id}
                  className="grid grid-cols-3 px-4 py-3.5 border-t border-dashed border-warm items-center hover:bg-paper transition-colors">
                  <div>
                    <div className="text-sm font-medium text-ink">{item.name}</div>
                    <div className="text-xs text-muted mt-0.5">{item.desc}</div>
                  </div>
                  <div className="text-xs text-muted font-mono text-center">{item.cat}</div>
                  <div className="flex items-center justify-end gap-3">
                    <span className="font-mono text-sm font-semibold">₹{item.price}</span>
                    <button onClick={() => setMenu(prev => prev.filter((_, j) => j !== i))}
                      className="text-xs text-muted hover:text-accent underline underline-offset-2">Remove</button>
                  </div>
                </div>
              ))}
              {menu.length === 0 && (
                <p className="text-center text-sm text-muted py-8">No items yet. Add one above.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
