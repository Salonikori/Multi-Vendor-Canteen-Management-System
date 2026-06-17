export default function Spinner({ label = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-muted">
      <div className="w-6 h-6 border-2 border-warm border-t-ink rounded-full animate-spin" />
      <span className="text-sm">{label}</span>
    </div>
  )
}
