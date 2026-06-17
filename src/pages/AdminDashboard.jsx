import { useState } from 'react'
import { useOrderTracking } from '../hooks/useOrderTracking'
import * as api from '../services/api'
import { VENDORS, STATUS_CONFIG, orderTotal } from '../data/mockData'
import Badge from '../components/ui/Badge'
import Star from '../components/ui/Star'
import Pill from '../components/ui/Pill'
import OrderRow from '../components/OrderRow'
import CanteenFloor from '../components/CanteenFloor'
import Spinner from '../components/ui/Spinner'
import LiveDot from '../components/ui/LiveDot'

export default function AdminDashboard() {
  const [tab, setTab] = useState('overview')
  const { orders, loading } = useOrderTracking(() => api.getAllOrders(), 5000)

  const totalRevenue = orders.reduce((s, o) => s + orderTotal(o), 0)
  const activeVendors = VENDORS.filter(v => v.open).length
  const avgRating = (VENDORS.reduce((s,v) => s + v.rating, 0) / VENDORS.length).toFixed(1)

  const revenueByVendor = VENDORS.map(v => ({
    ...v,
    revenue: orders.filter(o => o.vendorId === v.id).reduce((s,o) => s + orderTotal(o), 0),
    orderCount: orders.filter(o => o.vendorId === v.id).length,
  })).sort((a, b) => b.revenue - a.revenue)

  const maxRevenue = Math.max(...revenueByVendor.map(v => v.revenue), 1)

  const ordersByStatus = Object.fromEntries(
    Object.keys(STATUS_CONFIG).map(s => [s, orders.filter(o => o.status === s).length])
  )

  return (
    <div className="min-h-screen bg-paper">
      {/* Header */}
      <div className="border-b-2 border-ink bg-chalk">
        <div className="max-w-6xl mx-auto px-4 py-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-widest text-muted mb-0.5">System Administrator</p>
              <h1 className="font-serif text-3xl text-ink">Dashboard</h1>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted font-mono">
              <LiveDot />
              Live data
            </div>
          </div>

          {/* KPI strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { label:'Total revenue', val:`₹${totalRevenue}`, sub:'today' },
              { label:'Active stalls', val:`${activeVendors} / ${VENDORS.length}`, sub:'open now' },
              { label:'Total orders', val:orders.length, sub:'all time today' },
              { label:'Avg rating', val:avgRating, sub:'across all stalls' },
            ].map(k => (
              <div key={k.label} className="border-2 border-ink rounded-sm bg-paper px-4 py-3">
                <div className="font-mono font-bold text-2xl text-ink">{k.val}</div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-muted mt-1">{k.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-6xl mx-auto px-4 flex border-t-2 border-ink">
          {[['overview','Overview'],['vendors','Vendors'],['orders','Orders']].map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)}
              className={`px-5 py-2.5 text-sm font-medium border-r-2 border-ink last:border-r-0 transition-colors ${
                tab === id ? 'bg-ink text-paper' : 'bg-chalk text-ink hover:bg-warm'
              }`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-7">

        {/* ── OVERVIEW ── */}
        {tab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 space-y-5">
              {/* Revenue chart */}
              <div className="border-2 border-ink rounded-sm bg-chalk overflow-hidden">
                <div className="bg-ink text-paper px-5 py-3 flex items-center justify-between">
                  <span className="font-serif text-lg">Revenue breakdown</span>
                  <span className="font-mono text-xs text-paper/40">Today</span>
                </div>
                <div className="p-5 space-y-3">
                  {loading ? <Spinner label="Loading…" /> : revenueByVendor.map(v => (
                    <div key={v.id} className="flex items-center gap-3">
                      <div className="w-6 text-base shrink-0">{v.emoji}</div>
                      <div className="w-28 shrink-0">
                        <div className="text-xs font-medium text-ink truncate">{v.name}</div>
                        <div className="text-[10px] text-muted font-mono">{v.orderCount} orders</div>
                      </div>
                      <div className="flex-1 bg-warm rounded-none h-4 border border-ink/20 overflow-hidden">
                        <div className="h-full transition-all duration-700 border-r border-ink/20"
                          style={{ width:`${(v.revenue/maxRevenue)*100}%`, background: v.color }} />
                      </div>
                      <div className="w-16 text-right font-mono text-sm font-semibold shrink-0">
                        ₹{v.revenue}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order status breakdown */}
              <div className="border-2 border-ink rounded-sm bg-chalk overflow-hidden">
                <div className="bg-ink text-paper px-5 py-3">
                  <span className="font-serif text-lg">Order status</span>
                </div>
                <div className="grid grid-cols-4 divide-x-2 divide-ink">
                  {Object.entries(STATUS_CONFIG).map(([status, sc]) => (
                    <div key={status} className="px-4 py-4 text-center">
                      <div className="font-mono text-2xl font-bold text-ink">{ordersByStatus[status] || 0}</div>
                      <div className="text-[10px] font-mono uppercase tracking-widest mt-1" style={{ color: sc.color }}>
                        {sc.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right col */}
            <div className="space-y-5">
              <CanteenFloor onSelectVendor={() => {}} />

              {/* Top performers */}
              <div className="border-2 border-ink rounded-sm bg-chalk overflow-hidden">
                <div className="bg-ink text-paper px-4 py-2.5">
                  <span className="font-mono text-xs uppercase tracking-widest">Top stalls today</span>
                </div>
                {revenueByVendor.slice(0,3).map((v, i) => (
                  <div key={v.id} className="flex items-center gap-3 px-4 py-3 border-b border-dashed border-warm last:border-0">
                    <div className="font-serif text-2xl text-warm font-bold shrink-0">#{i+1}</div>
                    <div className="text-lg shrink-0">{v.emoji}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-ink truncate">{v.name}</div>
                      <div className="text-xs text-muted font-mono">{v.orderCount} orders</div>
                    </div>
                    <div className="font-mono text-sm font-semibold shrink-0">₹{v.revenue}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── VENDORS ── */}
        {tab === 'vendors' && (
          <div className="border-2 border-ink rounded-sm bg-chalk overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] bg-ink text-paper text-[11px] font-mono uppercase tracking-widest px-5 py-2.5 gap-4">
              <span>Stall</span>
              <span>Cuisine</span>
              <span>Rating</span>
              <span>Orders</span>
              <span>Revenue</span>
              <span>Status</span>
            </div>

            {revenueByVendor.map(v => (
              <div key={v.id}
                className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] px-5 py-4 border-t border-dashed border-warm items-center gap-4 hover:bg-paper transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-2xl shrink-0">{v.emoji}</span>
                  <div className="min-w-0">
                    <div className="font-medium text-ink text-sm truncate">{v.name}</div>
                    <div className="text-xs text-muted font-mono">Stall {v.stall}</div>
                  </div>
                </div>
                <div className="text-sm text-muted">{v.cuisine}</div>
                <div><Star value={v.rating} /></div>
                <div className="font-mono text-sm">{v.orderCount}</div>
                <div className="font-mono text-sm font-semibold">₹{v.revenue}</div>
                <div>
                  <Badge variant={v.open ? 'open' : 'closed'}>
                    {v.open ? 'Open' : 'Closed'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── ORDERS ── */}
        {tab === 'orders' && (
          loading ? <Spinner label="Loading orders…" /> : (
            <div>
              {/* Filter bar */}
              <div className="flex gap-2 mb-4 flex-wrap">
                {['All', ...Object.keys(STATUS_CONFIG)].map(s => (
                  <Pill key={s} active={false} onClick={() => {}}>
                    {s === 'All' ? `All (${orders.length})` : `${STATUS_CONFIG[s]?.label} (${ordersByStatus[s] || 0})`}
                  </Pill>
                ))}
              </div>

              <div className="border-2 border-ink rounded-sm bg-chalk overflow-hidden">
                {orders.length === 0 ? (
                  <p className="text-center text-muted py-12 text-sm">No orders yet today.</p>
                ) : orders.map(o => {
                  const vendor = VENDORS.find(v => v.id === o.vendorId)
                  return <OrderRow key={o.id} order={o} vendorName={vendor?.name} showCustomer />
                })}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  )
}
