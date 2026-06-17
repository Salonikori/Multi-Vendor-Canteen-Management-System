import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { VENDORS } from '../data/mockData'

const ROLE_HOME = { student: '/student', vendor: '/vendor', admin: '/admin' }

const ROLES = [
  { id: 'student', label: 'Student', sub: 'Order food & track your tray' },
  { id: 'vendor', label: 'Vendor',  sub: 'Manage your stall & orders'  },
  { id: 'admin',  label: 'Admin',   sub: 'System overview & analytics'  },
]

export default function Login() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const [role, setRole] = useState('student')
  const [name, setName] = useState('')
  const [vendorId, setVendorId] = useState(VENDORS[0].id)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (user) return <Navigate to={ROLE_HOME[user.role]} replace />

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const u = await login({ role, vendorId, name })
      navigate(ROLE_HOME[u.role], { replace: true })
    } catch (err) {
      setError(err.message || 'Sign in failed.')
    } finally { setSubmitting(false) }
  }

  return (
    <div className="min-h-screen bg-paper flex">
      {/* Left panel — decorative */}
      <div className="hidden lg:flex flex-col justify-between w-[42%] bg-ink text-paper p-10">
        <div>
          <div className="text-4xl mb-4">🍽</div>
          <h1 className="font-serif text-5xl leading-tight mb-3">Campus<br/>Eats</h1>
          <p className="text-paper/50 text-sm leading-relaxed max-w-xs">
            A multi-vendor canteen platform for students, cooks, and the people who keep it all running.
          </p>
        </div>

        {/* Vendor roll */}
        <div className="space-y-2">
          <p className="text-[11px] uppercase tracking-widest text-paper/30 font-mono mb-3">Open today</p>
          {VENDORS.filter(v => v.open).map(v => (
            <div key={v.id} className="flex items-center gap-3 text-sm">
              <span>{v.emoji}</span>
              <span className="text-paper/70">{v.name}</span>
              <span className="ml-auto font-mono text-paper/30 text-xs">Stall {v.stall}</span>
            </div>
          ))}
        </div>

        <p className="text-[10px] text-paper/20 font-mono">MVCS-2025 · Frontend Demo</p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-8">
            <div className="font-serif text-4xl text-ink mb-1">CampusEats</div>
            <p className="text-muted text-sm">Multi-Vendor Canteen System</p>
          </div>

          <h2 className="font-serif text-2xl text-ink mb-1">Sign in</h2>
          <p className="text-sm text-muted mb-6">Choose your role to enter the right dashboard.</p>

          <form onSubmit={handleSubmit}>
            {/* Role selector */}
            <div className="border-2 border-ink rounded-sm overflow-hidden mb-5">
              {ROLES.map((r, i) => (
                <label key={r.id}
                  className={`flex items-center gap-4 px-4 py-3.5 cursor-pointer transition-colors ${
                    i > 0 ? 'border-t-2 border-ink' : ''
                  } ${role === r.id ? 'bg-ink text-paper' : 'bg-chalk text-ink hover:bg-warm'}`}>
                  <input type="radio" name="role" value={r.id}
                    checked={role === r.id} onChange={() => setRole(r.id)}
                    className="accent-accent" />
                  <div>
                    <div className="font-semibold text-sm">{r.label}</div>
                    <div className={`text-xs mt-0.5 ${role === r.id ? 'text-paper/60' : 'text-muted'}`}>{r.sub}</div>
                  </div>
                </label>
              ))}
            </div>

            {/* Extra fields */}
            {role === 'student' && (
              <div className="mb-4">
                <label className="block text-xs font-mono uppercase tracking-widest text-muted mb-1.5">Your name</label>
                <input value={name} onChange={e => setName(e.target.value)}
                  placeholder="e.g. Rahul Mehta"
                  className="w-full border-2 border-ink rounded-sm px-3 py-2.5 text-sm bg-chalk text-ink placeholder:text-muted/60" />
              </div>
            )}

            {role === 'vendor' && (
              <div className="mb-4">
                <label className="block text-xs font-mono uppercase tracking-widest text-muted mb-1.5">Your stall</label>
                <select value={vendorId} onChange={e => setVendorId(Number(e.target.value))}
                  className="w-full border-2 border-ink rounded-sm px-3 py-2.5 text-sm bg-chalk text-ink appearance-none">
                  {VENDORS.map(v => (
                    <option key={v.id} value={v.id}>{v.emoji} {v.name} — Stall {v.stall}</option>
                  ))}
                </select>
              </div>
            )}

            {role === 'admin' && (
              <p className="text-xs text-muted border border-warm rounded-sm px-3 py-2.5 mb-4 bg-chalk font-mono">
                Admin access — full visibility across all vendors, orders and analytics.
              </p>
            )}

            {error && <p className="text-sm text-accent mb-3">{error}</p>}

            <button type="submit" disabled={submitting}
              className="w-full bg-ink text-paper py-3.5 font-semibold text-sm border-2 border-ink rounded-sm shadow-hard hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all disabled:opacity-60">
              {submitting ? 'One moment…' : `Continue as ${ROLES.find(r=>r.id===role)?.label} →`}
            </button>
          </form>

          <p className="text-[11px] text-muted/70 text-center mt-6">
            No real login — this is a frontend demo. Pick a role and explore.
          </p>
        </div>
      </div>
    </div>
  )
}
