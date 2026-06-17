import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { VENDORS } from '../data/mockData'
import LiveDot from './ui/LiveDot'

const ROLE_HOME = { student: '/student', vendor: '/vendor', admin: '/admin' }

export default function Navbar() {
  const { user, logout } = useAuth()
  const { totalItems } = useCart()
  const navigate = useNavigate()
  const openCount = VENDORS.filter(v => v.open).length

  return (
    <header className="bg-ink text-paper border-b-2 border-ink sticky top-0 z-50">
      {/* Ticker strip */}
      <div className="bg-accent text-paper text-[11px] font-mono overflow-hidden py-0.5">
        <div className="animate-ticker whitespace-nowrap">
          &nbsp;&nbsp;&nbsp;
          {VENDORS.filter(v=>v.open).map(v=>`${v.emoji} ${v.name} · Stall ${v.stall}   —   `).join('   ')}
          {VENDORS.filter(v=>v.open).map(v=>`${v.emoji} ${v.name} · Stall ${v.stall}   —   `).join('   ')}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        <Link to={ROLE_HOME[user?.role] || '/login'} className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 bg-paper text-ink rounded-sm flex items-center justify-center text-base font-serif font-bold group-hover:bg-accent group-hover:text-paper transition-colors">
            C
          </div>
          <div className="leading-tight hidden sm:block">
            <div className="font-serif text-base text-paper leading-none">CampusEats</div>
            <div className="text-[10px] text-paper/50 tracking-widest uppercase">Canteen · 2025</div>
          </div>
        </Link>

        <div className="flex items-center gap-1.5 text-[11px] text-paper/60 font-mono">
          <LiveDot />
          {openCount} of {VENDORS.length} stalls open
        </div>

        <div className="flex items-center gap-2">
          {user?.role === 'student' && totalItems > 0 && (
            <Link to="/student?cart=1"
              className="border border-paper/30 px-3 py-1 text-xs font-medium text-paper hover:bg-paper hover:text-ink transition-colors rounded-sm">
              Basket ({totalItems})
            </Link>
          )}
          {user && (
            <div className="hidden sm:block text-right">
              <div className="text-xs font-medium text-paper">{user.name}</div>
              <div className="text-[10px] text-paper/40 uppercase tracking-wide">{user.role}</div>
            </div>
          )}
          {user && (
            <button onClick={() => { logout(); navigate('/login') }}
              className="text-[11px] text-paper/50 hover:text-paper transition-colors ml-1 underline underline-offset-2">
              Sign out
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
