export default function Pill({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-3.5 py-1.5 text-sm font-medium border transition-all rounded-sm ${
        active
          ? 'bg-ink text-paper border-ink'
          : 'bg-transparent text-muted border-warm hover:border-ink hover:text-ink'
      }`}
    >
      {children}
    </button>
  )
}
