export default function Badge({ children, variant = 'default' }) {
  const variants = {
    default: 'bg-ink text-paper',
    open:    'bg-sage text-chalk border border-sage',
    closed:  'border border-ink text-muted',
    pending: 'bg-amber/15 text-amber border border-amber/40',
    preparing:'bg-ink text-paper',
    ready:   'bg-sage text-chalk',
    delivered:'bg-warm text-muted border border-warm',
    cancelled:'border border-accent/40 text-accent',
  }
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold tracking-wide uppercase rounded-sm ${variants[variant]}`}>
      {children}
    </span>
  )
}
